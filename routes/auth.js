const {Router, request, response} = require("express");
const router = Router();
const pool = require("../db");
const { password } = require("../db_config/config");
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var User = require('../routes/user');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const {secret} =  require('../db_config/config');
router.post('/login', async(request, response, next) => {

  

    // Read username and password from request body
    const { email, password,device_id, mobile_model } = request.body;
    console.log(request.body,email, password);
    // Filter user from the users array by username and password
    // const user = users.find(u => { return u.username === username && u.password === password });
    await pool.query(`Select * from public.users WHERE email=$1 `,[email])
    .then(async(rows,err) =>{
        if(err) return next(err);
        // Generate an access token
        // console.log(rows.rows[0].id);
        const validPassword = await bcrypt.compare(password, rows.rows[0].password);
        console.log(validPassword);
        if(validPassword)
      {
        const accessToken = jwt.sign({ username: rows.rows[0].username,post: rows.rows[0].post}, secret);
        // console.log(rows.rows[0].id, accessToken);
            pool.query(`UPDATE public.users SET auth_token = ($1), device_id = ($2), mobile_model = ($3) WHERE id =($4)`,
            [accessToken, device_id, mobile_model, rows.rows[0].id]).then((data, err) =>{
                // console.log(data.rows);

                pool.query("SELECT u.*,(\
                  select json_agg(userroom)\
            from ( \
                select *,\
                (select json_agg(room) from ( select * from rooms as r where r.room_id = ur.room_id ) room) as room ,\
                    (select json_agg(society)from ( select * ,\
                                  (select json_agg(address) from ( select * from address as addr where s.soc_address_id = id ) address) as address \
                                  from society as s where s.soc_id = ur.soc_id ) society) as society \
                  from user_room as ur where ur.userroom_id = ur_id \
              ) userroom\
          ) as userroom \
                  FROM (SELECT *, UNNEST(user_room_id) as ur_id FROM users where id = $1)  u \
              WHERE ur_id IS NOT NULL;",  [rows.rows[0].id], (err, res) =>{
                
                   

                    if(err) return next(err);
                    if(res.rowCount === 0)
                    {
                        res.json({"message":"No User Found"});
                    }
                    else
                    {
                        console.log("token generated and login successful");
                        response.status(200).json(res.rows);
                }
              });
            });
        }
        else{
            response.status(400).json({ error: "Invalid Password" });
        }
      }
      );

    // if (user) {
    // }
    //  else {
    //     res.send('Username or password incorrect');
    // }
});

module.exports = router;