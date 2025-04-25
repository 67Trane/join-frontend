

const params = new URLSearchParams(window.location.search);
let currentName = "";
const icon = params.get("icon");
const notAMember = params.get("userId");
let togglePopUp = false;

/**
 * Initializes the page by including HTML components and loading user-related data.
 * This function includes HTML components, then loads the account name, adjusts navigation links,
 * changes the navbar color, and loads the user's name.
 *
 * @async
 * @throws {Error} Throws an error if including HTML components fails.
 */
function init() {
  includeHTML()
    .then(() => {
      noMemberLink();
      changeNavbarColor();
      loadUserName();
    })
    .catch((error) => {
      console.error("Error including HTML:", error);
    });
}

/**
 * Loads and displays the current user's name in the greeting element.
 * If `currentName` is defined, it updates the inner HTML of the element with the ID 'greet-name'
 * to show the user's name.
 */
function loadAccountName() {
  greetId = document.getElementById("greet-name");
  if (currentName && greetId) {
    greetId.innerHTML = `${currentName}`;
  }
}

/**
 * Hides specific navigation links and account help box if the user is not a member.
 * If `notAMember` is true, it adds the 'd-none' class to the elements with IDs 'navbar-links'
 * and 'help-account-box' to hide them.
 */
function noMemberLink() {
  if (notAMember) {
    document.getElementById("navbar-links").classList.add("d-none");
    document.getElementById("help-account-box").classList.add("d-none");
  }
}

/**
 * Changes the background color of the navbar icon if it is defined.
 * If `icon` is defined, it adds the 'background-color' class to the element with the ID `icon`.
 */
function changeNavbarColor() {
  if (icon) {
    document.getElementById(`${icon}`).classList.add("background-color");
  }
}

/**
 * Toggles the visibility of a pop-up box displaying navigation links.
 * If `togglePopUp` is true, the function shows the pop-up box and adds the 'active' class to it.
 * Otherwise, it hides the pop-up box by removing its content.
 */
function renderPopUp() {
  let popUpBox = document.getElementById("headline-pop-up-container");
  togglePopUp = !togglePopUp;
  if (togglePopUp) {
    popUpBox.innerHTML = `
    <div id="headline-pop-up" class="headline-pop-up"> 
      <a class="pop-up-help" href="../documents/help.html">Help</a>
      <a href="../documents/legal.html">Legal Notice</a>
      <a href="../documents/Privacy.html">Privacy Policy</a>
      <a href="../index.html">Log out</a>
    </div>`;
    setTimeout(() => {
      document.getElementById("headline-pop-up").className += " active";
    }, 10);
  } else {
    let popUp = document.getElementById("headline-pop-up");
    if (popUp) {
      popUp.className = "headline-pop-up";
      setTimeout(() => (popUpBox.innerHTML = ""), 500);
    }
  }
}

/**
 * Navigates to the previous page in the browser history.
 */
function moveToLastPage() {
  history.back();
}

/**
 * Redirects the user to the help page.
 */
function openHelpPage() {
  window.location.href = "../documents/help.html";
}

/**
 * Redirects the user to the privacy policy page based on membership status.
 * If `notAMember` is true, it appends `userId` and `icon` parameters to the URL.
 * Otherwise, it only appends the `icon` parameter.
 */
function sendToPrivacyPolicyFromNavbar() {
  if (notAMember) {
    let noMember = true;
    window.location.href = `../documents/Privacy.html?userId=${noMember}&icon=privacy`;
  } else {
    window.location.href = "../documents/Privacy.html?icon=privacy";
  }
}

/**
 * Redirects the user to the legal notice page based on membership status.
 * If `notAMember` is true, it appends `userId` and `icon` parameters to the URL.
 * Otherwise, it only appends the `icon` parameter.
 */
function sendTolegalNoticeFromNavbar() {
  if (notAMember) {
    let noMember = true;
    window.location.href = `../documents/legal.html?userId=${noMember}&icon=legal`;
  } else {
    window.location.href = "../documents/legal.html?icon=legal";
  }
}

/**
 * Generates a random hexadecimal color code.
 *
 * @returns {string} A random color in hexadecimal format (e.g., "#a1b2c3").
 */
function getRandomColor() {
  let randomNumber = Math.floor(Math.random() * 16777215);
  let randomColor = "#" + randomNumber.toString(16).padStart(6, "0");
  return randomColor;
}

/**
 * Extracts the initials from a full name.
 *
 * @param {string} name - The full name of the contact.
 * @returns {Array<string>} An array containing the initials of the first and last name.
 */
function getContactInitials(name) {
  let namesArray = name.trim().split(" ");
  let lastName = namesArray[namesArray.length - 1];
  let firstName = namesArray[0];
  let initialFirst = firstName.charAt(0).toUpperCase();
  let initialLast = lastName.charAt(0).toUpperCase();
  return [initialFirst, initialLast];
}

/**
 * Stops the propagation of an event.
 *
 * @param {Event} event - The event to stop propagation for.
 */
function stopPropagation(event) {
  event.stopPropagation();
}
