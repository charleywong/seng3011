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
		LowerWindow,
		ListOfVar
	} = parameters;
	let ADJCLOSE = _.map(table, 'ADJCLOSE');
	let RETURN = return_number(ADJCLOSE),
		RETURN_PERCENTAGE = return_percentage(ADJCLOSE);
	let i = _.findIndex(table, (value) => value.DATE === moment(DateOfInterest).format('YYYY-MM-DD'));
	// Calculate Return and Return Percentage	
	table = _.map(table, (value, index) => {
		let doi = moment(value.DATE, 'YYYY-MM-DD');
		value.RETURN = RETURN[index];
		value.RETURN_PERCENTAGE = RETURN_PERCENTAGE[index];
		value.RELATIVE_DATE = index - i;
		return value;
	});

	let RETURNS = _.map(table, 'RETURN');
	// Calculate CM_RETURN and AV_RETURN
	table = _.map(
		table,
		(value, index) => _.extend(
			value, {
				CM_Return: cumulative_return(RETURNS, index, LowerWindow, UpperWindow),
				AV_Return: avg_return(RETURNS, index, LowerWindow, UpperWindow)
			}
		)
	);
	table = _.chain(table)
		// map column name to the correct format
		.map(value => ({
			RelativeDate: value.RELATIVE_DATE,
			Date: value.DATE,
			Return: value.RETURN,
			CM_Return: value.CM_Return,
			AV_Return: value.AV_Return
		}))
		// Remove redundant rows that we need earlier for return calculation
		.reject((value) => value.RelativeDate > UpperWindow || value.RelativeDate < -LowerWindow)
		.value();

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
 * @param {number[]} RETURNS Array of returns value
 * @param {number} T
 * @param {number} m
 * @param {number} n
 * @returns {number[]} Average returns array
 */
var avg_return = (RETURNS, T, m, n) => {
	return cumulative_return(RETURNS, T, m, n) / RETURNS.length;
}

/**
 * Calculate Cumulative Returns
 * @param { number [] } RETURNS Array of returns value
 * @param {number} T
 * @param {number} m
 * @param {number} n
 * @returns { number [] } cumlative returns array
 */
var cumulative_return = (RETURNS, T, m, n) => {
	if (T - m < 0 || T + n >= RETURNS.length) return null;
	let result = 0;
	for (let t = T - m; t < T + n; t++) {
		result += RETURNS[t];
	}
	return result;
}

module.exports = {
	calculate,
	return_number,
	return_percentage,
	avg_return,
	cumulative_return
}