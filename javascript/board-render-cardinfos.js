/**
 * Renders the information of a task in the task card.
 * @param {string} idnumber - The ID of the task.
 */
function renderTaskCardInfos(idnumber) {
  let iframe = document.getElementById("card-infos");
  if (iframe) {
    let iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
    tasks.filter((card) => {
      if (card.id == idnumber) {
        renderInfoCardHelper("title", card, iframeDocument);
        renderInfoCardHelper("description", card, iframeDocument);
        renderInfoCardHelper("date", card, iframeDocument);
        setPrio(card, iframeDocument);
        getAssignedTo(card, iframeDocument);
        getAllSubtasks(card, iframeDocument);
      }
    });
  } else {
    let iframe = document.getElementById("edit-card");
    let iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
    tasks.filter((card) => {
      if (card.id == idnumber) {
        renderEditCardInfos(iframeDocument, card);
      }
    });
  }
}

/**
 * Renders information in the edit task card.
 * @param {Document} iframeDocument - The document of the iframe.
 * @param {Object} card - The task object.
 */
function renderEditCardInfos(iframeDocument, card) {
  let iframe = document.getElementById("edit-card");
  let subtaskcontainer = iframeDocument.getElementById("subtasklist");
  iframeDocument.getElementById("input-title").value = card.title;
  iframeDocument.getElementById("text-area").value = card.description;
  iframeDocument.getElementById("input-date").value = card.date;
  iframe.contentWindow.selectedPrio(card.prio);

  let imgContainer = iframeDocument.getElementById("contacts-imges");
  imgContainer.innerHTML += `
        <span class="d-none" id="deliver-names">${card.assignedto}</span>
        <span class="d-none" id="deliver-category">${card.category}</span>
        <span class="d-none" id="deliver-status">${card.status}</span>
        <span class="d-none" id="deliver-cardId">${card.id}</span>
        `;

  for (let i = 0; i < Object.values(card.subtask).length; i++) {
    subtaskcontainer.innerHTML += iframe.contentWindow.renderAddToSubtaskList(i, card.subtask[i].name);
  }
}

/**
 * Retrieves all subtasks of a task and renders them.
 * @param {Object} card - The task object.
 * @param {Document} iframeDocument - The document of the iframe.
 */
// function getAllSubtasks(card, iframeDocument) {
//   let task = Object.keys(card.subtask);
//   let sectionsElement = iframeDocument.getElementById("subtasks");
//   sectionsElement.parentElement.id = `board-card-content-${card.id}`;

//   let boardCardContent = sectionsElement.parentElement;
//   if (!task[0] == "") {
//     for (let i = 0; i < task.length; i++) {
//       let checked = ifChecked(card, i);
//       sectionsElement.innerHTML += subtasksHTML(i, task, task.length, checked, card);
//     }
//   }
//   boardCardContent.innerHTML += renderBoardCardButtons(card.id);
// }

function getAllSubtasks(card, iframeDocument) {
  let sectionsElement = iframeDocument.getElementById("subtasks");
  sectionsElement.parentElement.id = `board-card-content-${card.id}`;

  let boardCardContent = sectionsElement.parentElement;
  if (!card.subtask[0].name == "") {
    for (let i = 0; i < card.subtask.length; i++) {
      
      let checked = ifChecked(card, i);
      sectionsElement.innerHTML += subtasksHTML(i, card.subtask[i].name, card.subtask.length, checked, card);
    }
  }
  boardCardContent.innerHTML += renderBoardCardButtons(card.id);
}

/**
 * Checks if a subtask is completed.
 * @param {Object} card - The task object.
 * @param {number} i - Index of the subtask.
 * @returns {string} 'checked' if completed, otherwise an empty string.
 */
function ifChecked(card, i) {
  let alltasks = Object.values(card.subtask);
  if (alltasks[i].status == "inwork") {
    return "";
  } else if (alltasks[i].status == "done") {
    return "checked";
  }
}

/**
 * Retrieves and renders assigned contacts for a task.
 * @param {Object} card - The task object.
 * @param {Document} iframeDocument - The document of the iframe.
 */
function getAssignedTo(card, iframeDocument) {
  if (!card.assignedto == false) {
    if (typeof card.assignedto === "object") {
      let newcard = JSON.stringify(card.assignedto);
      let reuslt = newcard.replaceAll("[", "").replaceAll("]", "").replaceAll('"', "");
      card.assignedto = reuslt;
    }
    let contacts = card.assignedto.split(",");

    let inits = [];
    let contact = card.assignedto;

    let contactss = contact.split(",");
    for (let id in contacts) {
      let name = contactss[id].split(" ");
      let firstinit = name[0][0];
      let second = name[1] ? name[1][0] : "";
      inits.push([firstinit.toUpperCase(), second.toUpperCase()]);
    }

    if (typeof card.color === "object") {
      let newcolor = JSON.stringify(card.color);
      let reuslt = newcolor.replaceAll("[", "").replaceAll("]", "");
      card.color = reuslt;
    }
    let color = card.color.match(/rgb\(\d{1,3},\s*\d{1,3},\s*\d{1,3}\)/g);

    for (let i = 0; i < contacts.length; i++) {
      let cleanInits = inits[i].join().replace(",", "");
      iframeDocument.getElementById("assigned-to").innerHTML += contactsHTML(contacts[i], cleanInits, color[i]);
    }
  }
}

