/**
 * @fileoverview Client-side API wrapper for interacting with the Django REST Framework backend.
 * @module apiClient
 */

/**
 * Base URL of the API endpoints.
 * @constant {string}
 */
const BASE_URL = "http://127.0.0.1:8000/api/";

/**
 * Authorization token stored in localStorage.
 * @type {string|null}
 */
let TOKEN = localStorage.getItem("token");

/**
 * Logs in a user using email and password inputs from the DOM.
 * On success, stores the auth token and redirects to the summary page.
 * If the user is new, adds them to the contact list.
 * @async
 * @returns {Promise<void>}
 */
async function loginUser() {
  const userEmail = document.getElementById("user-email").value;
  const userPassword = document.getElementById("user-password").value;

  try {
    const response = await fetch(`${BASE_URL}login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: userEmail, password: userPassword }),
    });

    if (response.status === 200) {
      const currentUser = await response.json();
      const {
        username: currentAccountName,
        email: currentEmail,
        token: currentToken,
        user: currentUserId,
      } = currentUser;

      // Persist current user on server and locally
      await postCurrentUser(currentAccountName, currentEmail, currentToken, currentUserId);
      localStorage.setItem("token", currentToken);

      const exists = await isUserInContactList(currentUser);
      window.location.href = `./documents/summary.html?name=${encodeURIComponent(currentAccountName)}`;

      if (!exists) {
        await postNewAccount(currentAccountName, currentEmail, currentUser);
      }
    } else {
      document.getElementById("user-email").classList.add("border-color-red");
      document.getElementById("user-password").classList.add("border-color-red");
      renderWrongLogIn();
    }
  } catch (error) {
    console.error("Error logging in:", error);
  }
}

/**
 * Fetches the current user record from the server.
 * @async
 * @function getCurentUser
 * @returns {Promise<Object>} The first current user object from the response array.
 */
async function getCurentUser() {
  const response = await fetch(`${BASE_URL}curent-user/`);
  const res = await response.json();
  return res[0];
}

/**
 * Checks if a user already exists in the contact list.
 * @async
 * @function isUserInContactList
 * @param {Object} user - The user object containing at least an email property.
 * @returns {Promise<boolean>} True if the user email is found in contacts.
 */
async function isUserInContactList(user) {
  const contacts = await loadContacts();
  return contacts.some((contact) => contact.emailIn.trim().toLowerCase() === user.email.trim().toLowerCase());
}

/**
 * Posts a new task to the server under the authenticated user.
 * @async
 * @function postInfos
 * @param {Object} tasks - Object containing task details.
 * @returns {Promise<void>}
 */
async function postInfos(tasks) {
  tasks.user = [currentUser.user];
  try {
    await fetch(`${BASE_URL}addTask/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: TOKEN ? `Token ${TOKEN}` : "",
      },
      body: JSON.stringify(tasks),
    });
  } catch (error) {
    console.error("Error posting task:", error);
  }
}

/**
 * Loads all contacts for the authenticated user and optionally renders them.
 * @async
 * @function loadContacts
 * @returns {Promise<Array>} Array of contact objects.
 */
async function loadContacts() {
  TOKEN = localStorage.getItem("token");
  try {
    const res = await fetch(`${BASE_URL}contacts/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: TOKEN ? `Token ${TOKEN}` : "",
      },
    });
    if (!res.ok) throw new Error("Server error");
    const result = await res.json();
    if (typeof renderContacts === "function" && renderContacts(result)) {
      return result;
    }
    return result;
  } catch (error) {
    console.error("Error loading contacts:", error);
  }
}

/**
 * Generic GET request to the API.
 * @async
 * @function getData
 * @param {string} path - The API endpoint path (e.g., "addTask/").
 * @returns {Promise<any>} Parsed JSON response.
 */
async function getData(path) {
  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: TOKEN ? `Token ${TOKEN}` : "",
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

/**
 * Updates a task by ID with the provided payload.
 * @async
 * @function updateTask
 * @param {number|string} id - The ID of the task to update.
 * @param {Object} payload - The updated task data.
 * @returns {Promise<void>}
 */
async function updateTask(id, payload) {
  try {
    await fetch(`${BASE_URL}addTask/${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: TOKEN ? `Token ${TOKEN}` : "",
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error("Error updating task:", error);
  }
}

/**
 * Deletes a task from the server by ID.
 * @param {number|string} id - The ID of the task to delete.
 * @returns {void}
 */
function deleteFromServer(id) {
  fetch(`${BASE_URL}addTask/${id}/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: TOKEN ? `Token ${TOKEN}` : "",
    },
  }).catch(console.error);
}

/**
 * Updates status information on the server (single resource at ID 1).
 * @async
 * @function uploadAmount
 * @param {Object} amounts - Key-value pairs representing status counts.
 * @returns {Promise<void>}
 */
async function uploadAmount(amounts) {
  try {
    await fetch(`${BASE_URL}Status/1/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(amounts),
    });
  } catch (error) {
    console.error("Error uploading status:", error);
  }
}

