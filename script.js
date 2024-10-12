const apiKey = 'YOUR API KEY'; // Reemplaza con tu clave API
const apiUrl = 'https://api.themoviedb.org/3';
const movieList = document.getElementById('movies');
const movieDetails = document.getElementById('movie-details');
const detailsContainer = document.getElementById('details');
const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');
const favoritesList = document.getElementById('favorites-list');
const addToFavoritesButton = document.getElementById('add-to-favorites');
let selectedMovieId = null;
let favoriteMovies = JSON.parse(localStorage.getItem('favorites')) || [];

// Fetch and display popular movies
async function fetchPopularMovies() {
    try {
        const response = await fetch('https://api.themoviedb.org/3/movie/popular?api_key=5708bdad8cdc6ad7c4ac5be809a47d32&language=en-US&page=1');
        if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.status);
        }
        const data = await response.json();
        displayMovies(data.results);  
    } catch (err) {
        console.error('Error:', err);
    }
}

// Display movies
function displayMovies(movies) {
    const movieList = document.getElementById('movies');  
    movieList.innerHTML = '';  
    movies.forEach(movie => {
        const li = document.createElement('li');
        li.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <span>${movie.title}</span>
        `;
        li.onclick = () => showMovieDetails(movie.id);  
        movieList.appendChild(li);  
    }
    );
}

// Show movie details
async function showMovieDetails(movieId) {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=5708bdad8cdc6ad7c4ac5be809a47d32&language=en-US`);
        if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.status);
        }
        const data = await response.json();
        // Muestra los detalles de la película
        const detailsContainer = document.getElementById('movie-details');
        const detailsDiv = document.getElementById('details');
        detailsDiv.innerHTML = `
            <h2>${data.title}</h2>
            <img src="https://image.tmdb.org/t/p/w500${data.poster_path}" alt="${data.title}">
            <p><strong>Sinopsis:</strong> ${data.overview}</p>
            <p><strong>Fecha de lanzamiento:</strong> ${data.release_date}</p>
            <p><strong>Calificación:</strong> ${data.vote_average}</p>
        `;

        selectedMovieId = movieId;
        // Remover la clase hidden para mostrar los detalles
        detailsContainer.classList.remove('hidden');
    } catch (err) {
        console.error('Error:', err);
    }
}

// Search movies
searchButton.addEventListener('click', async () => {
    const query = searchInput.value;
    if (query) {
        try {
            const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=5708bdad8cdc6ad7c4ac5be809a47d32&include_adult=false&language=en-US&page=1&query=${encodeURIComponent(query)}`);
            if (!response.ok) {
                throw new Error('Error en la solicitud de búsqueda: ' + response.status);
            }
            const data = await response.json();
            displayMovies(data.results);
        } catch (error) {
            console.error('Error searching movies:', error);
        }
    }
});

// Add movie to favorites
// Agregar película a favoritos
addToFavoritesButton.addEventListener('click', () => {
    if (selectedMovieId) {
        const favoriteMovie = {
            id: selectedMovieId,
            title: document.querySelector('#movie-details h2').textContent 
        };
        if (!favoriteMovies.some(movie => movie.id === selectedMovieId)) {
            favoriteMovies.push(favoriteMovie);
            localStorage.setItem('favorites', JSON.stringify(favoriteMovies)); 
            console.log('Película agregada a favoritos:', favoriteMovie);
            displayFavorites(); 
        } else {
            console.log('La película ya está en favoritos:', favoriteMovie);
        }
    }
});

// Mostrar películas favoritas
function displayFavorites() {
    const favoritesList = document.getElementById('favorites-list'); 
    favoritesList.innerHTML = ''; 
    favoriteMovies.forEach(movie => {
        const li = document.createElement('li');
        li.textContent = movie.title;
        favoritesList.appendChild(li);
    });
}

// Initial fetch of popular movies and display favorites
fetchPopularMovies(); // Obtiene y muestra las películas populares
displayFavorites(); // Muestra las películas favoritas guardadas
