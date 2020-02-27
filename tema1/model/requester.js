const request = require('request')

var logs = [];

var parse_host = function(link) {
    var f1 = link.split("://").slice(-1)[0]
    return f1.split("/")[0]
}


var get_page = function(link, done) {
    var host = parse_host(link)
    var time_st = Date.now()

    request(link, function (error, response, body) {
        var latency = Date.now() - time_st
        logs.push({domain: host, latency: latency, request: link, response: error ? error.message : body})

        if(error) return done(error.message)

        if(response && response.statusCode != 200) {
            return done("Bad code: " + response.statusCode + ". Body: " + body)
        }

        return done(null, body)
    });
}

var get_metrics = function() {
    let agg = {}
    for(let entry of logs) {
        if(!agg[entry.domain]) {
            agg[entry.domain] = {requests: 1, time: entry.latency}
        }
        else {
            agg[entry.domain].requests ++
            agg[entry.domain].time += entry.latency
        }
    }

    for(let key of Object.keys(agg)) {
        agg[key].avg_time = Math.round(agg[key].time / agg[key].requests)
    }

    return agg
}


module.exports = {
    get: get_page,
    get_metrics: get_metrics,
}
