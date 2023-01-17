var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

module.exports = function(passport) {
    var opts = {}
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = 'Rasbet';
    opts.algorithms = ['HS256']
    
    passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
        return done(null,true)
    }));
}