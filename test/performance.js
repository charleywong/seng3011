const _ = require('lodash');
const assert = require('assert');
const querystring = require('querystring');
const Promise = require('bluebird');
const {
	expect
} = require('chai');
require('isomorphic-fetch');

describe('> Stingray Performance Test', () => {

	const API_URL = 'http://ec2-54-160-211-66.compute-1.amazonaws.com:3000/api/company_returns?';
	describe('Multiple IDs performance testing with one request', () => {
		describe('# Request returns for one company', () => {
			it('should get response within 5000ms', function (done) {
				this.timeout(5000);
				let parameters = {
					InstrumentID: 'ABP.AX',
					ListOfVar: ['CM_Return', 'AV_Return'],
					UpperWindow: 5,
					LowerWindow: 3,
					DateOfInterest: '10/12/2012'
				}
				fetch(API_URL + querystring.stringify(parameters))
					.then(response => response.json())
					.then(json => done())
					.catch(err => done(err))
			});
		})
		describe('# Request returns for 3 companies', () => {
			it('should get response within 5000ms', function (done) {
				let parameters = {
					InstrumentID: 'AAPL,MSFT,FB',
					ListOfVar: ['CM_Return', 'AV_Return'],
					UpperWindow: 5,
					LowerWindow: 3,
					DateOfInterest: '10/12/2012'
				}
				this.timeout(5000);
				fetch(API_URL + querystring.stringify(parameters))
					.then(response => response.json())
					.then(json => done())
					.catch(err => done(err))
			});
		})
		describe('# Request returns for 6 companies', () => {
			it('should get response within 5000ms', function (done) {
				let parameters = {
					InstrumentID: 'AAPL,MSFT,AMZN,GOOGL,FB,BABA',
					ListOfVar: ['CM_Return', 'AV_Return'],
					UpperWindow: 5,
					LowerWindow: 3,
					DateOfInterest: '10/12/2012'
				}
				this.timeout(5000);
				fetch(API_URL + querystring.stringify(parameters))
					.then(response => response.json())
					.then(json => done())
					.catch(err => done(err))
			});
		})
	});
	describe('6 IDs performance testing with repeating requests', () => {
		describe('# Request returns for one company', () => {
			it('should get response within 5000ms', function (done) {
				let parameters = {
					InstrumentID: 'AAPL,MSFT,AMZN,GOOGL,FB,BABA',
					ListOfVar: ['CM_Return', 'AV_Return'],
					UpperWindow: 5,
					LowerWindow: 3,
					DateOfInterest: '10/12/2012'
				}
				this.timeout(5000);
				fetch(API_URL + querystring.stringify(parameters))
					.then(response => response.json())
					.then(json => done())
					.catch(err => done(err))
			});
		});
		describe('# Request returns for one company', () => {
			it('should get response within 5000ms', function (done) {
				let parameters = {
					InstrumentID: 'AAPL,MSFT,AMZN,GOOGL,FB,BABA',
					ListOfVar: ['CM_Return', 'AV_Return'],
					UpperWindow: 5,
					LowerWindow: 3,
					DateOfInterest: '10/12/2012'
				}
				this.timeout(5000);
				fetch(API_URL + querystring.stringify(parameters))
					.then(response => response.json())
					.then(json => done())
					.catch(err => done(err))
			});
		});
		describe('# Request returns for one company', () => {
			it('should get response within 5000ms', function (done) {
				let parameters = {
					InstrumentID: 'AAPL,MSFT,AMZN,GOOGL,FB,BABA',
					ListOfVar: ['CM_Return', 'AV_Return'],
					UpperWindow: 5,
					LowerWindow: 3,
					DateOfInterest: '10/12/2012'
				}
				this.timeout(5000);
				fetch(API_URL + querystring.stringify(parameters))
					.then(response => response.json())
					.then(json => done())
					.catch(err => done(err))
			});
		});
	});
	describe('Test API can handle a large amount of simultaneous calls', () => {
		let parameters = {
			InstrumentID: 'ABP.AX',
			ListOfVar: ['CM_Return', 'AV_Return'],
			UpperWindow: 5,
			LowerWindow: 3,
			DateOfInterest: '10/12/2012'
		}
		let apiRequest = fetch(API_URL + querystring.stringify(parameters)).then(response => response.json());
		describe('# 2 asynchronous calls', () => {
			it('should get response within 5000ms', (done) => {
				let promises = []
				for (let i = 0; i < 2; i++) {
					promises.push(apiRequest);
				}
				Promise.all(promises)
					.then(arrayOfJson => done())
					.catch(err => done(err));
			})
		});
		describe('# 4 asynchronous calls', () => {
			it('should get response within 5000ms', (done) => {
				let promises = []
				for (let i = 0; i < 4; i++) {
					promises.push(apiRequest);
				}
				Promise.all(promises)
					.then(arrayOfJson => done())
					.catch(err => done(err));
			})
		});
		describe('# 6 asynchronous calls', () => {
			it('should get response within 5000ms', (done) => {
				let promises = []
				for (let i = 0; i < 6; i++) {
					promises.push(apiRequest);
				}
				Promise.all(promises)
					.then(arrayOfJson => done())
					.catch(err => done(err));
			})
		});
	});
});

