const {Router, request, response} = require("express");
const router = Router();
const pool = require("../db");
const saltRounds = require('../db_config/config');
var bcrypt = require('bcrypt');

// module.exports = app => {
    
//     const user = require("../controllers/user");

//     // Create a new User
//     app.post("/user", user.create);

//     // Retrieve all User
//     app.get("/user", user.get);

//     // Retrieve a single User with UserId
//     app.get("/user/:userId", user.findById);

//     // Update a User with UserId
//     app.put("/user/:userId", user.updateById);

//     // Delete a User with UserId
//     app.delete("/user/:userId", user.deleteById);

//     // Delete a User
//     app.delete("/user", user.deleteAll);
//   };

router.get('/getUser', (request,response, next) =>{
    pool.query("Select * from users", (err, res) =>{
        if(err) return next(err);
        response.json(res.rows);
      });

});

router.get('/getUser/:id', (request,response, next) =>{
    const {id} = request.params;
    pool.query("Select * from public.users WHERE id = $1", [id], (err, res) =>{
        if(err) return next(err);

        if(res.rowCount === 0){
            response.status(400).json({error:"No User Found"});
        }
        else{
        response.status(200).json({data:res.rows[0]});
    }
      });

});


router.post('/', async (request,response, next) =>{
const {fname, lname, dob, gender, post, email, device_id, mobile_no, token, age, block_count, mobile_model, auth_token , is_active, password, status, photo} = request.body;
console.log(password,saltRounds.salt);
const passwordHash = await bcrypt.hashSync(password,saltRounds.salt);
console.log(passwordHash);
pool.query('INSERT INTO users (fname, lname, dob, gender, post, email, device_id, mobile_no, token, age, block_count, mobile_model, auth_token , is_active, password, status, photo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13,$14,$15,$16,$17)' ,
[fname, lname, dob, gender, post, email, device_id, mobile_no, token, age, block_count, mobile_model, auth_token , is_active, passwordHash, status, photo], (err, res) =>{
    if(err) return next(err);
    console.log("created User: ",res.rowCount);
    response.redirect('/user/getUser');
  });
});

router.put('/:id', (request,response, next) =>{

    const {id} = request.params;
    const keys = ['fname','lname', 'dob', 'gender', 'post', 'age', 
    'mobile_no','password', 'status', 'email', 'block_count', 'mobile_model', 
    'auth_token', 'is_active', 'device_id','photo', 'token'];
    const fields = [];

    keys.forEach(key =>{
        if(request.body[key]) fields.push(key);
    });

    fields.forEach((field, index) =>{
        pool.query(`UPDATE public.users SET ${field} = ($1) WHERE id =($2)`,
        [request.body[field], id], (err, res) =>{
            if(err) return next(err);
              if(index === fields.length - 1)  
              response.redirect('/user/getUser');
          });
        });
    });
 

 router.delete('/:id', (request,response,next) =>{
        const id = request.params;

        pool.query(`DELETE FROM public.users WHERE id =($1)`,[id],
        (err, res)=>{
            if(err) return next(err);
            
            response.redirect('/user_detail/user_detail');
        });

 });



module.exports = router;