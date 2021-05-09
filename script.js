const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
var nrc = require('node-run-cmd');
const puppy = require("puppeteer");
const { PuppeteerScreenRecorder } = require('puppeteer-screen-recorder');
const omdb_api = "http://www.omdbapi.com/?apikey=dc60619d&";
const process = require('process');

// const movie_name = fs.readFileSync("./movie_detail.txt", "utf-8").split("\n")[0];
// const movie_year = fs.readFileSync("./movie_detail.txt", "utf-8").split("\n")[1];

const movie_name = process.argv[2];
const movie_year = process.argv[3];


let finalData = [];
let IMBD_score = 0;
// let ROTTEN_user_rating = 0;
let ROTTEN_critic_score = 0;
let META_user_score = 0;
let META_critic_score = 0;
let Custom_score = 0;


async function vistIMDB(tab) {
    let searchQuery = "https://www.imdb.com/find?q=" + movie_name.split(" ").join("+") + "+" + movie_year;
    await tab.goto(searchQuery);
    await tab.waitForSelector(".result_text", { visible: true });
    let list = await tab.$$(".result_text>a");

    let movieUrl = "";
    let movieText = "";
    for (let i = 0; i < list.length; i++) {

        movieUrl = await tab.evaluate(function (ele) {
            return ele.href;
        }, list[i]);

        movieText = await tab.evaluate(function (ele) {
            return ele.innerText;
        }, list[i]);
        movieText = movieText.toLowerCase().replace(" ", "");
        let temp = movie_name.toLowerCase().replace(" ", "");
        if (temp.normalize() === movieText.normalize()) {
            break;
        }
    }

    await tab.goto(movieUrl);
    request(movieUrl, getInfo_fromIMDB);

    await tab.waitForSelector('link[rel = "canonical"]');
    let linkele = await tab.$('link[rel = "canonical"]');

    let reviews_link = await tab.evaluate(function (ele) {
        return ele.href;
    }, linkele) + "reviews";
    await tab.goto(reviews_link);

    await tab.waitForSelector(".lister-item-content .title");
    let reviewEle = await tab.$$(".lister-item-content .title");
    let scoreEle = await tab.$$(".rating-other-user-rating>span");

    finalData.push({
        "Top 10 IMDB Reviews": [],
        "Top 5 MetaCritic Reviews": []
    });

    for (let i = 0, j = 0; i < 10; i++, j = j + 2) {
        let temp_href = await tab.evaluate(function (ele) {
            return ele.href;
        }, reviewEle[i]);
        let temp_text = await tab.evaluate(function (ele) {
            return ele.innerText;
        }, reviewEle[i]);
        let temp_score = await tab.evaluate(function (ele) {
            return ele.innerText;
        }, scoreEle[j]);
        finalData[1]["Top 10 IMDB Reviews"].push({
            "#": "" + (i + 1),
            "Score": temp_score + "/10",
            "Title": temp_text,
            "Review Link": temp_href
        });
    }

    return;
}

function getInfo_fromIMDB(err, res, html) {
    if (!err) {
        fs.writeFileSync("./temp/imdb.html", html);
        let $ = cheerio.load(html);
        let rating = $(".ratingValue>strong>span").text();
        IMBD_score = parseFloat(rating);
    }
}




// async function visitROTTEN(tab) {
//     let searchQuery = "https://www.rottentomatoes.com/search?search=" + movie_name.split(" ").join("%20") + "%20" + movie_year;
//     await tab.goto(searchQuery);
//     await tab.waitForSelector('.media-row.center');
//     let movieUrlEle = await tab.$$('a[class = "media-col thumbnail-group"]');
//     let movieUrl = await tab.evaluate(function(ele) {
//         return ele.href;
//     },movieUrlEle[0]);
//     console.log(movieUrl);

// }



async function getTrailer(tab) {
    let searchQuery = "https://www.youtube.com/results?search_query=" + movie_name.split(" ").join("+") + "+" + movie_year + "+trailer";
    await tab.goto(searchQuery);

    await tab.waitForSelector('a[id="thumbnail"]');
    let list = await tab.$$('a[id="thumbnail"]');
    let vidUrl = await tab.evaluate(function (ele) {
        return ele.href;
    }, list[0]);

    vidUrl = vidUrl.replace("https://www.youtube.com/watch?v=", "");
    vidUrl = "https://www.youtube.com/embed/" + vidUrl + "?autoplay=1&mute=1";

    finalData[0]["Trailer url"] = vidUrl;

    return;
}




