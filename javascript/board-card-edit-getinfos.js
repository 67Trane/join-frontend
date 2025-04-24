/**
 * Resets the input field styling when typing.
 */
function inputTyping() {
  document.getElementById("input-title").style.border = "";
  document.getElementById("title-required").classList.add("d-none");
}

/**
 * Retrieves the task description.
 */
function getDescription() {
  let description = document.getElementById("text-area").value;
  tasks.description = description;
}

/**
 * Retrieves and validates the task date.
 */
function getDate() {
  let dateInput = document.getElementById("input-date");
  tasks.date = dateInput.value;
  document.getElementById("date-required").classList.add("d-none");
  dateInput.style.border = "";
}

/**
 * Collects all subtasks and their statuses.
 */
function getSubtasks() {
  let subtasklist = document.getElementById("subtasklist");
  let subtask = subtasklist.getElementsByTagName("li");
  for (let i = 0; i < subtask.length; i++) {
    const key = subtask[i].textContent.trim();
    tasks.subtask.push({name: key, status: "inwork"})
  }
}

/**
 * Validates and retrieves the task title.
 */
function getTitle() {
  let input = document.getElementById("input-title");
  let required = document.getElementById("title-required");

  if (input.value == "") {
    input.style.border = "1px solid rgb(248, 84, 103)";
    required.classList.remove("d-none");
  } else {
    tasks.title = input.value;
  }
}

/**
 * Adds a selected color to the color array if not already present.
 *
 * @param {string} color - The color to add.
 */
function getSelectedColor(color) {
  if (!getcolors.includes(color)) {
    getcolors.push(color);
    tasks.color = getcolors;
  }
}

/**
 * Displays an error message when the subtask input is empty.
 */
function subtaskIsEmpty() {
  let searchbar = document.getElementById("subtask-search-bar");
  let required = document.getElementById("subtask-required");
  searchbar.classList.add("notfound");
  required.classList.remove("d-none");
}
