/**
 * Represents the task object with various properties.
 * @type {Object}
 */
let tasks = {
  title: "",
  description: "",
  assignedto: [],
  date: "",
  prio: "",
  category: "",
  subtask: [],
  color: "",
  inits: "",
};

/**
 * Initializes the page by loading contacts and setting up the dropdown.
 */
function onload() {
  loadContacts();
  dropDown();
  minimumDate();
}

// let BASE_URL = "https://join-318-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * Extracts the initials from a contact's name.
 *
 * @param {string} contacts - The full name of the contact.
 * @returns {string[]} An array containing the first and second initials.
 */
function getContactInitials(contacts) {
  let newcontact = contacts.split(" ");
  let firstinits = newcontact[0]?.charAt(0).toUpperCase() || "";
  let secondinits = newcontact[1]?.charAt(0).toUpperCase() || "";
  return [firstinits, secondinits];
}

/**
 * Renders the list of contacts on the page.
 *
 * @param {Object} contacts - The contacts data retrieved from the server.
 */
function renderContacts(contacts) {
  let contactcontainer = document.getElementById("all-contacts");
  let allcontacts = [];
  let colors = [];
  for (let letter in contacts) {
    allcontacts.push(contacts[letter].nameIn);
    colors.push(contacts[letter].color);
  }
  for (let i = 0; i < allcontacts.length; i++) {
    allcontacts[i] ||= "Kontakt nicht gefunden";
    let [firstinits, secondinits] = getContactInitials(allcontacts[i]);
    tasks.inits += firstinits + secondinits + ",";
    contactcontainer.innerHTML += renderAssignedTo(allcontacts, i, firstinits, secondinits, colors);
    contactsImages(i);
    getContactsByParent(allcontacts[i], i);
  }
}

/**
 * Checks if a contact is assigned to the parent task and updates the assigned status.
 *
 * @param {string} contact - The contact name.
 * @param {number} i - The index of the contact.
 */
function getContactsByParent(contact, i) {
  let category = document.getElementById("deliver-category");
  let status = document.getElementById("deliver-status");
  let parentContact = document.getElementById("deliver-names");
  let splitedNames = parentContact.innerHTML.split(",");
  tasks.status = status.innerHTML;
  tasks.category = category.innerHTML;
  splitedNames.forEach((element) => {
    if (element == contact) {
      assignedToChecked(i, true);
    }
  });
}

/**
 * Renders the contact images.
 *
 * @param {number} i - The index of the contact.
 */
function contactsImages(i) {
  let imgcontainer = document.getElementById("contacts-imges");
  let inits = document.getElementById(`inits${i}`).innerHTML;
  imgcontainer.innerHTML += renderContactsImages(inits, i);
}

/**
 * Sets the selected priority and updates the UI accordingly.
 *
 * @param {string} prio - The selected priority ('urgent', 'medium', 'low').
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
 * Resets the priority buttons to their default styles.
 *
 * @param {HTMLElement} urgent - The urgent priority button element.
 * @param {HTMLElement} medium - The medium priority button element.
 * @param {HTMLElement} low - The low priority button element.
 * @param {HTMLImageElement} urgentimg - The urgent priority image element.
 * @param {HTMLImageElement} mediumimg - The medium priority image element.
 * @param {HTMLImageElement} lowimg - The low priority image element.
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
 * Toggles the assigned status of a contact and updates the UI.
 *
 * @param {number} id - The ID of the contact.
 */
let checkedIds = [];
function assignedToChecked(id, checked) {
  let checkbox = document.getElementById(`cbtest-19-${id}`);
  let grandParent = checkbox.parentElement.parentElement;
  let img = document.getElementById(`contact-initals1${id}`);
  let contactimg = document.getElementById(`contact-initals${id}`);
  let color = contactimg.style.backgroundColor;
  let contactid = document.getElementById(`id=${id}`);
  let contact = contactid.getElementsByTagName("p");
  if (checked) {
    checkbox.setAttribute("checked", "checked");
  } else {
    checkbox.checked = !checkbox.checked;
  }
  if (checkbox.checked) {
    checkedContact(img, color, contact, grandParent, id);
  } else {
    notCheckedContact(img, color, contact, grandParent, id);
  }
}

let checkedAmount = 0;
function checkedContact(img, color, contact, grandParent, id) {
  img.classList.remove("d-none");
  img.style.backgroundColor = color;
  tasks.assignedto.push(contact[0].textContent);
  getSelectedColor(color);
  grandParent.classList.add("background");
  checkedAmount++;
  limitContactsImgs(`plus: ${id}`);
}

function notCheckedContact(img, color, contact, grandParent, id) {
  grandParent.classList.remove("background");
  deleteSelectedColor(color);
  img.classList.add("d-none");
  let remove = tasks.assignedto.indexOf(contact[0].textContent);
  tasks.assignedto.splice(remove, 1);
  checkedAmount--;
  limitContactsImgs(`minus: ${id}`);
}

let getcolors = [];
/**
 * Deletes a selected color from the color array.
 *
 * @param {string} color - The color to delete.
 */
function deleteSelectedColor(color) {
  let index = getcolors.indexOf(color);
  getcolors.splice(index, 1);
  tasks.color = getcolors;
}

/**
 * Initializes the subtask input and sets up event listeners.
 */
