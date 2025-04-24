let isDropdownOpen = false;
/**
 * Manages the dropdown menu for the contact list.
 */
function dropDown() {
  let dropdown = document.getElementById("all-contacts");
  let dropdownToggle = document.getElementById("contacts-searchfield");
  let arrow = document.getElementById("arrow-down");
  let isDropdownOpen = false;

  document.addEventListener("click", (event) => {
    if (dropdownToggle.contains(event.target) && event.target.tagName === "IMG") {
      if (!isDropdownOpen) {
        openAssignedList();
        if (typeof limitContactsImgs === 'function') {
          prepairForLimitContacts();
        }
      } else {
        closeAssignedList();
        if (typeof limitContactsImgs === 'function') {
          limitContactsImgs();
        }
      }
      isDropdownOpen = !isDropdownOpen;
    } else if (!dropdown.contains(event.target) && !dropdownToggle.contains(event.target)) {
      if (isDropdownOpen) {
        closeAssignedList();
        if (typeof limitContactsImgs === 'function') {
          limitContactsImgs();
        }
      } else {
        closeAssignedList();
      }
      isDropdownOpen = false;
    } else if (arrow.contains(event.target)) {
      openAssignedList();
      if (typeof limitContactsImgs === 'function') {
        prepairForLimitContacts();
      }
      isDropdownOpen = true;
    } else {
      openAssignedList();
      if (typeof limitContactsImgs === 'function') {
        prepairForLimitContacts();
      }
      isDropdownOpen = true;
    }
  });
}

/**
 * Closes the dropdown list of contacts.
 */
function closeAssignedList() {
  let placeholder = document.getElementById("assigne-placeholder");
  let contactimages = document.getElementById("contacts-imges");
  let search = document.getElementById("search-container");
  let dropdown = document.getElementById("all-contacts");
  let dropdownToggle = document.getElementById("contacts-searchfield");

  placeholder.style.display = "";
  dropdown.classList.add("d-none");
  search.classList.add("d-none");
  dropdown.style.animation = "";
  document.getElementById("arrow-down").style.animation = "";
  contactimages.classList.remove("d-none");
  dropdownToggle.classList.remove("focused");
}

/**
 * Opens the dropdown list of contacts.
 */
function openAssignedList() {
  let placeholder = document.getElementById("assigne-placeholder");
  let input = document.getElementById("myInput");
  let contactimages = document.getElementById("contacts-imges");
  let search = document.getElementById("search-container");
  let dropdown = document.getElementById("all-contacts");
  let dropdownToggle = document.getElementById("contacts-searchfield");

  dropdown.classList.remove("d-none");
  search.classList.remove("d-none");
  dropdown.style.animation = "slowdropdown 0.7s forwards";
  document.getElementById("arrow-down").style.animation = "rotate 0.5s forwards";
  contactimages.classList.add("d-none");
  input.focus();
  placeholder.style.display = "none";
  dropdownToggle.classList.add("focused");
  isDropdownOpen = true;
}

/**
 * Filters the contact list based on user input.
 */
function filterFunction() {
  let input = document.getElementById("myInput");
  let filter = input.value.toUpperCase();
  let div = document.getElementById("all-contacts");
  let pElements = div.getElementsByTagName("p");
  let nocontact = document.getElementById("noContact");
  let filteredContacts = [];

  nocontact.classList.add("d-none");
  for (let i = 0; i < pElements.length; i++) {
    let txtValue = pElements[i].textContent || pElements[i].innerText;
    let grandParent = pElements[i].parentElement.parentElement;

    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      grandParent.style.display = "";
      filteredContacts.push(txtValue);
    } else {
      grandParent.style.display = "none";
    }
  }
  if (filteredContacts.length == 0) {
    nocontact.classList.remove("d-none");
  }
  isDropdownOpen = false;
}
