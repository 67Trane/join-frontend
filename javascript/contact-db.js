/**
 * Initializes the contact list by fetching data from Firebase.
 * Clears the existing list and renders contacts.
 * @async
 * @function initializeContactList
 * @returns {Promise<void>}
 */
async function initializeContactList() {
  init();
  try {
    db = [];
    db = await getData("contacts/");
    taskDb = await getData("addTask/");
  } finally {
    listContentRef.innerHTML = "";
    renderContactGroups();
    if (currentId) {
      selectElement(currentId);
    }
  }
}

/**
 * Displays the success popup and fades it out after 2 seconds.
 * @function showSuccessPopup
 */
function showSuccessPopup() {
  const popup = document.getElementById("success-popup");
  popup.classList.remove("d-none");

  setTimeout(() => {
    popup.classList.add("fade-out");
    popup.addEventListener("animationend", () => {
      popup.classList.add("d-none");
      popup.classList.remove("fade-out");
    });
  }, 2000);
}

/**
 * Updates the contact information in Firebase RealtimeDB and the local database.
 * @async
 * @function updateContact
 * @param {Event} [event] - The event that triggers the update.
 * @returns {Promise<void>}
 */
async function updateContact(event) {
  if (event) {
    event.preventDefault();
  }

  const updatedData = getUpdatedContactData();
  if (!updatedData) return;

  try {
    const success = await sendUpdateRequest(currentId, updatedData);
    if (success) {
      updateLocalDatabase(currentId, updatedData);
      closeEditContactDialog();
      await initializeContactList();
      selectElement(currentId);
      updateDetailView(updatedData);

      if (updatedData.isUser) {
        await updateAccount();
      }
    } else {
      alert("Error updating contact.");
    }
  } catch (error) {
    alert(error.message);
  }
}

/**
 * Initializes the user database by fetching user data from Firebase.
 * @async
 * @function initializeUsers
 * @returns {Promise<void>}
 */
async function initializeUsers() {
  try {
    userDb = [];
    await getUserData("curent-user");
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
}
