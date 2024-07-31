import { openDB, registerUser } from "./db/indexed_db.js";

const $ = function (id) {
  return document.getElementById(id);
};

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
    case "firstName":
      if (value === "") {
        errorMessage = "First name is required.";
        isFieldValid = false;
      }
      break;
    case "lastName":
      if (value === "") {
        errorMessage = "Last name is required.";
        isFieldValid = false;
      }
      break;
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
      } else if (value.length < 8) {
        errorMessage = "Password must be at least 8 characters long.";
        isFieldValid = false;
      }
      break;
    case "confirmPassword":
      if (value === "") {
        errorMessage = "Confirm password is required.";
        isFieldValid = false;
      } else if (value !== $("password").value.trim()) {
        errorMessage = "Passwords do not match.";
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

const registerNewUser = function (event) {
  event.preventDefault(); // Prevent form submission

  if (!isValid) {
    // Trigger validation for all fields
    validateField({ target: $("firstName") });
    validateField({ target: $("lastName") });
    validateField({ target: $("email") });
    validateField({ target: $("password") });
    validateField({ target: $("confirmPassword") });
    return;
  }

  const user = {
    firstName: $("firstName").value.trim(),
    lastName: $("lastName").value.trim(),
    email: $("email").value.trim(),
    password: $("password").value.trim(),
  };
  registerUser(user)
    .then(() => {
      showModal();
    })
    .catch((error) => {
      // todo: display error message
      console.error("Error adding user", error);
    });
};

// Modal functionality
const successModal = $("successModal");

const showModal = function () {
  overlay.style.display = "block";
  successModal.style.display = "block";
};

const closeModal = function () {
  overlay.style.display = "none";
  successModal.style.display = "none";
  window.location.href = "login.html";
};

window.onload = function () {
  openDB()
    .then(() => {
      console.log("Database opened successfully");
    })
    .catch((error) => {
      console.error("Error opening database", error);
    });

  const registrationForm = $("registrationForm");
  if (registrationForm) {
    registrationForm.onsubmit = registerNewUser;
  }

  $("closeDialog").onclick = closeModal;

  const firstNameInput = $("firstName");
  const lastNameInput = $("lastName");
  const emailInput = $("email");
  const passwordInput = $("password");
  const confirmPasswordInput = $("confirmPassword");

  if (firstNameInput) {
    firstNameInput.addEventListener("input", validateField);
  }

  if (lastNameInput) {
    lastNameInput.addEventListener("input", validateField);
  }

  if (emailInput) {
    emailInput.addEventListener("input", validateField);
  }

  if (passwordInput) {
    passwordInput.addEventListener("input", validateField);
  }

  if (confirmPasswordInput) {
    confirmPasswordInput.addEventListener("input", validateField);
  }
};
