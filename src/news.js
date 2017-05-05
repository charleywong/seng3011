const _ = require("lodash");
const moment = require("moment");
const qs = require("querystring");
require("isomorphic-fetch");

const COOL_BANANA_ENDPOINT = "https://nickr.xyz/coolbananas/api";
const TOPICS_LIST_ENDPOINT = COOL_BANANA_ENDPOINT + "/topics";

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
    let topicCodes = await getTopicCodes();
    let data = {
        InstrumentIDs: parameters.InstrumentID.join(","),
        StartDate: moment(parameters.DateOfInterest)
            .subtract(parameters.LowerWindow, "days")
            .toISOString(),
        EndDate: moment(parameters.DateOfInterest)
            .add(parameters.UpperWindow, "days")
            .toISOString(),
        TopicCodes: topicCodes.join(",")
    };
    return fetch(COOL_BANANA_ENDPOINT + "?" + qs.stringify(data))
        .then(responseHandler)
        .then(json => json.NewsDataSet);
};

module.exports = {
    getTopicCodes,
    getNews
};
