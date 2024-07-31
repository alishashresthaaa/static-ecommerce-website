import { ARTISTS, GENRES } from "./constants.js";
import { wrapPlaylistInSwiperSlide } from "./generateCard.js";
import { populatePlaylists } from "./search.js";

// Generate random playlist
var similarPlaylist = function (artists, genres) {
  const playlists = populatePlaylists(artists, genres, "similar-playlist").splice(0, 8);
  var $swiperWrapper = $("#similar-playlist");
  $swiperWrapper.empty();
  playlists.forEach((playlist) => {
    const swiperSlide = wrapPlaylistInSwiperSlide(playlist);
    $swiperWrapper.append(swiperSlide);
  });

  // Initialize Swiper
  new Swiper(".similar-playlist-swiper", {
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
  // Populate the random playlist
  similarPlaylist(ARTISTS, GENRES);
});