/**
 * Loads all tasks for the authenticated user.
 * @async
 * @function loadTasks
 * @returns {Promise<Array>} Array of task objects.
 */
async function loadTasks() {
  try {
    const response = await fetch(`${BASE_URL}addTask/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: TOKEN ? `Token ${TOKEN}` : "",
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Error loading tasks:", error);
  }
}

/**
 * Posts or updates the current user record on the server.
 * @async
 * @function postCurrentUser
 * @param {string} userName - The username to post.
 * @param {string} userEmail - The user email to post.
 * @param {string} token - Auth token to post.
 * @param {number|string} userId - User's ID.
 * @returns {Promise<void>}
 */
async function postCurrentUser(userName, userEmail, token, userId) {
  try {
    const response = await fetch(`${BASE_URL}curent-user/1/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nameIn: userName, emailIn: userEmail, token, user: userId }),
    });
    if (!response.ok) throw new Error("Error posting current user");
  } catch (error) {
    console.error("Error posting current user:", error);
  }
}

/**
 * Creates a guest user account and logs in.
 * Retries once if initial guest login fails.
 * @async
 * @function guestLogin
 * @param {boolean} [retried=false] - Indicates if this is a retry attempt.
 * @returns {Promise<void>}
 */
async function guestLogin(retried = false) {
  try {
    const res = await fetch(`${BASE_URL}login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "guest@guest.de", password: "guestlogin" }),
    });

    if (!res.ok) {
      if (!retried) {
        console.warn("Guest login failed; creating guest account...");
        await createGuest();
        return guestLogin(true);
      }
      throw new Error(`Guest login still failing: ${res.status}`);
    }

    const currentUser = await res.json();
    localStorage.setItem("token", currentUser.token);
    await postCurrentUser(currentUser.username, currentUser.email, currentUser.token, currentUser.user);
    if (!(await isUserInContactList(currentUser))) {
      await postNewAccount(currentUser.username, currentUser.email, currentUser);
    }
    window.location.href = `./documents/summary.html?name=${encodeURIComponent(currentUser.username)}`;
  } catch (error) {
    console.error("Error during guest login:", error);
  }
}

/**
 * Registers a new user with provided input data.
 * @async
 * @function registerUser
 * @param {Object} inputData - Fields: username, email, password, repeated_password.
 * @returns {Promise<void>}
 */
async function registerUser(inputData) {
  try {
    const response = await fetch(`${BASE_URL}registration/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inputData),
    });
    const result = await response.json();
    if (!response.ok) throw new Error("Error registering user");
    await postNewAccount(result.username, result.email, result);
  } catch (error) {
    console.error("Error registering user:", error);
  }
}

/**
 * Adds a new account to the contact list and optionally renders a success message.
 * @async
 * @function postNewAccount
 * @param {string} newName - Name of the new contact.
 * @param {string} newEmail - Email of the new contact.
 * @param {Object} newUser - User object containing token and user ID.
 * @returns {Promise<void>}
 */
