const _ = require('lodash');
module.exports = {
	calculate,
	return_number,
	return_percentage,
	avg_return,
	cumulative_return
}

/**
 * Calculate all the necessary metrics
 * @param {Object} table
 * @returns {Object} result table
 */
var calculate = (table) => {
	// YOUR CODE GOES HERE

	return table;
}

/**
 * Calculate Return from adjusted closing prices (See API 1 page 3-4)
 * @param {number[]} adjCloseArray Array of adjusted closing price
 * @returns {number[]} Array of return 
 */
var return_number = (adjCloseArray) => {
	if (!_.isArray(adjCloseArray)) throw new Error('adjCloseArray is not an array');
	let result = [];
	// YOUR CODE GOES HERE

	return [null].concat(result); // Add empty data at the top
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
	// YOUR CODE GOES HERE

}

/**
 * Calculate Cumulative Returns
 * @returns {number[]} Array of cumulative returns (include empty cell)
 */
var cumulative_return = (table, DateOfInterest, LowerWindow, UpperWindow) => {
	// YOUR CODE GOES HERE

}