// Контейнер
const container = document.querySelector('.container');

// Блок з даними
const tableBody = document.querySelector('.table_body');

// Форма пошуку
const searchBar = document.getElementById('search_bar');
const searchInput = document.getElementById('search_input');

// Модальне вікно
const modalWindow = document.querySelector('.modal');


// Запит даних
async function loadCars() {
    const server = 'https://myfakeapi.com/api/cars/';
    const response = await fetch(server);
    const responseResult = await response.json();

    let cars = responseResult.cars;
    runStorage(cars);
}

// Перевірка Local Storage
function runStorage(data) {
    let getJson = localStorage.getItem('cars');
    let cars = JSON.parse(getJson);
    if (!cars) {
        const json = JSON.stringify(data);
        localStorage.setItem('cars', json);
        location.reload();   
    }
    showPage(cars);
}

// Запис нових даних в Local Storage
function setLocalStorage(data) {
    let newStore = JSON.stringify(data);
    localStorage.setItem('cars', newStore);
}

// Виведення однієї сторінки списку автомобілів
function showPage(data) {
    let currentPage = 1;
    let rows = 50;

    displayList(data, rows, currentPage);
    displayPagination(data, rows, currentPage);
}

// Виведення списку автомобілів
function displayList(data, rowPerPage, page) {
    tableBody.innerHTML = "";
    page--;

    const start = rowPerPage * page;
    const end = start + rowPerPage;
    const paginatedCars = data.slice(start, end);

    paginatedCars.forEach(el => {
        const oneCar = document.createElement('tr');
        oneCar.classList.add('.car_el');
        oneCar.innerHTML = `
            <td>${el.car}</td>
            <td>${el.car_model}</td>
            <td>${el.car_vin}</td>
            <td>${el.car_color}</td>
            <td>${el.car_model_year}</td>
            <td>${el.price}</td>
            <td>${el.availability === true ? 'Yes' : 'No'}</td>
            <td>
              <div class="dropdown">
                <div class="menu_btn">Action</div>
                <div class="dropdown_child">
                    <p class="edit_btn" onclick="selectEditCar(${el.id})">Edit</p>
                    <p class="delete_btn" onclick="selectDeleteCar(${el.id})">Delete</p>
                </div>
              </div>
            </td>
        `
        tableBody.appendChild(oneCar);
    });
}

// Відображення блоку пагінації
function displayPagination(postsData, rowPerPage, currentPage) {
    const paginationOld = document.querySelector('.pagination');
    paginationOld.remove();
    const paginationEl = document.createElement('div');
    paginationEl.classList.add('pagination');
    container.appendChild(paginationEl);


    pagesCount = Math.ceil(postsData.length / rowPerPage);

        for (let i = 0; i < pagesCount; i++) {
            const numberEl = displayPaginationBtn(i + 1, currentPage, postsData, rowPerPage);
            paginationEl.appendChild(numberEl);
        }
}

// Відображення кнопок пагінації
function displayPaginationBtn(page, currentPage, postsData, rows) {
    const numberEl = document.createElement('span');
    numberEl.innerText = page;

    if (currentPage === page) numberEl.classList.add('current_page');

    numberEl.addEventListener('click', () => {
        currentPage = page;
        displayList(postsData, rows, currentPage);
        scrollPage();

        let currentItem = document.querySelector('.current_page');
            currentItem.classList.remove('current_page');
            numberEl.classList.add('current_page');
    })
    return numberEl;
}

// Прокрутка до верху таблиці
function scrollPage() {
    const table = document.querySelector('table');
    table.scrollIntoView({ behavior: "smooth" });
}

// Модалка додавання нового автомобіля
const addNewCarBtn = document.getElementById('add_btn');

