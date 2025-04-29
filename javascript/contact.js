const showDetail = document.getElementById("contact-detail");
const detailRef = document.getElementById("detail");
const addContactRef = document.getElementById("add-contact");
const contactListRef = document.getElementById("contact-list");
const listContentRef = document.getElementById("list-content-outter");
const addButtonRef = document.getElementById("add-button");
const editButtonRef = document.getElementById("edit-button");
const editBoxRef = document.getElementById("edit-box");
const editContactRef = document.getElementById("edit-contact");
const detailHeaderMob = document.getElementById("mobile-overlay-detail");
let currentSelectedElement = null;

let db = [];
let inputData;
let organizedContacts = {};
let currentId;
let isCurrentUser;

/**
 * Renders the contact groups on the page.
 */
function renderContactGroups() {
  listContentRef.innerHTML = "";
  organizedContacts = {};
  groupContactsByInitials();
  sortContactGroups();
  renderContacts(organizedContacts);
}

/**
 * Groups contacts by their initials.
 */
function groupContactsByInitials() {
  db.forEach((contact) => {
    let initials = getContactInitials(contact.nameIn);
    let letter = initials[1];
    if (!organizedContacts[letter]) {
      organizedContacts[letter] = [];
    }
    organizedContacts[letter].push({
      ...contact,
      initials: initials,
    });
  });
}

/**
 * Sorts the contact groups alphabetically.
 */
function sortContactGroups() {
  Object.keys(organizedContacts).forEach((letter) => {
    organizedContacts[letter].sort((a, b) => a.nameIn.localeCompare(b.nameIn));
  });
}

/**
 * Renders the sorted contact groups.
 * @param {Object} organizedContacts - The contacts organized by initials.
 */
function renderContacts(organizedContacts) {
  let sortedInitials = Object.keys(organizedContacts).sort();
  let globalIndex = 0;
  sortedInitials.forEach((initial, index) => {
    renderInitialGroup(initial, index, organizedContacts[initial], globalIndex);
    globalIndex += organizedContacts[initial].length;
  });
}

/**
 * Renders a group of contacts under a specific initial.
 * @param {string} initial - The initial letter.
 * @param {number} index - The index of the group.
 * @param {Array} contacts - The contacts under this initial.
 * @param {number} globalIndex - The global index for contacts.
 */
function renderInitialGroup(initial, index, contacts, globalIndex) {
  listContentRef.innerHTML += contactTemplateInitial(initial, index);
  let currentContactRef = document.getElementById(`list-content-inner-${index}`);
  renderContactsForInitial(currentContactRef, contacts, globalIndex);
}

/**
 * Renders individual contacts in a group.
 * @param {HTMLElement} containerRef - The container element.
 * @param {Array} contacts - The contacts to render.
 * @param {number} globalIndex - The global index for contacts.
 */
function renderContactsForInitial(containerRef, contacts, globalIndex) {
  contacts.forEach((contact, i) => {
    containerRef.innerHTML += getContactsTemplate(
      contact.nameIn,
      contact.emailIn,
      contact.phoneIn,
      contact.id,
      contact.initials[0],
      contact.initials[1],
      contact.color,
      globalIndex + i,
      contact.isUser
    );
  });
}

/**
 * Opens the add contact dialog.
 */
function openAddContactDialog() {
  addContactRef.innerHTML = addDialogTemplate();
  addContactRef.classList.remove("d-none");
  setupDialogAnimation(addContactRef);
  addInputEventListeners(["name", "email", "phone"]);
}

/**
 * Closes the add contact dialog.
 */
function closeAddContactDialog() {
  closeDialog(addContactRef);
}

/**
 * Retrieves input values from the add contact form.
 * @param {Event} event - The form submit event.
 */
function getInputValues(event) {
  event.preventDefault();
  const nameInput = document.getElementById("name").value.trim();
  const emailInput = document.getElementById("email").value.trim();
  const phoneInput = document.getElementById("phone").value.trim();
  if (!validateInput(nameInput, emailInput, phoneInput)) return;
  const inputData = {
    nameIn: nameInput,
    emailIn: emailInput,
    phoneIn: phoneInput,
    isUser: false,
    color: getRandomColor(),
  };
  pushContact(inputData);
  closeAddContactDialog();
  window.location.reload()
}

