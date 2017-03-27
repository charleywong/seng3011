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

	// Parse DateOfInterest into Javascript Date object
	let temp = DateOfInterest.split('/');
	// Throw error when DateOfInterest is invalid
	if (temp.length !== 3) throw new Error('Invalid DateOfInterest');
	// new Date(year, month, day, hours, minutes, seconds, milliseconds);
	DateOfInterest = new Date(temp[2], temp[1], temp[0]);

	// TODO: Validate others, throw error if parameters are invalid
	// YOUR CODE GOES HERE

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