addNewCarBtn.addEventListener('click', () => {
    modalWindow.style.display = 'flex';
    modalWindow.innerHTML = `
        <div class="modal_window modal_add">
            <div class="close_modal">
                <span class="close_modal_btn close_add_modal">Close</span>
            </div>
            <form class="form form_add" id="added_car">
                <h4 class="modal_header">Adding a new car</h4>
                <input type="hidden" id="add_id" name="id" value="${Math.floor(Math.random() * 9999) + 1000}">
                <div class="field">
                    <label for="add_car">Company</label>
                    <input type="text" name="car" id="add_car" class="inp_field" required>
                </div>
                <div class="field">
                    <label for="add_car_model">Model</label>
                    <input type="text" name="car_model" id="add_car_model" class="inp_field" required>
                </div>
                <div class="field">
                    <label for="add_car_vin">VIN</label>
                    <input type="text" name="car_vin" id="add_car_vin" class="inp_field" required>
                </div>
                <div class="field">
                    <label for="add_car_color">Color</label>
                    <input type="text" name="car_color" id="add_car_color" class="inp_field" required>
                    </div>
                <div class="form_block">
                    <div class="field">
                        <label for="add_car_model_year">Year</label>
                        <input type="number" name="car_model_year" id="add_car_model_year" class="inp_field" min="1900" required>
                    </div>
                    <div class="field">
                        <label for="add_price">Price</label>
                        <input type="text" name="price" id="add_price" class="inp_field" min="0" pattern="[$]+[0-9]+(\\.[0-9][0-9]?)?" value="$" required>
                    </div>
                    <div class="field">
                        <label for="add_availability">Availability</label>
                        <select name="availability" id="add_availability" class="inp_field">
                            <option>Yes</option>
                            <option>No</option>
                        </select>
                    </div>
                </div>
                <button type="submit" class="btn form_btn" id="save_add_btn">Save</button>
            </form>
        </div>
    `

    // Збереження доданого автомобіля
    const addForm = document.getElementById('added_car');
    addForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const dataFormAdd = new FormData(addForm);
        const obj = Object.fromEntries(dataFormAdd);

        const availability = obj.availability === 'Yes' ? true : false;
        obj.availability = availability;

        addingCarToStore(obj);
        runStorage();

        modalWindow.style.display = 'none';
    })

    // Закриття модалки
    const closeAddModal = document.querySelector('.close_add_modal');
    closeAddModal.addEventListener('click', () => {
        modalWindow.style.display = 'none';
    });
});

// Додавання нового автомобіля в список
function addingCarToStore(car) {
    let getJson = localStorage.getItem('cars');
    let cars = JSON.parse(getJson);
    cars.push(car);

    setLocalStorage(cars);
}

// Вибір автомобіля для редагування
function selectEditCar(carId) {
    let getJson = localStorage.getItem('cars');
    let cars = JSON.parse(getJson);
    let result;
    result = cars.filter((val) => {
        return val.id == carId;
    })[0];
    editModal(result);
}

