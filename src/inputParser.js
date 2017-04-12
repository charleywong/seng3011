const fs = require('fs');
const moment = require('moment')
const _ = require('lodash')
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
	let {
		InstrumentID,
		ListOfVar,
		UpperWindow,
		LowerWindow,
		DateOfInterest
	} = parameters;

	// hasNull(parameters);

	//  Assume InstrumentID can only contain letters/comma/dot
	let str = InstrumentID;
	if (str == null)
		throw new Error('Missing InstrumentID');
	str = str.replace(/\s/g, '');
	var arr = str.split(",");
	for (let i = 0; i < arr.length; i++) {
		if (!arr[i].match(/^[a-z,.]+$/gi))
			throw new Error('Invalid InstrumentID');
	}
	InstrumentID = arr;

	if (LowerWindow == null)
		throw new Error('Missing LowerWindow');
	LowerWindow = +LowerWindow;
	if (!isNumeric(LowerWindow)) {
		throw new Error('Invalid Lower Window');
	}

	if (UpperWindow == null)
		throw new Error('Missing UpperWindow');
	UpperWindow = +UpperWindow;
	if (!isNumeric(UpperWindow)) {
		throw new Error('Invalid Upper Window');
	}

	// Assume ListOfVars must contains some .*_Return
	//put it in a separate function to test
	let temp = ListOfVar;
	listIsValid(temp);

	// Parse DateOfInterest into Javascript Date object
	if (DateOfInterest == null)
		throw new Error('Missing DateOfInterest');
	try {
		DateOfInterest = moment(DateOfInterest, 'DD/MM/YYYY').toDate();
	} catch (err) {
		throw new Error('Invalid DateOfInterest');
	}

	return {
		InstrumentID,
		ListOfVar,
		UpperWindow,
		LowerWindow,
		DateOfInterest
	};
}

//  Check object for null field
//  Only goes one level deep, doesn't look into ListOfVar
function hasNull(obj) {
	// for (var field in obj) {
	//     if (obj[field] == null)
	//         throw new Error('Parameters contains Null value');
	// }

	let containNull = _.some(obj, (value) => value == null);
	// The code above is equivalent to this: 
	// let containNull = _.some(obj, function (value) {
	// return value === null
	// });
	if (containNull) throw new Error('Parameters contains Null value');
}

//  Check if windows are numbers and >= zero
function isNumeric(num) {
	// num = +num;

	return (num && !isNaN(num) && num >= 0);

	// if (num) { //if not null
	// 	if (!isNaN(num)) { //if a number
	// 		//if num greater thanm or equal 0 
	// 		if (num >= 0) 
	// 			//dont throw
	// 			return true;

	// 	}
	// } 
	// return false;
}

function listIsValid(array) {
	// for (var i = 0; i < array.length; i++) {
	// 	if (!array[i].match(/_Return/)) {
	// 		// console.log(temp[i]);
	// 		throw new Error('Invalid Variable found in ListOfVar');
	// 	}
	// }

	// list should only contains "CM_Return" or "AV_Return"
	let validInput = ["CM_Return", "AV_Return"];
	if (array == null) return;
	if (_.isString(array)) array = [array];
	// for (let i = 0; i < array.length; i++) {
	// 	if (validInput.indexOf(array[i]) == -1) {
	// 		throw new Error('Invalid Variable found in ListOfVar');
	// 	}
	// }
	let valid = _.every(array, (value) => validInput.indexOf(value) !== -1);

	// The code above is equivalent to this:
	// let valid = _.every(array, function (value) {
	// 	return validInput.indexOf(value) !== -1;
	// });

	if (!valid) throw new Error('Invalid Variable found in ListOfVar');
}

module.exports = {
	parseInput,
	hasNull,
	isNumeric,
	listIsValid
};