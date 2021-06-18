const {Router, request, response} = require("express");
const router = Router();
const pool = require("../db");
router.put("/room/:id", (request, response, next) =>{
    const {id} = request.params;
    const keys = ['owner','on_rent', 'on_sale', 'carpet_area', 'room_structure', 'balcony',
    'is_occupied','total_members', 'room_exists', 'owner_id', 'rental_id','members_id'];
    const fields = [];
    keys.forEach(key =>{
        if(request.body[key]) fields.push(key);
    });
    fields.forEach((field, index) =>{
        pool.query(`UPDATE public.rooms SET ${field} = ($1) WHERE room_id =($2)`,
        [request.body[field], id], (err, res) =>{
            if(err) return next(err);
              if(index === fields.length - 1)
              response.redirect('/user/getUser');
          });
        });
});


router.get('/room/:id',(request, response,next)=>{
    const id = request.params.id;
    pool.query('select * from rooms where soc_id = $1',[id],(err,res)=>{
        if(err) return next(err);
        
        response.json(res.rows);
    });
});


module.exports = router;