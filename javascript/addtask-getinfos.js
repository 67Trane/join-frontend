/**
 * Retrieves the task description from the input field.
 */
function getDescription() {
  let description = document.getElementById("text-area").value;
  tasks.description = description;
}

/**
 * Retrieves the task title from the input field.
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
 * Retrieves the task date from the input field.
 */
function getDate() {
  let dateInput = document.getElementById("input-date");
  tasks.date = dateInput.value;
  document.getElementById("date-required").classList.add("d-none");
  dateInput.style.border = "";
}

/**
 * Retrieves all subtasks from the list.
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
 * Resets the input fields for the title when the user types.
 */
function inputTyping() {
  document.getElementById("input-title").style.border = "";
  document.getElementById("title-required").classList.add("d-none");
}

/**
 * Displays an error message when the subtask is empty.
 */
function subtaskIsEmpty() {
  let searchbar = document.getElementById("subtask-search-bar");
  let required = document.getElementById("subtask-required");

  searchbar.classList.add("notfound");
  required.classList.remove("d-none");
}

/**
 * Adds a selected color to the list.
 * @param {string} color - The color to be added.
 */
function getSelectedColor(color) {
  if (!getcolors.includes(color)) {
    getcolors.push(color);
    tasks.color = getcolors;
  }
}

/**
 * Resets the priority display to default values.
 * @param {HTMLElement} urgent - The urgent priority element.
 * @param {HTMLElement} medium - The medium priority element.
 * @param {HTMLElement} low - The low priority element.
 * @param {HTMLImageElement} urgentimg - The image for urgent priority.
 * @param {HTMLImageElement} mediumimg - The image for medium priority.
 * @param {HTMLImageElement} lowimg - The image for low priority.
 */
function setPrioDefault(urgent, medium, low, urgentimg, mediumimg, lowimg) {
  urgent.style.backgroundColor = "white";
  medium.style.backgroundColor = "white";
  low.style.backgroundColor = "white";
  urgentimg.src = "../assets/img/urgent.svg";
  mediumimg.src = "../assets/img/Capa 2.svg";
  lowimg.src = "../assets/img/low.svg";
  urgent.style.color = "black";
  medium.style.color = "black";
  low.style.color = "black";
}

/**
 * Sets the selected priority for the task.
 * @param {string} prio - The selected priority ("urgent", "medium", "low").
 */
function selectedPrio(prio) {
  let urgent = document.getElementById("urgent");
  let medium = document.getElementById("medium");
  let low = document.getElementById("low");
  let urgentimg = document.getElementById("urgent-img");
  let mediumimg = document.getElementById("medium-img");
  let lowimg = document.getElementById("low-img");

  setPrioDefault(urgent, medium, low, urgentimg, mediumimg, lowimg);

  if (prio == "urgent") {
    urgent.style.backgroundColor = "rgb(255, 61, 0)";
    urgent.style.color = "white";
    urgentimg.src = "../assets/img/urgent white.svg";
    tasks.prio = "urgent";
  } else if (prio == "medium") {
    medium.style.backgroundColor = "rgb(255, 168, 0)";
    medium.style.color = "white";
    mediumimg.src = "../assets/img/Capa 2 white.svg";
    tasks.prio = "medium";
  } else if (prio == "low") {
    low.style.backgroundColor = "rgb(122, 226, 41)";
    low.style.color = "white";
    lowimg.src = "../assets/img/low white.svg";
    tasks.prio = "low";
  }
}

/**
 * Checks if a category has been selected.
 */
function isCategorySelected() {
  let categoryselected = document.getElementById("select-task").innerHTML;
  let inputfield = document.getElementById("input-category");
  let required = document.getElementById("category-required");
  if (categoryselected == "User Story" || categoryselected == "Technical Task") {
    inputfield.classList.remove("notfound");
    required.classList.add("d-none");
  } else {
    inputfield.classList.add("notfound");
    required.classList.remove("d-none");
  }
}
