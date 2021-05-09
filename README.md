# Movie-Info-Scraper

## Description: 
This is a simple web scraping script written in javascript. It scrapes movie information from Imdb, rotten tomatos and metacritics about a particular movie and shows the fetched info on a html page. All you need to do is pass the exact movie name and the year of release and the script does the work for you. It scrapes everything from ratings to poster, trailer, writer, director, cast, genre, awards, top reviews etc from all three site and also gives a custom rating but taking the average of user and critic ratings given on the three sites.

## Node Modules/Apis used:
* puppeteer
* cheerio
* node-run-cmd
* omdb Api

## Screen Capture of the working of script:

https://user-images.githubusercontent.com/64087434/117571334-c3942080-b0eb-11eb-9051-4cbd0750adc7.mp4

### How to run locally :
Just run the file 'script.js' in vscode using command : node script.js "HERE COMES THE EXACT MOVIE NAME" "HERE COMES THE YEAR OF RELEASE"
for example->
```
node script.js "The Godfather" "1972"
```


