document.querySelector("#search > form").addEventListener("submit", (event) => { event.preventDefault(); search() })

async function search() {
    let search = document.querySelector("#search input").value;
    data = await searchApi(search);
    updateHtml(data);
}

async function getApiKey(location) {
    let response = await fetch(location);
    let key = await response.json();
    return key;
}
const apiKey = getApiKey("api-keys.json");

async function searchApi(searchQuery) {
    let searchUrl = "http://www.omdbapi.com/?s=" + searchQuery + "&apikey=" + await apiKey;
    let response = await fetch(searchUrl);
    // 400 500 etc.
    if (response.ok = false) {
        null;
    }
    let data = await response.json();
    if (data.Response !== "True") {
        console.log(data);
    }
    console.log("End of searchApi.", data);
    return data;
}

async function updateHtml(data) {
    let resultSection = document.querySelector(".results");
    resultSection.replaceChildren();

    console.log("Beginning of update html.", data);
    if (data.totalResults == 0) {
        //No results.
    }
    data.Search.forEach(result => {
        let resultElement = document.createElement("details");
        resultElement.innerHTML = `
            <summary>
                ${result.Poster == "N/A" ? "" : "<img src=" + result.Poster + ">"}
                <h2>${result.Title}</h2>
            </summary>`;
        resultSection.appendChild(resultElement);

        resultElement.addEventListener("toggle", async () => {
            if (resultElement.open && !resultElement.querySelector('p')) {
                // Details is opened and <p> with info is not existing.
                let filmInfoElement = document.createElement('p');
                filmInfoElement.innerText = "Loading film info.";
                resultElement.appendChild(filmInfoElement);

                // Fetch details.
                async function getDetails() {
                    let response = await fetch("http://www.omdbapi.com/?i=" + result.imdbID + "&apikey=" + await apiKey)
                    let data = await response.json();
                    return data;
                }
                let details = await getDetails();

                // Display details.
                let html = "<table>";
                for (const key in details) {
                    if (key == "Ratings") {
                        html += "<tr><th>" + key + "</th><td><table>";
                        for (let rating of details[key]) {
                            html += "<tr><th>" + rating.Source + "</th><td>" + rating.Value + "</td></tr>";
                        }
                        if (details[key].length == 0) {
                            html += "No ratings.";
                        }
                        html += "</table></td></tr>";
                    } else if (key == "Poster") {
                        if (details[key] == "N/A") {
                            html += "<tr><th>" + key + "</th><td> No poster.</td></tr>";
                        } else {
                            html += "<tr><th>" + key + "</th><td><img src='" + details[key] + "' alt='Film poster.'></td></tr>";
                        }
                    } else if (key == "Response") {
                        // Ignore key Response.
                    } else {
                        html += "<tr><th>" + key + "</th><td>" + details[key] + "</td></tr>";
                    }
                }
                html += "</table>";

                filmInfoElement.innerHTML = html;
                console.log(details, typeof details);

                filmInfoElement.insertAdjacentHTML('beforeend', "<button> 💗 Favorite </button>");
                resultElement.querySelector('button').addEventListener('click', function () {
                    favorites.push(details);
                    localStorage.setItem("favorites", JSON.stringify(favorites));

                    let favoriteElement = resultElement.cloneNode(true);
                    favoriteElement.open = null;
                    document.querySelector('.fav-list').appendChild(favoriteElement);

                    let btn = favoriteElement.querySelector('button');
                    btn.innerText = 'Remove favorite';
                    btn.addEventListener("click", () => {
                        favorites.splice(favorites.indexOf(details), 1);
                        localStorage.setItem("favorites", JSON.stringify(favorites));

                        document.querySelector('.fav-list').removeChild(favoriteElement);
                    });
                });
            }
        });
    });

    
    resultSection.insertAdjacentHTML('beforeend', `<p> Showing ${ data.Search.length } search results.`);
}

search(); // Load first 10 films from prefilled search.



let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

favorites.forEach(favorite => {
    let favoriteElement = document.createElement("details");
    favoriteElement.innerHTML = `
        <summary>
            ${favorite.Poster == "N/A" ? "" : "<img src=" + favorite.Poster + ">"}
            <h2>${favorite.Title}</h2>
        </summary>`;
    document.querySelector('.fav-list').appendChild(favoriteElement);

    let filmInfoElement = document.createElement('p');
    favoriteElement.appendChild(filmInfoElement);

    let details = favorite;

    // Display details.
    let html = "<table>";
    for (const key in details) {
        if (key == "Ratings") {
            html += "<tr><th>" + key + "</th><td><table>";
            for (let rating of details[key]) {
                html += "<tr><th>" + rating.Source + "</th><td>" + rating.Value + "</td></tr>";
            }
            if (details[key].length == 0) {
                html += "No ratings.";
            }
            html += "</table></td></tr>";
        } else if (key == "Poster") {
            if (details[key] == "N/A") {
                html += "<tr><th>" + key + "</th><td> No poster.</td></tr>";
            } else {
                html += "<tr><th>" + key + "</th><td><img src='" + details[key] + "' alt='Film poster.'></td></tr>";
            }
        } else if (key == "Response") {
            // Ignore key Response.
        } else {
            html += "<tr><th>" + key + "</th><td>" + details[key] + "</td></tr>";
        }
    }
    html += "</table>";

    filmInfoElement.innerHTML = html;

    filmInfoElement.insertAdjacentHTML('beforeend', "<button> Remove favorite </button>");
    let btn = filmInfoElement.querySelector('button');
    btn.addEventListener("click", () => {
        favorites.splice(favorites.indexOf(details), 1);
        localStorage.setItem("favorites", JSON.stringify(favorites));

        document.querySelector('.fav-list').removeChild( filmInfoElement.closest("details") );
    });
});