/**
 * Opens the contact detail dialog.
 * @param {string} name - Contact's name.
 * @param {string} email - Contact's email.
 * @param {string} phone - Contact's phone number.
 * @param {string} id - Contact's ID.
 * @param {string} first - Contact's first initial.
 * @param {string} last - Contact's last initial.
 * @param {string} color - Contact's color.
 * @param {number} indexCard - Index of the contact card.
 * @param {boolean} user - Whether this contact is the current user.
 */
function openDetailDialog(name, email, phone, id, first, last, color, indexCard, user) {
  if (window.innerWidth >= 1024) {
    openDetailReferenceDesk(name, email, phone, id, first, last, color, user);
  } else {
    openDetailReferenceMob(name, email, phone, id, first, last, color, user);
  }
}

/**
 * Closes the contact detail dialog.
 */
function closeDetailDialog() {
  showDetail.classList.add("d-none");
  detailRef.classList.add("d-none");
  editButtonRef.classList.add("d-none");
  contactListRef.classList.remove("d-none");
  addButtonRef.classList.remove("d-none");
  listContentRef.classList.remove("d-none");
}

/**
 * Opens the contact detail view for desktop.
 * @param {string} name - Contact's name.
 * @param {string} email - Contact's email.
 * @param {string} phone - Contact's phone number.
 * @param {string} id - Contact's ID.
 * @param {string} first - Contact's first initial.
 * @param {string} last - Contact's last initial.
 * @param {string} color - Contact's color.
 * @param {boolean} user - Whether this contact is the current user.
 */
function openDetailReferenceDesk(name, email, phone, id, first, last, color, user) {
  currentId = id;
  const detailContentRef = document.getElementById("detail-desk");
  detailContentRef.innerHTML = detailTemplate(name, email, phone, id, first, last, color, user);
  setupDetailAnimation(detailContentRef);
  selectElement(id);
}

/**
 * Highlights the selected contact element.
 * @param {string} contactId - The ID of the contact to select.
 */
function selectElement(contactId) {
  const selectedElement = document.getElementById(`contact-card-${contactId}`);
  if (!selectedElement) return;
  if (currentSelectedElement && currentSelectedElement !== selectedElement) {
    currentSelectedElement.classList.remove("selected");
  }
  selectedElement.classList.add("selected");
  currentSelectedElement = selectedElement;
}

/**
 * Opens the contact detail view for mobile.
 * @param {string} name - Contact's name.
 * @param {string} email - Contact's email.
 * @param {string} phone - Contact's phone number.
 * @param {string} id - Contact's ID.
 * @param {string} first - Contact's first initial.
 * @param {string} last - Contact's last initial.
 * @param {string} color - Contact's color.
 * @param {boolean} user - Whether this contact is the current user.
 */
function openDetailReferenceMob(name, email, phone, id, first, last, color, user) {
  currentId = id;
  mobileDetailDivs();
  getDetailTemplateMob(name, email, phone, id, first, last, color, user);
}

/**
 * Adjusts the display for mobile detail view.
 */
function mobileDetailDivs() {
  showDetail.classList.remove("d-none");
  detailRef.classList.remove("d-none");
  editButtonRef.classList.remove("d-none");
  contactListRef.classList.add("d-none");
  editBoxRef.classList.add("d-none");
  addButtonRef.classList.add("d-none");
}

/**
 * Populates the contact detail template for mobile.
 * @param {string} name - Contact's name.
 * @param {string} email - Contact's email.
 * @param {string} phone - Contact's phone number.
 * @param {string} id - Contact's ID.
 * @param {string} first - Contact's first initial.
 * @param {string} last - Contact's last initial.
 * @param {string} color - Contact's color.
 * @param {boolean} user - Whether this contact is the current user.
 */
function getDetailTemplateMob(name, email, phone, id, first, last, color, user) {
  const initialsArray = getContactInitials(name);
  first = initialsArray[0];
  last = initialsArray[1];
  detailRef.innerHTML = detailTemplate(name, email, phone, id, first, last, color, user);
}

/**
 * Shows the edit box for editing a contact.
 * @param {Event} event - The event that triggered this function.
 */
function showEditBox(event) {
  stopPropagation(event);
  editBoxRef.classList.remove("d-none");
  editBoxRef.style.animation = "slideInFromRight 0.5s ease-in-out";
}

editBoxRef.addEventListener("animationend", function () {
  editBoxRef.style.animation = "";
});

/**
 * Hides the edit box.
 */
function hideEditBox() {
  editBoxRef.classList.add("d-none");
}

/**
 * Opens the edit contact dialog.
 * @param {string} id - Contact's ID.
 */
