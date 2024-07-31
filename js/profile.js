import { setLoggedInUser, getLoggedUser, logout } from "./db/local_storage.js";
import { openDB, updateUserProfile } from "./db/indexed_db.js";

const $ = function (id) {
  return document.getElementById(id);
};

function redirectToHome() {
  window.location.href = "index.html";
}

function redirectLogin() {
  window.location.href = "login.html";
}

let profileName = $("profile-name");
let profileEmail = $("profile-email");
let memberSince = $("member-since");

let firstName = $("first-name");
let lastName = $("last-name");
let dob = $("dob");
let gender = $("gender");
let address = $("address");

function initProfile(user) {
  profileName.textContent = user.firstName + " " + user.lastName;
  profileEmail.textContent = user.email;
  memberSince.textContent = user.memberSince || "Member since: 2024";

  firstName.value = user.firstName || "";
  lastName.value = user.lastName || "";
  dob.value = user.dob || "";
  gender.value = user.gender || "";
  address.value = user.address || "";
}

function updateProfile(event) {
  event.preventDefault();
  const user = getLoggedUser();
  user.firstName = firstName.value;
  user.lastName = lastName.value;
  user.dob = dob.value;
  user.gender = gender.value;
  user.address = address.value;
  console.log(user.email);
  updateUserProfile(user.email, user)
    .then(() => {
      alert("Profile updated successfully");
      setLoggedInUser(user);
      initProfile(user);
    })
    .catch((error) => {
      alert("Failed to update profile");
      console.error(error);
    });
}

window.onload = function () {
  openDB()
    .then(() => {
      console.log("Database opened successfully");
    })
    .catch((error) => {
      console.error(error);
    });
  // Check if the user is logged in when the page loads
  const user = getLoggedUser();
  initProfile(user);
  $("update-button").onclick = updateProfile;

  $("logout-button").onclick = function () {
    logout();
    redirectLogin();
  };
};

window.redirectToHome = redirectToHome;
