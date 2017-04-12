# seng3011

## How to run

- Install latest Nodejs version 7.7.* (`https://nodejs.org`)
- Install dependency `npm install`
- Run API server `npm start`
- Stop API server `npm stop`
- View API server log `npm run log`
- Go to `localhost:3000` to see the SENG3011 app
- (Optional) Unit testing `npm test`

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

## Dependencies

### Express web framework `https://expressjs.com/`
- [Docs / API references](https://expressjs.com/en/4x/api.html) 
- Used in `index.js`

### Mocha - [Unit testing tool](https://mochajs.org/)
- Write test files in test/
- Run command `npm test` to execute test files

### csvtojson - Load csv format from file, text or stream
- [Link](https://www.npmjs.com/package/csvtojson)
- Used in `step3.js`

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
- Used in `step2.js`