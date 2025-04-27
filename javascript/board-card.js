let tasks = window.parent.tasks;
let clickedCardId = window.parent.clickedCardId;
// let BASE_URL = "https://join-318-default-rtdb.europe-west1.firebasedatabase.app/";

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
        updateTask(task.id, task);
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
        updateTask(task.id, task);
      }
    });
  }

  window.parent.tasks = tasks;
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


