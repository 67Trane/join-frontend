/** @constant {string} */
// let BASE_URL = "https://join-318-default-rtdb.europe-west1.firebasedatabase.app/";
let BASE_URL = "http://127.0.0.1:8000/api/";
const TOKEN = localStorage.getItem("token");

/**
 * Global task object to store task information.
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
  color: [],
  inits: "",
  user: [],
};

/** @type {string} */
let section;

/** @type {Object} */
let listOfContacts;

let currentUser;

/**
 * Loads initial data and initializes the application.
 */
function onload() {
  getCurentUser();
  loadContacts();
  includeHTML();
  dropDown();
  taskSelected();
  selectedPrio("medium");
  init();
}

async function getCurentUser() {
  let response = await fetch(BASE_URL + "curent-user");
  res = await response.json();
  currentUser = res[0];
}

/**
 * Sends task information to the server to save it.
 */
function postInfos() {
  tasks.user.push(currentUser.user)
  try {
    fetch(BASE_URL + "addTask/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: TOKEN ? `Token ${TOKEN}` : "",
      },
      body: JSON.stringify({
        title: tasks.title,
        description: tasks.description,
        assignedto: tasks.assignedto,
        date: tasks.date,
        prio: tasks.prio,
        category: tasks.category,
        subtask: tasks.subtask,
        status: section,
        color: `${tasks.color}`,
        inits: tasks.inits,
        user: tasks.user
      }),
    });
  } catch (error) {
    console.error(error);
  }
}

/**
 * Loads contacts from the server and passes them for rendering.
 */
function loadContacts() {
  
  fetch(BASE_URL + "contacts/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: TOKEN ? `Token ${TOKEN}` : "",
    },
  })
    .then((response) => response.json())
    .then((result) => renderContacts(result))
    .catch((error) => console.log(error));
}

/**
 * Extracts the initials of a contact.
 * @param {string} contacts - The full name of the contact.
 * @returns {Array<string>} - An array containing the initials.
 */
function getContactInitials(contacts) {
  let newcontact = contacts.split(" ");
  let firstinits = newcontact[0]?.charAt(0).toUpperCase() || "";
  let secondinits = newcontact[1]?.charAt(0).toUpperCase() || "";
  return [firstinits, secondinits];
}

/**
 * Renders the loaded contacts in the UI.
 * @param {Object} contacts - An object containing contact data.
 */
function renderContacts(contacts) {
  listOfContacts = contacts;
  let contactcontainer = document.getElementById("all-contacts");
  let allcontacts = [];
  let colors = [];
  for (let letter in contacts) {
    allcontacts.push(contacts[letter].nameIn);
    colors.push(contacts[letter].color);
  }
  for (i = 0; i < allcontacts.length; i++) {
    allcontacts[i] ||= "Contact not found";
    let [firstinits, secondinits] = getContactInitials(allcontacts[i]);
    tasks.inits += firstinits + secondinits + ",";
    contactcontainer.innerHTML += renderAssignedTo(allcontacts, i, firstinits, secondinits, colors);
    contactsImages(i);
  }
}

/**
 * Updates the contact images in the UI.
 * @param {number} i - The index of the current contact.
 */
function contactsImages(i) {
  let imgcontainer = document.getElementById("contacts-imges");
  let inits = document.getElementById(`inits${i}`).innerHTML;
  imgcontainer.innerHTML += renderContactsImages(inits, i);
}

/**
 * Handles the selection of a contact in the assignment list.
 * @param {number} id - The ID of the selected contact.
 */
function assignedToChecked(id) {
  let checkbox = document.getElementById(`cbtest-19-${id}`);
  let grandParent = checkbox.parentElement.parentElement;
  let img = document.getElementById(`contact-initals1${id}`);
  let contactimg = document.getElementById(`contact-initals${id}`);
  let color = contactimg.style.backgroundColor;
  let contactid = document.getElementById(`id=${id}`);
  let contact = contactid.getElementsByTagName("p");
  toggleCheckbox(id);
  if (checkbox.checked) {
    img.classList.remove("d-none");
    img.style.backgroundColor = color;
    getSelectedColor(color);
    tasks.assignedto.push(contact[0].textContent);
  } else {
    deleteSelectedColor(color);
    img.classList.add("d-none");
    let remove = tasks.assignedto.indexOf(contact[0].textContent);
    tasks.assignedto.splice(remove, 1);
  }
  grandParent.classList.toggle("background");
}

/**
 * Toggles the state of the checkbox.
 * @param {number} i - The index of the checkbox.
 */
