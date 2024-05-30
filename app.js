// URL base de la API

const api_url = "https://swapi.dev/api/";

// Elementos del DOM

const content = document.getElementById("content");
const buttons = document.querySelectorAll("nav button");
const itemSelector = document.getElementById("item-selector");
const selectorContainer = document.getElementById("selector-container");

// Función para obtener los datos del API

async function fetchData(endpoint){
    try {
        const response = await fetch(api_url + endpoint);
        if(!response.ok){
            throw new Error("Network response was not ok")
        }
        const data = await response.json();
        console.log(`Fetched data from: ${endpoint}`, data);
        return data.results;

    }catch (error){
        console.error("Error fetching data: ", error);
        return [];
    }
}

// Card para personajes

function createCharacterCard(character){
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
    <h2>${character.name}</h2>
    <p>Altura: ${character.height} cm</p>
    <p>Peso: ${character.mass} kg</p>
    <p>Año de nacimiento: ${character.birth_year}</p>
    <p>Género: ${character.gender}</p>
    `;
    return card;
}

// Card para planetas

function createPlanetCard(planet){
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
    <h2>${planet.name}</h2>
    <p>Clima: ${planet.climate}</p>
    <p>Diámetro: ${planet.diameter}</p>
    <p>Periodo orbital: ${planet.orbital_period}</p>
    <p>Población: ${planet.population}</p>
    <p>Terreno: ${planet.terrain}</p>
    `;
    return card;
}

// Card para naves

function createStarshipCard(starship){
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
    <h2>${starship.name}</h2>
    <p>Pasajeros: ${starship.passengers} seres</p>
    <p>Tripulación: ${starship.crew} seres</p>
    <p>Cpacidad de carga: ${starship.cargo_capacity}</p>
    <p>Clase de la nave: ${starship.starship_class}</p>
    <p>Costo en créditos: ${starship.cost_in_credits}</p>
    <p>Longitud: ${starship.length}</p>
    <p>Modelo: ${starship.model}</p>
    <p>Clasificación de hipervelocidad: ${starship.hyperdrive_rating}</p>
    `;
    return card;
}

// Funcion para mostrar los datos

async function displayData(type){
    content.innerHTML = ""; // esto hace que la pagina se ponga "en blanco" cuando se cambia de boton
    itemSelector.style.display = "block";
    itemSelector.innerHTML = "<option value='' disabled selected>Seleccione un item</option>";

    const endpoint = type === "characters" ? "people" : type;
    console.log(`Fetching data from endpoint: ${endpoint}`);

    const data = await fetchData(endpoint);
    if (data.length === 0){
        itemSelector.innerHTML = "<option value='' disabled>No se encontraron datos</option>";
        return;
    }

    data.forEach(item =>{
        const option = document.createElement("option");
        option.value = item.url;
        option.textContent = item.name || item.title;
        itemSelector.appendChild(option);
    });

    itemSelector.onchange = async function(){
        const url = this.value;
        const response = await fetch(url);
        const item = await response.json();
        content.innerHTML = "";

        let card;

        if (type === "people"){
            card = createCharacterCard(item);
        }else if (type === "planets"){
            card = createPlanetCard(item);
        }else if (type === "starships"){
            card = createStarshipCard(item);
        }

        if (card){
            content.appendChild(card);
        }else {
            console.error("Error: card undefined");
        }
    }
}

// Agregar eventos a los botones

buttons.forEach(button =>{
    button.addEventListener("click", (event) =>{
        const type = event.target.id === "characters" ? "people" : event.target.id;
        displayData(type);
    })
})
