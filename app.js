"use strict";
const apiKey = "95ed1656";
const urlBase = `http://www.omdbapi.com/?apikey=${apiKey}`;
const searchField = document.getElementById('search-field');
let moviesData = [];

async function getRandomMovies() {
  const randomMovies = [];

  while (randomMovies.length < 15) {
    const randomPage = Math.floor(Math.random() * 100) + 1;
    const url = `${urlBase}&s=movie&page=${randomPage}`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      if (data.Response === "True") {
        const movies = data.Search;

        movies.forEach(movie => {
          if (randomMovies.length < 15 && !randomMovies.find(m => m.imdbID === movie.imdbID)) {
            randomMovies.push(movie);
          }
        });
      }
    } catch (error) {
      console.error('Ошибка при получении данных:', error);
    }
  }

  await Promise.all(randomMovies.map(movie => fetchMovieDetails(movie)));

  moviesData = randomMovies;
  displayCards();
}

async function fetchMovieDetails(movie) {
  const url = `${urlBase}&i=${movie.imdbID}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    movie.imdbRating = data.imdbRating || "";
    movie.Plot = data.Plot || "Описание недоступно";
  } catch (error) {
    console.error('Ошибка при получении данных фильма:', error);
  }
}

function createCard(movie) {
  return `
    <div class="card" data-movie-name="${movie.Title}">
      <img src="${movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300"}" alt="${movie.Title}">
      <div class="movie-info">
        <p><strong>${movie.Title}</strong></p>
        <p>${movie.imdbRating}</p>
        </div>
        <p> ${movie.Plot}</p>
    </div>
  `;
}

function displayCards() {
  const moviesWrapper = document.getElementById('movies-wrapper');

  if (moviesData.length === 0) {
    moviesWrapper.innerHTML = "<p>No movies found.</p>";
    return;
  }

  const cards = moviesData.map(movie => createCard(movie)).join('');
  moviesWrapper.innerHTML = cards;

  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
      const movieName = card.getAttribute('data-movie-name');
      const movie = moviesData.find(m => m.Title === movieName);
      console.log(movie);
    });
  });
}

document.addEventListener('DOMContentLoaded', function () {
  searchField.focus();

  getRandomMovies();

  searchField.addEventListener('input', (event) => {
    const searchTerm = event.target.value;
    if (searchTerm) {
      getData(searchTerm);
    } else {
      getRandomMovies();
    }
  });
});