function toggleCheckbox(i) {
  let checkbox = document.getElementById(`cbtest-19-${i}`);
  checkbox.checked = !checkbox.checked;
}

/** @type {Array<string>} */
getcolors = [];

/**
 * Removes a selected color from the list.
 * @param {string} color - The color to be removed.
 */
function deleteSelectedColor(color) {
  let index = getcolors.indexOf(color);
  getcolors.splice(index, 1);
  tasks.color = getcolors;
}

/**
 * Handles the selection of a category or task.
 * @param {string} [task] - The selected task or category.
 */
function taskSelected(task) {
  let categorylist = document.getElementById("categorys");
  let category = document.getElementById("input-category");
  let selecttask = document.getElementById("select-task");
  let tech = document.getElementById("tech");
  let user = document.getElementById("user");
  let categorytext = document.getElementById("category-required");
  let categoryDiv = document.getElementById("input-category");
  selecttask.innerHTML = "Select task category";

  document.addEventListener("click", (event) => {
    if (!category.contains(event.target)) {
      categorylist.classList.add("d-none");
    } else if (category.contains(event.target) && event.target.tagName === "IMG") {
      categorylist.classList.add("d-none");
    } else {
      categorylist.classList.remove("d-none");
      categorytext.classList.add("d-none");
      categoryDiv.classList.remove("notfound");
    }
  });
  if (task == "tech") {
    tech.classList.add("background");
    user.classList.remove("background");
    selecttask.innerHTML = "Technical Task";
    tasks.category = "Technical Task";
  } else if (task == "user") {
    user.classList.add("background");
    tech.classList.remove("background");
    selecttask.innerHTML = "User Story";
    tasks.category = "User Story";
  }
}

/**
 * Adds a new subtask.
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

/** @type {number} */
let id = 0;

/**
 * Cancels the input of a new subtask.
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
 * Adds the entered subtask to the list.
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
 * @param {number} id - The ID of the subtask to delete.
 */
function deleteSubtask(id) {
  let subtask = document.getElementById(`id-${id}`);
  subtask.remove();
}

/**
 * Enables editing of a subtask.
 * @param {number} id - The ID of the subtask to edit.
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
 * @param {number} id - The ID of the edited subtask.
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
 * Checks if all required fields are filled.
 * @returns {boolean} - True if all required fields are filled.
 */
function requiredFieldsCheck() {
  let date = document.getElementById("input-date");
  isCategorySelected();
  if (!date.value) {
    date.style.border = "1px solid rgb(255, 129, 144)";
    document.getElementById("date-required").classList.remove("d-none");
  }
  if (!tasks.date || !tasks.title || !tasks.category) {
    return false;
  } else {
    return true;
  }
}

/**
 * Checks the current status of the task.
 */
function checkStatus() {
  let iframe = window.parent.document.getElementById("whole-addtask-card");
  if (iframe) {
    let name = iframe.getAttribute("name");
    section = name;
  } else {
    section = "todo";
  }
}

/**
 * Checks if the current page is "addtask-card.html".
 * @returns {boolean} - True if the current page is "addtask-card.html".
 */
function checkWindowLocation() {
  if (window.location.href.endsWith("documents/addtask-card.html")) {
    return true;
  } else {
    return false;
  }
}

/**
 * Retrieves all task information and validates inputs.
 */
function getAllInfos() {
  getTitle();
  getDescription();
  getSubtasks();
  if (requiredFieldsCheck() == true) {
    checkStatus();
    postInfos();
    if (checkWindowLocation()) {
      successDisplay();
      setTimeout(() => {
        parent.closeWindow("whole-addtask-card");
      }, 2000);
    } else {
      successDisplay();
      setTimeout(() => {
        window.location = "./board.html";
      }, 2000);
    }
  }
}

/**
 * Clears all input fields and resets the form.
 */
function clearAllFields() {
  tasks = {
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
  let title = document.getElementById("input-title");
  let desc = document.getElementById("text-area");
  let contacts = document.getElementById("all-contacts");
  let imges = document.getElementById("contacts-imges");
  let date = document.getElementById("input-date");
  let subtasks = document.getElementById("subtasklist");
  subtasks.innerHTML = "";
  date.value = "";
  imges.innerHTML = "";
  title.value = "";
  desc.value = "";
  contacts.innerHTML = "";
  renderContacts(listOfContacts);
  selectedPrio("medium");
  taskSelected();
}

/**
 * Displays a success message.
 */
function successDisplay() {
  let container = document.getElementById("success-container");
  container.classList.remove("d-none");
}
