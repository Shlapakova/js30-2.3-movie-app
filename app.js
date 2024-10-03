"use strict";

const accessKey = "deAeNgQRbrdW_4C1n9uhO6_6bBwtES9YbsxIOL0uRPI";

const searchField = document.getElementById('search-field');
const searchIcon = document.querySelector('.search-icon');
const moviesWrapper = document.getElementById('movies-wrapper');

searchField.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        performSearch();
    }
});

searchIcon.addEventListener('click', function(event) {
    event.preventDefault();
    performSearch();
});

function performSearch() {
    const query = searchField.value.trim();
    if (query === '') {
        alert('Введите запрос для поиска.');
        return;
    }
    searchPhotos(query);
}

async function searchPhotos(query) {
    moviesWrapper.innerHTML = '<p>Загрузка...</p>';

    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=30&orientation=landscape&client_id=${accessKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        displayPhotos(data.results);
    } catch (error) {
        console.error(error);
        moviesWrapper.innerHTML = `<p>Произошла ошибка.</p>`;
    }
}

function displayPhotos(photos) {
    if (photos.length === 0) {
        moviesWrapper.innerHTML = '<p>Не найдено</p>';
        return;
    }

    moviesWrapper.innerHTML = '';

    photos.forEach(photo => {
        const img = document.createElement('img');
        img.src = photo.urls.small;
        img.alt = photo.alt_description || 'Unsplash Photo';
        img.title = photo.alt_description || 'Unsplash Photo';
        img.classList.add('gallery-image');
        moviesWrapper.appendChild(img);
    });
}

async function getRandomPhotos() {
    moviesWrapper.innerHTML = '<p>Загрузка...</p>';

    const url = `https://api.unsplash.com/photos/random?count=15&orientation=landscape&client_id=${accessKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
        }

        const photos = await response.json();
        displayPhotos(photos);
    } catch (error) {
        console.error(error);
        moviesWrapper.innerHTML = `<p>Произошла ошибка.</p>`;
    }
}

function toggleClearButton() {
  if (searchField.value.trim() !== '') {
      clearButton.classList.add('show');
      clearButton.classList.remove('hide');
  } else {
      clearButton.classList.add('hide');
      clearButton.classList.remove('show');
  }
}
document.addEventListener('DOMContentLoaded', function () {
    searchField.focus();
    getRandomPhotos();
});
