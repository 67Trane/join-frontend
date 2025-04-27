/**
 * Array of all tasks.
 * @type {Array<Object>}
 */
window.tasks = [];

/**
 * Currently dragged element ID.
 * @type {string}
 */
window.currentDraggedElement;

/**
 * ID of the clicked card.
 * @type {string}
 */
window.clickedCardId;

/**
 * Initializes the board by including HTML components and loading tasks.
 */
async function initBoard() {
  includeHTML();
  let loadedTasks = await loadTasks();
  checkTask(loadedTasks);
  init();
}

/**
 * Separates subtasks from a string.
 * @param {string} atasks - The string containing subtasks.
 * @returns {Array<string>} An array of subtasks.
 */
// function separatSubtask(atasks) {
//   if (!atasks == "") {
//     let inputString = atasks;
//     let matches = inputString.match(/'([^']*)'/g).map((s) => s.replace(/'/g, ""));
//     return matches;
//   }
// }

/**
 * Processes tasks and prepares them for rendering.
 * @param {Array<string>} keys - The task IDs.
 * @param {Array<Object>} values - The task objects.
 */
function checkTask(values) {
  tasks = [];
  for (let i = 0; i < values.length; i++) {
    tasks.push(values[i]);
  }
  renderTask();
}

/**
 * Converts an array of subtasks into an object.
 * @param {Array<string>} subtask - The array of subtasks.
 * @returns {Object} An object with subtasks as keys and 'inwork' as values.
 */
function renderToObject(subtask) {
  if (!subtask == "''") {
    let newsubtaskArray = {};
    for (let i = 0; i < subtask.length; i++) {
      newsubtaskArray[subtask[i]] = "inwork";
    }
    return newsubtaskArray;
  }
}

/**
 * Renders all tasks to the board.
 */
function renderTask() {
  let sections = ["todo", "inprogress", "awaitfeedback", "done"];
  sections.forEach((sectionId) => {
    let section = document.getElementById(sectionId);
    let ticketCards = section.getElementsByClassName("ticket-card");
    while (ticketCards.length > 0) {
      ticketCards[0].remove();
    }
    renderHelper(sectionId);
  });
  emptySection();
}

/**
 * Helper function to render tasks in a specific section.
 * @param {string} section - The section to render tasks in.
 */
function renderHelper(section) {
  let allTasks = tasks.filter((t) => t["status"] == section);
  for (let i = 0; i < allTasks.length; i++) {
    let category = getCategory(allTasks[i].category);
    let cleaned = isEmpty(allTasks[i]);
    if (cleaned.description == false) {
      allTasks[i].description = "";
    }
    let prio;
    if (!cleaned.prio == false) {
      prio = getPrio(i, allTasks);
    } else {
      prio = "noprio.svg";
    }
    let checked = 0;
    let count;
    let subtaskslength;
    if (!cleaned.subtask == false) {
      checked = subtaskChecked(i, allTasks[i]);
      count = getCheckedSubtasks(allTasks[i]);
      subtaskslength = Object.values(allTasks[i].subtask);
    } else {
      subtaskslength = [];
    }
    if (cleaned.color == false) {
      allTasks[i].color = "";
    }

    document.getElementById(`${section}-card`).innerHTML += renderToDos(
      allTasks,
      subtaskslength.length,
      i,
      category,
      prio,
      checked
    );
    let inits = getInitails(i, allTasks);
    for (let j = 0; j < inits.length; j++) {
      let contact = document.getElementById(`contact-images${allTasks[i].id}`);
      let colors = getColors(i, allTasks);
      contact.innerHTML += renderContactsImages(inits[j], colors, j);
    }
    if (!subtaskslength.length == 0) {
      renderProgressBar(count, subtaskslength.length, allTasks[i].id);
    } else {
      document.getElementById(`progress-bar-section${allTasks[i].id}`).classList.add("d-none");
    }
    limitContactImgs(allTasks[i].id);
  }
}

/**
 * Limits the display of contact images to a maximum of five and shows the count of hidden contacts.
 *
 * @param {string|number} id - The unique ID used to identify the contact section.
 */
function limitContactImgs(id) {
  let imgSection = document.getElementById(`contacts-section${id}`);
  let images = imgSection.getElementsByClassName("contact-initals");
  let over = document.getElementById(`over-amount${id}`);
  for (let i = 0; i < images.length; i++) {
    if (images.length >= 5) {
      if (i >= 5) {
        over.classList.remove("d-none");
        over.innerHTML = "+" + (i - 4);
        images[i].classList.add("d-none");
      }
    }
  }
}

/**
 * Checks if task properties are empty and sets default values.
 * @param {Object} task - The task object.
 * @returns {Object} The cleaned task object.
 */
function isEmpty(task) {
  task.subtask = task.subtask ?? "";
  task.assignedto = task.assignedto || false;
  task.color = task.color || false;
  task.description = task.description || false;
  task.prio = task.prio || false;
  if (!Object.keys(task.subtask).length) task.subtask = false;
  return task;
}

/**
 * Gets the priority icon based on task priority.
 * @param {number} i - Index of the task.
 * @param {Array<Object>} allTasks - Array of all tasks.
 * @returns {string} The file name of the priority icon.
 */
function getPrio(i, allTasks) {
  if (allTasks[i].prio == "urgent") {
    return "urgent.svg";
  } else if (allTasks[i].prio == "medium") {
    return "Capa 2.svg";
  } else if (allTasks[i].prio == "low") {
    return "low.svg";
  }
}

/**
 * Gets the category class based on the category name.
 * @param {string} category - The category name.
 * @returns {string} The CSS class for the category pill.
 */
