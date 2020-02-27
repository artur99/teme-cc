const request = require('request')
const NO_OF_PARALLEL_REQUESTS = 50

let time_gb_st = Date.now()
let promises = [...Array(NO_OF_PARALLEL_REQUESTS).keys()].map(x => {
    let time_st = Date.now()

    return new Promise(function(resolve, reject) {
        request('http://localhost:3000/get_movie?email=david1989mail@yahoo.com', function (error, response, body) {
            if(error) return reject(error)

            var latency = Date.now() - time_st
            resolve(latency)
        })
    })
})


Promise.all(promises).then(latencies => {
    let total_time = Date.now() - time_gb_st
    let avg_time = Math.round(latencies.reduce((x, y) => x + y, 0) / latencies.length)
    console.log("Sent " + NO_OF_PARALLEL_REQUESTS + " requests...")
    console.log("Total time: " + total_time + " ms")
    console.log("Averge time / request: " + avg_time + " ms")
})
.catch(err => {
    console.log("Some request failed:", err)
})
