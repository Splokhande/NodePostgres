

const {Router, request, response} = require("express");
const router = Router();
const pool = require("../db");
const checkJWT = require('./authenticateAdmin');


router.get('/get/socBody', async(request,response,next)=>{
    pool.query('Select * from soc_body',(err,res)=>{
        if(err){res.status(500);
            return next(err);}
       response.status(200).json({
        "message":"success",
        "data":res.rows});
    });
});

router.post("/create/socBody",async(request,response,next)=>{
    const {soc_id, chairman, secretary, treasurer, vice_chairman, vice_secretary, vice_treasurer,members,year} = request.body;
    console.log(password,saltRounds.salt);
    const passwordHash = await bcrypt.hashSync(password,saltRounds.salt);
    console.log(passwordHash);

    pool.query('INSERT INTO soc_body (soc_id, chairman, secretary, treasurer, vice_chairman, vice_secretary, vice_treasurer,members,year ) VALUES ($1, $2,$3,$4,$5,$6,$7,$8,$9) Returning *' ,
    [soc_id, chairman, secretary, treasurer, vice_chairman, vice_secretary, vice_treasurer,members,year],(err, resp) =>{
      if(err) return next(err);
      console.log("Society Body created successfully");
      // respo.json({"message":"Society Body created successfully"});
    });
    console.log("New Society Body Added: ",res.rowCount);
    response.json({"message":"success",
    // "total_rooms":total_room, "total_shop":total_shop
        "data": res.rows
});

});

router.put("/update/socBody/:soc_body_id", async(request,response,next)=>{
    const {soc_body_id} = request.params;
    const keys = ['chairman', 'secretary', 'treasurer', 'vice_chairman','vice_secretary', 'vice_treasurer','members','year'];
    const fields = [];

    console.log(soc_body_id);
    keys.forEach(key =>{
        if(request.body[key]) fields.push(key);
    });
    fields.forEach((field, index) =>{
        pool.query(`UPDATE public.soc_body SET ${field} = ($1) WHERE soc_body_id =($2)`,
        [request.body[field], soc_body_id], (err, res) =>{
            if(err){
              res.status(500);
              return next(err);}
              response.status(200).json({
                "message":"Updated Data Successfully",
                //  "data":res.rows
               });
          });
        });
});


module.exports = router;