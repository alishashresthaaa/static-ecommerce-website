$(document).ready(function() {
  const validationRules = {
    "#firstName": {
      validate: value => value.trim() !== "",
      errorMessage: "First name is required."
    },
    "#lastName": {
      validate: value => value.trim() !== "",
      errorMessage: "Last name is required."
    },
    "#email": {
      validate: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()),
      errorMessage: "Enter a valid email address."
    },
    "#password": {
      validate: value => value.trim() !== "",
      errorMessage: "Password is required."
    },
    "#repassword": {
      validate: value => value.trim() !== "" && value.trim() === $("#password").val().trim(),
      errorMessage: value => value.trim() === "" ? "Retype password." : "Passwords do not match."
    }
  };

  function validateInput(id) {
    const input = $(id);
    const value = input.val();
    const errorElement = $(`${id}Error`);
    const rule = validationRules[id];

    let errorMessage = rule.errorMessage;
    if (typeof errorMessage === "function") {
      errorMessage = errorMessage(value);
    }

    if (rule.validate(value)) {
      input.removeClass("input-error");
      errorElement.text("");
      return true;
    } else {
      input.addClass("input-error");
      errorElement.text(errorMessage);
      return false;
    }
  }

  $("#registrationForm").on("submit", function(event) {
    event.preventDefault(); // Prevent form submission

    let isValid = true;
    $(".error-message").text("");
    $("input").removeClass("input-error");

    // Validate all inputs
    for (let id in validationRules) {
      if (!validateInput(id)) {
        isValid = false;
      }
    }

    // If form is valid, submit the form
    if (isValid) {
      this.submit();
      alert("Registration successful");
      window.location.href = "/login.html";
    }
  });

  // Real-time validation
  $("input").on("input", function() {
    validateInput(`#${this.id}`);
  });
});
