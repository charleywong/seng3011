# seng3011

## How to run

- Install latest Nodejs (`https://nodejs.org`)
- Install dependency `npm install`
- Run API server `npm start`
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