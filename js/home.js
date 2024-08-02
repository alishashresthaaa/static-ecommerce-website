// Populate the genres in  search section
var populateGenres = function () {
  let genresDiv = $("#genre");
  $.each(GENRES, function (index, value) {
    let $genre = $("<option>", {
      value: value,
      text: value,
    });
    genresDiv.append($genre);
  });
};

// Populate the artists in search section
var populateArtists = function () {
  let artistsDiv = $("#artist");
  $.each(ARTISTS, function (index, value) {
    let $genre = $("<option>", {
      value: value,
      text: value,
    });
    artistsDiv.append($genre);
  });
};

// Handling the search form submission
var handleSearch = function () {
  let genre = $("#genre").val();
  let artist = $("#artist").val();
  let query = `?genre=${genre}&artist=${artist}`;
  window.location.href = `\search.html${query}`;
};

// Generate random playlist
var populateMostBought = function (artists, genres) {
  const playlists = populatePlaylists(
    artists,
    genres,
    "most-bought-playlist"
  ).splice(0, 8);
  var $swiperWrapper = $("#most-bought-playlist");
  $swiperWrapper.empty();
  playlists.forEach((playlist) => {
    const swiperSlide = wrapPlaylistInSwiperSlide(playlist);
    $swiperWrapper.append(swiperSlide);
  });

  // Initialize Swiper
  new Swiper(".most-bought-swiper", {
    direction: "horizontal",
    slidesPerView: "auto",
    spaceBetween: 15,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });
};

// Generate random playlist for our top sales
var populateTopSales = function (artists, genres) {
  const playlists = populatePlaylists(
    artists,
    genres,
    "top-sales-playlist"
  ).splice(0, 8);
  var $swiperWrapper = $("#top-sales-playlist");
  $swiperWrapper.empty();
  playlists.forEach((playlist) => {
    const swiperSlide = wrapPlaylistInSwiperSlide(playlist);
    $swiperWrapper.append(swiperSlide);
  });

  // Initialize Swiper
  new Swiper(".top-sales-swiper", {
    direction: "horizontal",
    slidesPerView: "auto",
    spaceBetween: 15,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });
};

// On document ready populate the genres and artists
$(document).ready(function () {
  populateGenres();
  populateArtists();
  // Form Submission
  $("#search").on("submit", handleSearch);
  // Populate the random playlist
  populateMostBought(ARTISTS, GENRES);
  populateTopSales(ARTISTS, GENRES);
});
