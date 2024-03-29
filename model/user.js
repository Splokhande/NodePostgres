module.exports = class User{
    constructor(id, fname, lname, age, dob, gender, password, mobile_no, photo, post, status, 
        email, block_count, mobile_model, auth_token, is_active, device_id, token){
        
    this.id = id;
    this.fname = fname;
    this.lname = lname;
    this.age = age;
    this.dob = dob;
    this.gender = gender;
    this.password = password;
    this.mobile_no = mobile_no;
    this.photo = photo;
    this.post = post;
    this.status = status;
    this.email = email;
    this.block_count = block_count;
    this.mobile_model = mobile_model;
    this.auth_token = auth_token;
    this.is_active = is_active;
    this.device_id = device_id;
    this.token = token;
    }
}






// const pool = require('../db_config/config');


// const User = function(User){
//     this.id = User.id;
//     this.fname = User.fname;
//     this.lname = User.lname;
//     this.age = User.age;
//     this.dob = User.dob;
//     this.gender = User.gender;
//     this.password = User.password;
//     this.mobile_no = User.mobile_no;
//     this.photo = User.photo;
//     this.post = User.post;
//     this.status = User.status;
//     this.email = User.email;
//     this.block_count = User.block_count;
//     this.mobile_model = User.mobile_model;
//     this.auth_token = User.auth_token;
//     this.is_active = User.is_active;
//     this.device_id = User.device_id;
//     this.token = User.token;
// }

// User.getAll = result =>{
//     pool.query("Select * from users ", (err, res) =>{
//         if(err) return  next(new ErrorHandler(400, err.message));
//         console.log(res.rows);
//         res.json(res.rows);
//       });

// }

// User.getById = (id, result) =>{
//     const {id} = request.params;
//     pool.query("Select * from users WHERE id = $1", [id], (err, res) =>{
//         if(err) return  next(new ErrorHandler(400, err.message));
//         if(res.rowCount === 0){
//             response.json({"message":"No User Found"});
//         }
//         else
//         {
//         response.json(res.rows);
//     }
//       });

// }



// User.create = (newUser, result )=> {
// const {fname, lname, dob, gender, age, mobileNo, status, email, blockCount, mobileModel, 
//     isLoggedIn, active, deviceId} = request.body;
//     // pool.query('INSERT INTO public.user_detail (f_name, l_name, dob, gender, age, mobile_no, status, email, block_count, mobile_model, is_logged_in, active, device_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)' 
//     pool.query('INSERT INTO users SET ?', newUser,(err,res)=>{
//         if(err){
//             console.log("error ", err);
//             result(err,null);
//             return;
//         }

//         console.log("created User: ",{id:res.id,});
//     // }
//     // ,[fname, lname, dob, gender, age, mobileNo, status, email, blockCount,
//     // mobileModel, isLoggedIn, active, deviceId], (err, res) =>{
//     //     if(err) return  next(new ErrorHandler(400, err.message));

//     //     response.redirect('/user_detail/user_detail');

//       });

// }

// User.put('/:id', (request,response, next) => {
//     const {id} = request.params;
//     const {fname, lname, dob, gender, age, mobileNo, status, email, blockCount, mobileModel, isLoggedIn, active, deviceId} = request.body;
//     const keys = ['f_name','l_name', 'dob', 'gender', 'age', 'mobile_no','password', 'status', 'email', 'block_count', 'mobile_model', 'is_logged_in', 'active', 'device_id'];
//     const fields = [];

//     keys.forEach(key => {
//         if(request.body[key]) fields.push(key);
//     });

//     fields.forEach((field, index) =>{
//         pool.query(`UPDATE public.users SET ${field} = ($1) WHERE id =($2)`,
//         [request.body[field], id], (err, res) =>{
//             if(err) return  next(new ErrorHandler(400, err.message));
//               if(index === fields.length - 1) 
//                response.redirect('/user_detail/user_detail');
//           });
//         });
//     });

//     User.delete('/:id', (request,response,next) =>{
//         const id = request.params;

//         pool.query(`DELETE FROM public.user_detail WHERE id =($1)`,[id],
//         (err, res)=>{
//             if(err) return  next(new ErrorHandler(400, err.message));
//             res.redirect('/user_detail/user_detail');
//         });

//  });

//  module.exports = User;