async function postNewAccount(newName, newEmail, newUser) {
  try {
    await fetch(`${BASE_URL}contacts/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: newUser.token ? `Token ${newUser.token}` : "",
      },
      body: JSON.stringify({
        nameIn: newName,
        emailIn: newEmail,
        phoneIn: "0",
        isUser: true,
        color: "blue",
        user: [Number(newUser.user)],
      }),
    });
    renderSuccessfully();
    setTimeout(() => (window.location.href = "./index.html"), 2000);
  } catch (error) {
    console.error("Error adding new account:", error);
  }
}

/**
 * Deletes a contact by ID and refreshes the contact list.
 * @async
 * @function deleteContact
 * @param {number|string} contactId - ID of the contact to delete.
 * @returns {Promise<void>}
 */
async function deleteContact(contactId) {
  try {
    const response = await fetch(`${BASE_URL}contacts/${contactId}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: TOKEN ? `Token ${TOKEN}` : "",
      },
    });
    if (!response.ok) throw new Error("Error deleting contact");
    closeDetailDialog();
    await initializeContactList();
  } catch (error) {
    console.error("Error deleting contact:", error);
  }
}

/**
 * Sends updated data for a specific contact.
 * @async
 * @function sendUpdateRequest
 * @param {number|string} contactId - ID of the contact to update.
 * @param {Object} updatedData - The fields to update.
 * @returns {Promise<boolean>} True on success, false on failure.
 */
async function sendUpdateRequest(contactId, updatedData) {
  try {
    const response = await fetch(`${BASE_URL}contacts/${contactId}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: TOKEN ? `Token ${TOKEN}` : "",
      },
      body: JSON.stringify(updatedData),
    });
    return response.ok;
  } catch (error) {
    console.error("Error updating contact:", error);
    return false;
  }
}

/**
 * Sends updated data for a specific task.
 * @async
 * @function sendUpdateTaskRequest
 * @param {number|string} taskId - ID of the task to update.
 * @param {Object} updatedData - The fields to update.
 * @returns {Promise<boolean>} True on success, false on failure.
 */
async function sendUpdateTaskRequest(taskId, updatedData) {
  try {
    const response = await fetch(`${BASE_URL}addTask/${taskId}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: TOKEN ? `Token ${TOKEN}` : "",
      },
      body: JSON.stringify(updatedData),
    });
    return response.ok;
  } catch (error) {
    console.error("Error updating task:", error);
    return false;
  }
}

/**
 * Fetches and initializes user data from the server.
 * @async
 * @function getUserData
 * @param {string} path - The API path where user data resides.
 * @returns {Promise<void>}
 */
async function getUserData(path) {
  try {
    const userResponse = await fetch(`${BASE_URL}${path}`);
    const userData = await userResponse.json();
    if (userData) {
      const userArray = Object.entries(userData).map(([key, value]) => ({ userId: key, ...value }));
      userDb.push(...userArray);
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
}

/**
 * Updates the current user's account record on the server.
 * @async
 * @function updateAccount
 * @returns {Promise<boolean>} True on success, false on failure.
 */
async function updateAccount() {
  const updatedData = getUpdatedContactData();
  const user = await getCurentUser();
  updatedData.user = user.user;
  try {
    const response = await fetch(`${BASE_URL}curent-user/1/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: TOKEN ? `Token ${TOKEN}` : "",
      },
      body: JSON.stringify(updatedData),
    });
    return response.ok;
  } catch (error) {
    console.error("Error updating user account:", error);
    return false;
  }
}

/**
 * Loads the current user's name and renders it via renderUserName().
 * @function loadUserName
 * @returns {void}
 */
function loadUserName() {
  fetch(`${BASE_URL}curent-user/`)
    .then((response) => response.json())
    .then((result) => renderUserName(result[0]))
    .catch((error) => console.error("Error fetching user name:", error));
}

/**
 * Creates a guest account with default credentials.
 * @async
 * @function createGuest
 * @returns {Promise<void>}
 */
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


/**
 * Sends a new contact object to the server.
 * @async
 * @function pushContact
 * @param {Object} inputData - Contact data (nameIn, emailIn, phoneIn, color).
 * @returns {Promise<void>}
 */
async function pushContact(inputData) {
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
 * Updates the status resource on the server by numerical payload.
 * @async
 * @function updateStatus
 * @param {Object} nr - Payload representing status counts or values.
 * @returns {Promise<void>}
 */
async function updateStatus(nr) {
  await fetch(BASE_URL + "Status/1/", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nr),
  });
}
