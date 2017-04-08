const fs = require('fs');
const port = 3000;
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
		let csvData = await fetchData(parameters);
		let table = await buildTable(csvData);
		let result = calculate(table, parameters);
		res.send(result);
	} catch (err) {
		res.send(err.message + '\n' + err.stack);
	}
});

app.get('/test', function (req, res) {
	res.setHeader("content-type", "text/html");
	fs.createReadStream("./mochawesome-reports/mochawesome.html").pipe(res);
})

app.get('/', (req, res) => {
	res.setHeader("content-type", "text/html");
	fs.createReadStream("./main_01.html").pipe(res);
});

app.listen(3000, function () {
	console.log('SENG3011 app listening on port 3000!')
});
