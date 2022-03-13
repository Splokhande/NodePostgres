  const { Router, request, response } = require("express");
  const router = Router();
  const pool = require("../db/db_path");
  const { ErrorHandler } = require("../functions/errorHandling");

  const { success, error, validation } = require("../functions/response");
///country
router.post("/add/country", (request, response, next) => {
  const { country } = request.body;
  pool.query(
    "INSERT INTO country (country) VALUES ($1) Returning *",
    [country],
    (err, res) => {
      if (err) return next(new ErrorHandler(400, err.message));
      console.log("New Country Added: ", res.rowCount);

      response.json({
        message: "success",
        data: res.rows,
      });
      response.json(success("OK", res.rows, res.status));
    }
  );
});

router.get("/get/country", (request, response, next) => {
  


  pool.query("Select * from country ", (err, res) => {
    if (err) return next(new ErrorHandler(400, err.message));
    response.json(success("OK", res.rows, res.status));
  });
});

///state
router.post("/add/state", (request, response, next) => {
  const { state, country_id } = request.body;
  pool.query(
    "INSERT INTO state  (state,country_id) VALUES ($1, $2) returning * ",
    [state, country_id],
    (err, res) => { 
      if (err) return next(new ErrorHandler(400, err.message));
      console.log("New State Added: ", res.rowCount);
      response.json(success("OK", res.rows, res.status));
    }
  );
});

router.get("/get/state/:id", (request, response, next) => {
  const { id } = request.params;
  pool.query("Select * from state where country_id = $1", [id], (err, res) => {
    if (err) return next(new ErrorHandler(400, err.message));
    response.json(success("OK", res.rows, res.status));
  });
});

///district
router.post("/add/district", (request, response, next) => {
  const { state_id, district } = request.body;
  pool.query(
    "INSERT INTO district (state_id, district) VALUES ($1, $2) Returning * ",
    [state_id, district],
    (err, res) => {
      if (err) return next(new ErrorHandler(400, err.message));
      console.log("New District Added: ", res.rowCount);
      response.json(success("OK", res.rows, res.status));
    }
  );
});

router.get("/get/district/:id", (request, response, next) => {
  const { id } = request.params;
  // pool.query("Select district.district_id,district.district, state.state_id, state.state, state.country_id, country.country from state INNER JOIN country on state.country_id = country.country_id inner join district on district.state_id = state.state_id", (err, res) =>{
  pool.query("Select * from district where state_id = $1", [id], (err, res) => {
    if (err) return next(new ErrorHandler(400, err.message));
    response.json(success("OK", res.rows, res.status));
  });
});

///city
router.post("/add/city", (request, response, next) => {
  const { district_id, city } = request.body;
  pool.query(
    "INSERT INTO city (city, district_id) VALUES ($1, $2) Returning *",
    [city, district_id],
    (err, res) => {
      if (err) return next(new ErrorHandler(400, err.message));
      console.log("New City Added: ", res.rowCount);
      response.json(success("OK", res.rows, res.status));
    }
  );
});
router.get("/get/city/:id", (request, response, next) => {
  const { id } = request.params;
  // pool.query("Select city.city_id, city.city, mc_list.mc_id, mc_list.mc ,district.district_id,district.district, state.state_id, state.state, state.country_id, country.country from state INNER JOIN country on state.country_id = country.country_id inner join district on district.state_id = state.state_id INNER JOIN mc_list on mc_list.district_id = district.district_id inner join city on mc_list.mc_id = city.city_id", (err, res) =>{
  pool.query("Select * from city where district_id = $1 ", [id], (err, res) => {
    if (err) return next(new ErrorHandler(400, err.message));
    response.json(success("OK", res.rows, res.status));
  });
});

router.put("/update/city/:id", (request, response, next) => {
  const { id } = request.params;

  const keys = ["city", "mc_id", "district_id"];
  const fields = [];
  keys.forEach((key) => {
    if (request.body[key]) fields.push(key);
  });

  fields.forEach((field, index) => {
    pool.query(
      `UPDATE public.city SET ${field} = ($1) WHERE id =($2) Returning *`,
      [request.body[field], id],
      (err, res) => {
        if (err) return next(new ErrorHandler(400, err.message));
        if (index === fields.length - 1)
          response.json(success("OK", res.rows, res.status));
      }
    );
  });
});

