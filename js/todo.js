const inputEl = document.getElementById('input');
const form = document.getElementById('form');
const ul = document.getElementById('item-list');
const tasksListDiv = document.querySelector('.tasks-list');
const deleteAll = document.querySelector('.delete-all');
const filter = document.querySelector('.filter');
const filterInput = document.querySelector('.form-input-filter');

let isEditMode = false;

hide();

function diplayItems() {
  let store = addLocalStorageItemsToTheDom();
  store.forEach((item) => addItemsToDom(item));

  removeFromLocalStorage();
}

function creatItems(e) {
  e.preventDefault();
  const value = inputEl.value;

  if (value === '') {
    alert('please add item');
    return;
  }

  if (isEditMode) {
    const editLi = ul.querySelector('.edit');
    const btn = form.querySelector('.submit-btn');
    console.log(editLi);
    removeFromLocalStorage(editLi.textContent);
    editLi.classList.remove('edit');
    editLi.remove();
    isEditMode = false;
    btn.style.backgroundColor = '#ccc';
    btn.textContent = 'Submit';
    hide();
  }

  addItemsToDom(value);
  addToLocalStorage(value);
  console.log(value);
  inputEl.value = '';
}

function addItemsToDom(newItems) {
  let li = document.createElement('li');
  const id = new Date().getTime().toString();

  li.innerHTML = newItems;
  li.setAttribute('id', id);
  ul.appendChild(li);
  const button = creatButton('icon-btn');
  li.appendChild(button);
}

function creatButton(className) {
  const button = document.createElement('button');
  button.classList.add(className);

  const icon = editIcon('<i class="fa-solid fa-pen-to-square"></i>');
  const deleteIconEl = deleteIcon('<i class="fa-solid fa-trash"></i>');

  button.innerHTML = `${icon}${deleteIconEl}`;

  hide();
  return button;
}

function editIcon(className) {
  let icon = document.createElement('i');
  icon = className;
  hide();
  return icon;
}
function deleteIcon(className) {
  let deleteIconEl = document.createElement('i');
  deleteIconEl = className;
  return deleteIconEl;
}

function addToLocalStorage(newItems) {
  let store = addLocalStorageItemsToTheDom();

  store.push(newItems);
  localStorage.setItem('list', JSON.stringify(store));
}

function addLocalStorageItemsToTheDom() {
  let store;

  if (localStorage.getItem('list') === null) {
    store = [];
  } else {
    store = JSON.parse(localStorage.getItem('list'));
  }

  return store;
}

function onClick(e) {
  if (e.target.classList.contains('fa-trash')) {
    deleteItem(e.target.parentElement.parentElement);
  } else {
    if (e.target.classList.contains('fa-pen-to-square')) {
      editMode(e.target.parentElement.parentElement);
    }
  }
  hide();
}

function deleteItem(item) {
  if (confirm('are you sure you want to delete it ?')) {
    item.remove();
    removeFromLocalStorage(item.textContent);
  }

  /*  if (e.target.classList.contains('fa-trash')) {
      const element = e.target.parentElement.parentElement;
      element.remove();
      hide();
    } */
}

function editMode(item) {
  isEditMode = true;
  ul.querySelectorAll('li').forEach((li) => li.classList.remove('edit'));
  const btn = form.querySelector('.submit-btn');
  item.classList.add('edit');
  inputEl.value = item.textContent;
  btn.textContent = 'Edit';
  btn.classList.add('green');
}

function removeFromLocalStorage(item) {
  let localStore = addLocalStorageItemsToTheDom();

  console.log(localStore);
  localStore = localStore.filter((arr) => arr != item);
  localStorage.setItem('list', JSON.stringify(localStore));
}

function clearItems() {
  if (confirm('are you sure you want to delete all ?')) {
    while (ul.firstChild) {
      ul.removeChild(ul.firstChild);
    }
    localStorage.removeItem('list');
  }
  hide();
}

function hide() {
  const li = document.querySelectorAll('li');

  if (li.length === 0) {
    deleteAll.classList.add('deleteAll');
    filter.classList.add('deleteAll');
  } else {
    deleteAll.classList.remove('deleteAll');
    filter.classList.remove('deleteAll');
  }
}

function filterItems(e) {
  const li = document.querySelectorAll('li');
  const filterValue = e.target.value.toLowerCase();
  li.forEach((liEl) => {
    const itemNAME = liEl.firstChild.textContent.toLowerCase();

    if (itemNAME.indexOf(filterValue) !== -1) {
      liEl.style.display = 'flex';
    } else {
      liEl.style.display = 'none';
    }
  });
}

form.addEventListener('submit', creatItems);
ul.addEventListener('click', onClick);
deleteAll.addEventListener('click', clearItems);
filterInput.addEventListener('input', filterItems);
document.addEventListener('DOMContentLoaded', diplayItems);
