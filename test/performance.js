const _ = require('lodash');
const assert = require('assert');
const {
	expect
} = require('chai');
require('isomorphic-fetch');

const API_URL = 'http://ec2-54-160-211-66.compute-1.amazonaws.com:3000/api/company_returns?';
 

describe('Multiple IDs performance testing with one request',  ()=> {
	describe('# Request returns for one company',  () => {	
		it('should get response within 5000ms', function(done) {
			this.timeout(5000);
			let parameters = {
				InstrumentID: 'ABP.AX',
				ListOfVar: ['CM_Return', 'AV_Return'],
				UpperWindow: 5,
				LowerWindow: 3,
				DateOfInterest: '10/12/2012'
			}
			fetch(API_URL + encodeURIComponent(parameters))
				.then(response => response.json())
				.then(json => done())
				.catch(err => done(err))
		});
	})
	describe('# Request returns for 3 companies',  () => {	
		it('should get response within 5000ms', function (done) {
			let parameters = {
				InstrumentID: 'AAPL,MSFT,FB',
				ListOfVar: ['CM_Return', 'AV_Return'],
				UpperWindow: 5,
				LowerWindow: 3,
				DateOfInterest: '10/12/2012'
			}
			this.timeout(5000);
			fetch(API_URL + encodeURIComponent(parameters))
				.then(response => response.json())
				.then(json => done())
				.catch(err => done(err))
		});
	})
	describe('# Request returns for 6 companies',  () => {	
		it('should get response within 5000ms', function (done) {
			let parameters = {
				InstrumentID: 'AAPL,MSFT,AMZN,GOOGL,FB,BABA',
				ListOfVar: ['CM_Return', 'AV_Return'],
				UpperWindow: 5,
				LowerWindow: 3,
				DateOfInterest: '10/12/2012'
			}
			this.timeout(5000);
			fetch(API_URL + encodeURIComponent(parameters))
				.then(response => response.json())
				.then(json => done())
				.catch(err => done(err))
		});
	})
});


