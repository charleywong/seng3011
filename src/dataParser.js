const _ = require('lodash');
const Promise = require('bluebird');
const moment = require('moment');

// https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
require('isomorphic-fetch');

/**
 * Fetch Yahoo Data via UNSW proxy
 * @param {Object} parameters - Parsed Parameter
 * @param {String[]} parameters.InstrumentID - Array of InstrumentID
 * @param {Number} parameters.UpperWindow - Upper Window
 * @param {Number} parameters.LowerWindow - Lower Window
 * @param {Date} parameters.DateOfInterest - Date of Interest
 * @returns {Promise} CSV content
 */
var fetchData = async function (parameters) {
	let {
		InstrumentID,
		UpperWindow,
		LowerWindow,
		DateOfInterest
	} = parameters;

	// Calculate start date and end date
	let startDate = moment(DateOfInterest).subtract(2 * LowerWindow + 1, 'day').toISOString(),
		endDate = moment(DateOfInterest).add(2 * UpperWindow, 'day').toISOString();
	InstrumentID = InstrumentID.join(';');

	// Prepare url to query yahoo database by Dynamically putting parameters into string
	// Read more about ES6 template string here 
	// https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Template_literals
	let url = `http://adage.cse.unsw.edu.au:8080/ImportEventDataset/v1/data?Datasource=External:Yahoo&startDate=${startDate}&endDate=${endDate}&InstrumentID=Yahoo:${InstrumentID}&DatasetType=EndOfDay`;
	let response = await fetch(url);
	if (response.status >= 400) {
		throw new Error("Bad response from server");
	}
	let csvData = await response.text();

	return csvData;
}

module.exports = {
	fetchData
}