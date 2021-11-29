 const {Router, request, response} = require("express");
const router = Router();
const pool = require("../db");
var dateFormat = require('dateformat');
var day=dateFormat(new Date().now, "yyyy-mm-dd h:MM:ss");
const { ErrorHandler } = require("../functions/errorHandling");

const { success, error, validation } = require("../functions/response");



router.get('/get/userRoom/:roomId',(request, response,next)=>{
    const id = request.params.id;
    pool.query('select * from rooms where soc_id = $1 AND room_exists =$2',[id,true],(err,res)=>{
        if(err) return  next(new ErrorHandler(400, err.message));
        response.json(res.rows);
    });
});

router.post('/assign/room',(request,response,next)=>{
    const {userId, roomId, socId,isResident,isRental,ownership} =request.body;
    console.log("I am here");
    pool.query('update rooms set members_id = array_append(members_id,$1) where room_id =1 AND soc_id =1',[userId],(err,room)=>{
        if(err) return  next(new ErrorHandler(400, err.message));
        console.log("I am here2");
        pool.query('Insert into user_room (soc_id,room_id,user_id,from_date,is_resident,is_rental,ownership) values ($1,$2,$3,$4,$5,$6,$7) RETURNING * ',[socId,roomId,userId,day,isResident,isRental,ownership],(err,userRoom)=>{
            if(err) return  next(new ErrorHandler(400, err.message));
            console.log(userRoom);
            var userRoomId = userRoom.rows[0].userroom_id;
            console.log(`I am here3 ${userRoomId}`);
         pool.query('update users set user_room_id = array_append(user_room_id,$1) where id = $2',[userRoomId,userId],(err,users)=>{
            if(err) return  next(new ErrorHandler(400, err.message));
            response.json(success("Room registered Succesfully", [], 200));
            });
        });
    });
});

router.post('room/add/rental',(request,response,next)=>{
    const {userId, roomId, socId,isResident,isRental} =request.body;

    pool.query('update rooms set rental_id = array_append(rental_id,$1) where room_id =1 AND soc_id =1',[userId],(err,room)=>{
        if(err) return  next(new ErrorHandler(400, err.message));
        pool.query('Insert into user_room (soc_id,room_id,user_id,from_date,is_resident,is_rental) values ($1,$2,$3,$4,$5,$6,) Returning userroom_id',[socId,roomId,userId,day,isResident,isRental],(err,userRoom)=>{
            if(err) return  next(new ErrorHandler(400, err.message));
            var userRoomId = userRoom.rows[0].id;
        pool.query('update users set user_room_id = array_append(user_room_id,$1) where id = $2',[userRoomId,userId],(err,users)=>{
            if(err) return  next(new ErrorHandler(400, err.message));
            response.sendStatus(200).json({
                "message":success,
                });
            });
        });
    });
});




router.post('room/remove/rental',(request,response,next)=>{
    const {userRoomId,socId,roomId}=request.body;
    var array = [];
    pool.query('select rental_id from rooms where soc_id = $1 AND room_id = $2',[socId,roomId],(err,list)=>{
        array = list;
    })

pool.query('update user_room set to_date = CURRENT_DATE where to_date is null AND soc_id = $1 AND room_id = $2 AND is_rental = true',[socId, roomId,],(err,userRoom)=>{
    if(err) return  next(new ErrorHandler(400, err.message));
    pool.query('update rooms set rental_id = {} where soc_id = $1 AND room_id = $2',[socId,roomId],(err,rooms)=>{
        if(err) return  next(new ErrorHandler(400, err.message));

        for(var i =0; i< array.length;i++){
            pool.query('update users set user_room_id = array_remove(user_room_id,$1) where id = $2 ',[userRoomId,array[i]],(err,userR)=>{
                if(err)return  next(new ErrorHandler(400, err.message));
                response.sendStatus(200).json({
                    'message' : 'success',
                });
            });
        }
    });
});


});


router.post('room/sell',(request,response,next)=>{
    const {userRoomId,socId,roomId}=request.body;
pool.query('update user_room set to_date = CURRENT_DATE where to_date is null AND soc_id = $1 AND room_id = $2',[socId, roomId],(err,userRoom)=>{
    if(err) return  next(new ErrorHandler(400, err.message));
    pool.query('update rooms set members_id = {} where soc_id = $1 AND room_id = $2',[socId,roomId],(err,rooms)=>{
        if(err) return  next(new ErrorHandler(400, err.message));
        pool.query('update users set user_room_id = array_remove(user_room_id,$1) where id = $2',[userRoomId,userId],(err,userR)=>{
            if(err)return  next(new ErrorHandler(400, err.message));
            response.sendStatus(200).json({
                'message' : 'success',
            });
        });
    });
});


});


module.exports = router;
