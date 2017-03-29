const _ = require('lodash');
const fs = require('fs');
const csv = require('csvtojson');
const Promise = require('bluebird');

/**
 * 
 * @param {String} csvData CSV Content
 */
var buildTable = (csvData) => {
	return new Promise(function (resolve, reject) {
		// Delete the first line as it's useless
		var position = csvData.toString().indexOf('\n'); // find position of new line element
		if (position != -1) { // if new line element found
			csvData = csvData.substr(position + 1);
		}

		// Dummy csv data if use dummy parameters from step 1
		// DATE,OPEN,HIGH,LOW,CLOSE,VOLUME,ADJCLOSE
		// 2013-01-18,2.27114,2.27114,2.25122,2.26118,166900,1.72149
		// 2013-01-17,2.26118,2.27114,2.24126,2.26118,458400,1.72149
		// 2013-01-16,2.2313,2.26118,2.21138,2.24126,373700,1.70632
		// 2013-01-15,2.2313,2.2811,2.21138,2.21138,427700,1.68357
		// 2013-01-14,2.19145,2.24126,2.19145,2.2313,342300,1.69874
		// 2013-01-11,2.15161,2.21138,2.15161,2.19145,429000,1.6684
		// 2013-01-10,2.17153,2.19145,2.14165,2.15161,390100,1.63807
		// 2013-01-09,2.16157,2.18149,2.15659,2.18149,329600,1.66082
		// 2013-01-08,2.15161,2.17153,2.15161,2.15161,340100,1.63807
		// 2013-01-07,2.19145,2.21138,2.15161,2.15161,359800,1.63807
		// 2013-01-04,2.17153,2.17153,2.15161,2.17153,190300,1.65323
		// 2013-01-03,2.19145,2.21138,2.15161,2.17153,216300,1.65323

		// TODO build a table with csvtojson
		// https://www.npmjs.com/package/csvtojson
        // http://keyangxiang.com/csvtojson/
		fs.writeFileSync('testFile.csv', csvData);
		csv({
            checkType: true     // convert strings to int, keyandxiang, check type
        })
			.fromString(csvData)	
			.on('error', (err) => {
				reject(err);
			})
			.on('end', (jsonArrObj) => {
				let table = jsonArrObj; 
                // jsonArrObj = {DATE: [], OPEN:[], HIGH:[], LOW:[], CLOSE:[], VOLUME: [], ADJCLOSE: []}
				// TODO validate table, parse data (for example parse DATE -> Javascipt Date object, parse string -> integers)
				// YOUR CODE GOES HERE
				
				// After manipulate with jsonArrObj, return results
				resolve(table);
			});
	});
}

module.exports = {
	buildTable
};