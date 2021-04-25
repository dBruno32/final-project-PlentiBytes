// For Testing

// TODO: Exports for form checking
// CONSIDER: Form checking on client side as well

class Validator {
    constructor() {

    }

    // Returns Boolean if number T/F
    isNumber(inputIn) {
        let condition = false;

        if(isNaN(inputIn)) {
            return condition = false;
        } else {
            return condition = true;
        }  
        return condition;
    }

    // Takes in array
    isNumberAll(arrayIn) {
        let condition = false;

        for(const item of arrayIn) {
            if(isNaN(item)) {
                return condition = false;
            } else {
                condition = true;
            } 
            return condition;
        }  
    }
} 

module.exports = Validator;