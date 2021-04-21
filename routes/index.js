// TODO: Modularize into separate router files

const express = require('express');
const router = express.Router();
const passport = require('passport');

const Goal = require('../models/Goal');
const Food = require('../models/Food');
const Schedule = require('../models/Schedule');


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
router.get('/home', (req, res) => {
    if(req.session.authorizedUser) {
        const user = req.session.authorizedUser;

        res.render('home', {
            name: user.displayName,
            startDate: new Date(user.createdAt).toDateString()
        });
    }
});

// View Foods
router.get('/foods', async (req, res) => {
    if(req.session.authorizedUser) {
        const user = req.session.authorizedUser;
    
        // *TODO* []: !!!!FORM VALIDATIONS!!!!
        // TODO [X]: QUery all user's (by ID) foods
        // TODO [X-Needs More Testing]: Categorize foods by their values    
        // TODO [X]: Parse into separate arrays
        // TODO [X]: render out as li elements in appropriate divs on .HBS page

        const allUsersFoods = await Food.findAll({ where: {owner: req.user.id} });

        const carbohydrateDenseFoods = [];
        const fiberDenseFoods = [];
        const fatDenseFoods = [];
        const proteinDenseFoods = [];
        const sugarDenseFoods = [];

        // Sum up total grams carb + fat + protein
        // Find prio (Carb / Fat / Protein) /3??
        // If CARB -> sum up total grams sugar + fiber  + (Carb - (sugar+fiber))
        // FInd prio (Carb / sugar / fiber)

        allUsersFoods.forEach(food => {
            const carb = food.servingCarbohydrate;
            const fat = food.servingFat;
            const fiber = food.servingFiber;
            const protein = food.servingProtein;
            const sugar = food.servingSugar;
            
//            const totalGram = food.servingCarbohydrate + food.servingFat + food.servingProtein;
            const totalGram = food.servingSize;
            
            // Rank big 3 (C/F/P)
            // TODO: Helper functions and helper class - messsy
            if(((carb / totalGram) > (fat/totalGram)) && ((carb/totalGram) > (protein/totalGram))) {
                // PRIO - Carbs
                // Rank Carb v Fiber v Sugar
                const carbDifference = carb - (fiber + sugar);  // helper var

                if(((fiber / carb) > (sugar/carb)) && ((fiber / carb) > (carbDifference / carb)) ) {
                // PRIO - Fiber
                    fiberDenseFoods.push(`${food.description} | ${food.servingCalorie} calories per ${food.servingSize}g serving.`);

                } else if(((sugar / carb) > (fiber/carb)) && ((sugar / carb) > (carbDifference / carb))) {
                // PRIO - Sugar
                    sugarDenseFoods.push(`${food.description} | ${food.servingCalorie} calories per ${food.servingSize}g serving.`);

                } else if(((carbDifference / carb) > (fiber/carb)) && ((carbDifference / carb) > (sugar / carb))) {
                // PRIO - Carb
                    carbohydrateDenseFoods.push(`${food.description} | ${food.servingCalorie} calories per ${food.servingSize}g serving.`);
                }

            } else if(((fat / totalGram) > (carb/totalGram)) && ((fat/totalGram) > (protein/totalGram))) {
                // PRIO - Fats
                fatDenseFoods.push(`${food.description} | ${food.servingCalorie} calories per ${food.servingSize}g serving.`);

            } else if(((protein / totalGram) > (fat/totalGram)) && ((protein/totalGram) > (carb/totalGram))) {
                // PRIO - Protein
                proteinDenseFoods.push(`${food.description} | ${food.servingCalorie} calories per ${food.servingSize}g serving.`);
            }
        });

        res.render('foods/view', {
            name: user.displayName,
            carbohydrates: carbohydrateDenseFoods,
            fibers: fiberDenseFoods,
            fats: fatDenseFoods,
            proteins: proteinDenseFoods,
            sugars: sugarDenseFoods
        });
    }
});

// Add a Food | render / GET
router.get('/foods/add', (req, res) => {  
    if(req.session.authorizedUser) {
        const user = req.session.authorizedUser;

        res.render('foods/add', {
            name: user.displayName
        });
    }
});

// Add a Food | POST + add to DB
router.post('/foods/add', async (req, res) => {
    
    if(req.session.authorizedUser) {
        const user = req.session.authorizedUser;
        console.log("US", req.user.id);

        const {
            foodDescription,
            servingSize,
            calorieServing,
            carbohydrateServing,
            fatServing,
            fiberServing,
            proteinServing,
            sugarServing
        } = req.body;

        const food = new Food({
            owner: req.user.id,
            description: foodDescription,
            servingSize: servingSize,
            servingCalorie: calorieServing,
            servingCarbohydrate: carbohydrateServing,
            servingFat: fatServing,
            servingFiber: fiberServing,
            servingProtein: proteinServing,
            servingSugar: sugarServing
        });

        await food.save();

        res.redirect('/foods');
    }
});

/* 
// Schedule/Create New
router.get('/schedule/create-new',  (req, res) => {
    if(req.session.authorizedUser) {
        res.render('schedule/create-new');
    }
});
*/

