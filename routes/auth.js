const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Login - View
router.get('/login', (req, res) => {
    res.render('login', {
        layout: 'login'
    });
});

// Login - Check in DB
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({where: { email: email } });

    // Find if User exists in system
    if(existingUser) {

        // Password Authentication
        if(await bcrypt.compare(password, existingUser.password)) {
          
            // Authorize User to the Session & Pass User details
            req.session.authorizedUser = {
                auth: true,
                displayName: existingUser.displayName,
                createdAt: existingUser.createdAt
            }

            const userID = existingUser.id;
            // Passport function call 
            req.login(existingUser, function(err) {
                if(err) {
                    console.log("UT OH");
                }
            });

            res.redirect('/home');
        } else {
            return res.render('errors/wrong-password', {
                layout: 'login'
            });
        }
        
    } else {
        return res.render('errors/user-does-not-exist', {
            layout: 'login'
        });
    }
});

// Initialiaze Persistance of Session
passport.serializeUser(function(userID, done) {
    done(null, userID);
});
  
passport.deserializeUser(function(userID, done) {
    done(null, userID);
});


// Register View 
router.get('/register', (req, res) => {
    res.render('register', {
        layout: 'login'
    });
});

// Register - Add in DB
router.post('/register', async (req, res) => {
    const { displayName, email, password } = req.body;
    
     // Find if User already exists in system
    let existingUser = await User.findOne({where: { email: email }});

    if(existingUser) {
        return res.render('errors/user-already-exists', {
            layout: 'login'
        });
    } else {

        const hashedPassword = await bcrypt.hash(password, 10);
        // Create  new User obj for DB w/ hashedPassword if User doesn't exist
        const newUser = new User({
            displayName, 
            email,
            password: hashedPassword
        }); 

        await newUser.save();

        res.redirect('/auth/login');
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;