class ToDoList {
  constructor(id, title, urgent, tasks) {
    this.id = id;
    this.title = title;
    this.urgent = urgent;
    this.tasks = tasks;
  }

  saveToStorage(array) {
  localStorage.setItem('toDoLists', JSON.stringify(array));

  }

  deleteFromStorage(array) {
    var toDoListId = this.id;
    var index = toDoLists.findIndex(function(toDoList) {
      return parseInt(toDoList.id) === toDoListId;
    });
    var newArray = array.splice(index, 1)

    this.saveToStorage(toDoLists);
  }

  updateToDo() {


  }

  updateTask() {


  }
}