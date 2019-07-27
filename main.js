var searchArea = document.querySelector('#input-search');
var cardArea = document.querySelector('#card-area');
var taskInput = document.querySelector('#input-item');
var titleInput = document.querySelector('#input-title');
var taskBtn = document.querySelector('#btn-task');
var tempTaskList = document.querySelector('#temp-task-list');

// searchArea.addEventListener('click',);
// cardArea.addEventListener('click',);
// taskInput.addEventListener('keyup', );
taskBtn.addEventListener('click', handleTempTask);




function handleTempTask(e) {
  e.preventDefault();
  console.log(e);
  addTempTask(taskInput.value);
  console.log(taskInput.value);
  //add item to an array
  //add item to DOM
  //clear inputs
  //enable Make List button
  //enable Clear All button
  //change button to delete button in list item
}

function addTempTask(input) {
  var tempTask = `<li class="temp-item" id="temp-item" data-id=""><img class="img-delete" id="btn-delete" src="images/delete.svg">${input}</li>`;
  tempTaskList.insertAdjacentHTML('beforeend', tempTask);
}


function addToDoItemToArray() {

}


function toggleTaskButton() {

}