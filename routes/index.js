const express = require('express');
const router = express.Router();
const passport = require('passport');


// TEMP - For pages not yet set up
router.get('/errors/temp', (req, res) => {
    res.render('errors/temp');
});

// PROPOSAL
router.get('/proposal', (req, res) => {
    res.render('proposal');
});


// MAIN ENTRY POINT
router.get('/',  (req,res) => {
    res.render('main', {
        layout: 'login'
    });
});

// HOME / Dashboard
router.get('/home', (req,res) => {
    console.log(req.isAuthenticated());
    if(req.session.authorizedUser) {
        const user = req.session.authorizedUser;

        res.render('home', {
            name: user.displayName,
            startDate: new Date(user.createdAt).toDateString()
        });
    }
});


// Schedule/Create New
router.get('/schedule/create-new',  (req, res) => {
    if(req.session.authorizedUser) {
        res.render('schedule/create-new');
    }
});

// Schedule/Review
router.get('/schedule/review',  (req, res) => {
    if(req.session.authorizedUser) {
        res.render('schedule/review');
    }
});

// Schedule/goals/weekly
router.get('/schedule/goals/weekly',  (req, res) => {
    if(req.session.authorizedUser) {
        res.render('schedule/goals/weekly');
    }
});

// Schedule/goals/daily
router.get('/schedule/goals/daily', (req, res) => {
    if(req.session.authorizedUser) {
        res.render('schedule/goals/daily');
    }
});

module.exports = router;