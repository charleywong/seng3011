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
	parameters = {
		"InstrumentID": "ABP.AX",
		"ListOfVar": ["CM_Return", "AV_Return"],
		"UpperWindow": 5,
		"LowerWindow": 3,
		"DateOfInterest": "10/12/2012"
	}

	let {
		InstrumentID,
		ListOfVar,
		UpperWindow,
		LowerWindow,
		DateOfInterest
	} = parameters;

    //  Assume InstrumentID can only ABP.AX for the moment
	if (!str.match(/ABP\.AX/g)) throw new Error('Invalid InstrumentID');

    //  Assume ListOfVars must contains some .*_Return
    temp = ListOfVar;
    for (i = 0; i < temp.length; i++) {
        if (!temp[i].match(/_Return/g)) {
            throw new Error('Invalid Variable found in ListOfVar');
        }
    }
    
    //  UpperWindow less than LowerWindow
    UpperWindow = parseInt(UpperWindow)
    LowerWindow = parseInt(LowerWindow)
    if (UpperWindow > LowerWindow) throw new Error('Invalid Window parameters');
    
	// Parse DateOfInterest into Javascript Date object
	let temp = DateOfInterest.split('/');
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
	}
}

module.exports = {
	parseInput
};