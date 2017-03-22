const fs = require('fs');
const port = 3000;
const step1 = require('./src/step1');
const step2 = require('./src/step2');
const step3 = require('./src/step3');
const step4 = require('./src/step4');

var express = require('express')
var app = express()

app.get('/api/company_returns', function (req, res) {
	res.send('Hello World!');
});

app.get('/', (req, res) => {
	res.setHeader("content-type", "text/html");
	fs.createReadStream("./main_01.html").pipe(res);
});

app.listen(3000, function () {
	console.log('SENG3011 app listening on port 3000!')
});