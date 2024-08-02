/**
 * Generates a list of similar playlists based on provided artists and genres.
 * @param {Array} artists - Array of artist names.
 * @param {Array} genres - Array of genre names.
 */
var similarPlaylist = function (artists, genres) {
  const playlists = populatePlaylists(
    artists,
    genres,
    "similar-playlist"
  ).splice(0, 8);
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

/**
 * Populates the playlist detail section with provided data.
 * @param {Object} data - Playlist data object.
 */
function populatePlaylistDetail(data) {
  console.log("Playlist", data);
  $("#totalSongs").text(data.playlist.length);
  let artists = [];
  let genres = [];
  let duration = 0;
  data.playlist.forEach((song) => {
    artists.push(song.artists);
    genres.push(song.genre);
    duration += durationToSeconds(song.duration);
  });

  const playlistImage = getPlaylistImage(data.playlist);
  $("#playlistImageContainer").append(playlistImage);
  $("#totalMinutes").text(secondsToDuration(duration));
  $("#totalPrice").text("$" + data.price);

  addContent(artists, $("#artistList"));
  addContent(genres, $("#genreList"));

  listSongs(data.playlist);
}

/**
 * Lists all songs in the provided playlist.
 * @param {Array} playlist - Array of song objects.
 */
function listSongs(playlist) {
  const $trackTable = $("#trackTable");
  playlist.forEach((track) => {
    const $row = $("<tr></tr>");
    $row.append($("<td></td>").text(track.title));
    $row.append($("<td></td>").text(getArtistsName(track.artists)));
    $row.append($("<td></td>").text(track.duration + "Mins"));
    $trackTable.append($row);
  });
}

/**
 * Adds content items to the specified container.
 * @param {Array} items - Array of items to be added.
 * @param {jQuery} container - jQuery object representing the container.
 */
function addContent(items, container) {
  const genreNames = getArtistsName(items);
  genreNames.split(", ").forEach((artist) => {
    const $span = $("<span></span>").addClass("search__pills").text(artist);
    $span.appendTo(container);
  });
}

// On document ready populate the genres and artists
$(document).ready(function () {
  const playlist = getCurrentPlaylist();
  if (playlist) {
    populatePlaylistDetail(playlist);
  }
  // Populate the random playlist
  similarPlaylist(ARTISTS, GENRES);
  $("#addToCart").click(function () {
    addToCart(playlist, $("#addToCart"));
  });
});
