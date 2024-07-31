import {
  setLoggedInUser,
  getLoggedUser,
  logout,
  isLoggedIn,
} from "./db/local_storage.js";
import { openDB, updateUserProfile } from "./db/indexed_db.js";
import { loadImage } from "./main.js";

const getById = function (id) {
  return document.getElementById(id);
};

function redirectToHome() {
  window.location.href = "index.html";
}

function redirectLogin() {
  window.location.href = "login.html";
}

let profileImage = getById("profile-image");
let profileName = getById("profile-name");
let profileEmail = getById("profile-email");
let memberSince = getById("member-since");

let firstName = getById("first-name");
let lastName = getById("last-name");
let dob = getById("dob");
let gender = getById("gender");
let address = getById("address");

function loadProfileImage() {
  const user = getLoggedUser();
  const url =
    "https://ui-avatars.com/api/?background=random&name=" +
    user.firstName +
    "+" +
    user.lastName;

  profileImage.src = url;
}

function initProfile(user) {
  loadImage();
  loadProfileImage();
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
      $.toast({
        hideAfter:4000,
        heading: "Success",
        text: "Profile updated successfully",
        icon: "success",
        position: "top-center",});
      setLoggedInUser(user);
      initProfile(user);
    })
    .catch((error) => {
      $.toast({
        hideAfter:4000,
        heading: "Error",
        text: "Failed to update profile",
        icon: "error",
        position: "top-center",});
      console.error(error);
    });
}

window.onload = function () {
  if (!isLoggedIn()) {
    redirectLogin();
    return;
  }
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
  getById("update-button").onclick = updateProfile;
  getById("logout-button").onclick = function () {
    logout();
    redirectLogin();
  };
};

window.redirectToHome = redirectToHome;
