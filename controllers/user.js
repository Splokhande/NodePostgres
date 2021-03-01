
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
        mobileNo: req.body.mobileNo,
        status: req.body.status,
        email: req.body.email,
        blockCount: req.body.blockCount,
        mobileModel: req.body.mobileModel,
        isLoggedIn: req.body.isLoggedIn,
        active: req.body.active,
        post: req.body.post,
        deviceId:req.body.deviceId,
        
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
