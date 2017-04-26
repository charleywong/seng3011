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
		//can i just remove these first 5 since they're checked later on anyway?
		it('InstrumentID is an array', function () {
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
			assert.equal(_.isArray(InstrumentID), true);
		});
		it('ListOfVar is an array', function () {
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
			assert.equal(_.isArray(ListOfVar), true);
		});
		it('UpperWindow is a number', function () {
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
			assert.equal(_.isInteger(UpperWindow), true);
		});

		it('LowerWindow is a number', function () {
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
			assert.equal(_.isInteger(LowerWindow), true);
		});
		it('DateOfInterest is a date', function () {
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
			assert.equal(_.isDate(DateOfInterest), true);
		});
		it('Should throw if InstrumentID is missing', function() {
			let parameters = {
				"ListOfVar": ["CM_Return", "AV_Return"],
				"UpperWindow": 5,
				"LowerWindow": 3,
				"DateOfInterest": "10/12/2012"
			}
			assert.throws(
				function() {
					return parseInput(parameters);
				},
				Error
			);
		})
		it('Should throw if InstrumentID is invalid', function() {
			let parameters = {
				"InstrumentID": "ABP-AX",
				"ListOfVar": ["CM_Return", "AV_Return"],
				"UpperWindow": 5,
				"LowerWindow": 3,
				"DateOfInterest": "10/12/2012"
			}
			assert.throws(
				function() {
					return parseInput(parameters);
				},
				Error
			);
		})
		it('Should throw if UpperWindow is missing', function() {
			let parameters = {
				"InstrumentID": "ABP.AX",
				"ListOfVar": ["CM_Return", "AV_Return"],	
				"LowerWindow": 2,
				"DateOfInterest": "10/12/2012"
			}
			assert.throws(
				function() {
					return parseInput(parameters);
				},
				Error
			);
		})
		it('Should throw if UpperWindow is invalid', function() {
			let parameters = {
				"InstrumentID": "ABP.AX",
				"ListOfVar": ["CM_Return", "AV_Return"],	
				"UpperWindow": "five",
				"LowerWindow": 2,
				"DateOfInterest": "10/12/2012"
			}
			assert.throws(
				function() {
					return parseInput(parameters);
				},
				Error
			);
		})
		it('Should throw if LowerWindow is missing', function() {
			let parameters = {
				"InstrumentID": "ABP.AX",
				"ListOfVar": ["CM_Return", "AV_Return"],
				"UpperWindow": 5,
				"DateOfInterest": "10/12/2012"
			}
			assert.throws(
				function() {
					return parseInput(parameters);
				},
				Error
			);
		})
		it('Should throw if LowerWindow is invalid', function() {
			let parameters = {
				"InstrumentID": "ABP.AX",
				"ListOfVar": ["CM_Return", "AV_Return"],
				"UpperWindow": 5,
				"LowerWindow": "three",
				"DateOfInterest": "10/12/2012"
			}
			assert.throws(
				function() {
					return parseInput(parameters);
				},
				Error
			);
		})
		it('Should throw if DateOfInterest is invalid', function() {
			let parameters = {
				"InstrumentID": "ABP.AX",
				"ListOfVar": ["CM_Return", "AV_Return"],
				"UpperWindow": 5,
				"LowerWindow": 3,
				"DateOfInterest": "10.12.2012"
			}
			assert.throws(
				function() {
					return parseInput(parameters);
				},
				Error
			);
		})
		it('Should throw if DateOfInterest is missing', function() {
			let parameters = {
				"InstrumentID": "ABP-AX",
				"ListOfVar": ["CM_Return", "AV_Return"],
				"UpperWindow": 5,
				"LowerWindow": 3,
			}
			assert.throws(
				function() {
					return parseInput(parameters);
				},
				Error
			);
		})
	});
	describe('#hasNull()', function () {
		it('throws an error if parameters contain a null value', function () {
			let parameters = {
				"InstrumentID": null,
				"ListOfVar": ["CM_Return", "AV_Return"],
				"UpperWindow": 4,
				"LowerWindow": 3,
				"DateOfInterest": "10/12/2012"
			}
			assert.throws(
				function () {
					return hasNull(parameters)
				},
				Error
			);
		});
	});
	describe('#isNumeric()', function () {
		it('throws an error if UpperWindow isn\'t a number or, it is not greater than or equal to 0', function () {
			let parameters = {
				"InstrumentID": "ABP.AX",
				"ListOfVar": ["CM_Return", "AV_Return"],
				"UpperWindow": "",
				"LowerWindow": -4,
				"DateOfInterest": "10/12/2012"
			}
			assert.equal(isNumeric(parameters.UpperWindow), false);
		});
		it('throws an error if LowerWindow isn\'t a number or, it is not greater than or equal to 0', function () {
			let parameters = {
				"InstrumentID": "ABP.AX",
				"ListOfVar": ["CM_Return", "AV_Return"],
				"UpperWindow": "",
				"LowerWindow": -4,
				"DateOfInterest": "10/12/2012"
			}
			assert.equal(isNumeric(parameters.LowerWindow), false);
		});
	});
	describe('#listIsValid()', function () {
		it('throws an error if ListOfVar doesn\'t contain "CM_Return" or "AV_Return"', function () {
			let parameters = {
				"InstrumentID": "ABP.AX",
				"ListOfVar": ["CM_Return", "AVReturn"],
				"UpperWindow": 5,
				"LowerWindow": 4,
				"DateOfInterest": "10/12/2012"
			}
			assert.throws(
				function () {
					return listIsValid(parameters.ListOfVar)
				},
				Error
			);
		});
	});

});


