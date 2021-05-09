# Movie-Info-Scraper

## Description: 
This is a simple web scraping script written in javascript. It scrapes movie information from Imdb, rotten tomatoes and metacritics about a particular movie and shows the fetched info on a html page. All you need to do is pass the exact movie name and the year of release and the script does the work for you. It scrapes everything from ratings to poster, trailer, writer, director, cast, genre, awards, top reviews etc from all three site and also gives a custom rating but taking the average of user and critic ratings given on the three sites. It also have links to top 10 Imdb reviews and top 5 metacritics reviews. This tool can help you view all the helpful information that there is about that movie and let you decide whether it is worth watching or not.

## Node Modules/Apis used:
* puppeteer
* cheerio
* node-run-cmd
* omdb Api
* puppeteer-screen-recorder

## Screen Capture of the working of script:

https://user-images.githubusercontent.com/64087434/117571334-c3942080-b0eb-11eb-9051-4cbd0750adc7.mp4

### How to run locally :
Just run the file 'script.js' in vscode using command : node script.js _"HERE COMES THE EXACT MOVIE NAME" "HERE COMES THE YEAR OF RELEASE"_

**for example->**
```
node script.js "The Godfather" "1972"
```

## Deatiled working explanation:
The file 'script.js' uses cheerio and puppeteer modules of node.js to vist Imdb, rotten tomatoes and metacritic and fetches the required data. Any file created during the process is stored in 'temp' folder. Final fetched data is stored in 'temp.json' file. Then the node-run-cmd module is used to create a local server which hosts 'index.html' file. The 'index.html' file is web page which uses 'display.js' script to fetch data from previously created 'temp.json' file and the required data is displayed on the browser. 'style.css' formats our webpage to display contents appropriately.

## Screenshots:
Here's how the final webpage will look like

![Screenshot (192)](https://user-images.githubusercontent.com/64087434/117572172-42d72380-b0ef-11eb-8a7e-3977f4220b4b.png)


![Screenshot (193)](https://user-images.githubusercontent.com/64087434/117572174-436fba00-b0ef-11eb-8fe5-868040838c70.png)


![Screenshot (194)](https://user-images.githubusercontent.com/64087434/117572167-410d6000-b0ef-11eb-9c27-1009e442f775.png)


![Screenshot (195)](https://user-images.githubusercontent.com/64087434/117572170-423e8d00-b0ef-11eb-8c1b-25173874544b.png)


