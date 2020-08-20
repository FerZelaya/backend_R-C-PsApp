var express = require('express')
var router = express.Router()
var passport = require('passport')
var passportJWT = require('passport-jwt')

var extractJWT = passportJWT.ExtractJwt
var strategyJWT = passportJWT.Strategy

passport.use(
    new strategyJWT(
        {
            jwtFromRequest: extractJWT.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET
        },
        (payload, next)=>{
            var user = payload
            return next(null, user)
        }
    )
)

var secRoutes = require('./sec')
var recipesRoutes = require('./recipes')

//public route
router.use("/sec", secRoutes)

//private route
const jwtAuthMiddleware = passport.authenticate('jwt' , {session:false})
router.use("/recipes", jwtAuthMiddleware, recipesRoutes)


module.exports = router;

