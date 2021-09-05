

module.exports = {
    handle:async function errorHandle (err){
        console.log(err);
        console.log(err.message); 
        return {
            "message":err.message,
        }
     },
};