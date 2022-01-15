const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const connectDB = require('./config/db')
const morgan = require('morgan')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const {engine} = require('express-handlebars')
const methodOverride = require('method-override')

//Load Config
dotenv.config({path: './config/config.env'})

// Passport Config
require('./config/passport')(passport)


connectDB()

//Iinitiallize an object of Express()
const app = express()

//Body parser
app.use(express.urlencoded({extended: false}))
app.use(express.json())


//Method Override
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    let method = req.body._method
    delete req.body._method
    return method
  }
}))

//Initializing a user when the development process is pinged
if(process.env.NODE_ENV === 'development'){
    app.use(morgan("dev"))
}


//Handlebar Helpers
const {formatDate, stripTags, truncate, editIcon, select} = require('./helpers/hbs')

//Handlebars
app.engine('.hbs', engine({
  helpers: {
    formatDate,
    stripTags,
    truncate,
    editIcon,
    select
  },
  defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', './views');


//Express session
// app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI
  })
}))

// const store = new MongoStore({
//   uri: process.env.MONGO_URI,
//   collection: "mySessions"
// })

// app.use(session({
//   secret: 'keyboard cat',
//   resave: false,
//   saveUninitialized: false,
//   store: store
// }))

//Passport middleware
app.use(passport.initialize())
app.use(passport.session())


//Set Global Variables
app.use(function (req, res, next){
  res.locals.user = req.user || null
  next()
})

//Static folder
app.use(express.static(path.join(__dirname, 'public')))


// Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))


const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server is running in ${process.env.NODE_ENV} mode on Port ${PORT}`))
