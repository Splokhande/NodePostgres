const {Router, request, response} = require("express");
const router = Router();
const pool = require("../db");
const checkAdmin = require('./authenticateUser');

router.post("/add/society",checkAdmin,async(request,response,next) =>{
console.log(request.user);
const {post} = request.user;
console.log("Post "+post);
if(post !== "superadmin"){
    return response.json(
      {
        "post":post,
        "message":"You are not authorized for this",
      }
    )
}

  let soc_id =0;
    const{soc_name,landmark,soc_reg_no,soc_address_id,total_room,total_floor,total_block,rooms_each_floor,total_shop,latitude, longitude}=request.body;

    pool.query('INSERT INTO society (soc_name,landmark,soc_reg_no,soc_address_id,total_room,total_floor,total_block,rooms_each_floor,total_shop,latitude,longitude) VALUES ($1, $2,$3,$4,$5,$6,$7,$8, $9, $10, $11) RETURNING *' ,
    [soc_name,landmark,soc_reg_no,soc_address_id,total_room,total_floor,total_block,rooms_each_floor,total_shop,latitude, longitude],
    (err, res) =>{
      if(err) return next(err);
      const blocks = total_block;
      const floors =total_floor;
      const rooms = rooms_each_floor;
      var arr = [];
      soc_id = res.rows[0].soc_id;
            for (i = 0; i <blocks ; i++) {
              for(j = 0; j< floors[i];j++){
                  for(k=0; k<rooms[i]; k++){
                    var room_no = `${String.fromCharCode(65+i)}-${j}0${k+1}`;
                      arr.push(`${String.fromCharCode(65+i)}-${j}0${k+1}`);
                      pool.query('INSERT INTO rooms (soc_id, room_no,owner, on_rent, on_sale, carpet_area, room_structure, balcony, is_occupied, total_members, room_exists) VALUES ($1, $2,$3,$4,$5,$6,$7,$8,$9,$10,$11)' ,
                      [soc_id,room_no,null,false,false,null,null,false,false,0,true],(err, resp) =>{
                        if(err) return next(err);
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
                  if(err) return next(err);
                  // console.log(`Room no ${String.fromCharCode(65+i)}-${j}0${k+1} added`);
                  // resp.json({"message":"success"});
                }
              );
            }


            pool.query('INSERT INTO soc_body (soc_id, chairman, secretary, treasurer, vice_chairman, vice_secretary, vice_treasurer,members,year ) VALUES ($1, $2,$3,$4,$5,$6,$7,$8,$9)' ,
            [soc_id,null,null, null, null,null, null, null, null],(err, resp) =>{
              if(err) return next(err);
              console.log("Society Body created successfully");
              // respo.json({"message":"Society Body created successfully"});
            });
            console.log("New Society Added: ",res.rowCount);
            response.json({"message":"success","total_rooms":total_room, "total_shop":total_shop});

      });
      });

router.get('/get/society/:id', (request,response, next) =>{

  const id = request.params.id; 
  console.log(id);
   pool.query("Select society.soc_name,society.soc_reg_no,society.soc_address_id,society.total_room,society.total_floor,society.total_block,society.rooms_each_floor,society.total_shop,society.landmark ,area.area_id, area.area,area.mc_id,area.city_id, wards.ward_id, wards.ward_no,wards.nagarsevak ,city.city_id, city.city, mc_list.mc_id, mc_list.mc ,district.district_id,district.district, state.state_id, state.state, state.country_id, country.country from state INNER JOIN country on state.country_id = country.country_id inner join district on district.state_id = state.state_id INNER JOIN mc_list on mc_list.district_id = district.district_id inner join city on mc_list.mc_id = city.city_id inner join wards on wards.ward_id = mc_list.mc_id inner join area on area.ward_id = wards.ward_id inner join society on society.soc_address_id = area.area_id where soc_id = $1",[id], (err, res) =>{
        if(err) return next(err);
         response.json(res.rows);
      });
});

module.exports = router;