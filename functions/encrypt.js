const saltRounds = require('../db_config/config');
const bcrypt = require('bcrypt');
module.exports ={
    encrypt: async function encryptData (data){
        console.log(data);
        console.log(await bcrypt.hash(data, saltRounds.salt));
        return  await bcrypt.hash(data, saltRounds.salt);
     },
     decrypt:function decryptData (data,hash){
        return bcrypt.compare(data, hash, (err, result) => {
             //result is true or false
             if(err) return err;
             return result;
           });
     }
};