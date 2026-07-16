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

function filter_films(){
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
    let error = {};
    if (title === ''){
        error = {
            val: false,
            message: 'Название не может быть пустым.'
        } 
        return error;
    }
    if (film_year.trim() === ''){
        error = {
            val: false,
            message: 'Год не может быть пустым.'
        }
        return error;
    }
    const year = Number(film_year);
    if (!Number.isInteger(year) || isNaN(year)){
        error = {
            val: false,
            message: 'Год должен быть числом.'
        }
        return error;
    }
    if (year < 1900){
        error = {
            val: false,
            message: 'Год не может быть меньше 1900.'
        }
        return error;
    }
    const cur_year = current_year();
    if (year > cur_year){
        error = {
            val: false,
            message: `Год не может быть больше ${cur_year}.`
        }
        return error;
    }
    const duplicate = list_films.some(f => f.title.toLowerCase() === film_name.toLowerCase() && f.year === year);
    if(duplicate){
         error = {
            val: false,
            message: 'Этот фильм уже есть в списке.'
        }
        return error;
    }
    else{
        error = {
            val: true,
            title: title,
            year: year
        }
    }
    return error;
}

function current_year(){
    let data = new Date().getFullYear();
    return data;
}

function show_error(message){
    const elem_error = document.getElementById('error_message');
    elem_error.innerHTML = `<div class="error">${message}</div>`;
}

function clear_error(){
    const elem_error = document.getElementById('error_message');
    elem_error.innerHTML = '';
}

function create_film_card(film) {
    const status_txt = film.watched ? 'Просмотрен' : 'Не просмотрен';
    const status_class = film.watched ? 'watched' : 'unwatched';
    
    return `
        <div class="movie__item" data-id="${film.id}">
            <div class="movie__info">
                <span class="movie__title">${text_without_html(film.title)}</span>
                <span class="movie__year">${film.year}</span>
                <span class="movie__status ${status_class}">${status_txt}</span>
            </div>
            <div class="movie_actions">
                <button class="btn btn__success toggle__btn">Изменить статус</button>
                <button class="btn btn__cancel delete__btn">Удалить</button>
            </div>
        </div>
    `;
}

function text_without_html(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function draw_list(){
    const filtered_list = filter_films();
    const elem_list = document.getElementById('list_movie');

    if(filtered_list.length === 0){
         elem_list.innerHTML = `<div class="empty_message">Фильмы не найдены.</div>`;
    }
    else{
        const listHtml = filtered_list.map(create_film_card).join('');
        elem_list.innerHTML = listHtml;
    }
    update_statistic();
}

function enter_film_info(event){
    event.preventDefault();
    clear_error();

    const elem_title = document.getElementById('film_name');
    const elem_year = document.getElementById('film_year');

    const title = elem_title.value;
    const year = elem_year.value;
    
    const valid = validation(title, year);
    if(!valid.val){
        show_error(valid.message);
        return;
    }

    add_film(valid.title, valid.year);

    elem_title.value = '';
    elem_year.value = '';

    draw_list();
}

function click_movie_btn(event){
    const cur_btn = event.target.closest('button');
    if(!cur_btn) return;
    
    const item_film = cur_btn.closest('.movie__item');
    if(!item_film) return;

    const id = Number(item_film.dataset.id);
    if(isNaN(id)) return;

    if(cur_btn.classList.contains('toggle__btn')){
        changed_state(id);
        draw_list();
        return;
    }
    if(cur_btn.classList.contains('delete__btn')){
        delete_film(id);
        draw_list();
        return;
    }
}

function update_filter_btn(filter){
     document.querySelectorAll('.filter__group__btn').forEach(btn => {
        btn.classList.toggle('active_btn', btn.dataset.filter === filter);
    });
}

function click_filter_btn(event){
    const cur_btn = event.target.closest('.filter__group__btn');
    if(!cur_btn) return;

    const filter = cur_btn.dataset.filter;
    if(!filter) return;

    set_filter(filter);
    update_filter_btn(filter);
    draw_list();
}

function create_data(){
    const data = [
        { title: 'Матрица', year: 1999, watched: true },
        { title: 'Дюна', year: 2021, watched: false },
    ];
    data.forEach(f => {
        list_films.push({
            id: next_id++,
            title: f.title,
            year: f.year,
            watched: f.watched
        });
    });
}

function init(){
    document.getElementById('add_form').addEventListener('submit', enter_film_info);
    document.getElementById('list_movie').addEventListener('click', click_movie_btn);
    document.getElementById('filter').addEventListener('click', click_filter_btn);
    create_data();
    draw_list();
}

document.addEventListener('DOMContentLoaded', init);