// Модалка редагування автомобіля
function editModal(data) {
    
    modalWindow.style.display = 'flex';
    modalWindow.innerHTML = `
        <div class="modal_window modal_edit">
            <div class="close_modal">
                <span class="close_modal_btn close_edit_modal">Close</span>
            </div>
            <form class="form form_edit" id="form_edit">
                <h4 class="modal_header">Editing selected ${data.car} ${data.car_model}</h4>
                <input type="hidden" id="edit_id" name="id" value="${data.id}">
                <div class="field">
                    <label for="edit_car">Company</label>
                    <input type="text" name="car" id="edit_car" class="inp_field inp_field_block" value="${data.car}" readonly>
                </div>
                <div class="field">
                    <label for="edit_car_model">Model</label>
                    <input type="text" name="car_model" id="edit_car_model" class="inp_field inp_field_block" value="${data.car_model}" readonly>
                </div>
                <div class="field">
                    <label for="edit_car_vin">VIN</label>
                    <input type="text" name="car_vin" id="edit_car_vin" class="inp_field inp_field_block" value="${data.car_vin}" readonly>
                </div>
                <div class="field">
                    <label for="edit_car_color">Color</label>
                    <input type="text" name="car_color" id="edit_car_color" class="inp_field" value="${data.car_color}" required>
                </div>
                <div class="form_block">
                    <div class="field">
                        <label for="edit_car_model_year">Year</label>
                        <input type="number" name="car_model_year" id="edit_car_model_year" class="inp_field inp_field_block" value="${data.car_model_year}" readonly>
                    </div>
                    <div class="field">
                        <label for="edit_price">Price</label>
                        <input type="text" name="price" id="edit_price" class="inp_field" pattern="[$]+[0-9]+(\\.[0-9][0-9]?)?" value="${data.price}" required>
                    </div>
                    <div class="field">
                        <label for="edit_availability">Availability</label>
                        <select name="availability" id="edit_availability" class="inp_field">
                            <option>Yes</option>
                            <option>No</option>
                        </select>
                    </div>
                </div>
                <button type="submit" class="btn form_btn" id="save_edit_btn">Save</button>
            </form>   
        </div>
    `
    // Збереження редагованого автомобіля
    const editForm = document.getElementById('form_edit');
    editForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const dataFormEdit = new FormData(editForm);
        const obj = Object.fromEntries(dataFormEdit);

        const availability = obj.availability === 'Yes' ? true : false;
        obj.availability = availability;

        changingCarInStore(obj);
        runStorage();

        modalWindow.style.display = 'none';
    })

    // Закриття модалки
    const closeEditModal = document.querySelector('.close_edit_modal');
    closeEditModal.addEventListener('click', () => {
        modalWindow.style.display = 'none';
    });
}

// Оновлення автомобіля в списку
function changingCarInStore(car) {
    let getJson = localStorage.getItem('cars');
    let cars = JSON.parse(getJson);
    let editingCarIndex = cars.findIndex(item => item.id == car.id);
    cars.splice(editingCarIndex, 1, car);

    setLocalStorage(cars);
}

// Вибір автомобіля на видалення
function selectDeleteCar(carId) {
    let getJson = localStorage.getItem('cars');
    let cars = JSON.parse(getJson);

    let result;
    result = cars.filter((val) => {
        return val.id == carId;
    })[0];
    deleteModal(result, cars);
}

// Модалка видалення автомобіля
function deleteModal(el, cars) {
    modalWindow.style.display = 'flex';
    modalWindow.innerHTML = `
        <div class="modal_window modal_delete">
            <h4 class="modal_header">Delete this ${el.car} ${el.car_model}?</h4>
            <form class="form_delete" id="form_delete"> 
                <button class="delete_car_btn" id="delete_car_btn">Yes</button>
                <span class="close_modal_btn close_delete_modal">No</span>
            </form>
        </div>
    `
    // Видалення автомобіля зі списку
    const deleteCarBtn = document.querySelector('.delete_car_btn');
    deleteCarBtn.addEventListener('click', (e) => {
        e.preventDefault();

        let carIndex = cars.findIndex(item => item.id == el.id);
        cars.splice(carIndex, 1);

        setLocalStorage(cars);
        runStorage();
        
        modalWindow.style.display = 'none';
    })

    // Закриття модалки
    const closeDeleteModal = document.querySelector('.close_delete_modal');
    closeDeleteModal.addEventListener('click', () => {
        modalWindow.style.display = 'none';
    });
}

// Запит пошуку автомобіля
searchBar.addEventListener('submit', (e) => {
    e.preventDefault();
    const wantedCar = searchInput.value;
    searchInput.value = '';
    let item = [];
    item = seachInStorage(wantedCar);
    showPage(item);
})

// Пошук автомобіля в масиві
function seachInStorage(string) {
    let json = localStorage.getItem('cars');
    let data = JSON.parse(json);
    let results;
    string = string.toUpperCase();

    results = data.filter((entry) => {
        let bool = false;
        for (const key in entry) {
            let item = String(entry[key]);
            bool = item.toUpperCase().includes(string);
            if (bool) return bool;
        }
    });
    return results;
}

loadCars();