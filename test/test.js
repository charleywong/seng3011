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

describe('Step4', function() {
	let table = {
		"DATE": ["2012-12-04",
				"2012-12-05",
				"2012-12-06",
				"2012-12-07",
				"2012-12-10",
				"2012-12-11",
				"2012-12-12",
				"2012-12-13"],
		"OPEN": [2.03207,
				2.01215,
				2.03207,
				2.04204,
				2.04204,
				2.01215,
				2.06196,
				2.07192],
		"HIGH": [2.03706,
				2.04204,
				2.04204,
				2.04702,
				2.04204,
				2.04204,
				2.06196,
				2.08188],
		"LOW": [2.01215,
				2.01215,
				2.02211,
				2.02211,
				2.01215,
				2.01215,
				2.02709,
				2.052],
		"CLOSE":[2.01215,
				2.01215,
				2.04204,
				2.04204,
				2.01215,
				2.04204,
				2.06196,
				2.06196],
		"VOLUME":[290900,
				381800,
				331800,
				311700,
				263200,
				209000,
				584800,
				582500],
		"ADJCLOSE": [1.5319,
					1.5319,
					1.55465,
					1.55465,
					1.5319,
					1.55465,
					1.56982,
					1.56982],
		"RETURN": [-0.022750000000000048,
					0,
					0.022750000000000048,
					0,
					-0.022750000000000048,
					0.022750000000000048,
					0.015169999999999906,
					0],
		"RETURN_PERCENTAGE":[-0.01463351879844341,
							0,
							0.014850838827599744,
							0,
							-0.01463351879844341,
							0.014850838827599744,
							0.009757823304280645,
							0,
							0.019320686448127792],
		"AV_RETURN":[0.0018962499999999882,
					0.005687499999999984,
					0.013271249999999984,
					0.010427500000000006,
					0.009479999999999988,
					0.010427499999999978,
					null,
					null]

	}
	let date = "2012-12-11";
	let lowerWindow = 4;
	let upperWindow = 2;
	describe('#calculate()', function() {
		let param = {
			"DateOfInterest" : "2012-12-11",
			"UpperWindow" : 4,
			"LowerWindow" : 2
		}
		it('should return an object for the results table', function() {
			let ret = calculate(table, param);
			// console.log(ret);
			assert.equal(_.isObject(ret), true);
		}) 
	});
	describe('#return_number()', function() {
		it('should return an array of numbers', function() {
			
		});
	});
	describe('#return_percentage()', function() {
		it('should return an array of percentages', function() {
			// let ret 
		});
	});
	describe('#avg_return()', function() {
		it('should return an array of average returns', function() {
			let ret = avg_return(table, date, lowerWindow, upperWindow);
			// console.log(ret);
			assert.equal(_.isArray(ret), true);
		});
	});
	describe('#cumulative_return()', function() {
		//return array
		it('should return an array of cumulative returns', function() {
			// console.log(table);
			let ret = cumulative_return(table, date, lowerWindow, upperWindow);
			// console.log(ret);
			assert.equal(_.isArray(ret), true);
			
		});

	});
});