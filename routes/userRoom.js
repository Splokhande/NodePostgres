const {Router, request, response} = require("express");
const router = Router();
const pool = require("../db");
var dateFormat = require('dateformat');
var day=dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
router.get('/get/userRoom/:roomId',(request, response,next)=>{
    const id = request.params.id;
    pool.query('select * from rooms where soc_id = $1 AND room_exists =$2',[id,true],(err,res)=>{
        if(err) return next(err);
        response.json(res.rows);
    });
});

router.post('create/userRoom',(request,response,next)=>{
    const {userId, roomId, socId,isResident,isRental} =request.body;

    pool.query('update rooms set members_id = array_append(members_id,$1) where room_id =1 AND soc_id =1',[userId],(err,room)=>{
        if(err) return next(err);
        pool.query('Insert into user_room (soc_id,room_id,user_id,from_date,isResident,isRental) values ($1,$2,$3,$4,$5,$6,) Returning userroom_id',[socId,roomId,userId,day,isResident,isRental],(err,userRoom)=>{
            if(err) return next(err);
            var userRoomId = userRoom.rows[0].id;
        pool.query('update users set user_room_id = array_append(user_room_id,$1) where id = $2',[userRoomId,userId],(err,users)=>{
            if(err) return next(err);
            response.sendStatus(200).json({
                "message":success,
                });
            });
        });
    });
});