let list_films = [];
let next_id = 1;
let current_state = "all";

function add_film(film_name, film_year){
    const new_film = {
        id: next_id++,
        title: film_name,
        year: film_year,
        watched: false
    }
    list_films.push(new_film);
    return new_film;
}

function delete_film(id){
    list_films = list_films.filter(f => f.id !== id);
}

function changed_state(id){
    const film = list_films.find(f => f.id === id);
    if(film){
        film.watched = !film.watched;
    }
    return film; 
}

function filter_films(current_state){
    if (current_state === 'all') return list_films;
    if (current_state === 'watched') return list_films.filter(f => f.watched === true);
    if (current_state === 'not_watched') return list_films.filter(f => f.watched === false);
    return list_films
}

function set_filter(state){
    current_state = state;
}

function update_statistic(){
    const all_films = list_films.length;
    const watched_films = list_films.filter(f => f.watched === true).length;
    const unwatched_films = all_films - watched_films;
    
    document.getElementById('statistic_total').textContent = all_films;
    document.getElementById('statistic_watched').textContent = watched_films;
    document.getElementById('statistic_not_watched').textContent = unwatched_films;

}

function validation(film_name, film_year){
    const title = film_name.trim();
    const error = {};
    if (title === ''){
        error = {
            val: false,
            message: 'Название не может быть пустым.'
        } 
    }
    const year = Number(film_year);
    if (!Number.isInteger(year)){
        error = {
            val: false,
            message: 'Год должен быть числом.'
        }
    }
    if (film_year.trim() === ''){
        error = {
            val: false,
            message: 'Год не может быть пустым.'
        }
    }
    if (year < 1900){
        error = {
            val: false,
            message: 'Год не может быть меньше 1900.'
        }
    }
    const cur_year = current_year();
    if (year > cur_year){
        error = {
            val: false,
            message: `Год не может быть больше ${cur_year}.`
        }
    }
    const duplicate = list_films.some(f => f.title.toLowerCase() === film_name.toLowerCase() && f.year === film_year);
    if(duplicate){
         error = {
            val: false,
            message: 'Этот фильм уже есть в списке.'
        }
    }
    else{
        error = {
            val: true,
            title: title,
            year: year
        }
    }
}

function current_year(){
    let data = new Date().getFullYear;
    return data;
}

function show_error(message){
    const elem_error = getElementById('error_message');
    elem_error.innerHTML = `<div class="error">${message}</div>`;
}

function clear_error(){
    const elem_error = getElementById('error_message');
    elem_error.innerHTML = '';
}
