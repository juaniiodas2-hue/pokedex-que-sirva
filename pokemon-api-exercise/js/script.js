// Buscador Pokemon - Consumo de PokeAPI
// Autor: Juan Esteban Hernandez Hurtado

const URL_BASE = 'https://pokeapi.co/api/v2/pokemon/';
const ID_MAXIMO = 1025;

const inputPokemon = document.getElementById('inputPokemon');
const btnBuscar = document.getElementById('btnBuscar');
const btnAleatorio = document.getElementById('btnAleatorio');
const mensaje = document.getElementById('mensaje');
const tarjeta = document.getElementById('tarjetaPokemon');

const pokemonNombre = document.getElementById('pokemonNombre');
const pokemonId = document.getElementById('pokemonId');
const pokemonImagen = document.getElementById('pokemonImagen');
const pokemonTipos = document.getElementById('pokemonTipos');
const pokemonAltura = document.getElementById('pokemonAltura');
const pokemonPeso = document.getElementById('pokemonPeso');
const pokemonExperiencia = document.getElementById('pokemonExperiencia');
const pokemonHabilidades = document.getElementById('pokemonHabilidades');
const pokemonStats = document.getElementById('pokemonStats');

btnBuscar.addEventListener('click', () => {
    const termino = inputPokemon.value.trim().toLowerCase();
    if (termino === '') {
        mostrarMensaje('Escribe un nombre o numero de pokemon.');
        return;
    }
    buscarPokemon(termino);
});

btnAleatorio.addEventListener('click', () => {
    const idAleatorio = Math.floor(Math.random() * ID_MAXIMO) + 1;
    buscarPokemon(idAleatorio);
});

inputPokemon.addEventListener('keydown', (evento) => {
    if (evento.key === 'Enter') {
        btnBuscar.click();
    }
});

async function buscarPokemon(termino) {
    ocultarTarjeta();
    mostrarMensaje('Buscando...');

    try {
        const respuesta = await fetch(URL_BASE + termino);

        if (!respuesta.ok) {
            throw new Error('No se encontro ese pokemon');
        }

        const datos = await respuesta.json();
        pintarPokemon(datos);
        limpiarMensaje();
    } catch (error) {
        mostrarMensaje('No se encontro ese pokemon. Verifica el nombre o numero.');
    }
}

function pintarPokemon(datos) {
    pokemonNombre.textContent = datos.name;
    pokemonId.textContent = '#' + String(datos.id).padStart(3, '0');

    const sprite = datos.sprites.other['official-artwork'].front_default || datos.sprites.front_default;
    pokemonImagen.src = sprite;
    pokemonImagen.alt = datos.name;

    pokemonTipos.innerHTML = '';
    datos.types.forEach((tipoInfo) => {
        const badge = document.createElement('span');
        badge.className = 'tipo';
        badge.textContent = tipoInfo.type.name;
        pokemonTipos.appendChild(badge);
    });

    pokemonAltura.textContent = (datos.height / 10) + ' m';
    pokemonPeso.textContent = (datos.weight / 10) + ' kg';
    pokemonExperiencia.textContent = datos.base_experience;

    pokemonHabilidades.innerHTML = '';
    datos.abilities.forEach((habilidadInfo) => {
        const item = document.createElement('li');
        item.textContent = habilidadInfo.ability.name;
        pokemonHabilidades.appendChild(item);
    });

    pokemonStats.innerHTML = '';
    datos.stats.forEach((statInfo) => {
        const valor = statInfo.base_stat;
        const porcentaje = Math.min((valor / 200) * 100, 100);

        const fila = document.createElement('div');
        fila.className = 'stat-fila';

        const nombre = document.createElement('span');
        nombre.className = 'stat-nombre';
        nombre.textContent = statInfo.stat.name;

        const barraFondo = document.createElement('div');
        barraFondo.className = 'stat-barra-fondo';

        const barra = document.createElement('div');
        barra.className = 'stat-barra';
        barra.style.width = porcentaje + '%';

        const numero = document.createElement('span');
        numero.className = 'stat-valor';
        numero.textContent = valor;

        barraFondo.appendChild(barra);
        fila.appendChild(nombre);
        fila.appendChild(barraFondo);
        fila.appendChild(numero);
        pokemonStats.appendChild(fila);
    });

    mostrarTarjeta();
}

function mostrarMensaje(texto) {
    mensaje.textContent = texto;
}

function limpiarMensaje() {
    mensaje.textContent = '';
}

function mostrarTarjeta() {
    tarjeta.classList.remove('oculto');
}

function ocultarTarjeta() {
    tarjeta.classList.add('oculto');
}

// Carga un pokemon inicial al abrir la pagina
buscarPokemon('pikachu');
