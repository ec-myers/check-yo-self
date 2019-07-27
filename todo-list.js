class ToDoList {
  constructor(id, title, urgent, tasks) {
    this.id = id;
    this.title = title;
    this.urgent = urgent;
    this.tasks = [];
  }

  saveToStorage(array) {
  localStorage.setItem('toDoLists', JSON.stringify(array));

  }

  deleteFromStorage() {


  }

  updateToDo() {


  }

  updateTask() {


  }
}