const _ = require("lodash");
const moment = require("moment");
const qs = require("querystring");
require("isomorphic-fetch");
const NodeCache = require("node-cache");
const myCache = new NodeCache();

const COOL_BANANA_ENDPOINT = "https://nickr.xyz/coolbananas/api";
const TOPICS_LIST_ENDPOINT = COOL_BANANA_ENDPOINT + "/topics";
const NOTFOUND_API_ENDPOINT = "http://159.203.160.38:8080/Seng3011/apiv2/";

let responseHandler = response =>
    response.status >= 400
        ? Promise.resolve({ newsDataSet: [] })
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
 * @param {ParsedParameter} parameters Parameters retrieved after being validated
 * @returns {Object[]} News Articles
 */
let getNews = async parameters => {
    // Get Topics Code from cool bananas
    let topicCodes = myCache.get("topic");
    if (!topicCodes) {
        topicCodes = await getTopicCodes();
        myCache.set("topic", topicCodes);
    }
    // Get news from 404 Not Found API
    let response = myCache.get("news" + JSON.stringify(parameters));
    if (response) return Promise.resolve(response);

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

    return fetch(NOTFOUND_API_ENDPOINT + qs.stringify(data, "/", "/"))
        .then(responseHandler)
        .then(json => {
            try {
                myCache.set(
                    "news" + JSON.stringify(parameters),
                    json.newsDataSet
                );
                return json.newsDataSet;
            } catch (err) {
                return [];
            }
        });
};

module.exports = {
    getTopicCodes,
    getNews
};
