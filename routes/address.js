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
          response.json(res.rows);
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

  router.get('/get/state', (request,response, next) =>{
    pool.query("Select state_id,state,state.country_id, country.country from state INNER JOIN country on state.country_id = country.country_id", (err, res) =>{
        if(err) return next(err);
        response.json(res.rows);
      });
});

///district
router.post('/add/district', (request,response, next) =>{
  const {state_id,district} = request.body;
  pool.query('INSERT INTO district (state_id,district) VALUES ($1, $2)' ,
  [state_id,district], (err, res) =>{
      if(err) return next(err);
      console.log("New District Added: ",res.rowCount);
      response.json({"message":"success"});
    });
  });

  router.get('/get/district', (request,response, next) =>{
    pool.query("Select district.district_id,district.district, state.state_id, state.state, state.country_id, country.country from state INNER JOIN country on state.country_id = country.country_id inner join district on district.state_id = state.state_id", (err, res) =>{
        if(err) return next(err);
        response.json(res.rows);
      });

});

///city
router.post('/add/city', (request,response, next) =>{
  const {mc_id,city} = request.body;
  pool.query('INSERT INTO city (mc_id,city) VALUES ($1, $2)' ,
  [mc_id,city], (err, res) =>{
      if(err) return next(err);
      console.log("New City Added: ",res.rowCount);
      response.json({"message":"success"});
    });
  });
  router.get('/get/city', (request,response, next) =>{
    pool.query("Select * from city", (err, res) =>{
        if(err) return next(err);
        response.json(res.rows);
      });

});


///area
router.post('/add/area', (request,response, next) =>{
  const {ward_id,landmark,area} = request.body;
  pool.query('INSERT INTO area (ward_id,landmark,area) VALUES ($1, $2)' ,
  [ward_id,landmark,area], (err, res) =>{
      if(err) return next(err);
      console.log("New Area Added: ",res.rowCount);
      response.json({"message":"success"});
    });
  });

  router.get('/get/area', (request,response, next) =>{
    pool.query("Select * from area", (err, res) =>{
        if(err) return next(err);
        response.json(res.rows);
      });

});

///municipal_corporation
router.post('/add/mc', (request,response, next) =>{
  const {mc, district_id, state_id,city_id} = request.body;
  pool.query('INSERT INTO mc_list (mc, district_id, state_id,city_id) VALUES ($1, $2, $3, $4)' ,
  [mc, district_id, state_id,city_id], (err, res) =>{
      if(err) return next(err);
      console.log("New Muncipal Corporation Added: ",res.rowCount);
      response.json({"message":"success"});
    });
  });

  router.get('/get/mc', (request,response, next) =>{
    pool.query("Select * from mc_list", (err, res) =>{
        if(err) return next(err);
        response.json(res.rows);
      });

});

///ward
router.post('/add/ward', (request,response, next) =>{
const {mc, district_id, state_id,city_id} = request.body;
pool.query('INSERT INTO mc_list (mc, district_id, state_id,city_id) VALUES ($1, $2, $3, $4)' ,
[mc, district_id, state_id,city_id], (err, res) =>{
    if(err) return next(err);
    console.log("New Municipal Corporation Added: ",res.rowCount);
    response.json({"message":"success"});
  });
});

router.get('/get/ward', (request,response, next) =>{
  pool.query("Select * from wards", (err, res) =>{
      if(err) return next(err);
      response.json(res.rows);
    });

});

module.exports = router;