// My API key gotten from OMDBAPI
const API_KEY = "65b38e5";
const BASE_URL = "https://www.omdbapi.com/?apikey=" + API_KEY;

// Target variables for Search
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const sortSelect = document.getElementById("sort-select");

// Target Variables for the movie container
const movieContainer = document.getElementById("movie-container");

// Target Variables for the modal section
const modalOverlay = document.getElementById("modal-overlay");
const modalContent = document.getElementById("modal-content");
const closeModal = document.getElementById("close-modal");
const modalTitle = document.getElementById("modal-title");
const modalPoster = document.getElementById("modal-poster");
const modalPlot = document.getElementById("modal-plot");
const modalInfo = document.getElementById("modal-info");
const modalWriter = document.getElementById("modal-writer");
const modalDirector = document.getElementById("modal-director");
const modalActors = document.getElementById("modal-actors");
const modalBoxOffice = document.getElementById("modal-box-office");
const modalInternetMovieRating = document.getElementById("internet-movie-rating");
const modalRottenTomatoesRating = document.getElementById("rotten-tomatoes-rating");
const modalMetacriticRating = document.getElementById("metacritic-rating");

// Function to get the user input from the search box
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchTerm = searchInput.value.trim();
  if (searchTerm !== "") {
    searchMovies(searchTerm);
  }
});

// Function to fetch and display user input
function searchMovies(searchTerm) {
  const url = `${BASE_URL}&s=${encodeURIComponent(searchTerm)}`;

  // Clear previous results
  movieContainer.innerHTML = "";

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (data.Response === "True") {
        // sorts result based on choice
        const sortedResults = sortResults(data.Search);
        // display movie cards
        displayMovieCards(sortedResults);
      } else {
        movieContainer.innerHTML = `<p>No results found</p>`;
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// function to display movie card
function displayMovieCards(movies) {
  movieContainer.innerHTML = ""; // Clear previous results

  movies.forEach((movie, index) => {
    setTimeout(() => {
      const movieCard = createMovieCard(movie);
      movieCard.style.animation = "fadeIn 1s ease-in";
      movieContainer.appendChild(movieCard);
    }, 0 * index);
  });
}

function createMovieCard(movie) {
  const { Title, Poster, Year, imdbID } = movie;

  const movieCard = document.createElement("div");
  movieCard.classList.add("movie-card");
  
  const poster = Poster === "N/A" ? "no-poster.jpg" : Poster;
  const html = `
    <div></div>
    <div class="movie-details">
      <h5>${Title}</h5>
      <p>${Year}</p>
      <button onclick="openModal('${imdbID}')">View Details</button>
    </div>
  `;
  movieCard.innerHTML = html;
  movieCard.style.backgroundImage = `url(${poster})`;
  return movieCard;
}

function openModal(imdbID) {
  const url = `${BASE_URL}&i=${encodeURIComponent(imdbID)}&plot=full`;
  // const url = `http://www.omdbapi.com/?i=${encodeURIComponent(imdbID)}&plot=full`

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log(data)
      if (data.Response === "True") {
        modalTitle.textContent = data.Title;
        modalPoster.src = data.Poster === "N/A" ? "no-poster.jpg" : data.Poster;
        modalInfo.textContent = `${data.Rated} ${data.Year} ${data.Genre}`;
        modalPlot.textContent = `${data.Plot}`;
        modalWriter.innerHTML = `<span style="font-weight: bold;">Written by:</span>${data.Writer}`;
        modalDirector.innerHTML = `<span style="font-weight: bold;">Directed by:</span> ${data.Director}`;
        modalActors.innerHTML = `<span style="font-weight: bold;">Starring:</span> ${data.Actors}`;
        if (data.BoxOffice !== undefined) {
          modalBoxOffice.innerHTML = `<span style="font-weight: bold;">Box Office:</span> ${data.BoxOffice}`;
        }
        
        if (data.Ratings.length === 3) {
          modalInternetMovieRating.textContent = `${data.Ratings[0].Source} ${data.Ratings[0].Value}`
          modalRottenTomatoesRating.textContent = `${data.Ratings[1].Source} ${data.Ratings[1].Value}`
          modalMetacriticRating.textContent = `${data.Ratings[2].Source} ${data.Ratings[2].Value}`
        } else if (data.Ratings.length === 2) {
          modalInternetMovieRating.textContent = `${data.Ratings[0].Source} ${data.Ratings[0].Value}`
          modalRottenTomatoesRating.textContent = `${data.Ratings[1].Source} ${data.Ratings[1].Value}`
        } else {
          modalInternetMovieRating.textContent = `${data.Ratings[0].Source} ${data.Ratings[0].Value}`
        }
        document.body.style.overflow = "hidden";
        modalOverlay.classList.remove("hide");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });

    

  // modalOverlay.classList.remove("hide");
}

closeModal.addEventListener("click", () => {
  modalOverlay.classList.add("hide");
  document.body.style.overflow = "auto";
});

sortSelect.addEventListener("change", () => {
  const searchTerm = searchInput.value.trim();
  if (searchTerm !== "") {
    searchMovies(searchTerm);
  }
});

function sortResults(results) {
  const sortBy = sortSelect.value;

  return results.sort((a, b) => {
    if (sortBy === "title") {
      return a.Title.localeCompare(b.Title);
    } else if (sortBy === "year") {
      return parseInt(a.Year) - parseInt(b.Year);
    } else if (sortBy === "rating") {
      const aRating = parseFloat(a.Rating);
      const bRating = parseFloat(b.Rating);
      return bRating - aRating;
    }
  });
}