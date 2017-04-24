const _ = require('lodash');
const assert = require('assert');
const {
	expect
} = require('chai');
require('isomorphic-fetch');

const MULTI_IDS_TEST_URLS = [
	// Correct parameters with 1 company ABP.AX
	'http://ec2-54-160-211-66.compute-1.amazonaws.com:3000/api/company_returns?InstrumentID=ABP.AX&ListOfVar=CM_Return&ListOfVar=AV_Return&UpperWindow=5&LowerWindow=3&DateOfInterest=10%2F12%2F2012',
	// Correct parameters with 3 companies AAPL, MSFT, FB
	'http://ec2-54-160-211-66.compute-1.amazonaws.com:3000/api/company_returns?InstrumentID=AAPL,MSFT,FB&ListOfVar=CM_Return&ListOfVar=AV_Return&UpperWindow=5&LowerWindow=3&DateOfInterest=10%2F12%2F2012',
	// Correct parameters with 6 companies AAPL,MSFT,AMZN,GOOGL,FB,BABA
	'http://ec2-54-160-211-66.compute-1.amazonaws.com:3000/api/company_returns?InstrumentID=AAPL,MSFT,AMZN,GOOGL,FB,BABA&ListOfVar=CM_Return&ListOfVar=AV_Return&UpperWindow=5&LowerWindow=3&DateOfInterest=10%2F12%2F2012'
];
 

describe('Multiple IDs performance testing with one request',  ()=> {
	describe('# Request returns for one company',  () => {	
		it('should get response within 5000ms', function(done) {
			this.timeout(5000);
			fetch(MULTI_IDS_TEST_URLS[0])
				.then(response => response.json())
				.catch(err => done(err))
		});
	})
	describe('# Request returns for 3 companies',  () => {	
		it('should get response within 5000ms', function(done) {
			this.timeout(5000);
			fetch(MULTI_IDS_TEST_URLS[2])
				.then(response => response.json())
				.catch(err => done(err))
		});
	})
	describe('# Request returns for 6 companies',  () => {	
		it('should get response within 5000ms', function(done) {
			this.timeout(5000);
			fetch(MULTI_IDS_TEST_URLS[1])
				.then(response => response.json())
				.catch(err => done(err))
		});
	})
});


