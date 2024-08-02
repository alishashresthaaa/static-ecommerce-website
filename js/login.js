// Predefined valid email and password for testing
const validEmail = "admin@gmail.com";
const validPassword = "admin123";
let isValid = false;

// Regex pattern for email validation
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Function to validate input fields
const validateField = function (event) {
  const $element = $(event.target);
  const id = $element.attr("id");
  const value = $element.val().trim();
  const errorElement = $(`#${id}Error`);

  let errorMessage = "";
  let isFieldValid = true;
  // Validate the field based on the ID
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

  // Display error message if validation fails
  errorElement.text(errorMessage);
  if (!isFieldValid) {
    $element.addClass("input-error");
  } else {
    $element.removeClass("input-error");
  }

  // Update the overall form validity
  isValid = document.querySelectorAll(".input-error").length === 0;
};

// Function to authenticate the user
const authenticateUser = function (event) {
  event.preventDefault(); // Prevent form submission
  var $element = $(event.target);
  console.log("Authenticating user...");
  // Trigger validation for all fields
  validateField({ target: $("#email") });
  validateField({ target: $("#password") });

  if (!isValid) {
    return;
  }

  const $email = $("#email").val().trim();
  const $password = $("#password").val().trim();

  // Check if the user exists in the database
  getUser($email)
    .then((user) => {
      console.log("User found", user);
      // Check if the password matches
      if (user && user.password === $password) {
        setLoggedInUser(user);
        window.location.href = "index.html";
      } else {
        $("#passwordError").text("Username or password is incorrect.");
        $("#password").addClass("input-error");
      }
    })
    .catch((error) => {
      console.error("Error getting user", error);
      $("#passwordError").text("Username or password is incorrect.");
      $("#password").addClass("input-error");
    });
};

// Function to initialize the page on window load
$(document).ready(function () {
  // Redirect to index.html if the user is already logged in
  if (isLoggedIn()) {
    window.location.href = "index.html";
  }

  // Open the database
  openDB()
    .then(() => {
      console.log("Database opened successfully");
    })
    .catch((error) => {
      console.error("Error opening database", error);
    });

  const $emailInput = $("#email");
  const $passwordInput = $("#password");

  if ($emailInput) {
    $emailInput.on("input", validateField);
  }

  if ($passwordInput) {
    $passwordInput.on("input", validateField);
  }

  const $loginForm = $("#loginForm");
  if ($loginForm) {
    $loginForm.on("submit", authenticateUser);
  }
});
