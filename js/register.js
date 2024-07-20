document.getElementById("registrationForm").addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent form submission

  let isValid = true;

  // Clear previous errors and classes
  document.querySelectorAll(".error-message").forEach((el) => (el.textContent = ""));
  document.querySelectorAll("input").forEach((el) => el.classList.remove("input-error"));

  // Validate inputs
  const inputs = [
    { id: "firstName", validate: (value) => value.trim() !== "", errorMessage: "First name is required." },
    { id: "lastName", validate: (value) => value.trim() !== "", errorMessage: "Last name is required." },
    { id: "email", validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()), errorMessage: "Enter a valid email address." },
    { id: "password", validate: (value) => value.trim() !== "", errorMessage: "Password is required." },
    { id: "repassword", validate: (value, form) => value.trim() === form.password.value.trim(), errorMessage: "Passwords do not match." },
  ];

  inputs.forEach(({ id, validate, errorMessage }) => {
    const input = document.getElementById(id);
    const value = input.value;
    const errorElement = document.getElementById(`${id}Error`);

    if (validate(value, this)) {
      input.classList.remove("input-error");
      errorElement.textContent = "";
    } else {
      input.classList.add("input-error");
      errorElement.textContent = errorMessage;
      isValid = false;
    }
  });

  // If form is valid, submit the form
  if (isValid) {
    this.submit();
  }
});

// Add event listeners for real-time validation
document.querySelectorAll("input").forEach((input) => {
  input.addEventListener("input", function () {
    // Clear error message and error class on input change
    const id = this.id;
    const value = this.value;
    const errorElement = document.getElementById(`${id}Error`);

    let errorMessage = "";
    let isValid = true;

    switch (id) {
      case "firstName":
        if (value.trim() === "") {
          errorMessage = "First name is required.";
          isValid = false;
        }
        break;
      case "lastName":
        if (value.trim() === "") {
          errorMessage = "Last name is required.";
          isValid = false;
        }
        break;
      case "email":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          errorMessage = "Enter a valid email address.";
          isValid = false;
        }
        break;
      case "password":
        if (value.trim() === "") {
          errorMessage = "Password is required.";
          isValid = false;
        }
        break;
      case "repassword":
        if (value.trim() !== document.getElementById("password").value.trim()) {
          errorMessage = "Passwords do not match.";
          isValid = false;
        }
        break;
    }

    if (isValid) {
      this.classList.remove("input-error");
      errorElement.textContent = "";
    } else {
      this.classList.add("input-error");
      errorElement.textContent = errorMessage;
    }
  });
});
