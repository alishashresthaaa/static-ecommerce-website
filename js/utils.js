// Function to gerenate random integer
var getRandomInt = function (min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; // The maximum is inclusive and the minimum is inclusive
};

var shuffleSongs = function (array) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
};

var toggleMobileMenu = function () {
  const menu = document.querySelector("#nav_list__mobile");
  menu.classList.toggle("show");
};

document.addEventListener("DOMContentLoaded", function () {
  document
    .querySelector(".hamburger__menu")
    .addEventListener("click", toggleMobileMenu);
  document.querySelector(".nav__logo").addEventListener("click", function () {
    window.location.href = "/";
  });

  if (document.querySelector(".header__login")) {
    document
      .querySelector(".header__login")
      .addEventListener("click", function () {
        window.location.href = "login.html";
      });
  }
});

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

// Function to convert duration string (MM:SS) to seconds
const durationToSeconds = function (duration) {
  const [minutes, seconds] = duration.split(":").map(Number);
  return minutes * 60 + seconds;
};

// Function to convert seconds to duration string (MM:SS)
const secondsToDuration = function (seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")} Mins`;
};

// Function to get unique artist names from a list of artists
const getArtistsName = function (artists) {
  const combinedArtists = artists.flat();
  const uniqueArtistsSet = new Set(combinedArtists);
  const uniqueArtistsString = Array.from(uniqueArtistsSet).join(", ");
  return uniqueArtistsString;
};
