const fs = require('fs');
const moment = require('moment')
/**
 * Parsing and validate query parameters from GET Request
 * @param {Object} parameters GET query string
 * @param {}
 * @returns {Object} validated data
 */
function parseInput(parameters) {
	// Dummy data. Make sure to comment it out when you want to deal with real data
/*
	parameters = {
		"InstrumentID": "ABP.AX",
		"ListOfVar": ["CM_Return", "AV_Return"],
		"UpperWindow": 5,
		"LowerWindow": 3,
		"DateOfInterest": "10/12/2012"
	}
*/
    
    //  Check object for null field
    //  Only goes one level deep, doesn't look into ListOfVar
    function hasNull(obj) {
        for (var field in obj) {
            if (obj[field] == null)
                throw new Error('Parameters contains Null value');
        }
    }

    //  Check if windows are numbers and >= zero
    function isNumeric(num) {
        if (num)
            return !isNaN(num) && num >= 0;
        return false;
    }

	let {
		InstrumentID,
		ListOfVar,
		UpperWindow,
		LowerWindow,
		DateOfInterest
	} = parameters;

    hasNull(parameters);

    //  Assume InstrumentID can only be .*\.AX
    let str = InstrumentID;
	if (!str.match(/.*\.AX/g)) throw new Error('Invalid InstrumentID');

    LowerWindow = +LowerWindow;
    if (!isNumeric(LowerWindow))
        throw new Error('Invalid Lower Window')

    UpperWindow = +UpperWindow;
    if (!isNumeric(UpperWindow))	
        throw new Error('Invalid Upper Window')
    
    //  Assume ListOfVars must contains some .*_Return
    let temp = ListOfVar;
    for (i = 0; i < temp.length; i++) {
        if (!temp[i].match(/_Return/g)) {
            throw new Error('Invalid Variable found in ListOfVar');
        }
    }
    
	// Parse DateOfInterest into Javascript Date object
	temp = DateOfInterest.split('/');
	// Throw error when DateOfInterest is invalid
	if (temp.length !== 3) throw new Error('Invalid DateOfInterest');
	// new Date(year, month, day, hours, minutes, seconds, milliseconds);
	DateOfInterest = new Date(temp[2], temp[1], temp[0]);
    

	return {
		InstrumentID,
		ListOfVar,
		UpperWindow,
		LowerWindow,
		DateOfInterest
	};
}

module.exports = {
	parseInput
};