import { isLoggedIn } from "./db/local_storage.js";

function redirectToLogin() {
  window.location.href = "login.html";
}
function redirectToHome() {
  window.location.href = "index.html";
}

function redirectToProfile() {
  window.location.href = "profile.html";
}

// Function to hide elements with the class 'nav__right'
function hideNavRight() {
  const logInContent = document.getElementById("loginContent");
  logInContent.style.display = "none";
}

function showNavRight() {
  const logInContent = document.getElementById("loginContent");
  logInContent.style.display = "block";
}

function hideViewProfile() {
  const viewProfile = document.getElementById("viewProfile");
  viewProfile.style.display = "none";
}

function showViewProfile() {
  const viewProfile = document.getElementById("viewProfile");
  viewProfile.style.display = "block";
}

window.onload = function () {
  // Check if the user is logged in when the page loads
  if (isLoggedIn()) {
    hideNavRight();
    showViewProfile();
  } else {
    showNavRight();
    hideViewProfile;
  }
};

window.redirectToLogin = redirectToLogin;
window.redirectToHome = redirectToHome;
window.redirectToProfile = redirectToProfile;

AOS.init({
  // Settings that can be overridden on per-element basis, by `data-aos-*` attributes:
  delay:12,
  duration: 700,
  easing: "ease",
  once: false,
  anchorPlacement: "top-bottom",
});
