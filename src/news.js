const _ = require("lodash");
const moment = require("moment");
const qs = require("querystring");
require("isomorphic-fetch");
const NodeCache = require("node-cache");
const myCache = new NodeCache();

const COOL_BANANA_ENDPOINT = "https://nickr.xyz/coolbananas/api";
const TOPICS_LIST_ENDPOINT = COOL_BANANA_ENDPOINT + "/topics";
const NOTFOUND_API_ENDPOINT = "http://159.203.160.38:8080/Seng3011/apiv2/";
const GOOGLE_NEWSRSS_ENDPOINT =
    "https://www.google.com/finance/company_news?output=rss&q=";
const parser = require("rss-parser");

let responseHandler = response =>
    response.status >= 400 ? Promise.resolve({}) : response.text();

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
    // let topicCodes = myCache.get("topic");
    // if (!topicCodes) {
    //     topicCodes = await getTopicCodes();
    //     myCache.set("topic", topicCodes);
    // }
    // Get news from 404 Not Found API
    let symbols = _.map(
        parameters.InstrumentID,
        v => "ASX:" + v.replace(".AX", "")
    );
    let response = myCache.get("news" + JSON.stringify(symbols));
    if (response) return Promise.resolve(response);

    let promises = [];
    for (let symbol of symbols) {
        let url = GOOGLE_NEWSRSS_ENDPOINT + symbol;
        promises.push(
            fetch(url).then(responseHandler).then(
                rss =>
                    new Promise((resolve, reject) => {
                        parser.parseString(rss, (err, parsed) => {
                            if (err) reject(err);
                            else resolve(_.extend({ id: symbol }, parsed));
                        });
                    })
            )
        );
    }
    let json = await Promise.all(promises);
    try {
        myCache.set("news" + JSON.stringify(symbols), json);
        return json;
    } catch (err) {
        return [];
    }
    // let data = {
    //     "start-date": moment(parameters.DateOfInterest)
    //         .subtract(parameters.LowerWindow, "days")
    //         .toISOString(),
    //     "end-date": moment(parameters.DateOfInterest)
    //         .add(parameters.UpperWindow, "days")
    //         .toISOString(),
    //     instrumentId: parameters.InstrumentID.map(v => "RIC_" + v).join(","),
    //     "topic-codes": topicCodes.join(",")
    // };

    // return fetch(NOTFOUND_API_ENDPOINT + qs.stringify(data, "/", "/"))
    //     .then(responseHandler)
    //     .then(json => {
    //         try {
    //             myCache.set(
    //                 "news" + JSON.stringify(parameters),
    //                 json.newsDataSet
    //             );
    //             return json.newsDataSet;
    //         } catch (err) {
    //             return [];
    //         }
    //     });
};

module.exports = {
    getTopicCodes,
    getNews
};
