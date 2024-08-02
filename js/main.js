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
    const $navList = $("#webNav");
    const $mobileNavList = $("#nav_list__mobile");
    const $loginContent = $("#loginContent");
    const $viewProfile = $("#viewProfile");

    $navList.empty(); // Clear existing items
    $mobileNavList.empty(); // Clear existing items

    NAVIGATION__LIST.forEach(function (navItem) {
      // Determine visibility based on login status
      if (
        !isUserLoggedIn &&
        ["cart", "orders", "profile"].includes(navItem.key)
      ) {
        return; // Skip these items if not logged in
      }
      if (isUserLoggedIn && ["login", "register"].includes(navItem.key)) {
        return; // Skip login and register items if logged in
      }

      const $navItem = createNavItem(navItem);
      // Append the item to the web navigation list if it's not "login" or "register"
      if (
        navItem.key !== "login" &&
        navItem.key !== "register" &&
        navItem.key !== "profile"
      ) {
        $navList.append($navItem);
      }
      $mobileNavList.append($navItem.clone()); // Add the same item to mobile nav
    });

    // Additional logic based on user login status
    if (isUserLoggedIn) {
      $viewProfile.show();
      loadImage();
    } else {
      $loginContent.show();
    }

    $(".nav__logo").click(function () {
      window.location.href = "index.html";
    });
  }

  function initHamburgerMenu() {
    // Attach click event to the hamburger menu
    $(".hamburger__menu").on("click", toggleMobileMenu);

    // Attach click event to the navigation logo
    $(".nav__logo").on("click", function () {
      window.location.href = "/";
    });

    // Attach click event to the login link if it exists
    if ($(".header__login").length) {
      $(".header__login").on("click", function () {
        window.location.href = "login.html";
      });
    }
  }

  initHamburgerMenu(); // Call function to initialize the hamburger menu
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