// Schedule/Create New
router.post('/schedule/create-new',  async (req, res) => {
    if(req.session.authorizedUser) {
        const schedule = new Schedule({
            title: req.body.scheduleTitle,
            owner: req.user.id,
        });
        
        await schedule.save();

        res.redirect(`/schedule/review/${schedule.id}`);
    }
});

router.get('/review-all-schedules', async (req, res) => {
    if(req.session.authorizedUser) {

        // TODO [X]: Query all schedules w/ user id
        // TODO [X]: Render all schedules to client
        // TODO [X]: inline-block card-container
        // TODO [X]: clicking card -> results in schedule/view/ | schedule ID |...

        const schedules = await Schedule.findAll({where: {owner: req.user.id} });
        const titles = [];
        const schedulesIDs = [];

// TODO (MAYBE?)[] : Create Object w/ title and scheudleIDS rather than ORM model pass

/*       
        schedules.forEach(schedule => {
            titles.push(schedule.title);
            schedulesIDs.push(schedule.id);
        });
*/
        res.render('schedule/review-all', {
            schedules
//            titles,
//            schedulesIDs
        });
    }
});


// Schedule/Review
router.get('/schedule/review/:id',  async (req, res) => {
    if(req.session.authorizedUser) {

        // TODO [X]: QUery for all rows of goals per Day 
        // TODO [X]: send to render on screen as li items in appropriate divs
        // TODO []: Modularize - messssy

        const sundayGoals = [];
        const mondayGoals = [];
        const tuesdayGoals = [];
        const wednesdayGoals = [];
        const thursdayGoals = [];
        const fridayGoals = [];
        const saturdayGoals = [];

        // Parse instead of querying 7 XX
        const goals = await Goal.findAll({ where: {schedule: req.params.id } });

        // Generate String arrays to iterate & pass through to .HBS view
        if(goals) {
            goals.forEach(goal => {
                if(goal.day.localeCompare("Sunday") == 0) {
                    sundayGoals.push(`Goal: ${goal.goalType} | ${goal.goalAmount}`);
                } 
                if(goal.day.localeCompare("Monday") == 0) {
                    mondayoals.push(`Goal: ${goal.goalType} | ${goal.goalAmount}`);
                }
                if(goal.day.localeCompare("Tuesday") == 0) {
                    tuesdayGoals.push(`Goal: ${goal.goalType} | ${goal.goalAmount}`);
                } 
                if(goal.day.localeCompare("Wednesday") == 0) {
                    wednesdayGoals.push(`Goal: ${goal.goalType} | ${goal.goalAmount}`);
                }
                if(goal.day.localeCompare("Thursday") == 0) {
                    thursdayGoals.push(`Goal: ${goal.goalType} | ${goal.goalAmount}`);
                } 
                if(goal.day.localeCompare("Friday") == 0) {
                    fridayGoals.push(`Goal: ${goal.goalType} | ${goal.goalAmount}`);
                }
                if(goal.day.localeCompare("Saturday") == 0) {
                    saturdayGoals.push(`Goal: ${goal.goalType} | ${goal.goalAmount}`);
                }
            }); 
        }


        res.render('schedule/review', {
            scheduleID: req.params.id,
            sundayGoals,
            mondayGoals,
            tuesdayGoals,
            wednesdayGoals,
            thursdayGoals,
            fridayGoals,
            saturdayGoals
        });
    }
});
/*
// Schedule/goals/weekly
router.get('/schedule/goals/weekly',  (req, res) => {
    if(req.session.authorizedUser) {
        res.render('errors/temp');
    }
});
*/
// Schedule/goals/daily
router.get('/schedule/:id/goals/daily', (req, res) => {
    if(req.session.authorizedUser) {
        res.render('schedule/goals/daily', {
            scheduleID: req.params.id
        });
    }
});

// Grab Commitments from HTML 
// TODO - Modularize / despaghettify 
// [X] TODO: CLIENT | Add Scripts to append goals to Commitment list items
// [X] TODO: Interfacing | When click submit...
// [X] TODO: SERVER | Code to grab list items and iterate through to create new database goal rows
// [X] TODO: SERVR | Save new entries on "commit"

// *[-]* REMEMBER: CLEAR OUT goals table before working scheule DB
router.post('/schedule/:id/goals/daily', async (req, res) => {
    if(req.session.authorizedUser) {

        // Passes the req.body data to split arrays [day] [amount] [type]
        const pendingCommitments = Object.entries(req.body);
        let days = [];
        let amounts = [];
        let types = [];

        // localeCompare() checks on strings to parse
        pendingCommitments.forEach(element => {
            // remove final char via substring
            let string = element[0].substring(0, element[0].length - 1);
            console.log(element);

            if(string.localeCompare("day") == 0) {
                days.push(element[1]);
            } 
            if(string.localeCompare("amount") == 0) {
                amounts.push(element[1]);
            } 
            if(string.localeCompare("type") == 0) {
                types.push(element[1]);
            }
        });

        // new Goal rows in DB
        for (let index = 0; index < days.length; index++) {
            goal = new Goal({
                day: days[index],
                goalAmount: amounts[index],
                goalType: types[index],
                schedule: req.params.id                              
            });
            await goal.save();
        }

        // temp
        res.redirect(`/schedule/review/${req.params.id}`);
    }
});

module.exports = router;