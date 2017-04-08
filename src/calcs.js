const _ = require('lodash');
const moment = require('moment');

/**
 * Calculate all the necessary metrics
 * @param {Object} table
 * @returns {Object} result table
 */
var calculate = (table, parameters) => {
	let {
		DateOfInterest,
		UpperWindow,
		LowerWindow
	} = parameters;
	table.RETURN = return_number(table.ADJCLOSE);
	table.RETURN_PERCENTAGE = return_percentage(table.ADJCLOSE);
	// table.CM_RETURN = cumulative_return();
	table.AV_RETURN = avg_return(table, DateOfInterest, LowerWindow, UpperWindow);
	return table;
}

/**
 * Calculate Return from adjusted closing prices (See API 1 page 3-4)
 * @param {number[]} adjCloseArray Array of adjusted closing price
 * @returns {number[]} Array of return 
 */
var return_number = (adjCloseArray) => {
	if (!_.isArray(adjCloseArray)) throw new Error('adjCloseArray is not an array');
	let result = _.chain(adjCloseArray)
		.map((value, index) => (
			(index === 0) ?
			null :
			(value - adjCloseArray[index - 1])))
		.value();
	return result; // Add empty data at the top
}

/**
 * Calculate Return (%) from adjusted closing prices (See API 1 page 3-4)
 * @param {number[]} adjCloseArray adjCloseArray Array of adjusted closing price
 * @returns {number[]} Array of return percentage
 */
var return_percentage = (adjCloseArray) => {

	var returnArray = return_number(adjCloseArray);
	returnArray = _.reject(returnArray, (v) => v == null);

	// Calculate Average Retun Percentage
	var result = _.chain(returnArray)
		.map((value, index) => value / adjCloseArray[index]) // Divide the return with yesterday closing price
		.value();

	return [null].concat(result); // Add empty data at the top
}

/**
 * Calculate Average returns
 * @returns {number[]} Array of average returns (include empty cell)
 */
var avg_return = (table, DateOfInterest, LowerWindow, UpperWindow) => {
	DateOfInterest = moment(DateOfInterest).format('YYYY-MM-DD');
	let i = _.findIndex(table.DATE, (value) => value === DateOfInterest),
		m = LowerWindow,
		n = UpperWindow;
	let result = []
	for (let T = i - m; T <= i + n; T++) {
		let sum = 0;
		for (let t = T - m; t <= T + n; t++) {
			sum += table.RETURN[t];
		}
		result.push(sum / (m + n));
	}
	return result;
}

/**
 * Calculate Cumulative Returns
 * @returns {number[]} Array of cumulative returns (include empty cell)
 */
var cumulative_return = (table, DateOfInterest, LowerWindow, UpperWindow) => {
	// YOUR CODE GOES HERE

}

module.exports = {
	calculate,
	return_number,
	return_percentage,
	avg_return,
	cumulative_return
}