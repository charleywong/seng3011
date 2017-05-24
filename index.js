const fs = require("fs");
const port = 3000;
const Promise = require("bluebird");
const moment = require("moment");
const _ = require("lodash");

const { parseInput } = require("./src/inputParser");
const { fetchData } = require("./src/dataParser");
const { buildTable } = require("./src/tableBuilder");
const { calculate } = require("./src/calcs");
const { getNews } = require("./src/news");

const companies = require("./companies.json");
const express = require("express");
const app = express();
const compress = require("compression");
const minify = require("express-minify");

app.use(compress({ level: 9 }));
app.use(minify());
const API_URL = "http://174.138.67.207/";
const NodeCache = require("node-cache");
const myCache = new NodeCache();
const querystring = require("querystring");
const version = "0.1.7";
const team = "Stingray";
const members = [
    "Andrew Au z5020593",
    "Charley Wong z5060076",
    "Chris Miles z5076366",
    "Minh (Jackson) Cung z3493000"
];
// Allow CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

// Blocking source code
app.use(function(req, res, next) {
    console.log(req.path);
    if (req.path.indexOf(".js.html") !== -1) {
        res.status(403).send("Source code will be available at W12");
        // res.sendstatus(403);
    }
    next();
});

app.use("/jsdocs", express.static("jsdocs"));

app.get("/api/companies", (req, res) => {
    res.json(companies);
});

app.get("/api/company/:id", async (req, res) => {
    let json = _.find(companies, v => v.unique_symbol === req.params.id);

    let news = await getNews({ InstrumentID: [req.params.id] });

    res.json(_.extend(json, { news: news[0] }));
});

app.get("/api/company_returns", async function(req, res) {
    const before = moment.now();
    let logPath = `log/${before}.log`;
    try {
        let parameters = parseInput(req.query);
        let news = await getNews(parameters);

        let cache = myCache.get(JSON.stringify(parameters));
        if (cache) {
            let n = moment.now();
            cache.elapsedTime = moment(n).diff(before, "ms");
            return res.json(cache);
        }

        // let csvData = await fetchData(parameters);
        // let tables = await buildTable(csvData, parameters.InstrumentID.length);
        // let query = async (table, InstrumentID, parameters) => ({
        //     InstrumentID,
        //     Data: calculate(table, parameters)
        // });
        // let promises = [];
        // for (let i = 0; i < tables.length; i++) {
        //     let table = tables[i];
        //     promises.push(
        //         query(
        //             table,
        //             parameters.InstrumentID[tables.length - i - 1],
        //             parameters
        //         )
        //     );
        // }
        if (_.isString(parameters.ListOfVar))
            parameters.ListOfVar = [parameters.ListOfVar];
        parameters = {
            InstrumentID: parameters.InstrumentID.join(","),
            DateOfInterest: moment(parameters.DateOfInterest).format(
                "YYYY-MM-DD"
            ),
            List_of_Var: (parameters.ListOfVar || []).join(","),
            Upper_window: parameters.UpperWindow,
            Lower_window: parameters.LowerWindow
        };
        let result = await fetch(
            API_URL + querystring.stringify(parameters, "/", "/")
        ).then(response => response.json());

        if (result.Errors && !_.isEmpty(result.Errors))
            throw new Error(
                "InstrumentID Value is Invalid, or there is No Stock Data Available for the Specified Window of Days"
            );
        else result = result.CompanyReturns;
        let now = moment.now();
        result = {
            version,
            team,
            members,
            startDate: moment(before).format(),
            endDate: moment(now).format(),
            elapsedTime: moment(now).diff(before, "ms"),
            elapsedTimeUnit: "milliseconds",
            CompanyReturns: result,
            parameters,
            log: "http://ec2-54-160-211-66.compute-1.amazonaws.com:3000/" +
                logPath,
            news
        };
        if (process.env.NODE_ENV == "production")
            fs.writeFileSync(logPath, JSON.stringify(result, null, 4), {
                encoding: "utf-8"
            });
        myCache.set(JSON.stringify(parameters), result);
        res.send(result);
    } catch (err) {
        let now = moment.now();
        let data = {
            version,
            team,
            members,
            startDate: moment(before).format(),
            endDate: moment(now).format(),
            elapsedTime: moment(now).diff(before, "ms"),
            elapsedTimeUnit: "milliseconds",
            CompanyReturns: null,
            parameters: req.query,
            error: err.message,
            log: "http://ec2-54-160-211-66.compute-1.amazonaws.com:3000/" +
                logPath
        };
        if (process.env.NODE_ENV == "production")
            fs.writeFileSync(logPath, JSON.stringify(data, null, 4), {
                encoding: "utf-8"
            });
        myCache.set(JSON.stringify(req.query), data);
        res.send(data);
    }
});

app.use("/log", express.static("log"));
app.use("/", express.static("html"));

app.listen(3000, function() {
    console.log("SENG3011 app listening on port 3000!");
});
