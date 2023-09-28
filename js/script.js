const path = {
    currentPage: window.location.pathname
}

async function displayPopularMovies() {
    const {results} = await fetchAPIData('movie/popular');
    
    results.forEach(movie => {
        const div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML = `
            <a href="movie-details.html?${movie.id}">
            ${
                movie.poster_path? 
                `<img
                src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
                class="card-img-top"
                alt="${movie.title}"
                />` 
                    : `<img
                src="../images/no-image.jpg"
                class="card-img-top"
                alt=${movie.title}
                />`
            }
            </a>
            <div class="card-body">
                <h5 class="card-title">${movie.title}</h5>
                <p class="card-text">
                    <small class="text-muted">Release: ${movie.release_date}</small>
                </p>
            </div>
        `;
        document.querySelector('#popular-movies').appendChild(div);

    });
}

async function displayTVShows() {
    const {results} = await fetchAPIData('movie/popular');
}

// Fetch data from TMDB API
async function fetchAPIData(endpoint) {
    const API_KEY = '1bf46b590cd922c5d02e34071fd36310';
    const API_URL = 'https://api.themoviedb.org/3/';

    const response = await fetch(`${API_URL}${endpoint}?api_key=${API_KEY}&language=en-us`);

    const data = await response.json();

    return data;
}

function ToggleSpinner() {
    const spinner = document.querySelector('spinner');
    spinner.classList.add('show');
}

// Highlight active link
function highlightActiveLink() {
    const links = document.querySelectorAll('.nav-link');
    
    links.forEach((link) => {
        if (link.getAttribute('href') === path.currentPage) {
            link.classList.add('active');
        }
    })
}
// Init App
function init() {
    highlightActiveLink();
    switch(path.currentPage) {
        case '/':
        case '/index.html':
            displayPopularMovies();
            break;
        case '/shows.html':
            console.log('Shows');
            break;
        case '/movie-details.html':
            console.log('Movie Details');
            break;
        case '/tv-details.html':
            console.log('TV Details');
            break;
        case '/search.html':
            console.log('Search');
            break;
    }
}

document.addEventListener('DOMContentLoaded', init);