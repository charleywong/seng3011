const fs = require('fs');
const port = 3000;
const Promise = require('bluebird');
const {
	parseInput
} = require('./src/inputParser');
const {
	fetchData
} = require('./src/dataParser');
const {
	buildTable
} = require('./src/tableBuilder');
const {
	calculate
} = require('./src/calcs');

var express = require('express')
var app = express()

app.get('/api/company_returns', async function (req, res) {
	try {
		let parameters = parseInput(req.query);
		let instrumentIDs = parameters.InstrumentID;
		let count = 0;
		let query = async function (InstrumentID, _parameters) {
			_parameters.InstrumentID = InstrumentID;
			let csvData = await fetchData(_parameters);
			let table = await buildTable(csvData);
			let result = calculate(table, _parameters);

			return {
				InstrumentID,
				Data: result
			}
		}

		let instrumentID_Promise = [];
		for (let i = 0; i < instrumentIDs.length; i++)
			instrumentID_Promise.push(
				query(instrumentIDs[i], parameters)
			);	
		
		let result = await Promise.all(instrumentID_Promise);
		result = {
			"CompanyReturns": result
		}
		res.send(result);
	} catch (err) {
		res.send(err.message + '\n' + err.stack);
	}
});

app.get('/test', function (req, res) {
	res.setHeader("content-type", "text/html");
	fs.createReadStream("./mochawesome-reports/mochawesome.html").pipe(res);
})

app.get('/documentation', function (req, res) {
	var html = fs.readFileSync('./html/document.html');
	res.setHeader("content-type", "text/html");
	res.send(html);
});

app.get('/', (req, res) => {
	res.setHeader("content-type", "text/html");
	fs.createReadStream("./main_01.html").pipe(res);
});

// serve search html when requesting to search
app.get('/search', (req, res) => {
	res.setHeader("content-type", "text/html");
	fs.createReadStream("./html/search.html").pipe(res);
});
app.get('/Chart.min.js', (req, res) => {
	res.setHeader("content-type", "text/javascript");
	fs.createReadStream("./html/Chart.min.js").pipe(res);
});

app.listen(3000, function () {
	console.log('SENG3011 app listening on port 3000!')
});