function addSubtask() {
  let addimg = document.getElementById("add-img");
  let notok = document.getElementById("ok-notok-section");
  let subtasklist = document.getElementById("subtasklist");
  let input = document.getElementById("input-subtask");
  let searchbar = document.getElementById("subtask-search-bar");
  let required = document.getElementById("subtask-required");
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      if (input.value === "") {
        subtaskIsEmpty();
      } else {
        addToSubtask();
      }
    } else {
      searchbar.classList.remove("notfound");
      required.classList.add("d-none");
    }
  });
  addimg.classList.add("d-none");
  notok.classList.remove("d-none");
  subtasklist.classList.remove("d-none");
}

let id = 0;
/**
 * Cancels the subtask input and resets the UI.
 */
function cancelSubtaskInput() {
  let input = document.getElementById("input-subtask");
  let addimg = document.getElementById("add-img");
  let notok = document.getElementById("ok-notok-section");
  input.value = "";
  addimg.classList.remove("d-none");
  notok.classList.add("d-none");
}

/**
 * Adds a subtask to the subtask list.
 */
function addToSubtask() {
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
 * Deletes a subtask from the list.
 *
 * @param {number} id - The ID of the subtask.
 */
function deleteSubtask(id) {
  let subtask = document.getElementById(`id-${id}`);
  subtask.remove();
}

/**
 * Enables editing of a subtask.
 *
 * @param {number} id - The ID of the subtask.
 */
function editSubtask(id) {
  let subtask = document.getElementById(`id-${id}`);
  let editdelete = document.getElementById(`edit-delete${id}`);
  let task = document.getElementById(`subtask${id}`);
  task.innerHTML = renderInputfieldEdit(id, task.innerHTML);
  editdelete.innerHTML = renderEditOptions(id);
  subtask.classList.replace("task", "onedit");
}

/**
 * Saves the edited subtask.
 *
 * @param {number} id - The ID of the subtask.
 */
function edited(id) {
  let newtask = document.getElementById(`newtask${id}`).value;
  let subtask = document.getElementById(`id-${id}`);
  let task = document.getElementById(`subtask${id}`);
  let editdelete = document.getElementById(`edit-delete${id}`);
  subtask.classList.replace("onedit", "task");
  editdelete.innerHTML = renderEditDoneImages(id);
  task.innerHTML = newtask;
}

/**
 * Checks if required fields are filled.
 *
 * @returns {boolean} True if required fields are filled, else false.
 */
function requiredFieldsCheck() {
  let date = document.getElementById("input-date");
  if (!date.value) {
    date.style.border = "1px solid rgb(255, 129, 144)";
    document.getElementById("date-required").classList.remove("d-none");
  }
  if (!tasks.date || !tasks.title) {
    return false;
  } else {
    return true;
  }
}

/**
 * Gathers all task information and updates the server.
 */
function getAllInfos() {
  checkSubtaskIsOnEdit();
  getTitle();
  getDescription();
  getSubtasks();
  getDate();
  if (requiredFieldsCheck() == true) {
    let cardId = document.getElementById("deliver-cardId").innerHTML;
    tasks.id = cardId;
    updateTask(cardId, tasks);
    successDisplay();
    setTimeout(() => {
      parent.closeWindow("edit-card");
    }, 1000);
  }
}

function checkSubtaskIsOnEdit() {
  let list = document.getElementById("subtasklist");
  let onedit = list.getElementsByClassName("onedit");
  if (onedit.length > 0) {
    for (let i = onedit.length - 1; i >= 0; i--) {
      let newid = onedit[i].id;
      let cleanedid = newid.replace("id-", "");
      edited(cleanedid);
    }
  }
}

function clearAllFields() {
  window.location.reload();
}

function minimumDate() {
  let dateInput = document.getElementById("input-date");
  let today = new Date();
  let year = today.getFullYear();
  let month = String(today.getMonth() + 1).padStart(2, "0");
  let day = String(today.getDate()).padStart(2, "0");
  let todayDate = `${year}-${month}-${day}`;
  dateInput.attributes.minimumDate = todayDate;
}

function successDisplay() {
  let container = document.getElementById("success-container");
  container.classList.remove("d-none");
}

function hidePlusAmouhnt(over) {
  if (checkedAmount <= 5) {
    over.classList.add("d-none");
  } else {
    over.classList.remove("d-none");
  }
}

let imgIds = [];
function limitContactsImgs(id) {
  contactIdAmounts(id);
  let imgList = document.getElementById("contacts-imges");
  let imgs = imgList.querySelectorAll(".contact-initals:not(.d-none)");
  let over = document.getElementById("over-amount");
  if (imgIds.length > 5) {
    for (let i = 0; i < imgIds.length - 5; i++) {
      imgs[imgs.length - 1 - i].classList.add("d-none");
    }
    over.classList.remove("d-none");
    over.innerHTML = "+" + (imgIds.length - 5);
  } else {
    over.classList.add("d-none");
  }
}

function contactIdAmounts(id) {
  if (id) {
    if (id.startsWith("plus: ")) {
      let newid = id.replace("plus: ", "");
      addToArray(newid);
    } else {
      let newid = id.replace("minus: ", "");
      let index = imgIds.indexOf(newid);
      if (index !== -1) {
        imgIds.splice(index, 1);
      }
    }
  }
}

function prepairForLimitContacts() {
  let imgList = document.getElementById("contacts-imges");
  let imgs = imgList.getElementsByClassName("contact-initals");
  for (let j = 0; j < imgIds.length; j++) {
    imgs[imgIds[j]].classList.remove("d-none");
  }
}

function addToArray(id) {
  if (!imgIds.includes(id)) {
    imgIds.push(id);
  }
}
