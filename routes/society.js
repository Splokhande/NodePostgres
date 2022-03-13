const {Router, request, response} = require("express");
const router = Router();
const pool = require("../db/db_path");
const { ErrorHandler } = require("../functions/errorHandling");

const { success, error, validation } = require("../functions/response");

router.post("/add/society",async(request,response,next) =>{
console.log(request);
var data = request.user;
// console.log("Post "+data.post);
// if(post == "user"){
//     return response.json(
//       {
//         "post":post,
//         "message":"You are not authorized for this",
//       }
//     )
// }

  let soc_id =0;
    const{soc_name,landmark,soc_reg_no,soc_address_id,total_room,total_floor,total_block,rooms_each_floor,total_shop,latitude, longitude}=request.body;

    pool.query('INSERT INTO society (soc_name,landmark,soc_reg_no,soc_address_id,total_room,total_floor,total_block,rooms_each_floor,total_shop,latitude,longitude)'+
    'VALUES ($1, $2,$3,$4,$5,$6,$7,$8, $9, $10, $11) RETURNING *' ,
    [soc_name,landmark,soc_reg_no,soc_address_id,total_room,total_floor,total_block,rooms_each_floor,total_shop,latitude, longitude],
    (err, res) =>{  
      if(err){
        res.status(500);
        return  next(new ErrorHandler(400, err.message));}
      const blocks = total_block;
      const floors =total_floor;
      const rooms = rooms_each_floor;
      var arr = [];
      console.log(`Block:${blocks} Floor:${floors} Rooms:${rooms}`);
      soc_id = res.rows[0].soc_id;
            for (i = 0; i <blocks ; i++) {
              for(j = 0; j<= floors[i];j++){
                  for(k=0; k<rooms[i]; k++){
                    var room_no = `${String.fromCharCode(65+i)}-${j}0${k+1}`;
                      arr.push(`${String.fromCharCode(65+i)}-${j}0${k+1}`);
                      pool.query('INSERT INTO rooms (soc_id, room_no,owner, on_rent, on_sale, carpet_area, room_structure, balcony, is_occupied, total_members, room_exists) VALUES ($1, $2,$3,$4,$5,$6,$7,$8,$9,$10,$11)' ,
                      [soc_id,room_no,null,false,false,null,null,false,false,0,true],(err, resp) =>{
                        if(err) return  next(new ErrorHandler(400, err.message));
                        console.log(`Room no ${String.fromCharCode(65+i)}-${j}0${k+1} added`);
                        // resp.json({"message":"success"});
                      }
                    );
                  }
                }
              }

            for(k=0; k<total_shop; k++){
              var shop_no = `Shop-0${k+1}`;
                arr.push(`${String.fromCharCode(65+i)}-${j}0${k+1}`);
                pool.query('INSERT INTO shop (soc_id, shop_no, shop_type, reg_no, shop_owner_id, rental_id, on_rent, on_sale, shop_area, is_occupied) VALUES ($1, $2,$3,$4,$5,$6,$7,$8,$9,$10)' ,
                [soc_id,shop_no,null,null,null,null,false,false,0,false],(err, resp) =>{
                  if(err) return  next(new ErrorHandler(400, err.message));
                  // console.log(`Room no ${String.fromCharCode(65+i)}-${j}0${k+1} added`);
                  // resp.json({"message":"success"});
                }
              );
            }

            pool.query('INSERT INTO soc_body (soc_id, chairman, secretary, treasurer, vice_chairman, vice_secretary, vice_treasurer,members,year ) VALUES ($1, $2,$3,$4,$5,$6,$7,$8,$9)' ,
            [soc_id,null,null, null, null,null, null, null, null],(err, resp) =>{
              if(err) return  next(new ErrorHandler(400, err.message));
              console.log("Society Body created successfully");
            });
            console.log("New Society Body Added: ",res.rowCount);
            response.json({"message":"success","total_rooms":total_room, "total_shop":total_shop});

      });
      });

router.get('/get/society', async (request,response, next) =>{
   pool.query(`With getSociety as  (
    Select soc.*,
   (select ROW_TO_JSON(addr)
      from (select addr.id,addr.full_address,
         (select ROW_TO_JSON(ar)
          from (select * from area as ar where ar.area_id = addr.area_id )ar) as area ,
        (select ROW_TO_JSON(ci)
          from (select * from city as ci where ci.city_id = addr.city_id)ci) as city,
        (select ROW_TO_JSON(dr)
          from (select * from district as dr where dr.district_id = addr.district_id)dr) as district,
        (select ROW_TO_JSON(st)
          from (select * from state as st where st.state_id = addr.state_id)st) as state,
        (select ROW_TO_JSON(co)
          from (select * from country as co where co.country_id = addr.country_id)co) as country
        from address as addr where addr.id = soc.soc_address_id) addr) as address
          from society as soc
  ) Select * from getSociety`, (err, res) =>{
        if(err){
          // res.statusCode(500);
          console.log("Error occuered");
          return  next(new ErrorHandler(400, err.message));
        }
        console.log("Success");
         response.json( success(
          "OK",
          res.rows,
          res.status
        ));
      });
});
router.get('/get/society/:id', async (request,response, next) =>{

  const id = request.params.id;
  console.log(id);
   pool.query( `Select * from society where soc_id = ${id}`, (err, res) =>{
        if(err){
          response.status(500);
          return  next(new ErrorHandler(400, err.message));
        }
        //res.rows
         response.json(success( "OK",
         res.rows,
         res.status
       ));
      });
});


router.put('/update/society/:id', async (request,response, next)=>{
  const {id} = request.params;
    const keys = ['soc_name','landmark','soc_reg_no','soc_address_id','total_room','total_floor','total_block','rooms_each_floor','total_shop,latitude','longitude'];
    const fields = [];
    keys.forEach(key =>{
        if(request.body[key]) fields.push(key);
    });
    fields.forEach((field, index) =>{
        pool.query(`UPDATE public.society SET ${field} = ($1) WHERE room_id =($2)`,
        [request.body[field], id], (err, res) =>{
            if(err){
              res.status(500);
              return  next(new ErrorHandler(400, err.message));}
              if(index === fields.length - 1)
              response.redirect('/user/getUser');
          });
        });
});


router.get('/get/societyRoom/:id',(request, response,next)=>{
  const id = request.params.id;
  pool.query('select * from rooms where soc_id = $1 AND room_exists =$2 order by room_no ASC',[id,true],(err,res)=>{
      if(err) return  next(new ErrorHandler(400, err.message));
      response.json(success( "OK",
      res.rows,
      res.status
    ));
  });
});


router.post('/get/society/:search',async(request,response,next)=>{
  const {search} = request.params;
  console.log(search);
  pool.query(`
  With getSociety as  (
    Select soc.*, 
   (select ROW_TO_JSON(addr)  
      from (select addr.*
        from address as addr where addr.id = soc.soc_address_id) addr) as address
          from society as soc where Upper(soc.soc_name) LIKE Upper('%${search}%') LIMIT 5
  ) Select * from getSociety
  `, (err, res) =>{
        if(err){
          // res.statusCode(500);
          return  next(new ErrorHandler(400, err.message));
        }
         response.json(  success(
          "OK",
          res.rows,
          res.status
        ));
      });
});
module.exports = router;