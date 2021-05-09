
function main() {

    fetch("./temp/temp.json")
        .then(response => response.json())
        .then(data => {
            further(data);
        });
}

function further(myData) {
    document.getElementById("title").innerHTML = myData[0]["Title"];
    document.getElementById("poster").src = myData[0]["Poster url"];
    document.getElementById("plot").innerHTML = `SUMMARY : ${myData[0]["Plot Summary"]}`;
    document.getElementById("imdb").innerText = `IMDB Score : ${myData[0]["Ratings"][0]["Value"]}`;
    document.getElementById("rotten").innerText = `Rotten Tomatos Score : ${myData[0]["Ratings"][1]["Value"]}`;
    document.getElementById("meta").innerText = `MetaCritic Score : ${myData[0]["Ratings"][2]["Value"]}`;
    document.getElementById("final").innerText = `Score:  ${myData[2]["CUSTOM SCORE"]}`;
    document.getElementById("r_date").innerText = `Release Date -> ${myData[0]["Release Date"]}`;
    document.getElementById("genre").innerText = `Genre -> ${myData[0]["Genre"]}`;
    document.getElementById("length").innerText = `Runtime -> ${myData[0]["Runtime"]}`;
    document.getElementById("dir").innerText = `Directed By -> ${myData[0]["Director"]}`;
    document.getElementById("wrt").innerText = `Written By -> ${myData[0]["Writer"]}`;
    document.getElementById("cast").innerText = `Cast -> ${myData[0]["Cast"]}`;
    document.getElementById("awards").innerText = `Awards/Nominations -> ${myData[0]["Awards"]}`;
    document.getElementById("trailer").src = myData[0]["Trailer url"];

    createTable(myData);
}

function createTable(myData) {
    for (let i = 0; i < myData[1]["Top 10 IMDB Reviews"].length; i++) {

        let score = myData[1]["Top 10 IMDB Reviews"][i]["Score"];
        let title = myData[1]["Top 10 IMDB Reviews"][i]["Title"];
        let url = myData[1]["Top 10 IMDB Reviews"][i]["Review Link"];

        let row = document.createElement('tr');
        document.getElementById("table1").appendChild(row)

        let col1 = document.createElement('td');
        let col2 = document.createElement('td');
        let a = document.createElement('a');

        col1.innerText = score;
        a.innerText = title;
        a.href = url;

        col2.appendChild(a);
        row.appendChild(col1);
        row.appendChild(col2);
    }
    for (let i = 0; i < myData[1]["Top 5 MetaCritic Reviews"].length; i++) {

        let score = myData[1]["Top 5 MetaCritic Reviews"][i]["Score"];
        let url = myData[1]["Top 5 MetaCritic Reviews"][i]["Review Link"];

        let row = document.createElement('tr');
        document.getElementById("table2").appendChild(row);

        let col1 = document.createElement('td');
        let col2 = document.createElement('td');
        let a = document.createElement('a');

        col1.innerText = score;
        a.innerText = url;
        a.href = url;
        
        col2.appendChild(a);
        row.appendChild(col1);
        row.appendChild(col2);
    }
}

main()