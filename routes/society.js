const {Router, request, response} = require("express");
const router = Router();
const pool = require("../db");


router.post("/add/society",(request,response,next) =>{
    const{soc_name,soc_reg_no,soc_address_id,total_room,total_floor,total_block,rooms_each_floor,total_shop}=request.body;

    pool.query('INSERT INTO society (soc_name,soc_reg_no,soc_address_id,total_room,total_floor,total_block,rooms_each_floor,total_shop) VALUES ($1, $2,$3,$4,$5,$6,$7,$8)' ,
    [soc_name,soc_reg_no,soc_address_id,total_room,total_floor,total_block,rooms_each_floor,total_shop],(err, res) =>{
     if(err) return next(err);
     console.log("New Society Added: ",res.rowCount);
      response.json({"message":"success"});
    });
});

router.get('/get/society', (request,response, next) =>{
    pool.query("Select society.soc_name,society.soc_reg_no,society.soc_address_id,society.total_room,society.total_floor,society.total_block,society.rooms_each_floor,society.total_shop ,area.area_id, area.area,area.landmark, wards.ward_id, wards.ward_no,wards.nagarsevak ,city.city_id, city.city, mc_list.mc_id, mc_list.mc ,district.district_id,district.district, state.state_id, state.state, state.country_id, country.country from state INNER JOIN country on state.country_id = country.country_id inner join district on district.state_id = state.state_id INNER JOIN mc_list on mc_list.district_id = district.district_id inner join city on mc_list.mc_id = city.city_id inner join wards on wards.ward_id = mc_list.mc_id inner join area on area.ward_id = wards.ward_id inner join society on society.soc_address_id = area.area_id", (err, res) =>{
        if(err) return next(err);
        response.json(res.rows);
      });
});

module.exports = router;