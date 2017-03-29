
const _ = require('lodash');
const assert = require('assert');
const {parseInput} = require('../src/step1.js');
var {fetchData} = require('../src/step2.js');
var buildTable = require('../src/step3.js');
var {
	calculate,
	return_number,
	return_percentage,
	avg_return,
	cumulative_return
} = require('../src/step4.js');

//test for input parsing
describe('parseInt', function() {
	let parameters = {
			"InstrumentID": "ABP.AX",
			"ListOfVar": ["CM_Return", "AV_Return"],
			"UpperWindow": 5,
			"LowerWindow": 3,
			"DateOfInterest": "10/12/2012"
		}
	let {InstrumentID, ListOfVar, UpperWindow, LowerWindow, DateOfInterest} = parseInput(parameters);

	it('InstrumentID is a string', function() {
		assert.equal(_.isString(InstrumentID), true);
	});
	it('ListOfVar is an array', function() {
		assert.equal(_.isArray(ListOfVar), true);
	});
	//check type of each var in json object is correct
	it('UpperWindow is a number', function() {
		assert.equal(_.isInteger(UpperWindow), true);
	});
	it('LowerWindow is a number', function() {
		assert.equal(_.isInteger(LowerWindow), true);
	});
	it('DateOfInterest is a date', function() {
		assert.equal(_.isDate(DateOfInterest), true);
	});

});

//test for fetchData
//check that 400 error or 404 error is thrown if insufficient data
// describe('fetchData', function() {
// 	let {
// 		InstrumentID,
// 		UpperWindow,
// 		LowerWindow,
// 		DateOfInterest
// 	} = parameters;
// });