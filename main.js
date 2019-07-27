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
var addListBtn = document.querySelector('#btn-make-task');

// searchArea.addEventListener('click',);
// cardArea.addEventListener('click',);
titleInput.addEventListener('keyup', enableMakeListButton);
taskInput.addEventListener('keyup', enableMakeListButton);
asideArea.addEventListener('click', handleTempTask);
addListBtn.addEventListener('click', addToDoList);
// addtaskBtn.addEventListener('click', handleTempTask);

populateCards(toDoLists);


function handleTempTask(e) {
  e.preventDefault();
  if (e.target.id === 'btn-task') {
    addTempTask(taskInput.value);
    clearInput(taskInput);
    enableMakeListButton(e);
  } else if (e.target.id === 'btn-delete') {
    deleteTempTask(e);
  }
  console.log(taskInput.value);
  //add item to an array
  //add item to DOM
  //enable Make List button
  //enable Clear All button
  //change button to delete button in list item
}

function addTempTask(input) {
  var tempTask = `<li class="temp-item" id="temp-item" data-id=""><img class="img-delete" id="btn-delete" src="images/delete.svg">${input}</li>`;
  tempTaskList.insertAdjacentHTML('beforeend', tempTask);
}

function deleteTempTask(e) {
  e.target.closest('.temp-item').remove();
}


function createToDoItemArray() {

}

function addToDoList(e) {
  e.preventDefault();
  var toDoList = new ToDoList(Date.now(), titleInput.value, false, 'elyse');

  toDoLists.push(toDoList);
  toDoList.saveToStorage(toDoLists);
  addCard(toDoList);
  console.log(toDoLists);
}

function populateCards(array) {
  for (i = 0; i < array.length; i++) {
    addCard(array[i]);
  }
}

function createTaskList() {
  console.log('here')
  var taskListStrings = []
  var taskElements = document.querySelectorAll('#temp-item');
  for (var i = 0; i < taskElements.length; i++ ) {
    console.log(taskElements[i].innerText);
   taskListStrings.push(taskElements[i].innerText);
  }
  return taskListStrings;
}

function addCard(toDoObj) {
  var taskList = createTaskList();
  var toDoCard = `<article class="to-do-list" id="todo-list" data-id=${toDoObj.id}>
        <header>
          <h2>${toDoObj.title}</h2>
        </header>
        <ul>${taskList}</ul>
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
      </article>`
  cardArea.insertAdjacentHTML('afterbegin', toDoCard);
}

function enableMakeListButton() {
  var taskBtn = document.querySelector('#btn-make-task');
  var task = document.querySelector('#temp-item');

  if (task !== undefined || titleInput.value !== '') {
    console.log(titleInput.value)
    taskBtn.disabled === false;
  } else if (task === undefined || titleInput.value === '') {
    taskBtn.disabled === true;
  }
}


function toggleClearButton(e) {
  console.log(e)
  e.preventDefault();
  clearBtn.disabled = !clearBtn.disabled;
}

function clearInput(input) {
  input.value = '';
}