///area
router.post("/add/area", (request, response, next) => {
  const { area, city_id } = request.body;
  pool.query(
    "INSERT INTO area (area, city_id) VALUES ($1, $2) Returning *",
    [area, city_id],
    (err, res) => {
      if (err) return next(new ErrorHandler(400, err.message));
      console.log("New Area Added: ", res.rowCount);
      console.log("New Area Added: ", res.rows);
      response.json(success("OK", res.rows, res.status));
    }
  );
});

router.get("/get/area/:id", (request, response, next) => {
  const { id } = request.params;
  pool.query("Select * from area where city_id = $1", [id], (err, res) => {
    if (err) return next(new ErrorHandler(400, err.message));
    response.json(success("OK", res.rows, res.status));
  });
});

router.put("/update/area/:id", (request, response, next) => {
  const { id } = request.params;

  const keys = ["area", "city_id", "district_id"];
  const fields = [];
  keys.forEach((key) => {
    if (request.body[key]) fields.push(key);
  });

  fields.forEach((field, index) => {
    pool.query(
      `UPDATE public.city SET ${field} = ($1) WHERE id =($2) Returning *`,
      [request.body[field], id],
      (err, res) => {
        if (err) return next(new ErrorHandler(400, err.message));
        if (index === fields.length - 1)
          response.json(success("OK", res.rows, res.status));
      }
    );
  });
});

///municipal_corporation
router.post("/add/mc", (request, response, next) => {
  const { mc, country_id } = request.body;
  pool.query(
    "INSERT INTO mc_list (mc,country_id) VALUES ($1, $2) Returning *",
    [mc, country_id],
    (err, res) => {
      if (err) return next(new ErrorHandler(400, err.message));
      console.log("New Municipal Corporation Added: ", res.rowCount);
      response.json(success("OK", res.rows, res.status));
    }
  );
});

router.get("/get/mc/:id", (request, response, next) => {
  // pool.query("Select mc_list.mc_id, mc_list.mc ,district.district_id,district.district, state.state_id, state.state, state.country_id, country.country from state INNER JOIN country on state.country_id = country.country_id inner join district on district.state_id = state.state_id INNER JOIN mc_list on mc_list.district_id = district.district_id", (err, res) =>{

  const { id } = request.params;
  console.log(id);
  pool.query("SELECT * from mc_list where state_id = $1", [id], (err, res) => {
    if (err) return next(new ErrorHandler(400, err.message));
    response.json(success("OK", res.rows, res.status));
  });
});

router.get("/get/mc", (request, response, next) => {
  // pool.query("Select mc_list.mc_id, mc_list.mc ,district.district_id,district.district, state.state_id, state.state, state.country_id, country.country from state INNER JOIN country on state.country_id = country.country_id inner join district on district.state_id = state.state_id INNER JOIN mc_list on mc_list.district_id = district.district_id", (err, res) =>{

  pool.query("SELECT * from mc_list", (err, res) => {
    if (err) return next(new ErrorHandler(400, err.message));
    response.json(success("OK", res.rows, res.status));
  });
});

router.put("/update/mc/:id", (request, response, next) => {
  const { id } = request.params;

  const keys = ["mc", "state_id", "district_id", "country_id"];
  const fields = [];
  keys.forEach((key) => {
    if (request.body[key]) fields.push(key);
  });

  fields.forEach((field, index) => {
    pool.query(
      `UPDATE public.mc_list SET ${field} = ($1) WHERE id =($2) Returning *`,
      [request.body[field], id],
      (err, res) => {
        if (err) return next(new ErrorHandler(400, err.message));
        if (index === fields.length - 1)
          response.json(success("OK", res.rows[0], res.status));
      }
    );
  });
});
///ward
router.post("/add/ward", (request, response, next) => {
  const { ward_no, mc_id, country_id, nagarsevak } = request.body;
  pool.query(
    "INSERT INTO wards (ward_no, mc_id , nagarsevak, country_id) VALUES ($1, $2, $3, $4) Returning *",
    [ward_no, mc_id, nagarsevak, country_id],
    (err, res) => {
      if (err) return next(new ErrorHandler(400, err.message));
      console.log("New Ward Added: ", res.rowCount);
      response.json(success("OK", res.rows, res.status));
    }
  );
});

