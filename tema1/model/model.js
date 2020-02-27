const crypto = require('crypto')

const config = require('../config')
const requester = require('./requester')



var get_top_movies = function(next) {
    let link = `https://api.themoviedb.org/3/movie/popular?api_key=${config.TMDB_APIKEY}&language=en-US&page=1`


    // let resposne = `{"page":1,"total_results":10000,"total_pages":500,"results":[{"popularity":323.577,"vote_count":440,"video":false,"poster_path":"\/aQvJ5WPzZgYVDrxLX4R6cLJCEaQ.jpg","id":454626,"adult":false,"backdrop_path":"\/qonBhlm0UjuKX2sH7e73pnG0454.jpg","original_language":"en","original_title":"Sonic the Hedgehog","genre_ids":[28,35,878,10751],"title":"Sonic the Hedgehog","vote_average":7.1,"overview":"Based on the global blockbuster videogame franchise from Sega, Sonic the Hedgehog tells the story of the world’s speediest hedgehog as he embraces his new home on Earth. In this live-action adventure comedy, Sonic and his new best friend team up to defend the planet from the evil genius Dr. Robotnik and his plans for world domination.","release_date":"2020-02-12"},{"popularity":252.587,"vote_count":4482,"video":false,"poster_path":"\/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg","id":496243,"adult":false,"backdrop_path":"\/TU9NIjwzjoKPwQHoHshkFcQUCG.jpg","original_language":"ko","original_title":"기생충","genre_ids":[35,18,53],"title":"Parasite","vote_average":8.6,"overview":"All unemployed, Ki-taek's family takes peculiar interest in the wealthy and glamorous Parks for their livelihood until they get entangled in an unexpected incident.","release_date":"2019-05-30"},{"popularity":260.901,"vote_count":566,"video":false,"poster_path":"\/uPGq1mkEXznUpapDmOSxbsybjfp.jpg","id":475303,"adult":false,"backdrop_path":"\/6fkqwqLEcDZOEAnBBfKAniwNxtx.jpg","original_language":"en","original_title":"A Rainy Day in New York","genre_ids":[35,10749],"title":"A Rainy Day in New York","vote_average":6.8,"overview":"Two young people arrive in New York to spend a weekend, but once they arrive they're met with bad weather and a series of adventures.","release_date":"2019-07-26"},{"popularity":208.09,"vote_count":2438,"video":false,"poster_path":"\/xBHvZcjRiWyobQ9kxBhO6B2dtRI.jpg","id":419704,"adult":false,"backdrop_path":"\/5BwqwxMEjeFtdknRV792Svo0K1v.jpg","original_language":"en","original_title":"Ad Astra","genre_ids":[12,18,9648,878,53],"title":"Ad Astra","vote_average":6,"overview":"The near future, a time when both hope and hardships drive humanity to look to the stars and beyond. While a mysterious phenomenon menaces to destroy life on planet Earth, astronaut Roy McBride undertakes a mission across the immensity of space and its many perils to uncover the truth about a lost expedition that decades before boldly faced emptiness and silence in search of the unknown.","release_date":"2019-09-17"},{"popularity":181.344,"vote_count":834,"video":false,"poster_path":"\/h4VB6m0RwcicVEZvzftYZyKXs6K.jpg","id":495764,"adult":false,"backdrop_path":"\/uozb2VeD87YmhoUP1RrGWfzuCrr.jpg","original_language":"en","original_title":"Birds of Prey (and the Fantabulous Emancipation of One Harley Quinn)","genre_ids":[28,35,80],"title":"Birds of Prey (and the Fantabulous Emancipation of One Harley Quinn)","vote_average":6.8,"overview":"After her breakup with the Joker, Harley Quinn joins forces with singer Black Canary, assassin Huntress, and police detective Renee Montoya to help a young girl named Cassandra, who had a hit placed on her after she stole a rare diamond from crime lord Roman Sionis.","release_date":"2020-02-05"},{"popularity":157.07,"vote_count":1648,"video":false,"poster_path":"\/jyw8VKYEiM1UDzPB7NsisUgBeJ8.jpg","id":512200,"adult":false,"backdrop_path":"\/zTxHf9iIOCqRbxvl8W5QYKrsMLq.jpg","original_language":"en","original_title":"Jumanji: The Next Level","genre_ids":[28,12,35,14],"title":"Jumanji: The Next Level","vote_average":6.7,"overview":"As the gang return to Jumanji to rescue one of their own, they discover that nothing is as they expect. The players will have to brave parts unknown and unexplored in order to escape the world’s most dangerous game.","release_date":"2019-12-04"},{"popularity":149.652,"vote_count":2468,"video":false,"poster_path":"\/h6Wi81XNXCjTAcdstiCLRykN3Pa.jpg","id":330457,"adult":false,"backdrop_path":"\/xJWPZIYOEFIjZpBL7SVBGnzRYXp.jpg","original_language":"en","original_title":"Frozen II","genre_ids":[12,16,10751],"title":"Frozen II","vote_average":7,"overview":"Elsa, Anna, Kristoff and Olaf head far into the forest to learn the truth about an ancient mystery of their kingdom.","release_date":"2019-11-20"},{"popularity":146.611,"vote_count":75,"video":false,"poster_path":"\/33VdppGbeNxICrFUtW2WpGHvfYc.jpg","id":481848,"adult":false,"backdrop_path":"\/yFRpUmsreYO5Bc0HVBTsJsHIIox.jpg","original_language":"en","original_title":"The Call of the Wild","genre_ids":[12,18,10751],"title":"The Call of the Wild","vote_average":5.7,"overview":"A sled dog struggles for survival in the wilds of the Yukon.","release_date":"2020-02-19"},{"popularity":83.592,"vote_count":1964,"video":false,"poster_path":"\/49HMMZPVJcnUwe2QmVzBfxyLAY2.jpg","id":258216,"adult":false,"backdrop_path":"\/t9MElpSTsqNBttwntdevOgQuJDe.jpg","original_language":"en","original_title":"Nymphomaniac: Vol. I","genre_ids":[18],"title":"Nymphomaniac: Vol. I","vote_average":6.9,"overview":"A man named Seligman finds a fainted wounded woman in an alley and he brings her home. She tells him that her name is Joe and that she is nymphomaniac. Joe tells her life and sexual experiences with hundreds of men since she was a young teenager while Seligman tells about his hobbies, such as fly fishing, reading about Fibonacci numbers or listening to organ music.","release_date":"2013-12-25"},{"popularity":135.547,"vote_count":9386,"video":false,"poster_path":"\/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg","id":475557,"adult":false,"backdrop_path":"\/n6bUvigpRFqSwmPp1m2YADdbRBc.jpg","original_language":"en","original_title":"Joker","genre_ids":[80,18,53],"title":"Joker","vote_average":8.2,"overview":"During the 1980s, a failed stand-up comedian is driven insane and turns to a life of crime and chaos in Gotham City while becoming an infamous psychopathic crime figure.","release_date":"2019-10-02"},{"popularity":124.324,"vote_count":2344,"video":false,"poster_path":"\/pThyQovXQrw2m0s9x82twj48Jq4.jpg","id":546554,"adult":false,"backdrop_path":"\/cjTQSwcsfVdirSFSHNBXRGkxmWa.jpg","original_language":"en","original_title":"Knives Out","genre_ids":[35,80,18,9648,53],"title":"Knives Out","vote_average":7.8,"overview":"When renowned crime novelist Harlan Thrombey is found dead at his estate just after his 85th birthday, the inquisitive and debonair Detective Benoit Blanc is mysteriously enlisted to investigate. From Harlan's dysfunctional family to his devoted staff, Blanc sifts through a web of red herrings and self-serving lies to uncover the truth behind Harlan's untimely death.","release_date":"2019-11-27"},{"popularity":117.59,"vote_count":941,"video":false,"poster_path":"\/y95lQLnuNKdPAzw9F9Ab8kJ80c3.jpg","id":38700,"adult":false,"backdrop_path":"\/upUy2QhMZEmtypPW3PdieKLAHxh.jpg","original_language":"en","original_title":"Bad Boys for Life","genre_ids":[28,80,53],"title":"Bad Boys for Life","vote_average":6.4,"overview":"Marcus and Mike are forced to confront new threats, career changes, and midlife crises as they join the newly created elite team AMMO of the Miami police department to take down the ruthless Armando Armas, the vicious leader of a Miami drug cartel.","release_date":"2020-01-15"},{"popularity":83.805,"vote_count":312,"video":false,"poster_path":"\/b5cz6BoyHrgBnhfDHOW5hXRWbln.jpg","id":449924,"adult":false,"backdrop_path":"\/ekP6EVxL81lZ4ivcqPsoZ72rY0h.jpg","original_language":"cn","original_title":"葉問4","genre_ids":[28,18,36],"title":"Ip Man 4: The Finale","vote_average":6,"overview":"Following the death of his wife, Ip Man travels to San Francisco to ease tensions between the local kung fu masters and his star student, Bruce Lee, while searching for a better future for his son.","release_date":"2019-12-20"},{"popularity":83.202,"vote_count":466,"video":false,"poster_path":"\/1DPUFG6QnGqzpvEaDEv7TaepycM.jpg","id":458897,"adult":false,"backdrop_path":"\/a0xTB1vBxMGt6LGG4N7k1wO9lfL.jpg","original_language":"en","original_title":"Charlie's Angels","genre_ids":[28,12,35],"title":"Charlie's Angels","vote_average":6.4,"overview":"When a systems engineer blows the whistle on a dangerous technology, Charlie's Angels from across the globe are called into action, putting their lives on the line to protect society.","release_date":"2019-11-14"},{"popularity":83.07,"vote_count":480,"video":false,"poster_path":"\/5eNiYMu2GXCtNlDwMcJqKGVwyoX.jpg","id":448119,"adult":false,"backdrop_path":"\/lG802rseTZcN9mtLsQPVfApEVzM.jpg","original_language":"en","original_title":"Dolittle","genre_ids":[12,35,14,10751],"title":"Dolittle","vote_average":6.4,"overview":"After losing his wife seven years earlier, the eccentric Dr. John Dolittle, famed doctor and veterinarian of Queen Victoria’s England, hermits himself away behind the high walls of Dolittle Manor with only his menagerie of exotic animals for company. But when the young queen falls gravely ill, a reluctant Dolittle is forced to set sail on an epic adventure to a mythical island in search of a cure, regaining his wit and courage as he crosses old adversaries and discovers wondrous creatures.","release_date":"2020-01-01"},{"popularity":81.291,"vote_count":2836,"video":false,"poster_path":"\/AuGiPiGMYMkSosOJ3BQjDEAiwtO.jpg","id":530915,"adult":false,"backdrop_path":"\/cqa3sa4c4jevgnEJwq3CMF8UfTG.jpg","original_language":"en","original_title":"1917","genre_ids":[28,18,10752],"title":"1917","vote_average":8,"overview":"At the height of the First World War, two young British soldiers must cross enemy territory and deliver a message that will stop a deadly attack on hundreds of soldiers.","release_date":"2019-12-10"},{"popularity":80.919,"vote_count":16,"video":false,"poster_path":"\/4U7hpTK0XTQBKT5X60bKmJd05ha.jpg","id":570670,"adult":false,"backdrop_path":"\/uZMZyvarQuXLRqf3xdpdMqzdtjb.jpg","original_language":"en","original_title":"The Invisible Man","genre_ids":[27,878,53],"title":"The Invisible Man","vote_average":7.6,"overview":"When Cecilia's abusive ex takes his own life and leaves her his fortune, she suspects his death was a hoax. As a series of coincidences turn lethal, Cecilia works to prove that she is being hunted by someone nobody can see.","release_date":"2020-02-26"},{"popularity":80.655,"vote_count":8742,"video":false,"poster_path":"\/jpfkzbIXgKZqCZAkEkFH2VYF63s.jpg","id":920,"adult":false,"backdrop_path":"\/a1MlbLBk5Sy6YvMbSuKfwGlDVlb.jpg","original_language":"en","original_title":"Cars","genre_ids":[12,16,35,10751],"title":"Cars","vote_average":6.7,"overview":"Lightning McQueen, a hotshot rookie race car driven to succeed, discovers that life is about the journey, not the finish line, when he finds himself unexpectedly detoured in the sleepy Route 66 town of Radiator Springs. On route across the country to the big Piston Cup Championship in California to compete against two seasoned pros, McQueen gets to know the town's offbeat characters.","release_date":"2006-06-08"},{"popularity":80.575,"vote_count":1530,"video":false,"poster_path":"\/vqzNJRH4YyquRiWxCCOH0aXggHI.jpg","id":290859,"adult":false,"backdrop_path":"\/riTANvQ8GKmQbgtC1ps3OfkU43A.jpg","original_language":"en","original_title":"Terminator: Dark Fate","genre_ids":[28,878],"title":"Terminator: Dark Fate","vote_average":6.2,"overview":"Decades after Sarah Connor prevented Judgment Day, a lethal new Terminator is sent to eliminate the future leader of the resistance. In a fight to save mankind, battle-hardened Sarah Connor teams up with an unexpected ally and an enhanced super soldier to stop the deadliest Terminator yet.","release_date":"2019-10-23"},{"popularity":68.495,"vote_count":57,"video":false,"poster_path":"\/gItrnbEbMBbUrdIkFz8kgS2gkt.jpg","id":505225,"adult":false,"backdrop_path":"\/lsgYcIbcoQeDZXsHYMOnkvk3sn0.jpg","original_language":"en","original_title":"The Last Thing He Wanted","genre_ids":[18,53],"title":"The Last Thing He Wanted","vote_average":4.9,"overview":"At the turning point of the Iran-Contra affair, Elena McMahon, a fearless investigative journalist covering the 1984 US presidential campaign, puts herself in danger when she abandons her assigned task in order to fulfill the last wish of her ailing father, a mysterious man whose past activities she barely knows…","release_date":"2020-01-27"}]}`
    //
    //
    // var parsed_r = JSON.parse(resposne)
    // next(null, parsed_r.results)
    // return

    requester.get(link, function(err, data) {
        if(err) {
            return next(err)
        }
        var response = {}

        try {
            response = JSON.parse(data)
        }
        catch(e) {}

        if(response && response.results && response.results.length > 0) {
            return next(null, response.results)
        }

        next('Invalid response (2): ' + JSON.stringify(response))
    })
}

