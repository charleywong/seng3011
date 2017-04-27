const _ = require('lodash');
const assert = require('assert');
const querystring = require('querystring');
const {
	expect
} = require('chai');
require('isomorphic-fetch');

//http://174.138.67.207/InstrumentID/ABP.AX,AAPL/DateOfInterest/2012-12-10/List_of_Var/CM_Return,AV_Return/Upper_window/5/Lower_window/3
// const API_URL = 'http://ec2-54-160-211-66.compute-1.amazonaws.com:3000/api/company_returns?';
const API_URL = 'http://174.138.67.207/';

describe('Testing that incorrect input leads to incorrect output',  ()=> {
	describe('# Invalid InstrumentID',  () => {	
		it('should display an error message saying InstrumentID is invalid', function(done) {
			let parameters = {
				InstrumentID: 'ABP-AX',
				DateOfInterest: '2012-12-10',
				List_of_Var: ['CM_Return'],
				Upper_window: 5,
				Lower_window: 3			
			}
			fetch(API_URL + querystring.stringify(parameters, '/', '/'))
				.then(response => response.json())
				.then(function(json) {
					if (_.includes(json.Errors.toString(), "InstrumentID Value is Invalid")) {
						done();
					}
				})
				.catch(err => done(err))
		});
	})
	describe('# Invalid InstrumentID',  () => {	
		it('should display an error message saying InstrumentID is missing or URL is not in valid format', function(done) {
			let parameters = {
				DateOfInterest: '2012-12-10',
				List_of_Var: ['CM_Return'],
				Upper_window: 5,
				Lower_window: 3			
			}
			fetch(API_URL + querystring.stringify(parameters, '/', '/'))
				.then(response => response.json())
				.then(function(json) {
					if ((_.includes(json.Errors, "InstrumentID Value is Invalid")) || (json.Errors == "Request URL is Not in a Valid Format")) {
						done();
					}
				})
				.catch(err => done(err))
		});
	})
	// describe('# Invalid DateOfInterest',  () => {	
	// 	//this times out
	// 	//sending this get request does have an error message saying "Request URL is Not in a Valid Format"
	// 	//but i'm not sure why it's timing out instead of passing test
	// 	it('should display an error message saying DateOfInterest is invalid or missing', function(done) {
	// 		// this.timeout(5000);
	// 		let parameters = {
	// 			InstrumentID: 'ABP.AX',
	// 			DateOfInterest: '2012/12/10',
	// 			List_of_Var: ['CM_Return'],
	// 			Upper_window: 5,
	// 			Lower_window: 3			
	// 		}
	// 		fetch(API_URL + querystring.stringify(parameters, '/', '/'))
	// 			.then(response => response.json())
	// 			.then(function(json) {
	// 				if ((json.Errors == "Request URL is Not in a Valid Format")) {
	// 					done();
	// 				}
	// 			})
	// 			.catch(err => done(err))
	// 	});
	// })
	describe('# Missing DateOfInterest',  () => {	
		it('should display an error message saying \'invalid\' format', function(done) {
			let parameters = {
				InstrumentID: 'ABP.AX',
				List_of_Var: ['CM_Return'],
				Upper_window: 5,
				Lower_window: 3		
			}
			fetch(API_URL + querystring.stringify(parameters, '/', '/'))
				.then(response => response.json())
				.then(function(json) {
					if (json.Errors == "Request URL is Not in a Valid Format") {
						done();
					}
				})
				.catch(err => done(err))
		});
	})
	describe('# Invalid List_of_Var',  () => {
		//this doesn't pass because they made it so that if you only specify one return and misspell it
		//it interprets  it as no specified input for List_of_Var
		it('should display an error message saying List_of_Var is invalid', function(done) {
			let parameters = {
				InstrumentID: 'ABP.AX',
				DateOfInterest: '2012-12-10',
				List_of_Var: ['CM---AAAeturn'],
				Upper_window: 5,
				Lower_window: 3			
			}
			fetch(API_URL + querystring.stringify(parameters, '/', '/'))
				.then(response => response.json())
				.then(function(json) {
					if ((json.Errors == "Request URL is Not in a Valid Format")) {
						done();
					}
				})
				.catch(err => done(err))
		});
	})
	describe('# Missing List_of_Var',  () => {
		it('should display an error message saying List_of_Var is missing', function(done) {
			let parameters = {
				InstrumentID: 'ABP.AX',
				DateOfInterest: '2012-12-10',
				Upper_window: 5,
				Lower_window: 3			
			}
			fetch(API_URL + querystring.stringify(parameters, '/', '/'))
				.then(response => response.json())
				.then(function(json) {
					if ((json.Errors == "Request URL is Not in a Valid Format")) {
						done();
					}
				})
				.catch(err => done(err))
		});
	})
	describe('# Invalid Upper_window',  () => {	
		it('should display an error message Upper_window is invalid', function(done) {
			let parameters = {
				InstrumentID: 'ABP.AX',
				DateOfInterest: '2012-12-10',
				List_of_Var: ['CM_Return'],
				Upper_window: "five",
				Lower_window: 3			
			}
			fetch(API_URL + querystring.stringify(parameters, '/', '/'))
				.then(response => response.json())
				.then(function(json) {
					if (json.Errors == "Upper Window Value is Invalid") {
						done();
					}
				})
				.catch(err => done(err))
		});
		it('should display an error message Upper_window is invalid', function(done) {
			let parameters = {
				InstrumentID: 'ABP.AX',
				DateOfInterest: '2012-12-10',
				List_of_Var: ['CM_Return'],
				Upper_window: -5,
				Lower_window: 3			
			}
			fetch(API_URL + querystring.stringify(parameters, '/', '/'))
				.then(response => response.json())
				.then(function(json) {
					if (json.Errors == "Upper Window Value is Invalid") {
						done();
					}
				})
				.catch(err => done(err))
		})
	})	
	describe('# Missing Upper_window',  () => {	
		it('should display an error message saying \'invalid\' format', function(done) {
			let parameters = {
				InstrumentID: 'ABP.AX',
				DateOfInterest: '2012-12-10',
				List_of_Var: ['CM_Return'],
				Lower_window: 5				
			}
			fetch(API_URL + querystring.stringify(parameters, '/', '/'))
				.then(response => response.json())
				.then(function(json) {
					if (json.Errors == "Request URL is Not in a Valid Format") {
						done();
					}
				})
				.catch(err => done(err))
		});
	})
	describe('# Invalid Lower_window',  () => {	
		it('should display an error message Lower_window is invalid', function(done) {
			let parameters = {
				InstrumentID: 'ABP.AX',
				DateOfInterest: '2012-12-10',
				List_of_Var: ['CM_Return'],
				Upper_window: 5,
				Lower_window: "three"				
			}
			fetch(API_URL + querystring.stringify(parameters, '/', '/'))
				.then(response => response.json())
				.then(function(json) {
					if (json.Errors == "Lower Window Value is Invalid") {
						done();
					}
				})
				.catch(err => done(err))
		});
		it('should display an error message Lower_window is invalid', function(done) {
			let parameters = {
				InstrumentID: 'ABP.AX',
				DateOfInterest: '2012-12-10',
				List_of_Var: ['CM_Return'],
				Upper_window: 5,
				Lower_window: -3				
			}
			fetch(API_URL + querystring.stringify(parameters, '/', '/'))
				.then(response => response.json())
				.then(function(json) {
					if (json.Errors == "Lower Window Value is Invalid") {
						done();
					}
				})
				.catch(err => done(err))
		});
	})
	describe('# Missing Lower_window',  () => {	
		it('should display an error message saying \'invalid\' format', function(done) {
			let parameters = {
				InstrumentID: 'ABP.AX',
				DateOfInterest: '2012-12-10',
				List_of_Var: ['CM_Return'],
				Upper_window: 5				
			}
			fetch(API_URL + querystring.stringify(parameters, '/', '/'))
				.then(response => response.json())
				.then(function(json) {
					if (json.Errors == "Request URL is Not in a Valid Format") {
						done();
					}
				})
				.catch(err => done(err))
		});
	})
});

describe('Testing that correct input leads to valid output',  ()=> {
	describe('# Lower and Upper windows are 0', () => {
		it('should display data for the day of interest', function(done) {
			let parameters = {
				InstrumentID: 'ABP.AX',
				DateOfInterest: '2012-12-10',
				List_of_Var: ['CM_Return'],
				Upper_window: 0,
				Lower_window: 0			
			}
			fetch(API_URL + querystring.stringify(parameters, '/', '/'))
				.then(response => response.json())
				.then(function(json) {
					if (json.hasOwnProperty("Errors")) {
					} else {
						done();
					}
				})
				.catch(err => done(err))
		})
	}) 
});
