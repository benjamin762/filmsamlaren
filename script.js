document.querySelector("form").addEventListener("submit", ()=>{event.preventDefault(); search()})

async function search() {
    
    let serch = document.querySelector("input").value;
    
    data = await searchApi(serch);
    updateHtml(data)
}

async function getApiKey(location) {
    let response = await fetch(location);
    let data = await response.json();
    return data;
}
const apiKey = getApiKey("api-keys.json");
// let imdbId,title,searchQuery;
// let imdburl="http://www.omdbapi.com/?i="+imdbId+"&apikey="+apiKey
// let titleurl="http://www.omdbapi.com/?t="+title+"&apikey="+apiKey
// let searchurl="http://www.omdbapi.com/?s="+searchQuery+"&apikey="+apiKey;

async function searchApi(searchQuery) {
    let searchUrl="http://www.omdbapi.com/?s="+searchQuery+"&apikey="+await apiKey;
    let response = await fetch (searchUrl)
    //400 500 osv
    if (response.ok = false) {
        null
    }
    let data = await response.json()
    if (data.Response !== "True") {
        console.log(data)
    }
    console.log("end of searchApi", data)
    return data
}

async function updateHtml(data) {
    let resultSection = document.querySelector(".resultat")
    resultSection.replaceChildren()


    console.log("beginof update html", data)
    if (data.totalResults == 0) {
        //inga resultat
    }
    data.Search.forEach(element => {
        let e = document.createElement("p")
        e.innerHTML = `
        <img src=${element.Poster}>
        <h2>${element.Title}</h2>
        <p>Year: ${element.Year} - Type: ${element.Type} - IMDB id: ${element.imdbID}</p>
        `
        resultSection.appendChild(e)
    });
}

search();