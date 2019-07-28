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
  // } else if (e.target.id === 'btn-delete') {
  //   deleteTempTask(e);
  } else if (e.target.id === 'btn-make-task') {
    displayTaskList(e);
    clearFormInputs(e);
  } else if (e.target.id === 'btn-clear') {
    clearFormInputs(e);
  }
}

function handleCardButtons(e) {
  if (e.target.id === 'btn-delete') {
    console.log('delete event: event')
    enableDeleteButton(e);
  } else if (e.target.id === 'task-item') {
    console.log('check-uncheck event');
    console.log(e);
    checkImg(e);
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
    var toDoTasksArray = instantiateToDoTasks(toDoList.tasks);
    return new ToDoList(toDoList.id, toDoList.title, toDoList.urgent, toDoTasksArray);
  }); 

  toDoLists = newArray;
}

function instantiateToDoTasks(array) {
  var newArray = array.map(function(toDoTask) {
    return new ToDoTask(toDoTask.id, toDoTask.text, toDoTask.checked);
  });

  return newArray;
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
   toDoTasks.push(new ToDoTask(i + 1,taskElements[i].innerText, false));
  }
  return toDoTasks;
}

function displayTaskList(array) {
  var liTaskStrings = '';
  for (var i = 0; i < array.length; i++) {
    var task = array[i];
    var checkedImg = task.checked ? 'images/checkbox-active.svg' : 'images/checkbox.svg';

    liTaskStrings = liTaskStrings + `<li id="task-item" data-id=${task.id}><img id="task-item" src=${checkedImg}>${task.text}</li>`;
  }
  return liTaskStrings;
}

function addCard(toDoObj) {
  var taskList = toDoObj.tasks;
  var html = displayTaskList(taskList);
  var deleteImg = areAllTasksChecked(toDoObj) ? "images/delete-active.svg" : "images/delete.svg";
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
            <img class="img-delete" id="btn-delete" src=${deleteImg}>
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

function findToDoTask(e) {
  var toDoList = findToDoList(e);
  var taskId = e.target.closest('li').getAttribute('data-id'); 
  var toDoTask = toDoList.tasks.find(function(toDoTaskObj) {
    return parseInt(taskId) === toDoTaskObj.id;
  });

  return toDoTask;
}

function areAllTasksChecked(toDoList) {
  for (var i = 0; i < toDoList.tasks.length; i++) {
    if (toDoList.tasks[i].checked === false) {
    return false; 
    }
  }
  return true;
}

function enableDeleteButton(e) {
  var toDoList = findToDoList(e);
  var tasksChecked = areAllTasksChecked(toDoList);
  if (tasksChecked === true) {
    deleteCard(e, toDoList);
  }
}

function deleteCard(e, toDoList) {
  e.target.closest('.to-do-list').remove();
  toDoList.deleteFromStorage(toDoLists);
}

function checkImg(e) {
  var toDoList = findToDoList(e);
  var toDoTask = findToDoTask(e);
  toDoTask.updateChecked();
  toDoList.saveToStorage(toDoLists);
  var updateChecked = toDoTask.checked ? 'images/checkbox-active.svg' : 'images/checkbox.svg';
  e.target.setAttribute('src', updateChecked);
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