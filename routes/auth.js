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
router.post('/login', (req, res, next) => {

  

    // Read username and password from request body
    const { email, password } = req.body;
    console.log(req.body,email, password);
    // Filter user from the users array by username and password
    // const user = users.find(u => { return u.username === username && u.password === password });
    user = pool.query("Select * from public.users WHERE email= $1 AND password = $2", 
    [email,password])
    .then((rows,err) =>{
        if(err) return next(err);

    //     if(res.rowCount === 0){
    //         response.json({"message":"No User Found"});
    //     }
    //     else{
    //         const accessToken = jwt.sign({ username: email,
    //             // role: user.role 
    //         }, secret);
    //         console.log(accessToken);
    //     //    return  response.json({
    //     //         "token":accessToken}
    //     //     );
    //     // response.json(res.rows);
    // }
            
           
        // Generate an access token
        const accessToken = jwt.sign({ username: rows.username,}, secret);
        console.log(rows.rows[0].id, accessToken);
            pool.query(`UPDATE public.users SET auth_token = ($1) WHERE id =($2)`,
        
            [accessToken, rows.rows[0].id]).then(data =>{
                console.log(data.rows);
                pool.query("Select * from public.users WHERE id = $1", [rows.rows[0].id], (err, res) =>{
                    if(err) return next(err);
                    if(res.rowCount === 0)
                    {
                        res.json({"message":"No User Found"});
                    }
                    else
                    {
                        response.redirect(User.);
                }
              });
            });
        // res.json({
        //     accessToken
        // });

      }
      );

    if (user) {
    }
     else {
        res.send('Username or password incorrect');
    }
});

module.exports = router;