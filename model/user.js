const pool = require('../db_config/config');


const User = function(User){
    this.id = User.id;
    this.fname = User.fname;
    this.lname = User.lname;
    this.age = User.age;
    this.dob = User.dob;
    this.gender = User.gender;
    this.password = User.password;
    this.mobileNo = User.mobileNo;
    this.photo = User.photo;
    this.post = User.post;
    this.status = User.status;
    this.email = User.email;
    this.blockCount = User.blockCount;
    this.mobileModel = User.mobileModel;
    this.isLoggedIn = User.isLoggedIn;
    this.isActive = User.isActive;
    this.deviceId = User.deviceId;
    this.token = User.token;
}

User.getAll = result =>{
    pool.query("Select * from users ", (err, res) =>{
        if(err) return next(err);
        console.log(res.rows);
        res.json(res.rows);
      });

}

User.getById = (id, result) =>{
    const {id} = request.params;
    pool.query("Select * from users WHERE id = $1", [id], (err, res) =>{
        if(err) return next(err);
        if(res.rowCount === 0){
            response.json({"message":"No User Found"});
        }
        else
        {
        response.json(res.rows);
    }
      });

}



User.create = (newUser, result )=> {
const {fname, lname, dob, gender, age, mobileNo, status, email, blockCount, mobileModel, 
    isLoggedIn, active, deviceId} = request.body;
    // pool.query('INSERT INTO public.user_detail (f_name, l_name, dob, gender, age, mobile_no, status, email, block_count, mobile_model, is_logged_in, active, device_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)' 
    pool.query('INSERT INTO users SET ?', newUser,(err,res)=>{
        if(err){
            console.log("error ", err);
            result(err,null);
            return;
        }

        console.log("created User: ",{id:res.id,});
    // }
    // ,[fname, lname, dob, gender, age, mobileNo, status, email, blockCount,
    // mobileModel, isLoggedIn, active, deviceId], (err, res) =>{
    //     if(err) return next(err);

    //     response.redirect('/user_detail/user_detail');

      });

}

User.put('/:id', (request,response, next) => {
    const {id} = request.params;
    const {fname, lname, dob, gender, age, mobileNo, status, email, blockCount, mobileModel, isLoggedIn, active, deviceId} = request.body;
    const keys = ['f_name','l_name', 'dob', 'gender', 'age', 'mobile_no','password', 'status', 'email', 'block_count', 'mobile_model', 'is_logged_in', 'active', 'device_id'];
    const fields = [];

    keys.forEach(key => {
        if(request.body[key]) fields.push(key);
    });

    fields.forEach((field, index) =>{
        pool.query(`UPDATE public.users SET ${field} = ($1) WHERE id =($2)`,
        [request.body[field], id], (err, res) =>{
            if(err) return next(err);
              if(index === fields.length - 1) 
               response.redirect('/user_detail/user_detail');
          });
        });
    });

    User.delete('/:id', (request,response,next) =>{
        const id = request.params;

        pool.query(`DELETE FROM public.user_detail WHERE id =($1)`,[id],
        (err, res)=>{
            if(err) return next(err);
            res.redirect('/user_detail/user_detail');
        });

 });

 module.exports = User;