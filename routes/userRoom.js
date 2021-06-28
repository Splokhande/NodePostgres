const {Router, request, response} = require("express");
const router = Router();
const pool = require("../db");


router.get('/update/userRoom/:roomId',(request, response,next)=>{
    const id = request.params.id;
    pool.query('select * from rooms where soc_id = $1 AND room_exists =$2',[id,true],(err,res)=>{
        if(err) return next(err);
        response.json(res.rows);
    });
});
