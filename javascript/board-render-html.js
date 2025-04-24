/**
 * Renders a task card.
 * @param {Array<Object>} task - Array of tasks in the section.
 * @param {number} subtasklength - Number of subtasks.
 * @param {number} i - Index of the task.
 * @param {string} categoryColor - CSS class for the category.
 * @param {string} prio - Priority icon file name.
 * @param {number} checked - Number of completed subtasks.
 * @returns {string} HTML string for the task card.
 */
function renderToDos(task, subtasklength, i, categoryColor, prio, checked) {
  return `
        <div class="ticket-card" id="ticket-${task[i].id}" draggable="true" onclick="openCard('${task[i].id}')"
              ondragstart="startDragging('${task[i].id}')">
              <div class="top-part" id="top-part">
                  <div class="${categoryColor}" id="pill">
                      <p>${task[i].category}</p>
                  </div>
                  <div class="dropdown">
                       <img src="../assets/img/3dots.svg" alt="" id="dots-${task[i].id}" class="dots" onclick="openMenu('${task[i].id}', event)">
                    <div id="myDropdown-${task[i].id}" class="dropdown-content">
                      <a onclick="stopEventPropagation(event); changeSections('todo','${task[i].id}');">To do</a>
                      <a onclick="stopEventPropagation(event); changeSections('inprogress', '${task[i].id}');">In progress</a>
                      <a onclick="stopEventPropagation(event); changeSections('awaitfeedback', '${task[i].id}');">Await feedback</a>
                      <a onclick="stopEventPropagation(event); changeSections('done','${task[i].id}');">Done</a>
                    </div>
                  </div>
              </div>
              <div class="title-notice">
                  <p id="ticket-title">${task[i].title}</p>
                  <p class="ticket-notice" id="ticket-notice">${task[i].description}</p>
              </div>
  
              <div class="progress-bar-section" id="progress-bar-section${task[i].id}">
                  <div class="progress-bar">
                      <div class="progress-bar-filler" id="filler-${task[i].id}"></div>
                  </div>
                  <p id="subtasks">${checked}/${subtasklength} Subtasks</p>
              </div>
  
              <div class="contacts-section" id="contacts-section${task[i].id}">
                  <div class="contacts" id="contact-images${task[i].id}"></div>
                  <p class="d-none" id="over-amount${task[i].id}"> test </p>
                  <img src="../assets/img/${prio}" alt="" />
              </div>
        </div>`;
}

/**
 * Renders contact initials.
 * @param {Array<string>} inits - Initials of the contact.
 * @param {Array<string>} allcolors - Colors associated with contacts.
 * @param {number} j - Index of the contact.
 * @returns {string} HTML string for the contact initials.
 */
function renderContactsImages(inits, allcolors, j) {
  return `<div class="contact-initals" id="contact-initals1" style="background-color: ${allcolors[j]};">
                                  <span>${inits[0]}${inits[1]}</span>
                                </div>`;
}

/**
 * Renders the delete and edit buttons on the task card.
 * @param {string} id - The ID of the task.
 * @returns {string} HTML string for the buttons.
 */
function renderBoardCardButtons(id) {
  return `<div class="delete-edit">
                  <div class="delete" id="delete-btn-${id}" onclick="deleteTask('${id}'), parent.closeWindow('card-infos')">
                      <img src="../assets/img/delete.svg" alt="">
                      <p>Delete</p>
                  </div>
                  <img src="../assets/img/Vector 3.svg" alt="">
                  <div class="edit" id="edit-btn-${id}" onclick="parent.editTask('${id}')">
                      <img src="../assets/img/edit.svg" alt="">
                      <p>Edit</p>
                  </div>
              </div>`;
}

/**
 * Renders HTML for a subtask checkbox.
 * @param {number} i - Index of the subtask.
 * @param {Array<string>} task - Array of subtask names.
 * @param {number} tasklength - Total number of subtasks.
 * @param {string} checked - 'checked' if the subtask is completed.
 * @param {Object} card - The task object.
 * @returns {string} HTML string for the subtask checkbox.
 */
function subtasksHTML(i, task, tasklength, checked, card) {
  return `<div class="subtasks-checkboxes" id="board-card-${card.id}-${i}">
                      <div class="checkbox-wrapper-19" >
                          <input type="checkbox" id="cbtest-19-${i}" onclick="parent.subtaskProcesBar('${card.id}', ${i}, ${tasklength}); boardCardSubtaskChecked(${i})" ${checked}/>
                          <label for="cbtest-19-${i}" class="check-box">
                      </div>
                      <p>${task}</p>
                  </div>`;
}

/**
 * Renders HTML for an assigned contact.
 * @param {string} contact - Name of the contact.
 * @param {string} init - Initials of the contact.
 * @param {string} color - Color associated with the contact.
 * @returns {string} HTML string for the assigned contact.
 */
function contactsHTML(contact, init, color) {
  return `<div class="assigned-contacts">
                      <div class="contact-circle" id="contact-circle" style="background-color: ${color};"><span id="contact-inits">${init}</span></div>
                      <p>${contact}</p>
                  </div>`;
}
