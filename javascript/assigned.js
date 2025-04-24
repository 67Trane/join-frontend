/**
 * @file Task Management Functions - Handles fetching, updating, and deleting task assignments from the Firebase database.
 */

let taskDb = [];
let currentTaskId;
const TOKEN = localStorage.getItem("token");

/**
 * Fetches tasks from the Firebase database and populates the `taskDb` array.
 *
 * @async
 * @function getTasks
 * @param {string} path - The path to the Firebase database endpoint.
 * @returns {Promise<void>} - A promise that resolves when tasks are fetched and added to `taskDb`.
 */
async function getTasks(path) {
  let taskArray = [];
  
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
      taskArray = Object.entries(data).map(([key, value]) => {
        return {
          firebaseid: key,
          ...value,
        };
      });
      taskDb.push(...taskArray);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

/**
 * Deletes a contact assignment from all tasks where the contact is assigned.
 *
 * @function deleteAssigned
 * @param {string} contactName - The name of the contact to be removed from task assignments.
 */
function deleteAssigned(contactName) {
  const assignedObjects = findAllAssigned(contactName);
  for (let i = 0; i < assignedObjects.length; i++) {
    let currentTaskObject = assignedObjects[i];
    let assignedtoValue = currentTaskObject.assignedto;

    if (assignedtoValue === undefined || assignedtoValue === null) {
      continue;
    }

    if (typeof assignedtoValue === "object") {
      assignedIsObject(currentTaskObject, contactName);
    } else if (typeof assignedtoValue === "string") {
      assignedIsString(currentTaskObject, contactName);
    }
  }
}

/**
 * Handles the case when assignedtoValue is an object.
 *
 * @function assignedIsObject
 * @param {Object} currentTaskObject - The task object that needs to be updated.
 * @param {string} contactName - The name of the contact to be removed.
 */
function assignedIsObject(currentTaskObject, contactName) {
  let assignedtoValue = currentTaskObject.assignedto;
  let colorValue = currentTaskObject.color;

  let assignedArray = Object.values(assignedtoValue);
  let colorArray = Array.isArray(colorValue) ? Object.values(colorValue) : [];

  const index = assignedArray.indexOf(contactName);
  if (index > -1) {
    assignedArray.splice(index, 1);
    if (colorArray.length > index) {
      colorArray.splice(index, 1);
    }
  }

  // Reconstruct the assignedto object with numeric keys
  const newAssign = {};
  assignedArray.forEach((name, idx) => {
    newAssign[idx] = name;
  });

  // Reconstruct the color object with numeric keys
  const newColor = {};
  colorArray.forEach((color, idx) => {
    newColor[idx] = color;
  });

  // Update the task with new assignedto and color
  deleteAssignCard(currentTaskObject, newAssign, newColor);
}

/**
 * Handles the case when assignedtoValue is a string.
 *
 * @function assignedIsString
 * @param {Object} currentTaskObject - The task object that needs to be updated.
 * @param {string} contactName - The name of the contact to be removed.
 */
function assignedIsString(currentTaskObject, contactName) {
  let assignedtoValue = currentTaskObject.assignedto;
  let colorValue = currentTaskObject.color;

  let assignedArray = assignedtoValue.includes(",")
    ? assignedtoValue.split(",").map((item) => item.trim())
    : [assignedtoValue.trim()];

  let colorArray =
    typeof colorValue === "string"
      ? colorValue.includes(",")
        ? colorValue.split(",").map((item) => item.trim())
        : [colorValue.trim()]
      : Array.isArray(colorValue)
      ? colorValue
      : [];

  const index = assignedArray.indexOf(contactName);
  if (index > -1) {
    assignedArray.splice(index, 1);
    if (colorArray.length > index) {
      colorArray.splice(index, 1);
    }
  }

  const newAssign = assignedArray.join(",");
  const newColor = colorArray.join(",");

  // Update the task with new assignedto and color
  deleteAssignCard(currentTaskObject, newAssign, newColor);
}

/**
 * Updates the assigned contact list and color list for a task and sends the updated task data to Firebase.
 *
 * @function deleteAssignCard
 * @param {Object} currentTaskObject - The task object that needs to be updated.
 * @param {string|Object} newAssign - The updated assigned contacts (string or object).
 * @param {string|Object} newColor - The updated colors (string or object).
 */
function deleteAssignCard(currentTaskObject, newAssign, newColor) {
  let taskId = currentTaskObject.firebaseid;
  const updatedData = {
    ...currentTaskObject,
    assignedto: newAssign,
    color: newColor,
  };

  sendUpdateTaskRequest(taskId, updatedData);
}

/**
 * Finds and returns all tasks that a given contact is assigned to.
 *
 * @function findAllAssigned
 * @param {string} name - The name of the contact to search for in task assignments.
 * @returns {Object[]} - An array of task objects that contain the specified contact.
 */
function findAllAssigned(name) {
  let results = [];
  for (let i = 0; i < taskDb.length; i++) {
    let assignedtoValue = taskDb[i].assignedto;
    if (assignedtoValue === undefined || assignedtoValue === null) {
      continue;
    }
    if (typeof assignedtoValue === "string") {
      let assignedtoArray = assignedtoValue.includes(",")
        ? assignedtoValue.split(",").map((item) => item.trim())
        : [assignedtoValue.trim()];

      if (assignedtoArray.includes(name)) {
        results.push(taskDb[i]);
      }
    } else if (Array.isArray(assignedtoValue)) {
      if (assignedtoValue.includes(name)) {
        results.push(taskDb[i]);
      }
    } else if (typeof assignedtoValue === "object") {
      let assignedtoArray = Object.values(assignedtoValue);
      if (assignedtoArray.includes(name)) {
        results.push(taskDb[i]);
      }
    }
  }
  return results;
}
