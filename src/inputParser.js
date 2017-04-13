const fs = require('fs');
const moment = require('moment')
const _ = require('lodash')
/**
 * Validated parameters
 * @typedef {Object} ParsedParamters
 * @property {String[]} InstrumentID - Instrument IDs
 * @property {Number} UpperWindow - Upper Window
 * @property {Number} LowerWindow - Lower Window
 * @property {Date} DateOfInterest - Date of Interest
 * @property {String[]} ListOfVar - List of Variables
 *
 */
/**
 * Parsing and validate query parameters from GET Request
 * @param {Object} parameters GET query string
 * @version 0.1.2
 * @since 0.0.2
 * @param {String} parameters.InstrumentID - Instrument ID separated by comma
 * @param {Number} parameters.UpperWindow - Upper Window
 * @param {Number} parameters.LowerWindow - Lower Window
 * @param {String} parameters.DateOfInterest - Date of Interest
 * @param {String[]} parameters.ListOfVar - List of Variables
 * @returns {ParsedParameters} Validated parameters
 * @throws Invalid or Missing parameters
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
	if (str == null || !_.isString(str))
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
	let containNull = _.some(obj, (value) => value == null);
	if (containNull) throw new Error('Parameters contains Null value');
}


/**
 * Check if windows are numbers and >= zero
 * @param {*} num
 */
function isNumeric(num) {
	return (num && !isNaN(num) && num >= 0);
}

/**
 * Check ListOfVar should only contains "CM_Return" or "AV_Return"
 * @param {*} array 
 */
function listIsValid(array) {
	let validInput = ["CM_Return", "AV_Return"];

	if (array == null) return;
	if (_.isString(array)) array = [array];

	let valid = _.every(
		array,
		// Predicate to check the value exists in validInput array
		(value) => validInput.indexOf(value) !== -1
	);
	if (!valid) throw new Error('Invalid Variable found in ListOfVar');
	return valid;
}

module.exports = {
	parseInput,
	hasNull,
	isNumeric,
	listIsValid
};