describe('dataParser', function () {
	// Async test with mocha 
	// http://staxmanade.com/2015/11/testing-asyncronous-code-with-mochajs-and-es7-async-await/
	describe('#fetchData()', function () {
		it(
			'should return csv content as text', function (done) {
					let parameters = {
						"InstrumentID": ["ABP.AX"],
						"ListOfVar": ["CM_Return", "AVReturn"],
						"UpperWindow": 5,
						"LowerWindow": 4,
						"DateOfInterest": Date.now() // DateOfInterest must be a Date object
					}
					fetchData(parameters)
						.then(csvData => done(assert.equal(_.isString(csvData), true)))
						.catch(done);
				}
		);
	});
});

describe('tableBuilder', function () {
	it('should return a table built from csvData', function (done) {
				let csvData = "ABP.AX 11/04/17 11:55:50 " + "\n" +
					"DATE,OPEN,HIGH,LOW,CLOSE,VOLUME,ADJCLOSE" + "\n" +
					"2017-04-10,3.33,3.37,3.33,3.35,765400,3.35" + "\n" +
					"2017-04-07,3.31,3.34,3.28,3.32,820500,3.32" + "\n" +
					"2017-04-06,3.35,3.38,3.30,3.33,617800,3.33" + "\n" +
					"2017-04-05,3.30,3.33,3.26,3.33,693100,3.33" + "\n" +
					"2017-04-04,3.30,3.32,3.27,3.28,537600,3.28" + "\n" +
					"2017-04-03,3.25,3.28,3.23,3.27,766400,3.27" + "\n";
				buildTable(csvData)
					.then(retTable => done(assert.equal(_.isArray(retTable), true)))
					.catch(done);
			}
	);
})

describe('calcs', function () {
	describe('#calculate()', function () {
		it('should return an object for the results table', function () {
			let table = sampleTable;
			let param = {
				"DateOfInterest": new Date("2012-12-12"),
				"UpperWindow": 2,
				"LowerWindow": 1,
				"ListOfVar": ["CM_Return","AV_RETURN"]		
			}
			let ret = calculate(table, param);
			assert.equal(_.isObject(ret), true);
		})

	});
	describe('#return_number()', function () {
		it('should return an array of numbers', function () {
			let table = sampleTable;
			let ADJCLOSE = _.map(table, 'ADJCLOSE');
			let ret = return_number(ADJCLOSE);
			assert.equal(_.isArray(ret), true);
		});

		it('should throw an error if ADJCLOSE is not an array', function () {
			ADJCLOSE = 5;
			assert.throws(
				function () {
					return return_number(ADJCLOSE);
				})
			Error;
		});
	});
	describe('#return_percentage()', function () {
		it('should return an array of percentages', function () {
			let table = sampleTable;
			let ADJCLOSE = _.map(table, 'ADJCLOSE');
			let ret = return_percentage(ADJCLOSE);
			assert.equal(_.isArray(ret), true);
		});
	});
	describe('#avg_return()', function () {
		it('should return a number for the average return', function () {
			let table = sampleTable;
			var param = {
				"DateOfInterest": new Date("2012-12-12"),
				"UpperWindow": 2,
				"LowerWindow": 1,
				"ListOfVar": ["CM_Return","AV_RETURN"]		
			}
			let ADJCLOSE = _.map(table, 'ADJCLOSE');
			let RETURN = return_number(ADJCLOSE);
			let AV_RETURN = avg_return(RETURN, param.DateOfInterest, param.LowerWindow, param.UpperWindow)
			assert.equal(_.isNumber(AV_RETURN), true);
		});
	});
	describe('#cumulative_return()', function () {
		it('should return a number for the cumulative return', function () {
			let table = sampleTable;
			var param = {
				"DateOfInterest": new Date("2012-12-12"),
				"UpperWindow": 2,
				"LowerWindow": 1,
				"ListOfVar": ["CM_Return","AV_RETURN"]		
			}
			let ADJCLOSE = _.map(table, 'ADJCLOSE');
			let RETURNS = return_number(ADJCLOSE);
			let ret = cumulative_return(RETURNS, 1, param.LowerWindow, param.UpperWindow);
			assert.equal(_.isNumber(ret), true);

		});

	});
});