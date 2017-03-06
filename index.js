const http = require('http');
const port = 3000;
const step1 = require('./src/step1');
const step2 = require('./src/step2');
const step3 = require('./src/step3');
const step4 = require('./src/step4');

const requestHandler = (request, response) => {
	var parsed_data = step1(request);

	// TODO
	response.end('Hello Node.js Server!');
}

const server = http.createServer(requestHandler);

server.listen(port, (err) => {
	if (err) {
		return console.log('something bad happened', err)
	}

	console.log(`server is listening on ${port}`)
});