function getCategory(category) {
  if (category == "User Story") {
    return "pill-blue";
  } else if (category == "Technical Task") {
    return "pill-turkis";
  }
}

/**
 * Gets the colors associated with assigned contacts.
 * @param {number} i - Index of the task.
 * @param {Array<Object>} allTasks - Array of all tasks.
 * @returns {Array<string>} Array of color strings.
 */
function getColors(i, allTasks) {
  let color = [];
  if (typeof allTasks[i].color === "object") {
    color = JSON.stringify(allTasks[i].color);
  } else {
    color = allTasks[i].color;
  }
  let allcolors;
  if (color == "") {
    allcolors = "white";
  } else {
    allcolors = color.match(/rgb\(\d{1,3},\s*\d{1,3},\s*\d{1,3}\)/g);
  }
  return allcolors;
}

/**
 * Gets the initials of assigned contacts.
 * @param {number} i - Index of the task.
 * @param {Array<Object>} allTasks - Array of all tasks.
 * @returns {Array<Array<string>>} Array of initials.
 */
function getInitails(i, allTasks) {
  let inits = [];
  let contact;
  if (allTasks[i].assignedto) {
    if (typeof allTasks[i].assignedto === "object") {
      let contactt = JSON.stringify(allTasks[i].assignedto);
      contact = contactt.replaceAll('"', "").replaceAll("[", "").replaceAll("]", "");
    } else {
      contact = allTasks[i].assignedto;
    }
  } else {
    contact = "";
  }
  if (!contact == "") {
    let contacts = contact.split(",");
    for (let id in contacts) {
      let name = contacts[id].split(" ");
      let firstinit = name[0][0];
      let second = name[1] ? name[1][0] : "";
      inits.push([firstinit.toUpperCase(), second.toUpperCase()]);
    }
    return inits;
  } else {
    return [];
  }
}

/**
 * Helper function to render information in the task card.
 * @param {string} sections - The section to render.
 * @param {Object} card - The task object.
 * @param {Document} iframeDocument - The document of the iframe.
 */
function renderInfoCardHelper(sections, card, iframeDocument) {
  let sectionsElement = iframeDocument.getElementById(sections);
  sectionsElement.innerHTML = card[`${sections}`];
}

/**
 * Updates the subtask progress bar when a subtask is checked or unchecked.
 * @param {string} cardId - The ID of the task.
 * @param {number} id - Index of the subtask.
 * @param {number} tasklength - Total number of subtasks.
 */
function subtaskProcesBar(cardId, id, tasklength) {
  let iframe = document.getElementById("card-infos");
  let iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
  let checkbox = iframeDocument.getElementById(`cbtest-19-${id}`);
  let task = getCardById(cardId);
  let subTaskCount = getCheckedSubtasks(task);
  if (checkbox.checked) {
    subTaskCount++;
  } else {
    subTaskCount--;
  }
  setSubTaskProces(subTaskCount, tasklength);
}

/**
 * Gets the number of completed subtasks in a task.
 * @param {Object} task - The task object.
 * @returns {number} Number of completed subtasks.
 */
function getCheckedSubtasks(task) {
  let count = 0;
  let checked = Object.values(task.subtask);
  for (let z = 0; z < checked.length; z++) {
    if (checked[z].status == "done") {
      count++;
    }
  }
  return count;
}

/**
 * Updates the subtask progress on the task card.
 * @param {number} count - Number of completed subtasks.
 * @param {number} tasklength - Total number of subtasks.
 */
function setSubTaskProces(count, tasklength) {
  let taskCard = document.getElementById(`ticket-${clickedCardId}`);
  let subtask = taskCard.querySelector("#subtasks");
  subtask.innerHTML = `${count}/${tasklength} Subtasks`;
  fillProgressBar(count, tasklength);
}

/**
 * Fills the progress bar based on completed subtasks.
 * @param {number} count - Number of completed subtasks.
 * @param {number} length - Total number of subtasks.
 */
function fillProgressBar(count, length) {
  let progressBar = document.getElementById(`filler-${clickedCardId}`);
  let result = (count / length) * 100;
  progressBar.style.width = `${result}%`;
}

/**
 * Searches for tasks based on user input.
 */
function searchCard() {
  addEventListener("keyup", () => {
    let input = document.getElementById("search-field");
    if (input.value.length >= 3) {
      for (let i = 0; i < tasks.length; i++) {
        let card = document.getElementById(`ticket-${tasks[i].id}`);
        card.classList.add("d-none");
        if (
          tasks[i].title.toLowerCase().includes(input.value.toLowerCase()) ||
          tasks[i].description.toLowerCase().includes(input.value.toLowerCase())
        ) {
          card.classList.remove("d-none");
        }
      }
    } else {
      for (let i = 0; i < tasks.length; i++) {
        let card = document.getElementById(`ticket-${tasks[i].id}`);
        card.classList.remove("d-none");
      }
    }
  });
}

/**
 * Opens the dropdown menu for a task card.
 * @param {string} id - The ID of the task.
 * @param {Event} event - The click event.
 */
function openMenu(id, event) {
  let dots = document.getElementById(`dots-${id}`);
  dots.src = "../assets/img/3drots-blue.svg";
  event.stopPropagation();
  let dropdowns = document.getElementsByClassName("dropdown-content");
  for (let i = 0; i < dropdowns.length; i++) {
    if (dropdowns[i].classList.contains("show") && dropdowns[i].id !== `myDropdown-${id}`) {
      dropdowns[i].classList.remove("show");
    }
  }
  document.getElementById(`myDropdown-${id}`).classList.toggle("show");
}

/**
 * Stops event propagation.
 * @param {Event} event - The event to stop propagation on.
 */
function stopEventPropagation(event) {
  event.stopPropagation();
}
