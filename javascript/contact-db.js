/**
 * @type {string}
 */
let baseUrl = "http://127.0.0.1:8000/api/";
// let baseUrl = 'https://join-318-default-rtdb.europe-west1.firebasedatabase.app/';

async function getData(path) {
  try {
    let response = await fetch(baseUrl + path, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: TOKEN ? `Token ${TOKEN}` : "",
      },
    });
    let data = await response.json();
    if (data) {
      let contactsArray = Object.entries(data).map(([key, value]) => {
        return {
          id: key,
          ...value,
        };
      });
      db.push(...contactsArray);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

async function getCurrentUser() {
  try {
    let response = await fetch(baseUrl + "curent-user", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: TOKEN ? `Token ${TOKEN}` : "",
      },
    });
    let data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

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
    await getData("contacts/");
    await getTasks("addTask/");
  } finally {
    listContentRef.innerHTML = "";
    renderContactGroups();
    // setCurrentTaskId();
    if (currentId) {
      selectElement(currentId);
    }
  }
}

/**
 * Fetches contact data from Firebase RealtimeDB.
 * @async
 * @function getData
 * @param {string} path - The path in the Firebase DB to fetch data from.
 * @returns {Promise<void>}
 */
// async function getData(path) {
//     console.log(path)
//     try {
//         let response = await fetch(baseUrl + path + '.json');
//         let data = await response.json();
//         console.log("hiier", data)

//         if (data) {
//             let contactsArray = Object.entries(data).map(([key, value]) => {
//                 return {
//                     id: key,
//                     ...value
//                 };
//             });
//             db.push(...contactsArray);
//         }
//     } catch (error) {
//         console.error('Error fetching data:', error);
//     }
// }

/**
 * Pushes new contact data into Firebase RealtimeDB.
 * @async
 * @function pushData
 * @param {Object} inputData - The contact data to push into the database.
 * @returns {Promise<void>}
 */

async function pushData(inputData) {
  inputData["user"] = [userDb[0].user];
  try {
    let response = await fetch(baseUrl + "contacts/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: TOKEN ? `Token ${TOKEN}` : "",
      },
      body: JSON.stringify(inputData),
    });
    if (!response.ok) {
      throw new Error("Error pushing data");
    }
    let responseData = await response.json();
    let newContactId = responseData.name;
    closeAddContactDialog();
    await initializeContactList();
    selectElement(newContactId);
    const initials = getContactInitials(inputData.nameIn);
    if (window.innerWidth >= 1024) {
      openDetailReferenceDesk(
        inputData.nameIn,
        inputData.emailIn,
        inputData.phoneIn,
        newContactId,
        initials[0],
        initials[1],
        inputData.color,
        false
      );
    } else {
      openDetailReferenceMob(
        inputData.nameIn,
        inputData.emailIn,
        inputData.phoneIn,
        newContactId,
        initials[0],
        initials[1],
        inputData.color,
        false
      );
    }
    showSuccessPopup();
  } catch (error) {
    console.error("Error pushing data:", error);
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
 * Deletes a contact from Firebase RealtimeDB.
 * @async
 * @function deleteContact
 * @param {number} contactId - The ID of the contact to delete.
 * @returns {Promise<void>}
 */
async function deleteContact(contactId) {
  try {
    let response = await fetch(baseUrl + `contacts/${contactId}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: TOKEN ? `Token ${TOKEN}` : "",
      },
    });
    if (!response.ok) {
      throw new Error("Error deleting contact");
    }
    closeDetailDialog();
    initializeContactList();
  } catch (error) {
    console.error("Error deleting contact:", error);
  }
  document.getElementById("detail-desk").innerHTML = "";
}

/**
 * Sends an update request to Firebase RealtimeDB for a specific contact.
 * @async
 * @function sendUpdateRequest
 * @param {number} contactId - The ID of the contact to update.
 * @param {Object} updatedData - The updated contact data.
 * @returns {Promise<boolean>} True if the request was successful, false otherwise.
 */
async function sendUpdateRequest(contactId, updatedData) {
  try {
    let response = await fetch(baseUrl + `contacts/${contactId}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: TOKEN ? `Token ${TOKEN}` : "",
      },
      body: JSON.stringify(updatedData),
    });
    if (!response.ok) {
      throw new Error("Error updating contact");
    }
    return true;
  } catch (error) {
    console.error("Error updating contact:", error);
    return false;
  }
}

/**
 * Sends an update request to Firebase RealtimeDB for a specific contact.
 * @async
 * @function sendUpdateRequest
 * @param {number} contactId - The ID of the contact to update.
 * @param {Object} updatedData - The updated contact data.
 * @returns {Promise<boolean>} True if the request was successful, false otherwise.
 */
async function sendUpdateTaskRequest(contactId, updatedData) {
 
  try {
    let response = await fetch(baseUrl + `addTask/${contactId}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: TOKEN ? `Token ${TOKEN}` : "",
      },
      body: JSON.stringify(updatedData),
    });
    if (!response.ok) {
      throw new Error("Error updating contact");
    }
    return true;
  } catch (error) {
    console.error("Error updating contact:", error);
    return false;
  }
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

/**
 * Fetches user data from Firebase RealtimeDB.
 * @async
 * @function getUserData
 * @param {string} path - The path in the Firebase DB to fetch user data from.
 * @returns {Promise<void>}
 */
async function getUserData(path) {
  try {
    let userResponse = await fetch(baseUrl + path);
    let userData = await userResponse.json();

    if (userData) {
      let userArray = Object.entries(userData).map(([key, value]) => {
        return {
          userId: key,
          ...value,
        };
      });
      userDb.push(...userArray);
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
}

/**
 * Updates the user account data in Firebase RealtimeDB.
 * @async
 * @function updateAccount
 * @returns {Promise<boolean>} True if the update was successful, false otherwise.
 */
async function updateAccount() {
  try {
    const updatedData = getUpdatedContactData();
    let response = await fetch(`${baseUrl}curent-user/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      throw new Error("Error updating user account");
    }
    return true;
  } catch (error) {
    console.error("Error updating user account:", error);
    return false;
  }
}