var get_random = function(i_start, i_end, next) {
    let link = `https://www.random.org/integers/?num=1&min=${i_start}&max=${i_end}&col=1&base=10&format=plain`

    requester.get(link, function(err, data) {
        if(err) return next(err)

        next(null, parseInt(data.trim()))
    })
}

var get_imdb_data = function(movie_title, next) {
    let link = `https://www.omdbapi.com/?t=${movie_title.replace(/\s/, '+')}&apiKey=${config.OMDB_APIKEY}`

    requester.get(link, function(err, data) {
        if(err) return next(err)

        try {
            let resp = JSON.parse(data)
            return next(null, resp)
        }
        catch(e) {
            console.log(e)
        }

        next("Invalid response (3): " + JSON.stringify(data))
    })
}

var get_gravatar_link = function(email, next) {
    var email = email.trim().toLowerCase()

    var hash = crypto.createHash('md5').update(email).digest("hex")
    var link = `https://www.gravatar.com/avatar/${hash}`

    next(null, link)
}

var get_username_from_email = function(email) {
    return email.trim().split('@')[0]
}

var get_movie = function(email, next) {

    // return next(null, {"username": "david1989mail", "year": 2004, "title":"Frozen II","description":"Elsa, Anna, Kristoff and Olaf head far into the forest to learn the truth about an ancient mystery of their kingdom.","imdb_id":"tt4520988","imdb_rating":"7.2","image":"https://m.media-amazon.com/images/M/MV5BMjA0YjYyZGMtN2U0Ni00YmY4LWJkZTItYTMyMjY3NGYyMTJkXkEyXkFqcGdeQXVyNDg4NjY5OTQ@._V1_SX300.jpg","gravatar_link":"https://www.gravatar.com/avatar/056fe50266054ed3a511cf0f701e4518"})

    get_top_movies(function(err, movie_list) {
        if(err) return next(err)

        get_random(0, movie_list.length - 1, function(err, random_int) {
            if(err) return next(err)

            var the_movie = movie_list[random_int]

            get_imdb_data(the_movie.title, function(err, imdb_data) {
                if(err) return next(err)

                get_gravatar_link(email, function(err, gravatar_link) {
                    if(err) return next(err)

                    var resp = {
                        title: the_movie.title,
                        description: the_movie.overview,
                        imdb_id: imdb_data.imdbID,
                        imdb_rating: imdb_data.imdbRating,
                        image: imdb_data.Poster,
                        year: imdb_data.Year,
                        gravatar_link: gravatar_link,
                        username: get_username_from_email(email),
                    }

                    next(null, resp)
                })
            })
        })
    })
}


module.exports = {
    get_movie: get_movie,
    get_metrics: requester.get_metrics
}
