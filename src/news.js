const _ = require("lodash");
const moment = require("moment");
const qs = require("querystring");
require("isomorphic-fetch");

const COOL_BANANA_ENDPOINT = "https://nickr.xyz/coolbananas/api";
const TOPICS_LIST_ENDPOINT = COOL_BANANA_ENDPOINT + "/topics";
const NOTFOUND_API_ENDPOINT = "http://159.203.160.38:8080/Seng3011/apiv2/";

let responseHandler = response =>
    response.status >= 400
        ? Promise.reject(new Error(response.statusText))
        : response.json();

/**
 * Get News topics code from COOL_BANANA_ENDPOINT
 * @returns {Promise<String[]>} Array of topics' codes
 */
let getTopicCodes = async () =>
    fetch(TOPICS_LIST_ENDPOINT)
        .then(responseHandler)
        .then(json => json.TopicCodes);
/**
 * Get News From Cool Banana
 * @param {ParsedParameter}
 */
let getNews = async parameters => {
    // let topicCodes = ["AMERS", "COM"];
    let topicCodes = await getTopicCodes();
    let data = {
        "start-date": moment(parameters.DateOfInterest)
            .subtract(parameters.LowerWindow, "days")
            .toISOString(),
        "end-date": moment(parameters.DateOfInterest)
            .add(parameters.UpperWindow, "days")
            .toISOString(),
        instrumentId: parameters.InstrumentID.map(v => "RIC_" + v).join(","),
        "topic-codes": topicCodes.join(",")
    };
    console.log(NOTFOUND_API_ENDPOINT + qs.stringify(data, "/", "/"));
    return fetch(NOTFOUND_API_ENDPOINT + qs.stringify(data, "/", "/"))
        .then(responseHandler)
        .then(json => json.newsDataSet);
};

module.exports = {
    getTopicCodes,
    getNews
};
