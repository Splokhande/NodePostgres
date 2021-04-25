const {Router, request, response} = require("express");
const router = Router();
const pool = require("../db");

///country  
  router.post('/add/country', (request,response, next) => {
    const {country} = request.body;
    pool.query('INSERT INTO country (country) VALUES ($1)' ,
    [country], (err, res) =>{
        if(err) return next(err);
        console.log("New Country Added: ",res.rowCount);
        response.json({"message":"success"});
      });
    });

  router.get('/get/country', (request,response, next) =>{
      pool.query("Select * from country", (err, res) =>{
          if(err) return next(err);
          response.json({
           "message":"success",
            "data":res.rows});
        });

  });

///state
router.post('/add/state', (request,response, next) =>{
  const {state,country_id} = request.body;
  pool.query('INSERT INTO state  (state,country_id) VALUES ($1, $2)' ,
  [state,country_id], (err, res) =>{
      if(err) return next(err);
      console.log("New State Added: ",res.rowCount);
      response.json({"message":"success"});
    });
  });

  router.get('/get/state/:id', (request,response, next) =>{
    const {id} = request.params;
    pool.query(`Select * from state where state_id = ${id}`, (err, res) =>{
        if(err) return next(err);
        response.json({
           "message":"success",
            "data":res.rows
          });
      });
});

///district
router.post('/add/district', (request,response, next) =>{
 
  const {state_id,district} = request.body;
  pool.query('INSERT INTO district (state_id, district) VALUES ($1, $2,) where id = ' ,
  [state_id,district], (err, res) =>{
      if(err) return next(err);
      console.log("New District Added: ",res.rowCount);
      response.json({"message":"success"});
    });
  });

  router.get('/get/district/:id', (request,response, next) =>{
    const {id} = request.params;
    // pool.query("Select district.district_id,district.district, state.state_id, state.state, state.country_id, country.country from state INNER JOIN country on state.country_id = country.country_id inner join district on district.state_id = state.state_id", (err, res) =>{
      pool.query("Select * from district where state_id = $1",[id], (err, res) =>{
        if(err) return next(err);
        response.json({
           "message":"success",
            "data":res.rows});
      });

});


///city
router.post('/add/city', (request,response, next) =>{
  const {district_id,city} = request.body;
  pool.query('INSERT INTO city (city, district_id) VALUES ($1, $2)' ,
  [city, district_id], (err, res) =>{
      if(err) return next(err);
      console.log("New City Added: ",res.rowCount);
      response.json({"message":"success"});
    });
  });
  router.get('/get/city/:id', (request,response, next) =>{
    const {id} = request.params;
    // pool.query("Select city.city_id, city.city, mc_list.mc_id, mc_list.mc ,district.district_id,district.district, state.state_id, state.state, state.country_id, country.country from state INNER JOIN country on state.country_id = country.country_id inner join district on district.state_id = state.state_id INNER JOIN mc_list on mc_list.district_id = district.district_id inner join city on mc_list.mc_id = city.city_id", (err, res) =>{
      pool.query("Select * from city where district_id = $1",[id], (err, res) =>{
        if(err) return next(err);
        response.json({
           "message":"success",
            "data":res.rows});
      });

});

router.put('/update/city/:id',(request, response, next) =>{
  const {id} = request.params;
   
  const keys = ['city','mc_id','district_id'];
  const fields = [];
  keys.forEach(key =>{
      if(request.body[key]) fields.push(key);
  });

  fields.forEach((field, index) =>{
      pool.query(`UPDATE public.city SET ${field} = ($1) WHERE id =($2) Returning *`,
      [request.body[field], id], (err, res) =>{
          if(err) return next(err);
            if(index === fields.length - 1)
            response.status(200).json({"data":res.rows[0]});
        });
      });
});

///area
router.post('/add/area', (request,response, next) => {
  const {area , city_id} = request.body;
  pool.query('INSERT INTO area (area, city_id) VALUES ($1, $2)' ,
  [area,city_id], (err, res) =>{
      if(err) return next(err);
      console.log("New Area Added: ",res.rowCount);
      response.json({"message":"success"});
    });
  });

  router.get('/get/area/:id', (request,response, next) =>{
    const {id} = request.params;
    pool.query("Select * from area where city_id = $1",[id], (err, res) =>{
        if(err) return next(err);
        response.json({
           "message":"success",
            "data":res.rows});
      });

});

router.put('/update/area/:id',(request, response, next) =>{
  const {id} = request.params;
   
  const keys = ['area','city_id','district_id'];
  const fields = [];
  keys.forEach(key =>{
      if(request.body[key]) fields.push(key);
  });

  fields.forEach((field, index) =>{
      pool.query(`UPDATE public.city SET ${field} = ($1) WHERE id =($2) Returning *`,
      [request.body[field], id], (err, res) =>{
          if(err) return next(err);
            if(index === fields.length - 1)
            response.status(200).json({"data":res.rows[0]});
        });
      });
});



