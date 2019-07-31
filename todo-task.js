class ToDoTask {
  constructor(id, text, checked) {
    this.id = id;
    this.text = text;
    this.checked = checked;
  }

  updateChecked() {
    this.checked = !this.checked;
  }
}

