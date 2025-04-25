let currentDraggedElement = window.currentDraggedElement;

/**
 * Moves the current dragged element to a new status.
 * @param {string} status - The new status to move the task to.
 */
function moveTo(status) {
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id == currentDraggedElement) {
      tasks[i]["status"] = status;
      updateTask(currentDraggedElement, tasks[i]);
    }
  }
  removeHighlightDragArea();
  renderTask();
  getAmountsOfAllSections();
}

/**
 * Removes the highlight class from all drag areas.
 */
function removeHighlightDragArea() {
  let sections = ["todo", "inprogress", "awaitfeedback", "done"];
  for (let i = 0; i < sections.length; i++) {
    document.getElementById(sections[i]).classList.remove("drag-area-highlight");
  }
}

/**
 * Adds highlight to a drag area.
 * @param {string} id - The ID of the drag area to highlight.
 */
function highlight(id) {
  document.getElementById(`${id}`).classList.add("drag-area-highlight");
}

/**
 * Allows the drop event on an element.
 * @param {DragEvent} event - The drag event.
 */
function allowDrop(event) {
  event.preventDefault();
}

/**
 * Removes highlight from a drag area.
 * @param {string} id - The ID of the drag area.
 */
function removeHighlight(id) {
  document.getElementById(id).classList.remove("drag-area-highlight");
}

/**
 * Starts dragging a task.
 * @param {string} id - The ID of the task.
 */
function startDragging(id) {
  currentDraggedElement = id;
  document.getElementById(`ticket-${id}`).classList.add("shake");
}

/**
 * Changes the section of a task.
 * @param {string} section - The new section to move the task to.
 * @param {string} id - The ID of the task.
 */
function changeSections(section, id) {
  currentDraggedElement = id;
  moveTo(section);
}
