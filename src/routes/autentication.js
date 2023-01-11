const express = require('express')
const router = express.Router();
const passport = require('passport');
const { get } = require('./link');

const {isLogedIn, isNotLogedIn} = require('../lib/auth')

router.get('/signup',isNotLogedIn, (req, res)=>{
    res.render('auth/signup')
})

router.post('/signup',isNotLogedIn,passport.authenticate('local.signup',{
    successRedirect:'/profile',
    failureRedirect:'/signup',
    failureFlash:true
    
}))

router.get('/signin',isNotLogedIn, (req, res) => {
    res.render('auth/signin')
  })
router.post('/signin',isNotLogedIn,(req, res, next)=> {
    passport.authenticate('local.signin',{
        successRedirect:'/profile',
        failureRedirect:'/signin',
        failureFlash:true
    })(req,res,next)
})


router.get('/profile', isLogedIn, (req, res) => {
  res.render('profile')
})

router.get("/logout",isLogedIn, (req, res) => {
    req.logout(req.user, err => {
      if(err) return next(err);
      res.redirect("/signin");
    });
  });



module.exports =  router