///municipal_corporation
router.post('/add/mc', (request,response, next) =>{
  const {mc, country_id} = request.body;
  pool.query('INSERT INTO mc_list (mc,country_id) VALUES ($1, $2)' ,
  [mc, country_id], (err, res) =>{
      if(err) return next(err);
      console.log("New Municipal Corporation Added: ",res.rowCount);
      response.json({"message":"success"});
    });
  });

  router.get('/get/mc/:id', (request,response, next) =>{
    // pool.query("Select mc_list.mc_id, mc_list.mc ,district.district_id,district.district, state.state_id, state.state, state.country_id, country.country from state INNER JOIN country on state.country_id = country.country_id inner join district on district.state_id = state.state_id INNER JOIN mc_list on mc_list.district_id = district.district_id", (err, res) =>{
        pool.query("SELECT * from mc_list where state_id = $1", [id], (err, res) =>{
        if(err) return next(err);
        response.json({
           "message":"success",
            "data":res.rows});
      });

});


router.put('/update/mc/:id',(request, response, next) =>{
  const {id} = request.params;

  const keys = ['mc','state_id','district_id','country_id'];
  const fields = [];
  keys.forEach(key =>{
      if(request.body[key]) fields.push(key);
  });

  fields.forEach((field, index) =>{
      pool.query(`UPDATE public.mc_list SET ${field} = ($1) WHERE id =($2) Returning *`,
      [request.body[field], id], (err, res) =>{
          if(err) return next(err);
            if(index === fields.length - 1)
            response.status(200).json({"data":res.rows[0]});
        });
      });
});
///ward
router.post('/add/ward', (request,response, next) =>{
const {ward_no, mc_id ,country_id, nagarsevak} = request.body;
pool.query('INSERT INTO wards (ward_no, mc_id , nagarsevak, country_id) VALUES ($1, $2, $3, $4)' ,
[ward_no, mc_id , nagarsevak, country_id], (err, res) =>{
    if(err) return next(err);
    console.log("New Ward Added: ",res.rowCount);
    response.json({"message":"success"});
  });
});

router.get('/get/ward', (request,response, next) =>{
  pool.query("Select wards.ward_id, wards.ward_no,wards.nagarsevak ,city.city_id, city.city, mc_list.mc_id, mc_list.mc ,district.district_id,district.district, state.state_id, state.state, state.country_id, country.country from state INNER JOIN country on state.country_id = country.country_id inner join district on district.state_id = state.state_id INNER JOIN mc_list on mc_list.district_id = district.district_id inner join city on mc_list.mc_id = city.city_id inner join wards on wards.ward_id = mc_list.mc_id", (err, res) =>{
      if(err) return next(err);
      response.json({
           "message":"success",
            "data":res.rows});
    });

});

router.put('/update/ward/:id',(request, response, next) =>{
  const {id} = request.params;

  const keys = ['ward','mc_id','country_id', 'nagarsevak'];
  const fields = [];
  keys.forEach(key =>{
      if(request.body[key]) fields.push(key);
  });

  fields.forEach((field, index) =>{
      pool.query(`UPDATE public.wards SET ${field} = ($1) WHERE id =($2) Returning *`,
      [request.body[field], id], (err, res) =>{
          if(err) return next(err);
            if(index === fields.length - 1)
            response.status(200).json({"data":res.rows[0]});
        });
      });
});



///Address
router.post('/add/address', (request,response, next) =>{
  const {ward_no, mc_id ,country_id, nagarsevak} = request.body;
  pool.query('INSERT INTO address (ward_no, mc_id , nagarsevak, country_id) VALUES ($1, $2, $3, $4)' ,
  [ward_no, mc_id , nagarsevak, country_id], (err, res) =>{
      if(err) return next(err);
      console.log("New Ward Added: ",res.rowCount);
      response.json({"message":"success"});
    });
  });
  
  router.put('/update/ward',(request, response, next) =>{
    const {id} = request.params;
  
    const keys = ['ward','mc_id','country_id', 'nagarsevak'];
    const fields = [];
   
  });

  router.get('/get/address/:district', (request,response, next) =>{
    const {district,city,mc,ward,state} = request.body;
    const query = `Select * from address where district = ${district}`;
    if(city != null){
      sql += ` and city = ${city}`;
      // params.post(city);
    }

    if(mc != null){
      sql += ` and mc = ${mc}`;
      // params.post(mc);
    }
    if(ward != null){
      sql += ` and ward = ${ward}`;
      // params.post(ward);
    }
    if(state != null){
      sql += ` and state = ${state}`;
      // params.post(state);
    }

    pool.query(
      query,
      // params, 
      (err, res) =>{
        if(err) return next(err);
        response.json({
           "message":"success",
            "data":res.rows});
      });
  });
  
  router.put('/update/address/:id',(request, response, next) =>{
    const {id} = request.params;
    const keys = ['ward','mc','area', 'city','landmark', 'district'];
    const fields = [];
    keys.forEach(key =>{
        if(request.body[key]) fields.push(key);
    });
  
    fields.forEach((field, index) =>{
        pool.query(`UPDATE public.wards SET ${field} = ($1) WHERE id =($2) Returning *`,
        [request.body[field], id], (err, res) =>{
            if(err) return next(err);
              if(index === fields.length - 1)
              response.status(200).json({"data":res.rows[0]});
          });
        });
  });

module.exports = router;