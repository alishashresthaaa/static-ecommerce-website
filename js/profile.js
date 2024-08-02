// Function to redirect to the home page
function redirectToHome() {
  window.location.href = "index.html";
}

// Function to redirect to the login page
function redirectLogin() {
  window.location.href = "login.html";
}

// Get references to profile elements
let $profileImage = $("#profile-image");
let $profileName = $("#profile-name");
let $profileEmail = $("#profile-email");
let $memberSince = $("#member-since");

let $firstName = $("#first-name");
let $lastName = $("#last-name");
let $dob = $("#dob");
let $gender = $("#gender");
let $address = $("#address");

// Function to load the profile image
function loadProfileImage() {
  const user = getLoggedUser(); // Get the logged-in user
  // Generate the profile image URL
  const url =
    "https://ui-avatars.com/api/?background=random&name=" +
    user.firstName +
    "+" +
    user.lastName;
  // Set the profile image source
  $profileImage.attr("src", url);
}

// Function to initialize the profile with user data
function initProfile(user) {
  loadImage(); // Load the image
  loadProfileImage(); // Load the profile image
  $profileName.text(user.firstName + " " + user.lastName);
  $profileEmail.text(user.email);
  $memberSince.text(user.memberSince || "Member since: 2024");

  // Set profile form fields
  $firstName.val(user.firstName || "");
  $lastName.val(user.lastName || "");
  $dob.val(user.dob || "");
  $gender.val(user.gender || "");
  $address.val(user.address || "");
}

// Function to update the user profile
function updateProfile(event) {
  event.preventDefault(); // Prevent the default form submission
  const user = getLoggedUser(); // Get the logged-in user
  // Update user object with form values
  user.firstName = $firstName.val();
  user.lastName = $lastName.val();
  user.dob = $dob.val();
  user.gender = $gender.val();
  user.address = $address.val();
  if (!user.firstName || !user.lastName) {
    $.toast({
      hideAfter: 4000,
      heading: "Error",
      text: "First name and last name are required fields",
      icon: "error",
      position: "top-center",
    });
    return;
  }
  // Update the user profile in the database
  updateUserProfile(user.email, user)
    .then(() => {
      $.toast({
        hideAfter: 4000,
        heading: "Success",
        text: "Profile updated successfully",
        icon: "success",
        position: "top-center",
      });
      setLoggedInUser(user); // Update the logged-in user in local storage
      initProfile(user); // Re-initialize the profile with updated data
    })
    .catch((error) => {
      $.toast({
        hideAfter: 4000,
        heading: "Error",
        text: "Failed to update profile",
        icon: "error",
        position: "top-center",
      });
      console.error(error);
    });
}

// Function to run when the window loads
$(document).ready(function () {
  if (!isLoggedIn()) {
    // Check if the user is not logged in
    redirectLogin(); // Redirect to login page
    return;
  }
  // Open the database
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
  $("#update-button").on("click", updateProfile);
  $("#logout-button").on("click", function () {
    logout(); // Log out the user
    redirectLogin(); // Redirect to login page
  });
});

// Expose redirectToHome function to the global scope
window.redirectToHome = redirectToHome;
