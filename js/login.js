document.getElementById("loginForm").addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent form submission

  let isValid = true;

  // Clear previous errors and classes
  document.querySelectorAll(".error-message").forEach((el) => (el.textContent = ""));
  document.querySelectorAll("input").forEach((el) => el.classList.remove("input-error"));

  // Validate Email
  const email = document.getElementById("email").value.trim();
  const validEmail = "sandip.tamang@lambton.com";
  if (email !== validEmail) {
    document.getElementById("emailError").textContent = "Email is invalid.";
    document.getElementById("email").classList.add("input-error");
    isValid = false;
  }

  // Validate Password
  const password = document.getElementById("password").value.trim();
  const validPassword = "Sandip@123";
  if (password !== validPassword) {
    document.getElementById("passwordError").textContent = "Password is invalid.";
    document.getElementById("password").classList.add("input-error");
    isValid = false;
  }

  // If form is valid, submit the form
  if (isValid) {
    this.submit();
  }
});

// Add event listeners for real-time validation
document.querySelectorAll("input").forEach((input) => {
  input.addEventListener("input", function () {
    const id = this.id;
    const value = this.value.trim();
    const errorElement = document.getElementById(`${id}Error`);

    let errorMessage = "";
    let isValid = true;

    switch (id) {
      case "email":
        if (value !== "sandip.tamang@gmail.com") {
          errorMessage = "Email is invalid.";
          isValid = false;
        }
        break;
      case "password":
        if (value !== "Sandip@123") {
          errorMessage = "Password is invalid.";
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
