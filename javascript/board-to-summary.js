/**
 * Object storing the number of tasks in each section.
 * @type {Object}
 */

let amounts = {};

function helpAmount() {
    let sections = ["todo", "inprogress", "awaitfeedback", "done"];
    for (let i = 0; i < sections.length; i++) {
      let section = getAmounthelper(sections[i]);
      amounts[sections[i]] = section;
    }
  }
  
  /**
   * Updates the number of tasks in each section and uploads the data to the server.
   */
  function getAmountsOfAllSections() {
    helpAmount();
    let urgent = getUrgentNumber();
    amounts["urgent"] = urgent;
    uploadAmount();
  }
  
  /**
   * Gets the number of tasks with 'urgent' priority.
   * @returns {number} The count of urgent tasks.
   */
  function getUrgentNumber() {
    let amount = 0;
    for (let i = 0; i < tasks.length; i++) {
      let task = tasks[i];
      if (task.prio == "urgent") {
        amount++;
      }
    }
    return amount;
  }
  
  /**
   * Uploads the amounts object to the server.
   */
  function uploadAmount() {
    fetch(BASE_URL + "Status/1/", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(amounts),
    });
  }

  

/**
 * Helper function to get the number of cards in a section.
 * @param {string} section - The ID of the section.
 * @returns {number} The number of cards in the section.
 */
function getAmounthelper(section) {
    let todo = document.getElementById(section);
    let card = todo.getElementsByClassName("ticket-card");
    return card.length;
  }