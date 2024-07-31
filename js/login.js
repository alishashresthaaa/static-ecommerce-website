import { openDB, getUser } from "./db/indexed_db.js";
import { setLoggedInUser, isLoggedIn } from "./db/local_storage.js";

const $ = function (id) {
  return document.getElementById(id);
};

const validEmail = "admin@gmail.com";
const validPassword = "admin123";
let isValid = false;

// Regex pattern for email validation
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateField = function (event) {
  const id = event.target.id;
  const value = event.target.value.trim();
  const errorElement = $(`${id}Error`);

  let errorMessage = "";
  let isFieldValid = true;

  switch (id) {
    case "email":
      if (value === "") {
        errorMessage = "Email is required.";
        isFieldValid = false;
      } else if (!emailPattern.test(value)) {
        errorMessage = "Email is invalid.";
        isFieldValid = false;
      }
      break;
    case "password":
      if (value === "") {
        errorMessage = "Password is required.";
        isFieldValid = false;
      }
      break;
  }

  errorElement.textContent = errorMessage;
  if (!isFieldValid) {
    event.target.classList.add("input-error");
  } else {
    event.target.classList.remove("input-error");
  }

  // Update the overall form validity
  isValid = document.querySelectorAll(".input-error").length === 0;
};

const authenticateUser = function (event) {
  console.log("Authenticating user...");
  event.preventDefault(); // Prevent form submission
  console.log("Authenticating user...");
  // Trigger validation for all fields
  validateField({ target: $("email") });
  validateField({ target: $("password") });

  if (!isValid) {
    return;
  }

  const email = $("email").value.trim();
  const password = $("password").value.trim();

  console.log("Authenticating user...", email, password);
  getUser(email)
    .then((user) => {
      console.log("User found", user);
      if (user && user.password === password) {
        setLoggedInUser(user);
        window.location.href = "index.html";
      } else {
        $("passwordError").textContent = "Username or password is incorrect.";
        $("password").classList.add("input-error");
      }
    })
    .catch((error) => {
      console.error("Error getting user", error);
      $("passwordError").textContent = "Username or password is incorrect.";
      $("password").classList.add("input-error");
    });

  // if (email === validEmail && password === validPassword) {
  //   authenticated = true;
  // } else {
  //   $("passwordError").textContent = "Username or password is incorrect.";
  //   $("password").classList.add("input-error");
  // }
};

window.onload = function () {
  if (isLoggedIn()) {
    window.location.href = "index.html";
  }

  openDB()
    .then(() => {
      console.log("Database opened successfully");
    })
    .catch((error) => {
      console.error("Error opening database", error);
    });

  const loginForm = $("loginForm");
  if (loginForm) {
    loginForm.onsubmit = authenticateUser;
  }

  const emailInput = $("email");
  const passwordInput = $("password");

  if (emailInput) {
    emailInput.addEventListener("input", validateField);
  }

  if (passwordInput) {
    passwordInput.addEventListener("input", validateField);
  }
};
