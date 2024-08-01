const LOGGED_IN_USER = "loggedInUser";
const CURRENT_PLAYLIST = "currentPlayList";

/**
 * Sets the logged-in user in local storage.
 * @param {Object} user - The user object to store.
 */
function setLoggedInUser(user) {
  if (!user || typeof user !== "object") {
    throw new Error("Invalid user object");
  }
  localStorage.setItem(LOGGED_IN_USER, JSON.stringify(user));
}

/**
 * Retrieves the logged-in user from local storage.
 * @returns {Object|null} The user object or null if not found.
 */
function getLoggedUser() {
  return JSON.parse(localStorage.getItem(LOGGED_IN_USER));
}

/**
 * Checks if a user is logged in.
 * @returns {boolean} True if a user is logged in, false otherwise.
 */
function isLoggedIn() {
  return localStorage.getItem(LOGGED_IN_USER) !== null;
}

/**
 * Logs out the current user by removing the user data from local storage.
 */
function logout() {
  localStorage.removeItem(LOGGED_IN_USER);
}

/**
 * Adds the current playlist to local storage.
 * @param {Object} playlist - The playlist object to be stored.
 */
function addCurretnPlaylist(playlist) {
  localStorage.setItem(CURRENT_PLAYLIST, JSON.stringify(playlist));
}

/**
 * Retrieves the current playlist from local storage.
 * @returns {Object|null} The playlist object or null if not found.
 */
function getCurrentPlaylist() {
  return JSON.parse(localStorage.getItem(CURRENT_PLAYLIST));
}

export {
  setLoggedInUser,
  getLoggedUser,
  isLoggedIn,
  logout,
  addCurretnPlaylist,
  getCurrentPlaylist,
};
