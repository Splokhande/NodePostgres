
const User = require("../model/user.js");

exports.create = (req,res) =>{
    if(!req.body){
        res.status(400).send({
            message: "Content cannot be empty"
        });
    }

    const user = new User({
        fname: req.body.fname,
        lname: req.body.lname,
        dob: req.body.dob,
        gender: req.body.gender,
        age: req.body.age,
        mobile_no: req.body.mobile_no,
        status: req.body.status,
        email: req.body.email,
        block_count: req.body.block_count,
        mobile_model: req.body.mobile_model,
        auth_token: req.body.auth_token,
        active: req.body.active,
        post: req.body.post,
        device_id:req.body.device_id,
    });
    User.create(user, (err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the Customer."
          });
        else res.send(data);
      });

};

exports.get = (req,res) => {
};
  User.getAll((err, data) => {
    if(err)
    res.status(500).send({
      message:
        err.message || "Some error occurred while fetching the Customer."
    });
    else res.send(data);
  });
