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
    .catch((error) => console.log('Error fetching datas:', error));
}

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
