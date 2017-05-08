# seng3011

## How to run

- Install latest Nodejs version 7.7.* (`https://nodejs.org`)
- Install dependency `npm install`
- Run API server in development environment `npm start`
- Run API server in production environment `npm run start:production`
- Stop API server `npm stop`
- View API server log `npm run log`
- Go to `localhost:3000` to see the SENG3011 app
- (Optional) Unit testing + Performance testing `npm test`
- (Optional) Generate Test Report `npm run generate:test`
- (Optional) Generate JSDoc `npm run generate:jsdoc`
***
## Changelog
- 	*v0.1.6 (7 April 2017):*
	+ Throw Error messages for invalid IDs
	+ Added News section by using other team's API
	+ Added Given parameters in API
- 	*v0.1.5 (27 April 2017):*
	+ Enable In-memory cache system
	+ Enable CPU cluster mode in production server
	+ Upgrade More Test for SeeSharp and Alvin's Friends
- 	*v0.1.4 (24 April 2017):*
	+ Corrected output type in jsdocs
	+ Updated Unit Testings
	+ Added API Performance Testings
	+ Added In-memory cache system
- 	*v0.1.3 (13 April 2017):*
	+ Added bootstrap theme
	+ Beautify documentation
	+ Implementation Docs
- 	*v0.1.2 (13 April 2017):*
	+ Enabled multiple InstrumentIDs
	+ Improved Docs
	+ Added interactive Visualiser
-	*v0.1.1 (12 April 2017):*
	+ API should output in correct format with log
	+ Beautify documentation
-   *v0.1.0 (10 April 2017):*
	+ Fix API calculation, it should output in correct format
	+ Currently doesn't work with multiple InstrumentID due to UNSW server issue (Return wrong data, return duplicate when received multiple request at a time)
	+ Added separate documentation
	+ Added basic WebUI
-   *v0.0.2*
	+ Without doing any calculation, return table in json format
-   *v0.0.1*
	+ Return helloworld
***
## Specs 

### Step 1
API parse the input parameters provided by user
### Step 2
API send a query to get daily price data, filtered by the Instrument ID and Date rage. As the
API should calculated returns for each day in the defined date range, it needs to acquire daily
price data for a range of dates before and after the DateOfIntrest.
As API have to calculate cumulative and average return for each day within the upper and
lower window, minimally the range should be between (DateOfIntrest+2*UpperWindow)
and (DateOfIntrest+2*LowerWindow+1), in order to have sufficient data for calculation.
Refer to appendix 6.2 table where sample calculation was conducted, to understand the data
range necessary.
### Step 3
API build a table of price data, align with the given date.
### Step 4
Company Returns API calculates the average returns and cumulative returns and shows them
versus the event date. The formula for calculating cumulative return and average return at
time (T) is ...

***
## Dependencies

### Express web framework `https://expressjs.com/`
- [Docs / API references](https://expressjs.com/en/4x/api.html) 
- Used in `index.js`

### Mocha - [Unit testing tool](https://mochajs.org/)
- Write test files in test/
- Run command `npm test` to execute test files

### csvtojson - Load csv format from file, text or stream
- [Link](https://www.npmjs.com/package/csvtojson)
- Used in `tableBuilder.js`

### Lodash - A modern JavaScript utility library delivering modularity, performance & extras.
- [Documentations](https://lodash.com/docs/4.17.4)

### Moment - Parse, validate, manipulate, and display dates and times in JavaScript.
- [Documentations](https://momentjs.com/docs/)

### bluebird - a fully featured JavaScript promises library with unmatched performance.
- [Documentations](https://bluebirdjs.com/docs/api-reference.html)

### isomorphic-fetch - a nodejs compatible version of [fetch()](https://github.com/github/fetch)
- The `fetch()` function is a Promise-based mechanism for programmatically making
web requests in the browser. This project is a polyfill that implements a subset
of the standard Fetch specification, enough to make `fetch` a viable
replacement for most uses of XMLHttpRequest in traditional web applications.
- Used in `dataParser.js`