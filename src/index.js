const express = require('express')
const path = require('path');
const exphbs = require('express-handlebars');
const flash = require('connect-flash')
const session = require('express-session')
const MySqlStore = require('express-mysql-session')
const passport = require('passport')

const {database} = require('./keys')
//Initializations

const app = express();
require('./lib/passport')

//setings
app.set('port',process.env.PORT || 3000);
app.set("views", path.resolve(__dirname, "./views"))

app.engine('.hbs',exphbs.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'),'layouts'),
    partialsDir: path.join(app.get('views'),'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));

app.set('view engine','.hbs');
//Middlewares
app.use(session({
    secret:'mysqlcon',
    resave: false,
    saveUninitialized:false,
    store: new MySqlStore(database)
}))
app.use(flash());
app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.use(passport.initialize())
app.use(passport.session())


//global varaiables

app.use((req, res, next)=>{
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user
    next();
});

//Routes
app.use(require('./routes/index.js'))
app.use(require('./routes/autentication'))
app.use('/links',require('./routes/link'))
//Public

//Starting the server

app.listen(app.get('port'),()=>{
    console.log('server on port', app.get('port'));
})




