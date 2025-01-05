document.querySelector("form").addEventListener("submit", (event)=>{event.preventDefault(); search()})

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
        let e = document.createElement("details")
        e.innerHTML = `
        <summary>
        ${element.Poster == "N/A" ? "" : "<img src="+element.Poster+">"}
        <h2>${element.Title}</h2>
        </summary>`;
        resultSection.appendChild(e)

        e.addEventListener("toggle", async (event) => {
            if(e.open && !e.querySelector('p')) {
                // details är öppnad och p med mer ifo finns inte
                let p = document.createElement('p');
                p.innerText = "Laddar filminfo.";
                e.appendChild(p);
                // fetxh details
                async function getDetails() {
                    let response = await fetch("http://www.omdbapi.com/?i="+element.imdbID+"&apikey="+ await apiKey)
                    let data = await response.json();
                    return data;
                }
                let details = await getDetails();

                // display details
                let html = "<table>";
                for (const key in details) {
                    if (key == "Ratings") {
                        html+= "<tr><th>"+ key+ "</th><td><table>";
                        for (let rating of details[key]) {
                            html += "<tr><th>"+rating.Source + "</th><td>" + rating.Value + "</td></tr>"
                        }
                        if (details[key].length == 0) {
                            html += "No ratings."
                        }
                        html += "</table></td></tr>";
                    } else if (key == "Poster") {
                        if (details[key] == "N/A") {
                            html+= "<tr><th>"+ key+ "</th><td> No poster.</td></tr>"
                        } else {
                            html+= "<tr><th>"+ key+ "</th><td><img src='"+ details[key]+ "'></td></tr>"
                        }
                    } else if (key == "Response") {
                        // Ignore
                    } else {
                        html+= "<tr><th>"+ key+ "</th><td>"+ details[key]+ "</td></tr>"
                    }
                }
                html += "</table>";

                p.innerHTML = html;
                console.log(details, typeof details);

                p.insertAdjacentHTML('beforeend',"<button> 😍💑💗❤Favorit </button>");
                e.querySelector('button').addEventListener('click', function () {
                    favourites.push(details);
                    localStorage.setItem("favorites", JSON.stringify(favourites));
        
                    // document.querySelector('.favorites').insertAdjacentHTML("beforeend", "<h2>details.title</h2><button>Remove</button>");
                    let f = e.cloneNode(true);
                    f.open = null;
                    document.querySelector('.fav-list').appendChild(f);
                    
                    let btn = f.querySelector('button');
                    btn.innerText='Ta bor faorit';
                    btn.addEventListener("click", () => {
                        favourites.splice(favourites.indexOf(details), 1);
                        localStorage.setItem("favorites", JSON.stringify(favourites));
                        
                        document.querySelector('.fav-list').removeChild(f);
                    });

                });

            } else {
                // details är stängd
            }
        });
    });
}

search();


// //////////////////////////////////////////////////////////////////

let favourites = JSON.parse(localStorage.getItem("favorites")) || [];

// document.getElementsByClassName('.no-fav')[0].classList.toggle("hidden", favourites.length > 0)




if (favourites.length > 0) {

    favourites.forEach(element => {
        let e = document.createElement("details")
        e.innerHTML = `
        <summary>
        ${element.Poster == "N/A" ? "" : "<img src="+element.Poster+">"}
        <h2>${element.Title}</h2>
        </summary>`;
        document.querySelector('.fav-list').appendChild(e)

                let p = document.createElement('p');
                e.appendChild(p);
                
                let details = element;

                // display details
                let html = "<table>";
                for (const key in details) {
                    if (key == "Ratings") {
                        html+= "<tr><th>"+ key+ "</th><td><table>";
                        for (let rating of details[key]) {
                            html += "<tr><th>"+rating.Source + "</th><td>" + rating.Value + "</td></tr>"
                        }
                        if (details[key].length == 0) {
                            html += "No ratings."
                        }
                        html += "</table></td></tr>";
                    } else if (key == "Poster") {
                        if (details[key] == "N/A") {
                            html+= "<tr><th>"+ key+ "</th><td> No poster.</td></tr>"
                        } else {
                            html+= "<tr><th>"+ key+ "</th><td><img src='"+ details[key]+ "'></td></tr>"
                        }
                    } else if (key == "Response") {
                        // Ignore
                    } else {
                        html+= "<tr><th>"+ key+ "</th><td>"+ details[key]+ "</td></tr>"
                    }
                }
                html += "</table>";

                p.innerHTML = html;
                
                p.insertAdjacentHTML('beforeend',"<button> Ta bor faorit </button>");
                    
                    
                    let btn = p.querySelector('button');
                    btn.addEventListener("click", () => {
                        favourites.splice(favourites.indexOf(details), 1);
                        localStorage.setItem("favorites", JSON.stringify(favourites));
                        
                        document.querySelector('.fav-list').removeChild(p.closest("details"));
                    });


       
    });
}
