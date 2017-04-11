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
} = require('../src/inputParser.js');

const {
	fetchData
} = require('../src/dataParser.js');

const {
	buildTable
} = require('../src/tableBuilder.js');

const {
	calculate,
	return_number,
	return_percentage,
	avg_return,
	cumulative_return
} = require('../src/calcs.js');

//test for input parsing
describe('inputParser', function () {
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

		it('InstrumentID is an array', function () {
			assert.equal(_.isArray(InstrumentID), true);
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
		it('throws an error if ListOfVar doesn\'t contain "CM_Return" or "AV_Return"', function () {
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

describe('dataParser', function () {
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
					// console.log(csvData);
					expect(_.isString(csvData)).to.equal(true);
				}
			)
		);
	});
});

describe('tableBuilder', function() {
	it('should return a table built from csvData', function() {
		let csvData = "ABP.AX 11/04/17 11:55:50 " + "\n" +
						"DATE,OPEN,HIGH,LOW,CLOSE,VOLUME,ADJCLOSE" + "\n" +
						"2017-04-10,3.33,3.37,3.33,3.35,765400,3.35" + "\n" +
						"2017-04-07,3.31,3.34,3.28,3.32,820500,3.32" + "\n" +
						"2017-04-06,3.35,3.38,3.30,3.33,617800,3.33" + "\n" +
						"2017-04-05,3.30,3.33,3.26,3.33,693100,3.33" + "\n" +
						"2017-04-04,3.30,3.32,3.27,3.28,537600,3.28" + "\n" +
						"2017-04-03,3.25,3.28,3.23,3.27,766400,3.27" + "\n";
		// console.log(csvData);
		let retTable = buildTable(csvData);
		// console.log(JSON.stringify(retTable, null, 2));
		assert.equal(_.isObject(retTable),true);
	});
})

describe('calcs', function() {
	let table = {
		 "DATE":['2017-04-03',
		     	'2017-04-04',
		     	'2017-04-05',
		     	'2017-04-06',
		     	'2017-04-07',
		     	'2017-04-10'],
		  "OPEN": [ 3.25, 3.3, 3.3, 3.35, 3.31, 3.33 ],
		  "HIGH": [ 3.28, 3.32, 3.33, 3.38, 3.34, 3.37 ],
		  "LOW": [ 3.23, 3.27, 3.26, 3.3, 3.28, 3.33 ],
		  "CLOSE": [ 3.27, 3.28, 3.33, 3.33, 3.32, 3.35 ],
		  "VOLUME": [ 766400, 537600, 693100, 617800, 820500, 765400 ],
		  "ADJCLOSE": [ 3.27, 3.28, 3.33, 3.33, 3.32, 3.35 ] }
		
	// let date = "2012-12-11";
	// let lowerWindow = 4;
	// let upperWindow = 2;
	var param = {
			"DateOfInterest" : "2012-12-11",
			"UpperWindow" : 4,
			"LowerWindow" : 2
		}
	describe('#calculate()', function() {
		
		it('should return an object for the results table', function() {
			let ret = calculate(table, param);
			// console.log(ret);
			assert.equal(_.isObject(ret), true);
		}) 

	});
	describe('#return_number()', function() {
		let temp = {
		 "DATE":['2017-04-03',
		     	'2017-04-04',
		     	'2017-04-05',
		     	'2017-04-06',
		     	'2017-04-07',
		     	'2017-04-10'],
		  "OPEN": [ 3.25, 3.3, 3.3, 3.35, 3.31, 3.33 ],
		  "HIGH": [ 3.28, 3.32, 3.33, 3.38, 3.34, 3.37 ],
		  "LOW": [ 3.23, 3.27, 3.26, 3.3, 3.28, 3.33 ],
		  "CLOSE": [ 3.27, 3.28, 3.33, 3.33, 3.32, 3.35 ],
		  "VOLUME": [ 766400, 537600, 693100, 617800, 820500, 765400 ],
		  "ADJCLOSE": 3.27 }
		it('should return an array of numbers', function() {
			let ret = return_number(table.ADJCLOSE);
			// console.log(param.ADJCLOSE);
			// ret.toString();
			assert.equal(_.isArray(ret),true);
		});
		it('should throw an error if ADJCLOSE is not an array', function() {
			assert.throws(
				function() {
					return return_number(temp.ADJCLOSE);
				})
			Error;
		});
	});
	describe('#return_percentage()', function() {
		it('should return an array of percentages', function() {
			let ret = return_percentage(table.ADJCLOSE);
			assert.equal(_.isArray(ret), true);
		});
	});
	describe('#avg_return()', function() {
		it('should return an integer for the average return', function() {
			let ret = avg_return(table, param.DateOfInterest, param.LowerWindow, param.UpperWindow);
			// console.log(ret);
			assert.equal(_.isNumber(ret), true);
		});
	});
	describe('#cumulative_return()', function() {
		//return array
		it('should return an integer for the cumulative return', function() {
			// console.log(table);
			let ret = cumulative_return(table, param.DateOfInterest, param.LowerWindow, param.UpperWindow);
			// console.log(ret);
			assert.equal(_.isNumber(ret), true);
			
		});

	});
});