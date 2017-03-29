const _ = require('lodash');
const assert = require('assert');
const {
	parseInput,
	hasNull,
	isNumeric
} = require('../src/step1.js');

const {fetchData} = require('../src/step2.js');
const {buildTable} = require('../src/step3.js');
const {
	calculate,
	return_number,
	return_percentage,
	avg_return,
	cumulative_return
} = require('../src/step4.js');

//test for input parsing
describe('Step1', function() {


	describe('#parseInt()', function() {
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
		// // it('throws an error if parameters contain a null value', function() {
		// // 	assert.throw(parseInput, error, "error thrown");
		// // });
		// describe('hasNull', function() {
		// 	it('throws an error if parameters contain a null value', function() {
		// 		;
		// 	});
		// });
	});
	describe('#hasNull()', function() {
		let parameters1 = {
			"InstrumentID": null,
			"ListOfVar": ["CM_Return", "AV_Return"],
			"UpperWindow": 5,
			"LowerWindow": 3,
			"DateOfInterest": "10/12/2012"
		}
		it('throws an error if parameters contain a null value', function() {
			assert.throws (
				function() {
					return hasNull(InstrumentID)
				},
				/InstrumentID/,
				'txt'
			);
		});
	});
	describe('#isNumeric()', function() {
		let parameters2 = {
			"InstrumentID": "ABP.AX",
			"ListOfVar": ["CM_Return", "AVReturn"],
			"UpperWindow": -5,
			"LowerWindow": null,
			"DateOfInterest": "10/12/2012"
		}
		it('throws an error if UpperWindow isnt a number or greater than or equal to 0', function() {
			assert.throws (
				function() {
					return isNumeric(UpperWindow)
				},
				/UpperWindow/,
				'txt'
			);
		});
		it('throws an error if LowerWindow isnt a number or greater than or equal to 0', function() {
			assert.throws (
				function() {
					return isNumeric(LowerWindow)
				},
				/LowerWindow/,
				'txt'
			);
		});
	});
	
});
