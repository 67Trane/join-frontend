

/**
 * Renders the user's name in the header by displaying the first letter of the name.
 * This function updates the inner HTML of the element with the ID 'header-user-icon'
 * to show the first letter of the user's name.
 * 
 * @param {Object} result - The user data object retrieved from the server.
 * @param {string} result.nameIn - The name of the current user.
 */
function renderUserName(result) {
  let name = result.nameIn;
  let firstLetter = name[0];
  currentName = name;
  loadAccountName();
  if (result) {
    if (document.getElementById('header-user-icon')) {
      document.getElementById('header-user-icon').innerHTML = `${firstLetter}`;
    }
  }
}
