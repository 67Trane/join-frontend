let tasks = window.parent.tasks;
let clickedCardId = window.parent.clickedCardId;
// let BASE_URL = "https://join-318-default-rtdb.europe-west1.firebasedatabase.app/";
let BASE_URL = "http://127.0.0.1:8000/api/";
const TOKEN = localStorage.getItem("token");

/**
 * Initializes the board card.
 */
function initBoardCard() {}

/**
 * Handles the checkbox state change of a subtask in a board card.
 * Updates the subtask status and synchronizes with the server.
 *
 * @param {number} id - The ID of the subtask.
 */
function boardCardSubtaskChecked(id) {
  parent.fillProgressBar();
  let checkboxdiv = document.getElementById(`board-card-${clickedCardId}-${id}`);
  let checkbox = checkboxdiv.querySelector(`#cbtest-19-${id}`);

  if (checkbox.checked) {
    tasks.forEach((task) => {
      if (task.id == clickedCardId) {
        if (typeof task.assignedto === "string") {
          let newassigned = task.assignedto.split(",");
          task.assignedto = newassigned;
        }
        task.subtask[id].status = "done";
        updateServer(task);
      }
    });
  } else {
    tasks.forEach((task) => {
      if (task.id == clickedCardId) {
        if (typeof task.assignedto === "string") {
          let newassigned = task.assignedto.split(",");
          task.assignedto = newassigned;
        }
        task.subtask[id].status = "inwork";
        updateServer(task);
      }
    });
  }

  window.parent.tasks = tasks;
}

/**
 * Updates the server with the provided subtask status.
 *
 * @param {Object} task - The subtask object to update on the server.
 */
function updateServer(task) {
  try {
    fetch(BASE_URL + "addTask/" + clickedCardId + "/", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: TOKEN ? `Token ${TOKEN}` : "",
      },
      body: JSON.stringify(task),
    });
  } catch (error) {
    console.log(error);
  }
}

/**
 * Deletes a task from the local tasks array and updates the parent window.
 *
 * @param {number} id - The ID of the task to delete.
 */
function deleteTask(id) {
  let index = tasks.findIndex((task) => task.id === id);
  if (index !== -1) {
    tasks.splice(index, 1);
  }
  deleteFromServer(id);
  window.parent.tasks = tasks;
}

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
