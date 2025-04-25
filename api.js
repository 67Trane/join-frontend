const BASE_URL = "http://127.0.0.1:8000/api/";
const TOKEN = localStorage.getItem("token");

async function loginUser() {
  let userEmail = document.getElementById("user-email").value;
  let userPassword = document.getElementById("user-password").value;

  try {
    let user = await fetch(BASE_URL + "login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: userEmail,
        password: userPassword,
      }),
    });
    if (user.status == 200) {
      currentUser = await user.json();
      let currentAccountName = currentUser.username;
      let currentEmail = currentUser.email;
      let currentToken = currentUser.token;

      await postCurrentUser(currentAccountName, currentEmail, currentToken, currentUser.user);
      window.location.href = `./documents/summary.html?name=${encodeURIComponent(currentAccountName)}`;
      localStorage.setItem("token", currentUser.token);

      closeAddContactDialog();
      initialize();
    } else {
      document.getElementById("user-email").classList.add("border-color-red");
      document.getElementById("user-password").classList.add("border-color-red");
      renderWrongLogIn();
      return;
    }
  } catch (error) {
    console.log("Error pushing data:", error);
  }
}

async function getCurentUser() {
  let response = await fetch(BASE_URL + "curent-user");
  res = await response.json();
  currentUser = res[0];
}

/**
 * Sends task information to the server to save it.
 */
async function postInfos() {
  tasks.user.push(currentUser.user);
  try {
    await fetch(BASE_URL + "addTask/", {
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
        user: tasks.user,
      }),
    });
  } catch (error) {
    console.error(error);
  }
}

/**
 * Loads contacts from the server and passes them for rendering.
 */
async function loadContacts() {
  await fetch(BASE_URL + "contacts/", {
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
 * Fetches tasks from the Firebase database and populates the `taskDb` array.
 *
 * @async
 * @function getTasks
 * @param {string} path - The path to the Firebase database endpoint.
 * @returns {Promise<void>} - A promise that resolves when tasks are fetched and added to `taskDb`.
 */
// async function getTasks(path) {
//   let taskArray = [];

//   try {
//     let response = await fetch(BASE_URL + path, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: TOKEN ? `Token ${TOKEN}` : "",
//       },
//     });
//     let data = await response.json();
//     if (data) {
//       taskArray = Object.entries(data).map(([key, value]) => {
//         return {
//           firebaseid: key,
//           ...value,
//         };
//       });
//       taskDb.push(...taskArray);
//     }
//   } catch (error) {
//     console.error("Error fetching data:", error);
//   }
// }

async function getData(path) {
  try {
    let response = await fetch(BASE_URL + path, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: TOKEN ? `Token ${TOKEN}` : "",
      },
    });
    let data = await response.json();
    if (data) {
      return data;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

async function updateTask(id, payload) {
  const url = `${BASE_URL}addTask/${id}/`;
  await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: TOKEN ? `Token ${TOKEN}` : "",
    },
    body: JSON.stringify(payload),
  });
}

// /**
//  * Updates the task data on the server.
//  */
// async function updateServer() {
//   await fetch(BASE_URL + "addTask/" + cardId + "/", {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: TOKEN ? `Token ${TOKEN}` : "",
//     },
//     body: JSON.stringify(tasks),
//   });
// }

// /**
//  * Updates the server with the provided subtask status.
//  *
//  * @param {Object} task - The subtask object to update on the server.
//  */
// async function updateServer(task) {
//   try {
//     await fetch(BASE_URL + "addTask/" + clickedCardId + "/", {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: TOKEN ? `Token ${TOKEN}` : "",
//       },
//       body: JSON.stringify(task),
//     });
//   } catch (error) {
//     console.log(error);
//   }
// }

// async function updateServer(task, alltask) {
//   await fetch(BASE_URL + "addTask/" + task + "/", {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: TOKEN ? `Token ${TOKEN}` : "",
//     },
//     body: JSON.stringify(alltask),
//   });
// }

/**
 * Deletes a task from the server.
 *
 * @param {number} id - The ID of the task to delete from the server.
 */
function deleteFromServer(id) {
  fetch(BASE_URL + "addTask/" + id + "/", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: TOKEN ? `Token ${TOKEN}` : "",
    },
  });
}

/**
 * Uploads the amounts object to the server.
 */
async function uploadAmount() {
  await fetch(BASE_URL + "Status/1/", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(amounts),
  });
}

async function loadTasks() {
  try {
    let response = await fetch(BASE_URL + "addTask/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: TOKEN ? `Token ${TOKEN}` : "",
      },
    });
    let data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

// async function loadTasks2() {
//   await fetch(BASE_URL + "addTask/", {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: TOKEN ? `Token ${TOKEN}` : "",
//     },
//   })
//     .then((response) => response.json())
//     .then((result) => {
//       let values = result && typeof result === "object" ? Object.values(result) : "";
      
//       checkTask(values);
//     });
// }