function openEditContactDialog(id) {
  const contact = db.find((contact) => {
    return contact.id == id;
  });
  showEditContactDialog(contact);
  initializeEditDialog(contact);
  addInputEventListeners(["edit-name", "edit-email", "edit-phone"]);
}

/**
 * Displays the edit contact dialog.
 * @param {Object} contact - The contact object.
 */
function showEditContactDialog(contact) {
  editContactRef.classList.remove("d-none");
  isCurrentUser = contact.isUser;
  const color = contact.color;
  editContactRef.innerHTML = showEditOverlay(contact.nameIn, contact.emailIn, contact.isUser, color);
  currentId = contact.id;
  hideEditBox();
}

/**
 * Initializes the edit dialog with contact data.
 * @param {Object} contact - The contact object.
 */
function initializeEditDialog(contact) {
  setTimeout(() => {
    setupDialogAnimation(editContactRef);
    populateEditDialogFields(contact);
  }, 0);
}

/**
 * Adds animation to a dialog.
 * @param {HTMLElement} dialogRef - The dialog element.
 * @param {string} [animationClass='animate-from-bottom'] - The animation class.
 */
function setupDialogAnimation(dialogRef, animationClass = "animate-from-bottom") {
  const dialogCard = dialogRef.querySelector(".contact-card.add");
  dialogCard.classList.add(animationClass);
  dialogCard.addEventListener("animationend", function () {
    dialogCard.classList.remove(animationClass);
  });
  dialogCard.addEventListener("click", function (event) {
    event.stopPropagation();
  });
  dialogRef.addEventListener("click", function () {
    closeDialog(dialogRef);
  });
}

/**
 * Adds animation to the detail view.
 * @param {HTMLElement} detailRef - The detail view element.
 */
function setupDetailAnimation(detailRef) {
  detailRef.classList.remove("animate-detail");
  setTimeout(() => {
    detailRef.classList.add("animate-detail");
    detailRef.addEventListener("animationend", function () {
      detailRef.classList.remove("animate-detail");
    });
  }, 10);
}

/**
 * Populates the edit dialog fields with contact data.
 * @param {Object} contact - The contact object.
 */
function populateEditDialogFields(contact) {
  document.getElementById("edit-name").value = contact.nameIn;
  document.getElementById("edit-email").value = contact.emailIn;
  document.getElementById("edit-phone").value = contact.phoneIn;
}

/**
 * Retrieves updated contact data from the edit form.
 * @returns {Object|null} The updated contact data or null if validation fails.
 */
function getUpdatedContactData() {
  const nameIn = document.getElementById("edit-name").value.trim();
  const emailIn = document.getElementById("edit-email").value.trim();
  const phoneIn = document.getElementById("edit-phone").value.trim();
  if (!validateInput(nameIn, emailIn, phoneIn, "edit-")) return null;
  const color = getRandomColor();
  const isUser = isCurrentUser;
  return { nameIn, emailIn, phoneIn, color, isUser };
}

/**
 * Updates the local database with new contact data.
 * @param {string} contactId - Contact's ID.
 * @param {Object} updatedData - The updated contact data.
 */
function updateLocalDatabase(contactId, updatedData) {
  const contactIndex = db.findIndex((contact) => contact.id === contactId);
  if (contactIndex > -1) {
    db[contactIndex] = { id: contactId, ...updatedData };
  }
}

/**
 * Updates the contact detail view with new data.
 * @param {Object} updatedData - The updated contact data.
 */
function updateDetailView(updatedData) {
  const initials = getContactInitials(updatedData.nameIn);
  if (!showDetail.classList.contains("d-none")) {
    getDetailTemplateMob(
      updatedData.nameIn,
      updatedData.emailIn,
      updatedData.phoneIn,
      currentId,
      initials[0],
      initials[1],
      updatedData.color
    );
  }

  openDetailReferenceDesk(
    updatedData.nameIn,
    updatedData.emailIn,
    updatedData.phoneIn,
    currentId,
    initials[0],
    initials[1],
    updatedData.color
  );
}

/**
 * Closes the edit contact dialog.
 */
function closeEditContactDialog() {
  closeDialog(editContactRef);
}

/**
 * Closes a dialog and clears its content.
 * @param {HTMLElement} dialogRef - The dialog element to close.
 */
function closeDialog(dialogRef) {
  dialogRef.classList.add("d-none");
  dialogRef.innerHTML = "";
}
