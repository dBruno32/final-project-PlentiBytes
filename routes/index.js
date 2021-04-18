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
router.get('/', (req,res) => {
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

// Grab Commitments from HTML 
router.post('/schedule/goals/daily', (req, res) => {
    if(req.session.authorizedUser) {
        // Passes the req.body data to an array
        const pendingCommitments = Object.entries(req.body);

        pendingCommitments.forEach(element => {
            console.log(element[1]);
        });

        // temp
        res.redirect('/schedule/goals/daily');

        // TODO: Helper function to Split string element to get the different columns for DB


        // [X] TODO: CLIENT | Add Scripts to append goals to Commitment list items
        // [X] TODO: Interfacing | When click submit...
        // [] TODO: SERVER | Code to grab list items and iterate through to create new database goal rows
        // [] TODO: SERVR | Save new entries on "commit"
    }
});

module.exports = router;