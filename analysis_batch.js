const Promise = require("bluebird");
const moment = require("moment");
const _ = require("lodash");
const fs = require("fs");
const querystring = require("querystring");
require("isomorphic-fetch");

const API_URL = "http://174.138.67.207/";
let handleResponse = response =>
    response.status !== 200
        ? Promise.reject(JSON.stringify(response))
        : response.json();

let run = async () => {
    let long = [], short = [];
    let companies = await fetch("http://localhost:3000/api/companies").then(
        handleResponse
    );
    companies = _.map(companies, "unique_symbol");

    let parameters = {
        InstrumentID: companies.join(","),
        DateOfInterest: moment("23/5/2017", "DD/MM/YYYY").format("YYYY-MM-DD"),
        List_of_Var: ["AV_Return"].join(","),
        Upper_window: 0,
        Lower_window: 365
    };
    // console.log(API_URL + querystring.stringify(parameters, "/", "/"));
    let result = await fetch(
        API_URL + querystring.stringify(parameters, "/", "/")
    ).then(handleResponse);
    var { CompanyReturns } = result;
    for (let ret of CompanyReturns) {
        let { InstrumentID, Data } = ret;
        let currentData = _.last(Data);
        if (currentData.AV_Return * 100 > 0)
            long.push({ InstrumentID, currentData });
    }

    parameters = {
        InstrumentID: companies.join(","),
        DateOfInterest: moment("23/5/2017", "DD/MM/YYYY").format("YYYY-MM-DD"),
        List_of_Var: ["AV_Return"].join(","),
        Upper_window: 0,
        Lower_window: 30
    };
    // console.log(API_URL + querystring.stringify(parameters, "/", "/"));
    result = await fetch(
        API_URL + querystring.stringify(parameters, "/", "/")
    ).then(handleResponse);
    var { CompanyReturns } = result;
    for (let ret of CompanyReturns) {
        let { InstrumentID, Data } = ret;
        let currentData = _.last(Data);
        if (currentData.AV_Return * 100 > 0.05)
            short.push({ InstrumentID, currentData });
    }

    console.log(long.length, short.length);
    fs.writeFileSync(
        "html/batch.json",
        JSON.stringify({ long, short }, null, 2)
    );
    return { long, short };
};

run();
