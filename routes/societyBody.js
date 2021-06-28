

const {Router, request, response} = require("express");
const router = Router();
const pool = require("../db");
const checkJWT = require('./authenticateAdmin');

router.put("update/socBody/:id",checkJWT, async(request,response,next)=>{
    const {id} = request.params;
    const keys = ['chairman', 'secretary', 'treasurer', 'vice_chairman','vice_secretary', 'vice_treasurer','members'];
    const fields = [];
    console.log(request.body[key]);
    console.log(id);
    keys.forEach(key =>{
        if(request.body[key]) fields.push(key);
    });
    fields.forEach((field, index) =>{
        pool.query(`UPDATE public.soc_body SET ${field} = ($1) WHERE soc_body_id =($2) Returning *`,
        [request.body[field], id], (err, res) =>{
            if(err){
              res.status(500);
              return next(err);}
              response.status(200).json({
                "message":"success",
                 "data":res.rows
               });
          });
        });
});

module.exports = router;