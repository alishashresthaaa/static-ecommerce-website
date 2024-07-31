import { isLoggedIn, getLoggedUser } from "./db/local_storage.js";

function redirectToLogin() {
  window.location.href = "login.html";
}
function redirectToHome() {
  window.location.href = "index.html";
}

function redirectToProfile() {
  window.location.href = "profile.html";
}

function redirectToSearchPage() {
  window.location.href = "search.html";
}

function loadImage() {
  const user = getLoggedUser();
  const url = "https://ui-avatars.com/api/?background=random&name=" + user.firstName + "+" + user.lastName;

  document.getElementById("profileImage").src = url;
}

// Handle navigation bar based on user login status
const NAVIGATION__LIST = [
  { key: "home", name: "Home", value: "index.html" },
  { key: "search", name: "Search", value: "search.html" },
  { key: "pricing", name: "Pricing", value: "pricing.html" },
  { key: "faq", name: "FAQ", value: "faq.html" },
  { key: "cart", name: "Cart", value: "cart.html" },
  { key: "orders", name: "My Orders", value: "orders.html" },
  { key: "profile", name: "My Profile", value: "profile.html" },
  { key: "login", name: "Login", value: "login.html" },
  { key: "register", name: "Register", value: "register.html" },
];

$(document).ready(function () {
  const $navList = $("#webNav");
  const $mobileNavList = $("#nav_list__mobile");
  const $loginContent = $("#loginContent");
  const $viewProfile = $("#viewProfile");

  // Determine which items to include based on login status
  const isUserLoggedIn = isLoggedIn();

  // Helper function to create navigation items
  function createNavItem(navItem) {
    const $li = $("<li>", { class: "nav__item" });
    const $a = $("<a>", { href: navItem.value, text: navItem.name });

    $li.append($a);
    return $li;
  }

  // Function to update navigation for both web and mobile
  function updateNavMenu() {
    $navList.empty(); // Clear existing items
    $mobileNavList.empty(); // Clear existing items

    NAVIGATION__LIST.forEach(function (navItem) {
      // Determine visibility based on login status
      if (!isUserLoggedIn && ["cart", "orders", "profile"].includes(navItem.key)) {
        return; // Skip these items if not logged in
      }
      if (isUserLoggedIn && ["login", "register"].includes(navItem.key)) {
        return; // Skip login and register items if logged in
      }

      const $navItem = createNavItem(navItem);
      // Append the item to the web navigation list if it's not "login" or "register"
      if (navItem.key !== "login" && navItem.key !== "register" && navItem.key !== "profile") {
        $navList.append($navItem);
      }
      $mobileNavList.append($navItem.clone()); // Add the same item to mobile nav
    });

    // Additional logic based on user login status
    if (isUserLoggedIn) {
      $loginContent.hide();
      $viewProfile.show();
      $profileImage.attr("src", "https://ui-avatars.com/api/?background=random&name=" + user.firstName + "+" + user.lastName);
    } else {
      $loginContent.show();
      $viewProfile.hide();
    }
  }

  updateNavMenu(); // Call function to update the navigation menus
});

window.redirectToLogin = redirectToLogin;
window.redirectToHome = redirectToHome;
window.redirectToProfile = redirectToProfile;
window.redirectToSearchPage = redirectToSearchPage;

AOS.init({
  delay: 12,
  duration: 700,
  easing: "ease",
  once: false,
  anchorPlacement: "top-bottom",
});

export { loadImage };
