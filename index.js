//  @author: Dominic Bruno
//  @app: Node Final project PlentiBytes | Final Project & Proposal
//  @course: Software Engineering (Proff. Pogue), Spring 2021 | Lewis University
//  @contact: dominicmbruno@lewisu.edu

const cors = require('cors');
const express = require('express');
const session = require('express-session');
const handlebars = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport');

//  DB work
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const db = require('./utils/db');
require('./models/Session');

const { port, passKey} = require('./config');

const app = express();

//  HBS (ext) - Handlebars View Enginee0-
//  @ Local DIR - 'view'
app.engine('.hbs', handlebars({ 
    defaultLayout: 'main', 
    extname: '.hbs'
}));
app.set('view engine', 'hbs');

//  Static Files @ Local DIR - 'src'
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

//  Allows server to indicate other origins
app.use(cors());

//  Session Middleware + link to passport
app.use(session({
    secret: passKey,
    store: new SequelizeStore({ 
        db: db,
        table: 'sessions'
    }),
    resave: false,
    saveUninitialized: false
  }));

app.use(passport.initialize());
app.use(passport.session());
 
app.use('/', require('./routes/index.js'));
app.use('/auth', require('./routes/auth.js'));


app.listen(port, (req, res) => {
    console.log(`App running on server: ${port}`);
});