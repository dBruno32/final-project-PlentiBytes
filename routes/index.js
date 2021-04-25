// TODO: Modularize into separate router files

/*
    -TODO - FORM VALIDATIONS Refine | Updating:
    --> goals: ensure amounts are numbers
    ---> /schedule/goals/daily
    ----> pre-post & post-post
    -----> amount
    
    -->foods: ensure amounts are coherent numbers
    ---> /foods/add
    ----> individual amounts
    ----> individual amounts not to exceed serving size

    --> entries: ensure amountsare numbers
    --->amount
*/

const express = require('express');
const router = express.Router();
const passport = require('passport');

const Goal = require('../models/Goal');
const Entry = require('../models/Entry');
const Food = require('../models/Food');
const Schedule = require('../models/Schedule');

const Validator = require('../utils/validator');


// TEMP - For pages not yet set up
router.get('/errors/temp', (req, res) => {
    res.render('errors/temp');
});

// NA - For however user accidentally gets to link / tries to get to link not authroized for
router.get('/errors/not-authorized', (req, res) => {
    res.render('errors/not-authorized', {
        layout: 'login'
    });
});

// For trying to post to goals w/o any entries
router.get('/errors/incorrect-goal-commit', (req, res) => {
    res.render('errors/incorrect-goal-commit');
});

// For trying to post to goals w/ non numbers
router.get('/errors/invalid-form-input', (req, res) => {
    res.render('errors/invalid-form-input');
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
    }  else {
        res.redirect('/errors/not-authorized');
    }
});

// View Foods
router.get('/foods', async (req, res) => {
    if(req.session.authorizedUser) {
        const user = req.session.authorizedUser;
    
        // *TODO* [-]: !!!!FORM VALIDATIONS!!!!
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
    } else {
        res.redirect('/errors/not-authorized');
    }
});

// Add a Food | render / GET
router.get('/foods/add', (req, res) => {  
    if(req.session.authorizedUser) {
        const user = req.session.authorizedUser;

        res.render('foods/add', {
            name: user.displayName
        });
    } else {
        res.redirect('/errors/not-authorized');
    }
});