async function visitMETA(tab) {
    let searchQuery = "https://www.metacritic.com/search/movie/" + movie_name.split(" ").join("%20") + "/results";
    await tab.goto(searchQuery);

    let temp_ele = await tab.$$(".product_title.basic_stat>a");
    let movieText = "";
    let movieUrl = "";
    for (let i = 0; i < temp_ele.length; i++) {
        movieUrl = await tab.evaluate(function (ele) {
            return ele.href;
        }, temp_ele[i]);

        movieText = await tab.evaluate(function (ele) {
            return ele.innerText;
        }, temp_ele[i]);

        movieText = movieText.toLowerCase().replace(" ", "");
        let temp = movie_name.toLowerCase().replace(" ", "");
        if (temp.normalize() === movieText.normalize()) {
            break;
        }
    }

    await tab.goto(movieUrl);

    request(movieUrl, getInfo_fromMETA.bind(this, tab));

    return;
}

function getInfo_fromMETA(tab, err, res, html) {
    if (!err) {
        fs.writeFileSync("./temp/meta.html", html);
        let $ = cheerio.load(html);

        let user_temp = $(".metascore_anchor span");
        let userscore = $(user_temp[1]).text();
        META_user_score = parseFloat(userscore);

        let reviewScores = $('.metascore_w.header_size.movie');
        let reviewSources = $(".read_full");
        for (let i = 0; i < 5; i++) {
            let score = $(reviewScores[i + 1]).text();
            let source = $(reviewSources[i]).attr("href");
            finalData[1]["Top 5 MetaCritic Reviews"].push({
                "#": "" + (i + 1),
                "Score": score,
                "Review Link": source
            });
        }

        computeCustomScore(tab);
    }
}




async function visitOMDB(tab) {
    let searchQuery = omdb_api + "t=" + movie_name.split(" ").join("+") + "&y=" + movie_year + "&plot=short&r=json";
    await tab.goto(searchQuery);
    request(searchQuery, getInfo_fromOMDB);

    return;
}

function getInfo_fromOMDB(err, res, html) {
    if (!err) {
        fs.writeFileSync("./temp/omdbInfo.json", html);
        let rawdata = fs.readFileSync('./temp/omdbInfo.json');
        let info_obj = JSON.parse(rawdata);

        finalData.push({
            "Title": info_obj["Title"],
            "Release Date": info_obj["Released"],
            "Genre": info_obj["Genre"],
            "Runtime": info_obj["Runtime"],
            "Director": info_obj["Director"],
            "Writer": info_obj["Writer"],
            "Cast": info_obj["Actors"],
            "Plot Summary": info_obj["Plot"],
            "Awards": info_obj["Awards"],
            "Poster url": info_obj["Poster"],
            "Trailer url": "",
            "Ratings": info_obj["Ratings"]
        });

        let temp = info_obj["Ratings"][1]["Value"];
        ROTTEN_critic_score = parseInt(temp.replace("%", ""));

        let temp2 = info_obj["Metascore"];
        META_critic_score = parseInt(temp2);
    }
}




function computeCustomScore(tab) {

    // console.log(IMBD_score);
    // console.log(META_critic_score);
    // console.log(META_user_score);
    // console.log(ROTTEN_critic_score);

    let temp_score = (IMBD_score * 10) + (META_user_score * 10) + META_critic_score + ROTTEN_critic_score;
    Custom_score = temp_score / 4;

    finalData.push({
        "CUSTOM SCORE": Custom_score
    });
    fs.writeFileSync("./temp/temp.json", JSON.stringify(finalData));

    let delayPromise = new Promise(function (resolve, rej) {
        setTimeout(resolve, 800);
    })

    delayPromise.then(function () {
        nrc.run("python -m http.server", callback(tab));
    });
}

async function callback(tab) {
    await tab.goto("http://localhost:8000/index.html");
}



async function main() {
    let browser = await puppy.launch({
        headless: false,
        defaultViewport: false
    });
    let tabs = await browser.pages();
    let tab = tabs[0];

    // const recorder = new PuppeteerScreenRecorder(tab);
    // await recorder.start('./test.mp4');

    await visitOMDB(tab);
    await vistIMDB(tab);
    await getTrailer(tab);
    // await visitROTTEN(tab);
    await visitMETA(tab);

    // let delayPromise = new Promise(function (resolve, rej) {
    //     setTimeout(resolve, 35000);
    // });
    // delayPromise.then(function () {
    //     stopRecording(recorder);
    // });

}

// async function stopRecording(recorder) {
//     await recorder.stop();
// }

main();
