const fs = require('fs');
const port = 3000;
const Promise = require('bluebird');
const moment = require('moment');
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
const readmeRender = require('marky-markdown');

var express = require('express')
var app = express()

const version = '0.1.1';
const team = 'Stingray';
const members = [
	'Andrew Au z5020593',
	'Charley Wong z5060076',
	'Chris Miles z5076366',
	'Minh (Jackson) Cung z3493000'
];
// Allow CORS
app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.get('/api/company_returns', async function (req, res) {
	var before = moment.now();
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
		let now = moment.now();
		result = {
			version,
			team,
			members,
			startDate: moment(before).calendar(),
			endDate: moment(now).calendar(),
			elapsedTime: moment(now).diff(before, 'ms'),
			elapsedTimeUnit: 'milliseconds',
			"CompanyReturns": result
		}
		res.send(result);
	} catch (err) {
		let now = moment.now();
		res.send({
			version,
			team,
			members,
			startDate: moment(before).calendar(),
			endDate: moment(now).calendar(),
			elapsedTime: moment(now).diff(before, 'ms'),
			elapsedTimeUnit: 'milliseconds',
			CompanyReturns: null,
			error: err.message,
			log: err.stack
		});
	}
});

app.get('/test', function (req, res) {
	res.setHeader("content-type", "text/html");
	fs.createReadStream("./mochawesome-reports/mochawesome.html").pipe(res);
})

app.get('/', function (req, res) {
	var readme = fs.readFileSync('./README.md', 'utf-8');
	readme = readmeRender(readme);
	var html = fs.readFileSync('./html/document.html', 'utf-8');
	html = html.replace('{{README}}', readme)
		.replace('{{VERSION}}', version);
	res.setHeader("content-type", "text/html");
	res.send(html);
});

// app.get('/', (req, res) => {
// 	res.setHeader("content-type", "text/html");
// 	fs.createReadStream("./main_01.html").pipe(res);
// });

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