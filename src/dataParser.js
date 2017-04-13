const _ = require('lodash');
const Promise = require('bluebird');
const moment = require('moment');

// https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
require('isomorphic-fetch');

/**
 * Fetch Yahoo Data via UNSW proxy
 * @param {Object} parameters - Parsed Parameter
 * @version 0.1.2
 * @since 0.0.2
 * @param {String[]} parameters.InstrumentID - Array of InstrumentID
 * @param {Number} parameters.UpperWindow - Upper Window
 * @param {Number} parameters.LowerWindow - Lower Window
 * @param {Date} parameters.DateOfInterest - Date of Interest
 * @returns {Promise<String>} CSV content
 */
var fetchData = (parameters) => {
	return new Promise((resolve, reject) => {
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
		fetch(url)
			.then((response) => {
				if (response.status >= 400) {
					reject(new Error("Bad response from server"));
				} else {
					return response.text();
				}
			})
			.then((csvData) => {
				return resolve(csvData);
			});
	});
}

module.exports = {
	fetchData
}