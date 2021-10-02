const expressJwt = require('express-jwt');
const config =  require('../db_config/config');

module.exports = jwt;

function jwt() {
    const  secret  = config.secret;
    var response = expressJwt({ secret, algorithms: ['HS256'], },
    ).unless({
        path: [
            // public routes that don't require authentication
            '/auth/login',
            '/user/newUser',
            '/user/newUser',
            '/admin/login'
        ],

    });
    console.log("____________________________");
    console.log(response);
        return response;

}