// Add a Food | POST + add to DB
router.post('/foods/add', async (req, res) => {
    
    if(req.session.authorizedUser) {
        // For Validations

        const user = req.session.authorizedUser;

        var {
            foodDescription,
            servingSize,
            calorieServing,
            carbohydrateServing,
            fatServing,
            fiberServing,
            proteinServing,
            sugarServing
        } = req.body;

        // Data coming in as strings?
        servingSize = parseInt(servingSize, 10);
        calorieServing = parseInt(calorieServing, 10);
        carbohydrateServing = parseInt(carbohydrateServing, 10);
        fatServing = parseInt(fatServing, 10);
        fiberServing = parseInt(fiberServing, 10);
        proteinServing = parseInt(proteinServing, 10);
        sugarServing = parseInt(sugarServing, 10);


        // Validations on array including the specific food's serving inputs
        const v = new Validator();      
        const toTestNumbers = [servingSize, calorieServing, fatServing, fiberServing, proteinServing, sugarServing];

        if(!v.isNumberAll(toTestNumbers)) {
            return res.redirect('/errors/invalid-form-input');
        }

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
    } else {
        res.redirect('/errors/not-authorized');
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
    } else {
        res.redirect('/errors/not-authorized');
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
    } else {
        res.redirect('/errors/not-authorized');
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

        const sundayEntries = [];
        const mondayEntries = [];
        const tuesdayEntries = [];
        const wednesdayEntries = [];
        const thursdayEntries = [];
        const fridayEntries = [];
        const saturdayEntries = [];

        // Parse instead of querying 7 XX
        const goals = await Goal.findAll({ where: {schedule: req.params.id } });

        // Generate String arrays to iterate & pass through to .HBS view
        // String array for ea day's goals based on return
        if(goals) {
            goals.forEach(goal => {
                if(goal.day.localeCompare("Sunday") == 0) {
                    sundayGoals.push(`Goal: ${goal.goalType} | ${goal.goalAmount}`);
                } else if(goal.day.localeCompare("Monday") == 0) {
                    mondayGoals.push(`Goal: ${goal.goalType} | ${goal.goalAmount}`);
                } else if(goal.day.localeCompare("Tuesday") == 0) {
                    tuesdayGoals.push(`Goal: ${goal.goalType} | ${goal.goalAmount}`);
                } else if(goal.day.localeCompare("Wednesday") == 0) {
                    wednesdayGoals.push(`Goal: ${goal.goalType} | ${goal.goalAmount}`);
                } else if(goal.day.localeCompare("Thursday") == 0) {
                    thursdayGoals.push(`Goal: ${goal.goalType} | ${goal.goalAmount}`);
                } else if(goal.day.localeCompare("Friday") == 0) {
                    fridayGoals.push(`Goal: ${goal.goalType} | ${goal.goalAmount}`);
                } else if(goal.day.localeCompare("Saturday") == 0) {
                    saturdayGoals.push(`Goal: ${goal.goalType} | ${goal.goalAmount}`);
                }
            }); 
        }

        const entries = await Entry.findAll({ where: {schedule: req.params.id } });
        
        // TODO [X]: QUery for all rows of goals per Day 
        // TODO [X]: send to render on screen as li items in appropriate divs
        if(entries) {
            entries.forEach(entry => {
                let foodString = entry.food.substring(0, entry.food.length - 1);

                if(entry.day.localeCompare("Sunday") == 0) {
                    sundayEntries.push(`Entry: ${foodString} | ${entry.entryAmount}`);
                } else if(entry.day.localeCompare("Monday") == 0) {
                    mondayEntries.push(`Entry: ${foodString} | ${entry.entryAmount}`);
                } else if(entry.day.localeCompare("Tuesday") == 0) {
                    tuesdayEntries.push(`Entry: ${foodString} | ${entry.entryAmount}`);
                } else if(entry.day.localeCompare("Wednesday") == 0) {
                    wednesdayEntries.push(`Entry: ${foodString} | ${entry.entryAmount}`);
                } else if(entry.day.localeCompare("Thursday") == 0) {
                    thursdayEntries.push(`Entry: ${foodString} | ${entry.entryAmount}`);
                } else if(entry.day.localeCompare("Friday") == 0) {
                    fridayEntries.push(`Entry: ${foodString} | ${entry.entryAmount}`);
                } else if(entry.day.localeCompare("Saturday") == 0) {
                    saturdayEntries.push(`Entry: ${foodString} | ${entry.entryAmount}`);
                }
            });
        }


        res.render('schedule/review', {
            scheduleID: req.params.id,
            // Goals
            sundayGoals,
            mondayGoals,
            tuesdayGoals,
            wednesdayGoals,
            thursdayGoals,
            fridayGoals,
            saturdayGoals,
            // Entries
            sundayEntries,
            mondayEntries,
            tuesdayEntries,
            wednesdayEntries,
            thursdayEntries,
            fridayEntries,
            saturdayEntries
        });
    } else {
        res.redirect('/errors/not-authorized');
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
    } else {
        res.redirect('/errors/not-authorized');
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

        // if no commits -> direct them out
        if(pendingCommitments.length == 0) {
            return res.redirect('/errors/incorrect-goal-commit');
        }

        // localeCompare() checks on strings to parse
        pendingCommitments.forEach(element => {
            // remove final char via substring
            let string = element[0].substring(0, element[0].length - 1);
            console.log(element);

            if(string.localeCompare("day") == 0) {
                days.push(element[1]);
            } else if(string.localeCompare("amount") == 0) {
                amounts.push(element[1]);
            } else if(string.localeCompare("type") == 0) {
                types.push(element[1]);
            }
        });

        // Validations on array including the the goalAMounts from each pendingCommit
        // TODO validatee on client for extra protection against errors
        const v = new Validator();      

        if(!v.isNumberAll(amounts)) {
            return res.redirect('/errors/invalid-form-input');
        }

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
    } else {
        res.redirect('/errors/not-authorized');
    }
});

// Schedule/entries/daily
router.get('/schedule/:id/entries', async (req, res) => {
    if(req.session.authorizedUser) {
        // Pass all user foods for form select -- options
        const allUsersFoods = await Food.findAll({ where: {owner: req.user.id} });


        res.render('schedule/entries', {
            scheduleID: req.params.id,
            foods: allUsersFoods
        });
    } else {
        res.redirect('/errors/not-authorized');
    }
});

// Schedule/entries/daily POST
router.post('/schedule/:id/entries', async (req, res) => {
    if(req.session.authorizedUser) {
        const {
            entryFood,
            entryDay,
            entryAmount
        } = req.body;

        // Validations on individual entryAmount
        const v = new Validator();  
        if(!v.isNumber(entryAmount)) {
            return res.redirect('/errors/invalid-form-input');
        }

        const entry = new Entry({
            food: entryFood,
            entryAmount: entryAmount,
            day: entryDay,
            schedule: req.params.id
        });

        await entry.save();


        res.redirect(`/schedule/review/${req.params.id}`);
    } else {
        res.redirect('/errors/not-authorized');
    }
});

module.exports = router;
