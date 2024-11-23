let peliculas = [];

/* Llama un evento al cargar la página y ejecuta un fetch */
document.addEventListener("DOMContentLoaded", () => {
    const pelisURL = "https://japceibal.github.io/japflix_api/movies-data.json"; /* link de la API de peliculas */

    /* fetch que llama los datos de la API */
    fetch(pelisURL)
    .then(response => response.json())
    .then(data => {
        peliculas = data;
        console.log('Películas cargadas:', peliculas); 
    })
    .catch(error => console.error('Error al cargar las películas:', error));
});

/* Variables de búsqueda */

const btnBuscar = document.getElementById("btnBuscar");
const inputBusqueda = document.getElementById("inputBuscar");
const contenedorPelis = document.getElementById("lista");

/* Evento al hacer click en el botón de Búsqueda */
btnBuscar.addEventListener("click", () => {
    contenedorPelis.innerHTML = '';

    const peliIngresada = inputBusqueda.value.toLowerCase();

    if (!peliIngresada) {
        return;
    }

    /* Verifica que las películas se hayan cargado correctamente */
    if (peliculas.length === 0) {
        console.error("Error al cargar las películas.");
        return;
    }

    /* Filtra las películas en base a lo buscado */
    const pelisResult = peliculas.filter(pelicula => {
        return pelicula.title.toLowerCase().includes(peliIngresada) ||
               pelicula.tagline.toLowerCase().includes(peliIngresada) ||
               pelicula.overview.toLowerCase().includes(peliIngresada) ||
               pelicula.genres.some(genero => genero.name.toLowerCase().includes(peliIngresada));
    });

    /* Crea los contenedores para cada película filtrada */
    pelisResult.forEach(pelicula => {
        contenedorPelis.appendChild(crearContenedorPelicula(pelicula));
    });
});

/* Crea un elemento por cada película cargada */
function crearContenedorPelicula(pelicula) {
    const li = document.createElement('li');
    li.className = 'list-group-item bg-dark item-pelicula';

    li.innerHTML = `
        <div class="d-flex justify-content-between align-items-center">
            <div class="d-flex flex-column">
                <span class="text-white">${pelicula.title}</span>
                <span class="text-secondary">${pelicula.tagline}</span>
            </div>
            <div class="text-white">
                ${califEstrellas(pelicula.vote_average)}
            </div>
        </div>
    `;

    li.addEventListener("click", () => { mostrarDetallesPelis(pelicula) });

    return li;
}

/* Crea calificación de 5 estrellas en cada película */
function califEstrellas(promedioDeVotacion) {
    const estrellas = Math.round(promedioDeVotacion / 2);
    let estrellasHtml = '';
    for (let i = 1; i <= 5; i++) {
        estrellasHtml += `<span class="fa fa-star ${i <= estrellas ? 'checked' : ''}"></span>`;
    }
    return estrellasHtml;
}

/* Despliega detalles de la película cargada */
function mostrarDetallesPelis(pelicula) {
    const movieOverview = document.getElementById("movieOverview");
    const movieTitle = document.getElementById("movieTitle");
    const movieGenres = document.getElementById("movieGenres");
    const movieYear = document.getElementById("movieYear");
    const movieRuntime = document.getElementById("movieRuntime");
    const movieBudget = document.getElementById("movieBudget");
    const movieRevenue = document.getElementById("movieRevenue");

    if (!movieOverview || !movieTitle || !movieGenres || !movieYear || !movieRuntime || !movieBudget || !movieRevenue) {
        console.error("Faltan elementos en el DOM necesarios para mostrar los detalles de la película.");
        return;
    }

    movieOverview.innerText = pelicula.overview;
    movieTitle.innerText = pelicula.title;
    movieYear.innerText = pelicula.release_date ? pelicula.release_date.split('-')[0] : 'Desconocido';
    movieRuntime.innerText = pelicula.runtime ? `${pelicula.runtime} mins` : 'Desconocido';
    movieBudget.innerText = pelicula.budget ? `$${pelicula.budget}` : 'Desconocido';
    movieRevenue.innerText = pelicula.revenue ? `$${pelicula.revenue}` : 'Desconocido';

    movieGenres.innerHTML = '';
    if (pelicula.genres && pelicula.genres.length > 0) {
        pelicula.genres.forEach(genre => {
            const listItem = document.createElement('li');
            listItem.textContent = genre.name;
            movieGenres.appendChild(listItem);
        });
    } else {
        movieGenres.innerHTML = '<li>No disponible</li>';
    }

    const detallePelicula = document.getElementById('offcanvas-detalle-pelicula');
    if (detallePelicula) {
        const offcanvas = new bootstrap.Offcanvas(detallePelicula);
        offcanvas.show();
    }
}
  