async function getCurrentUser() {
  try {
    let response = await fetch(BASE_URL + "curent-user", {
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

async function pushData(inputData) {
  inputData["user"] = [userDb[0].user];
  try {
    let response = await fetch(BASE_URL + "contacts/", {
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
 * Deletes a contact from Firebase RealtimeDB.
 * @async
 * @function deleteContact
 * @param {number} contactId - The ID of the contact to delete.
 * @returns {Promise<void>}
 */
async function deleteContact(contactId) {
  try {
    let response = await fetch(BASE_URL + `contacts/${contactId}/`, {
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
    let response = await fetch(BASE_URL + `contacts/${contactId}/`, {
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
    let response = await fetch(BASE_URL + `addTask/${contactId}/`, {
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
 * Fetches user data from Firebase RealtimeDB.
 * @async
 * @function getUserData
 * @param {string} path - The path in the Firebase DB to fetch user data from.
 * @returns {Promise<void>}
 */
async function getUserData(path) {
  try {
    let userResponse = await fetch(BASE_URL + path);
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
    let response = await fetch(`${BASE_URL}curent-user/`, {
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

/**
 * Fetches the current user's data from the server and renders the user's name.
 * The function retrieves the current user's information from the specified URL and then
 * passes the result to the `renderUserName` function for display.
 *
 * @async
 * @throws {Error} Throws an error if the network request fails.
 */
function loadUserName() {
  fetch(currentUserURL)
    .then((response) => response.json())
    .then((result) => {
      renderUserName(result[0]);
    })
    .catch((error) => console.log("Error fetching datas:", error));
}

async function createStatusAmount() {
  let amounts = {
    awaitfeedback: 0,
    done: 0,
    inprogress: 0,
    todo: 0,
    urgent: 0,
  };
  fetch(BASE_URL + "Status/1/", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(amounts),
  });
}

async function postCurrentUser(userName, userEmail, token, userid) {
  try {
    const response = await fetch(currentUserURL + "1/", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nameIn: `${userName}`, emailIn: `${userEmail}`, token: `${token}`, user: `${userid}` }),
    });
    if (!response.ok) {
      throw new Error("Error posting data");
    }
  } catch (error) {
    console.error("Error posting current user:", error);
  }
}

async function createGuest() {
  const res = await fetch(`${BASE_URL}registration/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: "Guest",
      email: "guest@guest.de",
      password: "guestlogin",
      repeated_password: "guestlogin",
    }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    console.error("Guest registration failed:", errData);
    throw new Error(`Registration failed (${res.status})`);
  }
}

async function guestLogin(retried = false) {
  const res = await fetch(`${BASE_URL}login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "guest@guest.de",
      password: "guestlogin",
    }),
  });

  // If Django returns 400 (bad creds), create guest then retry
  if (!res.ok) {
    if (!retried) {
      console.warn("Guest login failed; creating guest account…");
      await createGuest();
      return guestLogin(true);
    } else {
      // Already retried once — bail out
      throw new Error(`Guest login still failing: ${res.status}`);
    }
  }

  // Success path
  const currentUser = await res.json();
  localStorage.setItem("token", currentUser.token);
  await postCurrentUser(currentUser.username, currentUser.email, currentUser.token, currentUser.user);
  postNewAccount(currentUser.username, currentUser.email);
  window.location.href = `./documents/summary.html?name=${encodeURIComponent(currentUser.username)}`;
}

async function setNoCurrentUser() {
  let userName = "Guest";
  if (userName) {
    document.getElementById("wrong-log-in").classList.add("d-none");
  }
  try {
    const response = await fetch(currentUserURL + "1/", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nameIn: `${userName}`, emailIn: "" }),
    });
    if (!response.ok) {
      throw new Error("Error posting data");
    }
  } catch (error) {
    console.error("Error posting no current user:", error);
  }
}

async function pushData(inputData) {
  try {
    let response = await fetch(BASE_URL + "registration/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inputData),
    });
    currentUser = await response.json();
    if (!response.ok) {
      throw new Error("Error pushing data");
    }
    postNewAccount(currentUser.username, currentUser.email);
    initialize();
  } catch (error) {
    console.log("Error pushing data:", error);
  }
}

async function postNewAccount(newName, newEmail) {
  await fetch(BASE_URL + "contacts/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: currentUser.token ? `Token ${currentUser.token}` : "",
    },

    body: JSON.stringify({
      nameIn: `${newName}`,
      emailIn: `${newEmail}`,
      phoneIn: "0",
      isUser: true,
      color: "blue",
      user: [+currentUser.user],
    }),
  });
  renderSuccessfully();
  setTimeout(() => {
    window.location.href = "./index.html";
  }, 2000);
}

async function updateStatus(nr) {
  fetch(BASE_URL + "Status/1/", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nr),
  });
}

async function loadAccounts() {
  await fetch(BASE_URL + "Status/")
    .then((response) => response.json())
    .then((result) => {
      amounts = result[0];
    })
    .catch((error) => console.log("Error fetching data:", error));
}
