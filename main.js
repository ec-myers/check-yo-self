var addTaskBtn = document.querySelector('#btn-task');
var asideArea = document.querySelector('aside');
var cardArea = document.querySelector('#card-area');
var clearBtn = document.querySelector('#btn-clear');
var deleteBtn = document.querySelector('#btn-delete');
var makeListBtn = document.querySelector('#btn-make-task');
var urgentBtn = document.querySelector('#btn-urgent')
var searchInput = document.querySelector('#input-search');
var taskInput = document.querySelector('#input-item');
var tempTaskList = document.querySelector('#temp-task-list');
var titleInput = document.querySelector('#input-title');
var toDoLists = [];

asideArea.addEventListener('click', handleTempTask);
cardArea.addEventListener('click', handleCardButtons);
makeListBtn.addEventListener('click', addToDoList);
searchInput.addEventListener('keyup', handleSearch);
taskInput.addEventListener('keyup', enableTaskBtn);
titleInput.addEventListener('keyup', enableFormButtons);
window.addEventListener('DOMContentLoaded', handlePageLoad);

function handlePageLoad() {
  instantiateToDoLists();
  populateCards(toDoLists);
  displayToDoPrompt();
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
    clearFormInputs(e);
    enableTaskBtn();
  } else if (e.target.id === 'btn-urgent') {
    // displayUrgent(toDoLists);
    displayUrgent(toDoLists);
    // displayUrgentPrompt(toDoLists)
  }
}

function handleCardButtons(e) {
  if (e.target.id === 'btn-delete-2') {
    enableDeleteButton(e);
  } else if (e.target.id === 'task-item') {
    checkTask(e);
  } else if (e.target.id === 'img-urgent') {
    toggleUrgent(e);
  }
}

function handleSearch(e) {
  if (e.target.id === 'input-search') {
    displaySearch(toDoLists);
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
  var toDoList = new ToDoList(Date.now(), titleInput.value, false, tasks);
  toDoLists.push(toDoList);
  toDoList.saveToStorage(toDoLists);
  addCard(toDoList);
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
    var updateCheckedText = task.checked ? 'active-text' : '';

    liTaskStrings = liTaskStrings + `<li class="${updateCheckedText}" id="task-li" data-id=${task.id}><img id="task-item" src=${checkedImg}>${task.text}</li>`;
  }
  return liTaskStrings;
}

function addCard(toDoObj) {
  var taskList = toDoObj.tasks;
  var html = displayTaskList(taskList);
  var deleteImg = areAllTasksChecked(toDoObj) ? "images/delete-active.svg" : "images/delete.svg";
  var articleClass = toDoObj.urgent ? "urgent" : "";
  var urgentLabel = toDoObj.urgent ? "label-urgent" : "label";
  var header = toDoObj.urgent ? "header-urgent" : "header";
  var footer = toDoObj.urgent ? "footer-urgent" : "footer";
  var urgentImg = toDoObj.urgent ? "images/urgent-active.svg" : "images/urgent.svg";
  var toDoCard = `<article class="todo-list ${articleClass}" id="todo-list" data-id=${toDoObj.id}>
        <header class=${header} id="header">
          <h2>${toDoObj.title}</h2>
        </header>
        <ul>${html}</ul>
        <footer class=${footer} id="footer">
          <div class="div-urgent">
            <img class="img-urgent" id="img-urgent" src=${urgentImg}>
            <p class=${urgentLabel} id="urgent-label">urgent</p>
          </div>
          <div class="div-delete">
            <img class="img-delete" id="btn-delete-2" src=${deleteImg}>
            <p>Delete</p>
          </div>
        </footer>
      </article>`;

  cardArea.insertAdjacentHTML('afterbegin', toDoCard);
  disableMakeListButton();
  displayToDoPrompt();
}

