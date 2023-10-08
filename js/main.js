const searchBtn = document.getElementById("btnBuscar");
const searchInp = document.getElementById("inputBuscar");
let originalMovies = [];
let filteredMovies = [];

document.addEventListener("DOMContentLoaded", async () => {
  originalMovies = await fetchMovies();
  filteredMovies = [...originalMovies];
  searchBtn.addEventListener("click", () => filterMovies());
  document.getElementById("changeTheme").addEventListener("click", () => changeTheme())
});

async function fetchMovies() {
  const response = await fetch(
    "https://japceibal.github.io/japflix_api/movies-data.json"
  );
  if (!response.ok) throw new Error("Error to fetch movies");
  const jsonResponse = await response.json();
  return jsonResponse;
}

function filterMovies() {
  const searchTerm = searchInp.value.trim().toLowerCase();
  if (!searchTerm) {
    filteredMovies = [...originalMovies];
  }

  filteredMovies = originalMovies.filter((movie) => {
    return (
      movie.title.toLowerCase().includes(searchTerm) ||
      movie.genres.some((genre) =>
        genre.name.toLowerCase().includes(searchTerm)
      ) ||
      movie.tagline.toLowerCase().includes(searchTerm) ||
      movie.overview.toLowerCase().includes(searchTerm)
    );
  });

  showMovies();
}

function showMovies() {
  const movieList = document.getElementById("lista");
  movieList.innerHTML = "";

  filteredMovies.forEach((movie) => {
    movieList.innerHTML += `
    <a 
      class="list-group-item list-group-item-action"
      href="#"
      data-bs-toggle="offcanvas"
      data-bs-target="#offcanvasTop"
      aria-controls="offcanvasTop"
      id="${movie.id}"
    >
      <p class="float-end">${showRating(movie.vote_average)}</p>
      <h5>${movie.title}</h5>
      <p class="text-body-tertiary">${movie.tagline}</p>
    </a>
    <div class="offcanvas offcanvas-top" tabindex="-1" id="offcanvasTop" aria-labelledby="offcanvasTopLabel">
      <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="offcanvasTopLabel">${movie.title}</h5>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body">
        <p class="text-body-secondary">${movie.overview}</p>
      </div>
      <hr />
      <div class="offcanvas-footer">
        <div class="dropdown float-end me-3">
          <a href="#" class="btn btn-secondary dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            More
          </a>
          <ul class="dropdown-menu">
            <li><a href="#" class="dropdown-item">Year: ${movie.release_date.split("-")[0]}</a></li>
            <li><a href="#" class="dropdown-item">Runtime: ${movie.runtime} mins</a></li>
            <li><a href="#" class="dropdown-item">Budget: $${movie.budget}</a></li>
            <li><a href="#" class="dropdown-item">Revenue: $${movie.revenue}</a></li>
          </ul>
        </div>
        <p class="ms-3">${movie.genres.map(genre => genre.name).join(" - ")}</p>
      </div>
    </div>
  `;
  });
}

function showRating(rating) {
  rating = Math.round((rating / 10) * 5);
  ratingHtml = "";

  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      ratingHtml += "<i class='fa fa-star checked'></i>";
    } else {
      ratingHtml += "<i class='fa fa-star'></i>";
    }
  }

  return ratingHtml;
}

function changeTheme() {
  if (document.querySelector("html").getAttribute("data-bs-theme") === "light") {
    document.querySelector("html").setAttribute("data-bs-theme", "dark");
    document.querySelector("#changeTheme").firstChild.setAttribute("class", "fa-solid fa-sun fa-2xl")
  } else if (document.querySelector("html").getAttribute("data-bs-theme") === "dark") {
    document.querySelector("html").setAttribute("data-bs-theme", "light");
    document.querySelector("#changeTheme").firstChild.setAttribute("class", "fa-solid fa-moon fa-2xl")
  }
}