router.get("/get/ward", (request, response, next) => {
  // pool.query("Select wards.ward_id, wards.ward_no,wards.nagarsevak ,city.city_id, city.city, mc_list.mc_id, mc_list.mc ,district.district_id,district.district, state.state_id, state.state, state.country_id, country.country from state INNER JOIN country on state.country_id = country.country_id inner join district on district.state_id = state.state_id INNER JOIN mc_list on mc_list.state_id = state.state_id inner join city on mc_list.mc_id = city.city_id inner join wards on wards.ward_id = mc_list.mc_id", (err, res) =>{
  //     if(err) return  next(new ErrorHandler(400, err.message));
  //     response.json({
  //          "message":"success",
  //           "data":res.rows});
  //   });
  pool.query(
    " select wards.ward_id, wards.ward_no,wards.nagarsevak,\
   (select json_agg(alb)from (select * from mc_list where mc_id = wards.ward_id ) alb) \
   as mc from wards where ward_id = 1",
    (err, res) => {
      if (err) return next(new ErrorHandler(400, err.message));
      response.json(success("OK", res.rows, res.status));
    }
  );
});

router.put("/update/ward/:id", (request, response, next) => {
  const { id } = request.params;

  const keys = ["ward", "mc_id", "country_id", "nagarsevak"];
  const fields = [];
  keys.forEach((key) => {
    if (request.body[key]) fields.push(key);
  });

  fields.forEach((field, index) => {
    pool.query(
      `UPDATE public.wards SET ${field} = ($1) WHERE id =($2) Returning *`,
      [request.body[field], id],
      (err, res) => {
        if (err) return next(new ErrorHandler(400, err.message));
        if (index === fields.length - 1)
          response.json(success("OK", res.rows[0], res.status));
      }
    );
  });
});

///Address
router.post("/add/address", (request, response, next) => {
  const {
    ward,
    mc,
    area,
    city,
    district,
    state,
    country,
    pincode,
    full_address,
  } = request.body;



  pool.query(
    "INSERT INTO address (ward_id,mc_id,area_id,city_id,district_id,state_id,country_id,pincode,full_address) VALUES ($1, $2, $3, $4, $5, $6, $7,$8,$9)",
    [ward, mc, area, city, district, state, country, pincode, full_address],
    (err, res) => {
      if (err) return next(new ErrorHandler(400, err.message));
      console.log("New Address Added: ", res.rowCount);
      response.json(success("OK", res.rows, res.status));

    }
  );
});

router.put("/update/address/:id", (request, response, next) => {
  const { id } = request.params;

  const keys = ["ward", "mc", "area", "city", "district", "state", "country"];
  const fields = [];

  keys.forEach((key) => {
    if (request.body[key]) fields.push(key);
  });

  fields.forEach((field, index) => {
    pool.query(
      `UPDATE address SET ${field} = ($1) WHERE id =($2) Returning *`,
      [request.body[field], id],
      (err, res) => {
        if (err) return next(new ErrorHandler(400, err.message));
        if (index === fields.length - 1)
          response.json(success("OK", res.rows[0], res.status));
      }
    );
  });
});

router.get("/get/address/:search", async (request, response, next) => {
  const { search } = request.params;
  console.log(`Select * from address where full_address LIKE '%${search}%'`);
  address = pool.query(
    `With getAddress as  (
      Select addr.id,addr.full_address, (
          select ROW_TO_JSON(ar)
            from (select * from area as ar where ar.area_id = addr.area_id )ar) as area ,
          (select ROW_TO_JSON(ci)
            from (select * from city as ci where ci.city_id = addr.city_id)ci) as city,
          (select ROW_TO_JSON(dr)
            from (select * from district as dr where dr.district_id = addr.district_id)dr) as district,	
          (select ROW_TO_JSON(st)
            from (select * from state as st where st.state_id = addr.state_id)st) as state,
          (select ROW_TO_JSON(co)
            from (select * from country as co where co.country_id = addr.country_id)co) as country
    
            from address as addr where Upper(addr.full_address) LIKE Upper('%${search}%') LIMIT 5
    ) Select * from getAddress`,
    
    async (err, res) => {
      if (err) return next(new ErrorHandler(400, err.message));
      
      response.json(
        success(
          "OK",
          res.rows,
          res.status
        )
      );
      console.log({
        address: res.rows,
      });
    }
  );

  
});

router.put("/update/address/:id", (request, response, next) => {
  const { id } = request.params;
  const keys = ["ward", "mc", "area", "city", "landmark", "district"];
  const fields = [];
  keys.forEach((key) => {
    if (request.body[key]) fields.push(key);
  });

  fields.forEach((field, index) => {
    pool.query(
      `UPDATE public.wards SET ${field} = ($1) WHERE id =($2) Returning *`,
      [request.body[field], id],
      (err, res) => {
        if (err) return next(new ErrorHandler(400, err.message));
        if (index === fields.length - 1)
          response.json(success("OK", res.rows[0], res.status));
      }
    );
  });
});

module.exports = router;
