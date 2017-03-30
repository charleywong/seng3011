const _ = require('lodash');
const assert = require('assert');
const {
	expect
} = require('chai');
const {
	parseInput,
	hasNull,
	isNumeric,
	listIsValid
} = require('../src/step1.js');

const {
	fetchData
} = require('../src/step2.js');

const {
	buildTable
} = require('../src/step3.js');

const {
	calculate,
	return_number,
	return_percentage,
	avg_return,
	cumulative_return
} = require('../src/step4.js');

//test for input parsing
describe('Step1', function () {
	describe('#parseInput()', function () {
		let parameters = {
			"InstrumentID": "ABP.AX",
			"ListOfVar": ["CM_Return", "AV_Return"],
			"UpperWindow": 5,
			"LowerWindow": 3,
			"DateOfInterest": "10/12/2012"
		}
		let {
			InstrumentID,
			ListOfVar,
			UpperWindow,
			LowerWindow,
			DateOfInterest
		} = parseInput(parameters);

		it('InstrumentID is a string', function () {
			assert.equal(_.isString(InstrumentID), true);
		});
		it('ListOfVar is an array', function () {
			assert.equal(_.isArray(ListOfVar), true);
		});
		//check type of each var in json object is correct
		it('UpperWindow is a number', function () {
			assert.equal(_.isInteger(UpperWindow), true);
		});

		it('LowerWindow is a number', function () {
			assert.equal(_.isInteger(LowerWindow), true);
		});
		it('DateOfInterest is a date', function () {
			assert.equal(_.isDate(DateOfInterest), true);
		});
	});
	describe('#hasNull()', function () {
		it('throws an error if parameters contain a null value', function () {
			let parameters1 = {
				"InstrumentID": null,
				"ListOfVar": ["CM_Return", "AV_Return"],
				"UpperWindow": 4,
				"LowerWindow": 3,
				"DateOfInterest": "10/12/2012"
			}
			// console.log(parameters1)
			assert.throws(
				function () {
					return hasNull(parameters1)
				},
				Error
			);
		});
	});
	describe('#isNumeric()', function () {
		let parameters2 = {
			"InstrumentID": "ABP.AX",
			"ListOfVar": ["CM_Return", "AV_Return"],
			"UpperWindow": "",
			"LowerWindow": -4,
			"DateOfInterest": "10/12/2012"
		}
		//this doesn't throw error
		it('throws an error if UpperWindow isn\'t a number or greater than or equal to 0', function () {
			assert.equal(isNumeric(parameters2.UpperWindow), false);
		});
		it('throws an error if LowerWindow isn\'t a number or greater than or equal to 0', function () {
			assert.equal(isNumeric(parameters2.LowerWindow), false);
		});
	});
	describe('#listIsValid()', function () {
		let parameters3 = {
			"InstrumentID": "ABP.AX",
			"ListOfVar": ["CM_Return", "AVReturn"],
			"UpperWindow": 5,
			"LowerWindow": 4,
			"DateOfInterest": "10/12/2012"
		}
		it('throws an error if ListOfVar doesn\'t contains "CM_Return" or "AV_Return"', function () {
			// console.log(parameters3);
			assert.throws(
				function () {
					return listIsValid(parameters3.ListOfVar)
				},
				Error
			);
		});
	});

});

/**
 * Test asynchronous code with mocha wrapper
 * @param {Function} fn 
 * @param {*} args 
 * @returns {Function} async function
 */
var mochaAsyncTest = function (fn) {
	return async function (done) {
		try {
			await fn();
			done();
		} catch (err) {
			done(err);
		}
	}
}

describe('Step2', function () {
	// Async test with mocha 
	// http://staxmanade.com/2015/11/testing-asyncronous-code-with-mochajs-and-es7-async-await/
	describe('#fetchData()', function () {
		it(
			'should return csv content as text',
			mochaAsyncTest(
				// Since we used await in the function below,
				// We need to put `async` before `function` syntax 
				async function () {
					let parameters = {
						"InstrumentID": "ABP.AX",
						"ListOfVar": ["CM_Return", "AVReturn"],
						"UpperWindow": 5,
						"LowerWindow": 4,
						"DateOfInterest": Date.now() // DateOfInterest must be a Date object
					}
					let csvData = await fetchData(parameters);
					expect(_.isString(csvData)).to.equal(true);
				}
			)
		);
	});
});