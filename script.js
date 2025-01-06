document.querySelector("#search > form").addEventListener("submit", (event) => { event.preventDefault(); search() })

async function search() {
    let search = document.querySelector("#search input").value;
    if (search.trim() == "") {
        // Don't allow empty search. Do nothing and let old results stay on page.
        return;
    }
    let data = await searchApi(search);
    if (data.Response == "True") {
        updateHtml(data);
    }
}

async function getApiKey(location) {
    try {
        // let response = await fetch(location);
        let [response] = await Promise.all([fetch(location)]); // Use Promise.all because of customer requirement to use Promise.all. Can be removed once need for Promise.all is found elsewhere.
            
        if (!response.ok) {
            throw new Error("Could not load api-keys.json. See readme.md for setup instructions.")
        }
        let key;
        try {
            key = await response.json();
        } catch (error) {
            throw new Error("Could not parse api-keys.json as json. See readme for setup inctructions and api-keys.json.example for correct json form.");
        }
        return key;
    } catch (error) {
        console.log(error);
        document.body.replaceChildren(error);
    }
}
const apiKey = getApiKey("api-keys.json");

async function searchApi(searchQuery) {
    try {
        let searchUrl = "http://www.omdbapi.com/?s=" + searchQuery + "&apikey=" + await apiKey;
        let response = await fetch(searchUrl);
        if (response.ok == false) {
            throw new Error("Search api did not respond ok. Check your internet connection and correct api key or try again later.");
        }
        let data = await response.json();
        if (data.Response !== "True") {
            throw new Error(data.Error);
        }
        return data;
    } catch (error) {
        if (error == "TypeError: Failed to fetch") {
            error = "Failed to connect to search check your internet connection.";
        }
        console.log(error);
        document.querySelector('.results').replaceChildren(error);
    }
}

async function updateHtml(data) {
    let resultSection = document.querySelector(".results");
    resultSection.replaceChildren();

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
                    try {
                        let response = await fetch("http://www.omdbapi.com/?i=" + result.imdbID + "&apikey=" + await apiKey)
                        let data = await response.json();
                        if (data.Response == "False") {
                            throw new Error();
                        }
                        return data;
                    } catch (error) {
                        console.log(error);
                        filmInfoElement.innerText = "Failed to load film details.";
                        return "error";
                    }
                }
                let details = await getDetails();
                if (details == "error") {
                    return;
                }
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

                filmInfoElement.insertAdjacentHTML('beforeend', "<button> 💗 Favorite </button>");
                resultElement.querySelector('button').addEventListener('click', function () {
                    // Check if already favorite
                    if (!favorites.every(favorite => favorite.imdbID != details.imdbID)) {
                        return;
                    }

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