/**
 * Opens the detailed view of a task.
 * @param {string} id - The ID of the task.
 */
function openCard(id) {
  clickedCardId = id;
  let body = document.getElementById("body");
  let background = document.getElementById("background-grey");
  background.classList.remove("d-none");

  body.innerHTML += `<iframe class="card-info" id="card-infos" src="./board-card.html"></iframe>`;
  let iframe = document.getElementById("card-infos");
  iframe.onload = function () {
    renderTaskCardInfos(id);
  };
}

/**
 * ID counter for subtasks.
 * @type {number}
 */
let id = 0;

/**
 * Adds a subtask to the subtask list.
 */
function setSubtasks() {
  let input = document.getElementById("input-subtask");
  let subtaskcontainer = document.getElementById("subtasklist");
  id++;
  if (input.value == "") {
    subtaskIsEmpty();
  } else {
    subtaskcontainer.innerHTML += renderAddToSubtaskList(id, input.value);
    input.value = "";
  }
}

/**
 * Switches the task card to edit mode.
 */
function editTask() {
  let card = document.getElementById("card-infos");
  card.id = "edit-card";
  card.src = "./board-card-edit.html";
}

/**
 * Retrieves a task by its ID.
 * @param {string} crypticId - The ID of the task.
 * @returns {Object} The task object.
 */
function getCardById(crypticId) {
  let newtask = {};
  tasks.forEach((task) => {
    if (task.id == crypticId) {
      newtask = task;
    }
  });
  return newtask;
}

/**
 * Sets the priority indicator in the task card.
 * @param {Object} card - The task object.
 * @param {Document} iframeDocument - The document of the iframe.
 */
function setPrio(card, iframeDocument) {
  if (card.prio == "urgent") {
    iframeDocument.getElementById("urgent").classList.remove("d-none");
  } else if (card.prio == "medium") {
    iframeDocument.getElementById("medium").classList.remove("d-none");
  } else if (card.prio == "low") {
    iframeDocument.getElementById("low").classList.remove("d-none");
  }
}

/**
 * Closes a window or modal.
 * @param {string} card - The ID of the card or modal to close.
 */
function closeWindow(card) {
  let addtask = document.getElementById(card);
  let background = document.getElementById("background-grey");
  setTimeout(() => {
    background.classList.add("d-none");
    addtask.remove();
    loadTasks();
  }, 100);
}

/**
 * Counts the number of completed subtasks.
 * @param {number} i - Index of the task.
 * @param {Object} alltask - The task object.
 * @returns {number} Number of completed subtasks.
 */
function subtaskChecked(i, alltask) {
  let checked = 0;
  let subtasks = Object.values(alltask.subtask);
  for (let j = 0; j < subtasks.length; j++) {
    if (subtasks[j].status == "done") {
      checked++;
    }
  }
  return checked;
}

/**
 * Global click handler to close dropdown menus when clicking outside.
 * @param {Event} event - The click event.
 */
window.onclick = function (event) {
  let allDots = document.getElementsByClassName("dots");
  for (let x = 0; x < allDots.length; x++) {
    allDots[x].src = "../assets/img/3dots.svg";
  }
  if (!event.target.matches(".dots")) {
    let dropdowns = document.getElementsByClassName("dropdown-content");
    for (let i = 0; i < dropdowns.length; i++) {
      let openDropdown = dropdowns[i];
      if (openDropdown.classList.contains("show")) {
        openDropdown.classList.remove("show");
      }
    }
  }
};

/**
 * Opens the 'Add Task' form.
 * @param {string} section - The section where the task will be added.
 */
function openAddTask(section) {
  if (window.innerWidth > 1024) {
    let body = document.getElementById("body");
    let background = document.getElementById("background-grey");
    background.classList.remove("d-none");
    body.innerHTML += `<iframe class="add-task-card" name="${section}" id="whole-addtask-card" src="./addtask-card.html"></iframe>`;
  } else {
    window.location.href = "./addtask.html";
  }
}

/**
 * Checks if sections are empty and shows/hides the empty message.
 */
function emptySection() {
  let sections = ["todo", "inprogress", "awaitfeedback", "done"];

  for (let i = 0; i < sections.length; i++) {
    let section = document.getElementById(sections[i]);
    let cards = section.getElementsByClassName("ticket-card");
    let empty = document.getElementById(`${sections[i]}-empty`);
    if (cards.length <= 0) {
      empty.classList.remove("d-none");
    } else {
      empty.classList.add("d-none");
    }
  }
}

/**
 * Renders the progress bar for a task.
 * @param {number} count - The number of completed subtasks.
 * @param {number} length - The total number of subtasks.
 * @param {string} id - The task ID.
 */
function renderProgressBar(count, length, id) {
    let progressBar = document.getElementById(`filler-${id}`);
    let result = (count / length) * 100;
    progressBar.style.width = `${result}%`;
  }