const passport = require('passport')
const localEstrategy = require('passport-local').Strategy

const pool = require('../database')
const helpers = require('../lib/helpers')

passport.use('local.signin', new localEstrategy ({
    usernameField: "username",
    passwordField: "password",
    passReqToCallback: true

}, async (req, username , password, done)=>{
    const rows = await pool.query('SELECT * FROM users WHERE username = ?', [username])
    if (rows.length > 0){
        const user = rows[0]
        const validPassword = await helpers.mathcPassword(password , user.password)
        if(validPassword){
            console.log('jaja')
            done(null, user , req.flash('success', 'Wellcome '  + user.username))
        }else{
            done(null, false , req.flash('message','Incorrect password'))
        }
    }else{
        return (done(null, false, req.flash('message','The Username does not exist')))
    }
}))

passport.use('local.signup', new localEstrategy ({
    usernameField: "username",
    passwordField: "password",
    passReqToCallback: true
}, async(req, username, password, done)=>{
    console.log(req.body);
    const{ fullname } = req.body
    const newUser ={
        username,
        password,
        fullname
        
    }
    newUser.password = await helpers.encryptPassword(password)
    const result = await pool.query('INSERT INTO users SET ?', [newUser])
    newUser.id = result.insertId
    return done(null , newUser)
}))

passport.serializeUser((user, done)=>{
    done(null, user.id)
    console.log(user)
})

passport.deserializeUser(async(id, done)=>{
    const rows = await pool.query('SELECT * FROM users WHERE id = ?', [id])
    done(null, rows[0])
})