const {Router, request, response} = require("express");
const router = Router();
const pool = require("../db");
const saltRounds = require('../db_config/config');
var bcrypt = require('bcrypt');
const uploadFile = require('../functions/uploadPhoto.js');
const checkAuth = require('../routes/authenticateUser');
const checkAdmin = require('../routes/authenticateAdmin');
var currentTimeInMilliseconds=new Date().toLocaleString(undefined, {timeZone: 'Asia/Kolkata'});;
const Multer = require('multer');
const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024 // no larger than 5mb, you can change as needed.
    }
  });
router.get('/getUser', (request,response, next) =>{
    pool.query("Select * from users ", (err, res) =>{
        if(err){res.status(500);
             return next(err);}
        response.json(res.rows);
      });
});

// SELECT u.*,ur.soc_id, ur.room_id, s.soc_id,s.soc_name,s.soc_reg_no,s.soc_address_id
// FROM (SELECT id, UNNEST(user_room_id) as myroom
//        FROM  users
//       ) u inner join user_room as ur 
//                   on ur.userroom_id = u.myroom 
//       inner join society as s 
//                   on ur.soc_id = s.soc_id
//        inner join  
      
//  WHERE myroom IS NOT NULL;

router.get('/getUser/:id', (request,response, next) =>{
    const {id} = request.params;
    pool.query("SELECT u.*,(\
        select json_agg(alb)from ( select ur.*, r.* AS room from user_room as ur \
                                          inner join \
                                              rooms as r on r.room_id = ur.room_id \
                                  where ur.userroom_id = ur_id ) alb) as userroom\
        FROM (SELECT id, UNNEST(user_room_id) as ur_id FROM users where id = $1) u \
    WHERE ur_id IS NOT NULL;", [id], (err, res) =>{
        if(err){
            
            return next(err);}

        if(res.rowCount === 0){
            response.status(400).json({error:"No User Found"});
        }
        else{
        response.status(200).json({data:res.rows[0]});
        }
    });
});

router.get('/getUserRoom/:id', (request,response, next) =>{
    const {id} = request.params;
    pool.query("Select users from users WHERE id = $1", [id], (err, res) =>{
        if(err) return next(err);

        if(res.rowCount === 0){
            response.status(400).json({error:"No User Found"});
        }
        else{
        response.status(200).json({data:res.rows[0]});
    }
      });

});


    router.post('/newUser', async (request,response, next) =>{
    const {fname, lname, dob, gender, post, email, device_id, mobile_no, token, age, block_count, mobile_model, auth_token , is_active, password, status, photo} = request.body;
    console.log(password,saltRounds.salt);  
    const passwordHash = await bcrypt.hashSync(password,saltRounds.salt);
    console.log(passwordHash);

        
    pool.query('INSERT INTO users (fname, lname, dob, gender, post, email, device_id, mobile_no, token, age, block_count, mobile_model, auth_token , is_active, password, status, photo, updated_at, created_at, user_room_id, vehicle_id`) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13,$14,$15,$16,$17,$18,$19,$20,$21) RETURNING *' ,
    [fname, lname, dob, gender, post, email, device_id, mobile_no, token, age, block_count, mobile_model, auth_token , is_active, passwordHash, status, photo,currentTimeInMilliseconds,currentTimeInMilliseconds,[],[]], (err, res) =>{
         if(err) return next(err);
        console.log("created User: ",res.rows[0]);
        response.status(200).json({"data":res.rows[0]});
    });
    });

router.put('/:id', (request,response, next) =>{
    const {id} = request.params;
   
    const keys = ['fname','lname', 'dob', 'gender', 'post', 'age',
    'mobile_no', 'status', 'email', 'block_count', 'mobile_model',
    'auth_token', 'is_active', 'device_id','photo', 'token'];
    const fields = [];
    keys.forEach(key =>{
        if(request.body[key]) fields.push(key);
    });

    pool.query(`UPDATE public.users SET updated_at = ($1) WHERE id =($2) Returning *`,
        [currentTimeInMilliseconds, id], (err, res) =>{
            if(err) return next(err);

          });
    fields.forEach((field, index) =>{
        // if(field === 'password'){
        //     request.body[field] = await bcrypt.hashSync(request.body[field],saltRounds.salt);
        // }
        pool.query(`UPDATE public.users SET ${field} = ($1) WHERE id =($2) Returning *`,
        [request.body[field], id], (err, res) =>{
            if(err) return next(err);
              if(index === fields.length - 1)
              response.status(200).json({"data":res.rows[0]});
          });
        });
    });

    router.put('/updatePassword/:id', async (request, response, next) =>{
        const {id} = request.params;  
        const {password} = request.body;
        const passwordHash = await bcrypt.hashSync(password,saltRounds.salt);
   
        pool.query(`UPDATE public.users SET password = ($1) WHERE id =($2) Returning *`,
        [passwordHash, id], (err, res) =>{
            if(err) return next(err);
              response.status(200).json({"message":"success"});
          });
        });


        router.put('/updatePhoto/:id',multer.single('file'), async (request, response, next) =>{
            let file = req.file;
            if (file) {
                uploadFile(file).then((success) => {
                res.status(200).send({
                    status: 'success'
                }).json({'message':"Photo uploaded"});
                }).catch((error) => {
                console.error(error);
                });
            }

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