function findToDoList(e) {
  var toDoListId = e.target.closest('#todo-list').getAttribute('data-id');
  var toDoList = toDoLists.find(function(toDoList) {
    return toDoList.id === parseInt(toDoListId);
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

function toggleDeleteButton(e, toDoList) {
  var areTasksChecked = areAllTasksChecked(toDoList);
  var deleteImg = areTasksChecked ? "images/delete-active.svg" : "images/delete.svg";
  e.target.closest('.todo-list').querySelector('#btn-delete-2').setAttribute('src', deleteImg);
  console.log(e.target.closest('.todo-list'))
}

function enableDeleteButton(e) {
  var toDoList = findToDoList(e);
  var tasksChecked = areAllTasksChecked(toDoList);
  if (tasksChecked === true) {
    deleteCard(e, toDoList);
  }
}

function deleteCard(e, toDoList) {
  e.target.closest('#todo-list').remove();
  toDoList.deleteFromStorage(toDoLists);
  displayToDoPrompt();
}

function checkTask(e) {
  var toDoList = findToDoList(e);
  var toDoTask = findToDoTask(e);
  toDoTask.updateChecked();
  toDoList.saveToStorage(toDoLists);
  var updateChecked = toDoTask.checked ? 'images/checkbox-active.svg' : 'images/checkbox.svg';
  var updateCheckedText = toDoTask.checked ? 'active-text' : '';
  e.target.setAttribute('src', updateChecked);
  e.target.closest('#task-li').classList.toggle('active-text');
  toggleDeleteButton(e, toDoList);
}
  var toDoPrompt = document.querySelector('#todo-prompt');

function displayToDoPrompt() {
  if (toDoLists.length === 0) {
    toDoPrompt.classList.remove('hidden');
  } else {
    toDoPrompt.classList.add('hidden');
  }
}
  var urgentPrompt = document.querySelector('#urgent-prompt');

// function displayUrgentPrompt(array) {
//   console.log('inside: urgentPrompt')
//   var urgentArray = returnUrgentArray(array);
//   if (urgentArray.length === 0) {
//     urgentPrompt.classList.remove('hidden');
//   } else {
//     urgentPrompt.classList.add('hidden');
//   }
// }

// function displayUrgentPrompt() {
//   var urgentArray = returnUrgentArray(array);
//   if (urgentArray.length === 0) {
//     cardArea.insertAdjacentHTML('afterbegin', `<p id="urgent-prompt">You have no urgent items.</p>`);
//   }
// }

function toggleUrgentBtn() {
  urgentBtn.clicked = !urgentBtn.clicked;
}

function displayUrgent(array) {
  toggleUrgentBtn();
  if (urgentBtn.clicked === true) {
    cardArea.innerHTML = '';
    urgentBtn.classList.add('active');
  var urgentArray = returnUrgentArray(array);
  populateCards(urgentArray);
  } else if (urgentBtn.clicked === false) {
    cardArea.innerHTML = '';
    urgentBtn.classList.remove('active');
    populateCards(array);
  }
  displayUrgentPrompt();
}

// function displayUrgent(array) {
//   cardArea.innerHTML = '';
//   if (btn)
//   var urgentArray = returnUrgentArray(array);
//   populateCards(urgentArray);
// }

function returnUrgentArray(array) {
  var urgentArray = array.filter(function(toDoList) {
    return toDoList.urgent === true;
  });
  return urgentArray;
}

function toggleUrgent(e) {
  var toDoList = findToDoList(e);
  toDoList.updateToDo();
  toDoList.saveToStorage(toDoLists);
  updateUrgentCard(e, toDoList);
}

function updateUrgentCard(e, toDoList) {
  var urgentLabel = toDoList.urgent ? "label-urgent" : "label";
  var header = toDoList.urgent ? "header-urgent" : "header";
  var footer = toDoList.urgent ? "footer-urgent" : "footer";
  var urgentImg = toDoList.urgent ? "images/urgent-active.svg" : "images/urgent.svg";

  e.target.closest('article').classList.toggle('urgent');
  e.target.setAttribute('src', urgentImg);
  e.target.closest('article').querySelector('#header').setAttribute('class', header);
  e.target.closest('article').querySelector('#footer').setAttribute('class', footer);
  e.target.closest('article').querySelector('#urgent-label').setAttribute('class', urgentLabel);
}

function displaySearch(array) {
  cardArea.innerHTML = '';
  if (searchInput.value === '') {
    populateCards(array);
  } else {
    var searchArray = returnSearchArray(array, searchInput.value)
    populateCards(searchArray);
  }
}

function returnSearchArray(array, searchTerms) {
  var searchResultsArray = array.filter(function(toDoList) {
    return toDoList.title.toLowerCase().includes(searchTerms.toLowerCase())
  });

  return searchResultsArray;
}

// function displayUrgentTasks(array) {

// }

// function returnUrgentTasksArray(array) {
//   var urgentArray = array.filter(function(toDoList) {
//     return toDoList.urgent === true;
//   })

//   return urgentArray;
// }

//error handling functions

function enableFormButtons() {
  console.log('inside: enableForm')
  enableTaskBtn();
  var task = document.querySelector('#temp-item');

  if (task.innerText !== '' || titleInput.value !== '') {
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
  } else if (titleInput.value === '' && taskInput.value === ''){
    addTaskBtn.disabled = true;
}
}

function toggleTaskBtn() {
  addTaskBtn.disabled  = !addTaskBtn.disabled;
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