describe('> SeeSharp Performance Test', () => {
	const API_URL = 'http://174.138.67.207/'
	describe('Multiple IDs performance testing with one request', () => {
		describe('# Request returns for one company', () => {
			it('should get response within 5000ms', function (done) {
				this.timeout(5000);
				let parameters = {
					InstrumentID: 'ABP.AX',
					ListOfVar: ['CM_Return', 'AV_Return'],
					UpperWindow: 5,
					LowerWindow: 3,
					DateOfInterest: '2012-12-10'
				}
				fetch(API_URL + querystring.stringify(parameters, '/', '/'))
					.then(response => response.json())
					.then(json => done())
					.catch(err => done(err))
			});
		})
		describe('# Request returns for 3 companies', () => {
			it('should get response within 5000ms', function (done) {
				let parameters = {
					InstrumentID: 'AAPL,MSFT,FB',
					ListOfVar: ['CM_Return', 'AV_Return'],
					UpperWindow: 5,
					LowerWindow: 3,
					DateOfInterest: '2012-12-10'
				}
				this.timeout(5000);
				fetch(API_URL + querystring.stringify(parameters, '/', '/'))
					.then(response => response.json())
					.then(json => done())
					.catch(err => done(err))
			});
		})
		describe('# Request returns for 6 companies', () => {
			it('should get response within 5000ms', function (done) {
				let parameters = {
					InstrumentID: 'AAPL,MSFT,AMZN,GOOGL,FB,BABA',
					ListOfVar: ['CM_Return', 'AV_Return'],
					UpperWindow: 5,
					LowerWindow: 3,
					DateOfInterest: '2012-12-10'
				}
				this.timeout(5000);
				fetch(API_URL + querystring.stringify(parameters, '/', '/'))
					.then(response => response.json())
					.then(json => done())
					.catch(err => done(err))
			});
		})
	});
	describe('Multiple IDs performance testing with repeating requests', () => {
		describe('# Request returns for 6 companies', () => {
			it('should get response within 5000ms', function (done) {
				let parameters = {
					InstrumentID: 'AAPL,MSFT,AMZN,GOOGL,FB,BABA',
					ListOfVar: ['CM_Return', 'AV_Return'],
					UpperWindow: 5,
					LowerWindow: 3,
					DateOfInterest: '2012-12-10'
				}
				this.timeout(5000);
				fetch(API_URL + querystring.stringify(parameters, '/', '/'))
					.then(response => response.json())
					.then(json => done())
					.catch(err => done(err))
			});
		})
		describe('# Request returns for 6 companies', () => {
			it('should get response within 5000ms', function (done) {
				let parameters = {
					InstrumentID: 'AAPL,MSFT,AMZN,GOOGL,FB,BABA',
					ListOfVar: ['CM_Return', 'AV_Return'],
					UpperWindow: 5,
					LowerWindow: 3,
					DateOfInterest: '2012-12-10'
				}
				this.timeout(5000);
				fetch(API_URL + querystring.stringify(parameters, '/', '/'))
					.then(response => response.json())
					.then(json => done())
					.catch(err => done(err))
			});
		})
		describe('# Request returns for 6 companies', () => {
			it('should get response within 5000ms', function (done) {
				let parameters = {
					InstrumentID: 'AAPL,MSFT,AMZN,GOOGL,FB,BABA',
					ListOfVar: ['CM_Return', 'AV_Return'],
					UpperWindow: 5,
					LowerWindow: 3,
					DateOfInterest: '2012-12-10'
				}
				this.timeout(5000);
				fetch(API_URL + querystring.stringify(parameters, '/', '/'))
					.then(response => response.json())
					.then(json => done())
					.catch(err => done(err))
			});
		})
	});
	describe('Test API can handle a large amount of simultaneous calls', () => {
		let parameters = {
			InstrumentID: 'ABP.AX',
			ListOfVar: ['CM_Return', 'AV_Return'],
			UpperWindow: 5,
			LowerWindow: 3,
			DateOfInterest: '2012-12-10'
		}
		let apiRequest = fetch(API_URL + querystring.stringify(parameters, '/', '/')).then(response => response.json());
		describe('# 2 asynchronous calls', () => {
			it('should get response within 5000ms', (done) => {
				let promises = []
				for (let i = 0; i < 2; i++) {
					promises.push(apiRequest);
				}
				Promise.all(promises)
					.then(arrayOfJson => done())
					.catch(err => done(err));
			})
		});
		describe('# 4 asynchronous calls', () => {
			it('should get response within 5000ms', (done) => {
				let promises = []
				for (let i = 0; i < 4; i++) {
					promises.push(apiRequest);
				}
				Promise.all(promises)
					.then(arrayOfJson => done())
					.catch(err => done(err));
			})
		});
		describe('# 6 asynchronous calls', () => {
			it('should get response within 5000ms', (done) => {
				let promises = []
				for (let i = 0; i < 6; i++) {
					promises.push(apiRequest);
				}
				Promise.all(promises)
					.then(arrayOfJson => done())
					.catch(err => done(err));
			})
		});
	});
});