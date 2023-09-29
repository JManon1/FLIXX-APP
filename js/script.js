const path = {
    currentPage: window.location.pathname,
    search: {
        term: '',
        type: '',
        page: 1,
        totalPages: 1,
        totalResults: 0
    },
    api: {
        apiKey: '1bf46b590cd922c5d02e34071fd36310',
        apiUrl: 'https://api.themoviedb.org/3/'
    }
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

// Display 20 most popular tv shows
async function displayPopularTVShows() {
    const {results} = await fetchAPIData('tv/popular');

    results.forEach(show => {
        const div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML = `
            <a href="tv-details.html?id=${show.id}">
            ${
                show.poster_path? 
                `<img
                src="https://image.tmdb.org/t/p/w500${show.poster_path}"
                class="card-img-top"
                alt="${show.name}"
                />` 
                    : `<img
                src="../images/no-image.jpg"
                class="card-img-top"
                alt=${show.name}
                />`
            }
            </a>
            <div class="card-body">
                <h5 class="card-title">${show.name}</h5>
                <p class="card-text">
                <small class="text-muted">Aired: ${show.first_air_date}</small>
                </p>
            </div>
        `;

        document.querySelector('#popular-shows').appendChild(div);
    });
}

// Display Movie Details
async function displayMovieDetails() {
    const movieId = window.location.search.includes('=') === false?
        window.location.search.split('?')[1]:
        window.location.search.split('=')[1];

    const movie = await fetchAPIData(`movie/${movieId}`);

    // Overlay for background image
    displayBackgroundImage('movie', movie.backdrop_path);

    const div = document.createElement('div');
    
    div.innerHTML = `
        <div class="details-top">
          <div>
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
          </div>
          <div>
            <h2>${movie.title}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${movie.vote_average.toFixed(1)} / 10
            </p>
            <p class="text-muted">Release Date: ${movie.release_date}</p>
            <p>
              ${movie.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
              ${
                movie.genres.map((genre) => `<li>${genre.name}
                </li>`).join('')
              }
            </ul>
            <a href="#" target="_blank" class="btn">Visit Movie Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Movie Info</h2>
          <ul>
            <li><span class="text-secondary">Budget:</span> $${addCommasToNumber(movie.budget)}</li>
            <li><span class="text-secondary">Revenue:</span> $${addCommasToNumber(movie.revenue)}</li>
            <li><span class="text-secondary">Runtime:</span> ${movie.runtime} minutes</li>
            <li><span class="text-secondary">Status:</span> ${movie.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">
              ${movie.production_companies.map((company) => 
                `<span>${company.name}`).join(', ')}
          </div>
        </div>`;

        document.querySelector('#movie-details').appendChild(div);
}

// Display Movie Details
async function displayShowDetails() {
    const showId = window.location.search.split('=')[1];

    const show = await fetchAPIData(`tv/${showId}`);

    // Overlay for background image
    displayBackgroundImage('show', show.backdrop_path);

    const div = document.createElement('div');
    div.innerHTML = `
        <div class="details-top">
          <div>
          ${
            show.poster_path? 
            `<img
            src="https://image.tmdb.org/t/p/w500${show.poster_path}"
            class="card-img-top"
            alt="${show.name}"
            />` 
                : `<img
            src="../images/no-image.jpg"
            class="card-img-top"
            alt=${show.name}
            />`
          }
          </div>
          <div>
            <h2>${show.name}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${show.vote_average.toFixed(1)} / 10
            </p>
            <p class="text-muted">Release Date: ${show.first_air_date}</p>
            <p>
              ${show.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
              ${
                show.genres.map((genre) => `<li>${genre.name}
                </li>`).join('')
              }
            </ul>
            <a href="#" target="_blank" class="btn">Visit Movie Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Movie Info</h2>
          <ul>
            <li><span class="text-secondary">Number Of Episodes:</span> ${show.number_of_episodes}</li>
            <li>
                <span class="text-secondary">Last Episode To Air:</span> ${show.last_air_date}
            </li>
            <li><span class="text-secondary">Status:</span> ${show.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">
              ${show.production_companies.map((company) => 
                `<span>${company.name}`).join(', ')}
          </div>
        </div>`;

        document.querySelector('#show-details').appendChild(div);
}

// Set the backdrop
function displayBackgroundImage(type, backgroundPath) {
    const sec = document.querySelector('section');

    const overLayDiv = document.createElement('div');
    overLayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backgroundPath})`;
    overLayDiv.style.backgroundSize = 'cover';
    overLayDiv.style.backgroundPosition = 'center';
    overLayDiv.style.backgroundRepeat = 'no-repeat';
    overLayDiv.style.height = '100vh';
    overLayDiv.style.width = '100vw';
    overLayDiv.style.position = 'absolute';
    overLayDiv.style.top = '0';
    overLayDiv.style.left = '0';
    overLayDiv.style.zIndex = '-1';
    overLayDiv.style.opacity = '0.1';

    sec.appendChild(overLayDiv);


}

// Search Movies/Shows
async function search() {
    let isMovie = document.querySelector('#movie')
        .getAttribute('checked') === true? true : false;
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    path.search.type = urlParams.get('type');
    path.search.term = urlParams.get('search-term');

    if (path.search.term !== '' && path.search.term !== null) {
        const { results, total_pages, page, total_results} = await searchAPIData();
        
        path.search.page = page;
        path.search.totalPages = total_pages;
        path.search.totalResults = total_results;
        if (results.length === 0) {
            showAlert('No results found');
            return;
        }
        
        displaySearchResults(results);

        document.querySelector('#search-term').value = '';
    } 
    else {
        showAlert('Please enter a movie/show to search');
    }
     
}

function displaySearchResults(results) {
    // Clear previous results
    document.querySelector('#search-results').innerHTML = '';
    document.querySelector('#search-results-heading').innerHTML = '';
    document.querySelector('#pagination').innerHTML = '';
    

    results.forEach(result => {
        const div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML = `
            <a href="${path.search.type}-details.html?${result.id}">
            ${
                result.poster_path? 
                `<img
                src="https://image.tmdb.org/t/p/w500${result.poster_path}"
                class="card-img-top"
                alt="${path.search.type === 'movie'?result.title:result.name}"
                />` 
                    : `<img
                src="../images/no-image.jpg"
                class="card-img-top"
                alt=${path.search.type === 'movie'?result.title:result.name}
                />`
            }
            </a>
            <div class="card-body">
                <h5 class="card-title">${path.search.type === 'movie'?result.title:result.name}</h5>
                <p class="card-text">
                    <small class="text-muted">Release: ${path.search.type === 'movie'?result.release_date:result.first_air_date}</small>
                </p>
            </div>
        `;

        document.querySelector('#search-results-heading').innerHTML = `
            <h2>${results.length} of ${path.search.totalResults}
            Results for ${path.search.term}</h2>`
        document.querySelector('#search-results').appendChild(div);
        

    });
    displayPagination();
}

// Create & Display Pagination For Search
function displayPagination() {
    const div = document.createElement('div');
    div.classList.add('pagination');
    div.innerHTML = `
        <button class="btn btn-primary" id="prev">Prev</button>
        <button class="btn btn-primary" id="next">Next</button>
        <div class="page-counter">Page ${path.search.page} of ${path.search.totalPages}</div>`;

    document.querySelector('#pagination').appendChild(div);

    // Disable prev button if on first page
    if (path.search.page === 1) {
        document.querySelector('#prev').disabled = true;
    }

    // Disable next button if on last page
    if (path.search.page === path.search.totalPages) {
        document.querySelector('#next').disabled = true;
    }

    // Next page
    document.querySelector('#next').addEventListener('click', async () => {
        path.search.page++;
        const { results, total_pages } = await searchAPIData();
        displaySearchResults(results);
    });

    // Prev page
    document.querySelector('#prev').addEventListener('click', async () => {
        path.search.page--;
        const { results, total_pages } = await searchAPIData();
        displaySearchResults(results);
    });
}
// Display Slider Movies
async function displaySlider() {
    const {results} = await fetchAPIData('movie/now_playing');
    
    results.forEach((result) => {
        const div = document.createElement('div');

        div.classList.add('swiper-slide');
        div.innerHTML = `
            <a href="movie-details.html?id=${result.id}">
            ${
                result.poster_path? 
                `<img
                src="https://image.tmdb.org/t/p/w500${result.poster_path}"
                class="card-img-top"
                alt="${result.title}"
                />` 
                    : `<img
                src="../images/no-image.jpg"
                class="card-img-top"
                alt=${result.title}
                />`
            }
            </a>
            <h4 class="swiper-rating">
                <i class="fas fa-star text-secondary"></i> ${result.vote_average.toFixed(1)}/ 10
            </h4>
            `;
        document.querySelector('.swiper-wrapper').appendChild(div);

        initSwiper();
    });

}

function initSwiper() {
    const swiper = new Swiper('.swiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        freeMode: true,
        loop: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: true
        },
        breakpoints: {
            500: {
                slidesPerView: 2
            },
            700: {
                slidesPerView: 3
            },
            1200: {
                slidesPerView: 4
            }
        }
    });
}

// Fetch data from TMDB API
async function fetchAPIData(endpoint) {
    ToggleSpinner();
    const response = await fetch(`${path.api.apiUrl}${endpoint}?api_key=${path.api.apiKey}&language=en-us`);

    const data = await response.json();
    ToggleSpinner();

    return data;
}

// Make Request To Search 
async function searchAPIData() {
    ToggleSpinner();
    const response = await fetch(`${path.api.apiUrl}search/${path.search.type}?api_key=${path.api.apiKey}&language=en-us&query=${path.search.term}&page=${path.search.page}`);

    const data = await response.json();
    ToggleSpinner();

    return data;
}

function ToggleSpinner() {
    const spinner = document.querySelector('.spinner');
    spinner.classList.toggle('show');
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

// Show Alert 
function showAlert(message, className = 'error') {
    const alertEl = document.createElement('div');
    alertEl.classList.add('alert', className);
    alertEl.appendChild(document.createTextNode(message));
    document.querySelector('#alert').appendChild(alertEl);

    setTimeout(() => alertEl.remove, 3000);
}

function addCommasToNumber(num) {
    var str = num.toLocaleString().split(".");
    str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return str;
}
// Init App
function init() {
    highlightActiveLink();
    switch(path.currentPage) {
        case '/':
        case '/index.html':
            displaySlider();
            displayPopularMovies();
            break;
        case '/shows.html':
            displayPopularTVShows();
            break;
        case '/movie-details.html':
            displayMovieDetails();
            break;
        case '/tv-details.html':
            displayShowDetails();
            break;
        case '/search.html':
            search();
            break;
    }
}

document.addEventListener('DOMContentLoaded', init);