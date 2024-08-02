$(document).ready(function () {
  $("#togglePassword").on("click", function () {
    var passwordInput = $("#password");
    var type = passwordInput.attr("type") === "password" ? "text" : "password";
    passwordInput.attr("type", type);
    $(this).toggleClass("fa-eye fa-eye-slash");
  });

  $("#toggleRepassword").on("click", function () {
    var passwordInput = $("#confirmPassword");
    var type = passwordInput.attr("type") === "password" ? "text" : "password";
    passwordInput.attr("type", type);
    $(this).toggleClass("fa-eye fa-eye-slash");
  });
});
