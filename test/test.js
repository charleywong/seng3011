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
const fs = require('fs');
// const _  = require('lodash');

const {
	calculate,
	return_number,
	return_percentage,
	avg_return,
	cumulative_return
} = require('../src/calcs.js');

const sampleTable = require('../table');

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
						"InstrumentID": ["ABP.AX"],
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

describe('tableBuilder', function () {
	it('should return a table built from csvData',
		mochaAsyncTest(
			async function () {
				let csvData = "ABP.AX 11/04/17 11:55:50 " + "\n" +
					"DATE,OPEN,HIGH,LOW,CLOSE,VOLUME,ADJCLOSE" + "\n" +
					"2017-04-10,3.33,3.37,3.33,3.35,765400,3.35" + "\n" +
					"2017-04-07,3.31,3.34,3.28,3.32,820500,3.32" + "\n" +
					"2017-04-06,3.35,3.38,3.30,3.33,617800,3.33" + "\n" +
					"2017-04-05,3.30,3.33,3.26,3.33,693100,3.33" + "\n" +
					"2017-04-04,3.30,3.32,3.27,3.28,537600,3.28" + "\n" +
					"2017-04-03,3.25,3.28,3.23,3.27,766400,3.27" + "\n";
				let retTable = await buildTable(csvData);
				assert.equal(_.isArray(retTable), true);
			}
		)
	);
})

describe('calcs', function () {
	let table = sampleTable;
	// console.log(table);
	var param = {
		"DateOfInterest": new Date("2012-12-12"),
		"UpperWindow": 2,
		"LowerWindow": 1,
		"ListOfVar": ["CM_Return","AV_RETURN"]		
	}
	describe('#calculate()', function () {

		it('should return an object for the results table', function () {
			let ret = calculate(table, param);
			// console.log(ret);
			assert.equal(_.isObject(ret), true);
		})

	});
	describe('#return_number()', function () {
		let ADJCLOSE = _.map(table, 'ADJCLOSE');
		// console.log(table);
		// console.log(ADJCLOSE);

		it('should return an array of numbers', function () {
			let ret = return_number(ADJCLOSE);
			// console.log(ret);
			assert.equal(_.isArray(ret), true);
		});

		ADJCLOSE = 5;
		it('should throw an error if ADJCLOSE is not an array', function () {
			assert.throws(
				function () {
					return return_number(ADJCLOSE);
				})
			Error;
		});
	});
	describe('#return_percentage()', function () {
		it('should return an array of percentages', function () {
			let ret = return_percentage(table.ADJCLOSE);
			assert.equal(_.isArray(ret), true);
		});
	});
	describe('#avg_return()', function () {
		it('should return an integer for the average return', function () {
			//how to call this 
			// let RETURN = return_number(table.ADJCLOSE);

			let AV_RETURN = avg_return(RETURN, param.DateOfInterest, param.LowerWindow, param.UpperWindow)
			// console.log(AV_RETURN);
			// console.log(RETURN);

		});
	});
	describe('#cumulative_return()', function () {
		//return array
		it('should return an integer for the cumulative return', function () {
			// console.log(table);
			let ret = cumulative_return(retTab, param.DateOfInterest, param.LowerWindow, param.UpperWindow);
			// console.log(ret);
			assert.equal(_.isNumber(ret), true);

		});

	});
});