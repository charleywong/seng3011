const _ = require('lodash');
module.exports = {

}

var return_number = (adjCloseArray) => {
	if (!_.isArray(adjCloseArray)) throw new Error('adjCloseArray is not an array');
	//TODO

	return [];
}

var return_percentage = (adjCloseArray) => {

	var returnArray = return_number(adjCloseArray);

	// Calculate Average Retun Percentage
	var result = _.chain(returnArray)
		.map((value, index) => value / adjCloseArray[index]) // Divide the return with yesterday closing price
		.value();

	return result;
}

var avg_return = (adjCloseArray, m, n) => {
	var returnArray = return_number(adjCloseArray);
	// TODO

}

var avg_return_percentage = (adjCloseArray, m, n) => {
	var returnPercentageArray = return_percentage(adjCloseArray);
	// TODO

}