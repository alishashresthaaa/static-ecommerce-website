$(document).ready(function() {
  // Constants for valid credentials
  const VALID_EMAIL = "test@test.com";
  const VALID_PASSWORD = "test@123";

  // Function to display error messages
  function showError(inputId, message) {
    $(`#${inputId}Error`).text(message);
    $(`#${inputId}`).addClass("input-error");
  }

  // Function to clear error messages
  function clearErrors() {
    $(".error-message").text("");
    $("input").removeClass("input-error");
  }

  // Function to validate the email
  function validateEmail(email) {
    return email === VALID_EMAIL;
  }

  // Function to validate the password
  function validatePassword(password) {
    return password === VALID_PASSWORD;
  }

  // Handle form submission
  $("#loginForm").on("submit", function(event) {
    event.preventDefault(); // Prevent form submission

    clearErrors(); // Clear previous errors

    let isValid = true;

    // Validate Email
    const email = $("#email").val().trim();
    if (!validateEmail(email)) {
      showError("email", "Email is invalid.");
      isValid = false;
    }

    // Validate Password
    const password = $("#password").val().trim();
    if (!validatePassword(password)) {
      showError("password", "Password is invalid.");
      isValid = false;
    }

    // If form is valid, submit the form
    if (isValid) {
      this.submit();
      window.location.href = "/";
    }
  });

  // Handle real-time validation
  $("input").on("input", function() {
    const id = $(this).attr("id");
    const value = $(this).val().trim();
    let errorMessage = "";
    let isValid = true;

    switch (id) {
      case "email":
        isValid = validateEmail(value);
        if (!isValid) errorMessage = "Email is invalid.";
        break;
      case "password":
        isValid = validatePassword(value);
        if (!isValid) errorMessage = "Password is invalid.";
        break;
    }

    if (isValid) {
      $(this).removeClass("input-error");
      $(`#${id}Error`).text("");
    } else {
      $(this).addClass("input-error");
      $(`#${id}Error`).text(errorMessage);
    }
  });
});
