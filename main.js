var toDoLists = [];
var searchArea = document.querySelector('#input-search');
var cardArea = document.querySelector('#card-area');
var taskInput = document.querySelector('#input-item');
var titleInput = document.querySelector('#input-title');
var addTaskBtn = document.querySelector('#btn-task');
var tempTaskList = document.querySelector('#temp-task-list');
var clearBtn = document.querySelector('#btn-clear');
var deleteBtn = document.querySelector('#btn-delete');
var asideArea = document.querySelector('aside');
var makeListBtn = document.querySelector('#btn-make-task');

// searchArea.addEventListener('click',);
cardArea.addEventListener('click', handleCardButtons);
titleInput.addEventListener('keyup', enableFormButtons);
taskInput.addEventListener('keyup', enableTaskBtn);
asideArea.addEventListener('click', handleTempTask);
makeListBtn.addEventListener('click', addToDoList);
window.addEventListener('DOMContentLoaded', handlePageLoad);
// addtaskBtn.addEventListener('click', handleTempTask);


function handlePageLoad() {
  instantiateToDoLists();
  populateCards(toDoLists);
}

function handleTempTask(e) {
  e.preventDefault();
  if (e.target.id === 'btn-task') {
    addTempTask(taskInput.value);
    enableFormButtons(e);
    clearTaskInput(e);
    disableTaskBtn(e);
  } else if (e.target.id === 'btn-delete') {
    deleteTempTask(e);
  } else if (e.target.id === 'btn-make-task') {
    displayTaskList(e);
    clearFormInputs(e);
  } else if (e.target.id === 'btn-clear') {
    console.log(e);
    clearFormInputs(e);
  }
}

function handleCardButtons(e) {
  if (e.target.id === 'btn-delete') {
    console.log('delete event:, event')
    deleteCard(e);
  }
}

function addTempTask(input) {
  var tempTask = `<li class="temp-item" id="temp-item" data-id=""><img class="img-delete" id="btn-delete" src="images/delete.svg">${input}</li>`;
  tempTaskList.insertAdjacentHTML('beforeend', tempTask);
}

function deleteTempTask(e) {
  e.target.closest('.temp-item').remove();
}

function addToDoList(e) {
  e.preventDefault();
  var tasks = createTaskList();
  console.log(tasks);
  var toDoList = new ToDoList(Date.now(), titleInput.value, false, tasks);
  toDoLists.push(toDoList);
  toDoList.saveToStorage(toDoLists);
  console.log(toDoList);
  addCard(toDoList);
  console.log(toDoLists);
}

function instantiateToDoLists() {
  var newArray = JSON.parse(localStorage.getItem('toDoLists')).map(function(toDoList){
    return new ToDoList(toDoList.id, toDoList.title, toDoList.urgent, toDoList.tasks);
  }); 

  toDoLists = newArray;
}

function populateCards(array) {
  for (i = 0; i < array.length; i++) {
    addCard(array[i]);
  }
}

function createTaskList() {
  var toDoTasks = []
  var taskElements = document.querySelectorAll('#temp-item');

  for (var i = 0; i < taskElements.length; i++ ) {
   toDoTasks.push(new ToDoTask(Date.now(),taskElements[i].innerText, false));
  }
  return toDoTasks;
}

function displayTaskList(array) {
  var liTaskStrings = '';

  for (var i = 0; i < array.length; i++) {
    liTaskStrings = liTaskStrings + `<li><img class="img-unchecked"src="images/checkbox.svg">${array[i].text}</li>`;
  }
  return liTaskStrings;
}

function addCard(toDoObj) {
  var taskList = toDoObj.tasks;
  var html = displayTaskList(taskList);
  var toDoCard = `<article class="to-do-list" id="todo-list" data-id=${toDoObj.id}>
        <header>
          <h2>${toDoObj.title}</h2>
        </header>
        <ul>${html}</ul>
        <footer>
          <div class="div-urgent">
            <img class="img-urgent" src="images/urgent.svg">
            <p>Urgent</p>
          </div>
          <div class="div-delete">
            <img class="img-delete" id="btn-delete" src="images/delete.svg">
            <p>Delete</p>
          </div>
        </footer>
      </article>`;

  cardArea.insertAdjacentHTML('afterbegin', toDoCard);
  disableMakeListButton();
}

function findToDoList(e) {
  console.log('inside: findToDoList')
    var toDoListId = e.target.closest('.to-do-list').getAttribute('data-id');
    var toDoList = toDoLists.find(function(toDoList) {
      return toDoList.id === parseInt(toDoListId);
      console.log(toDoList.id)
      console.log(toDoListId)
    });

    return toDoList;
}

function deleteCard(e) {
  console.log('delete:, inside delete')
  e.target.closest('.to-do-list').remove();
  var toDoList = findToDoList(e);

  toDoList.deleteFromStorage(toDoLists);
}

//error handling functions

function enableFormButtons() {
  enableTaskBtn();
  var task = document.querySelector('#temp-item');

  if (task.innerText !== null || titleInput.value !== '') {
    makeListBtn.disabled = false;
    clearBtn.disabled = false;
  } 
}


function disableMakeListButton() {
  makeListBtn.disabled = true;
}

function enableTaskBtn() {
  if (titleInput.value !== '' && taskInput.value !== '') {
    addTaskBtn.disabled = false;
  } else if (titleInput.value === '' && taskInput.value === '')
    addTaskBtn.disabled = true;
}

function toggleClearButton(e) {
  e.preventDefault();
  clearBtn.disabled = !clearBtn.disabled;
}

function disableTaskBtn() {
  addTaskBtn.disabled = true;
}

function clearTaskInput() {
  taskInput.value = '';
}

function clearFormInputs() {
  titleInput.value = '';
  taskInput.value = '';
  tempTaskList.innerText = '';
  clearBtn.disabled = true;
}