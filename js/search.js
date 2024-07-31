import { ARTISTS, GENRES, PRICE_PER_SONG, SONGS } from "./constants.js";
import { getPlaylistItem } from "./generateCard.js";
import { getRandomInt, shuffleSongs } from "./utils.js";

var generatePlaylist = function (artists = [], genres = [], limit = null, count = 10) {
  let playlists = [];
  let playlist = SONGS.filter((song) => {
    if (artists.length == 0 && genres.length == 0) {
      return true;
    }
    return artists.some((element) => song.artists.includes(element)) || genres.includes(song.genre);
  });

  for (let i = 0; i < count; i++) {
    shuffleSongs(playlist);

    var realLimit = limit ? limit : getRandomInt(10, 25);
    playlists.push({
      playlist: playlist.slice(0, realLimit),
      price: PRICE_PER_SONG * realLimit,
    });
  }
  console.log(playlists);
  return playlists;
};

var populatePlaylists = function (artists, genres, id = "playlist") {
  const playlists = generatePlaylist(artists, genres);
  var $playlists = $("#" + id);
  $playlists.empty();
  playlists.forEach((element) => {
    const playlistItem = getPlaylistItem(element);
    $playlists.append(playlistItem);
  });
  return playlists;
};

$(document).ready(function () {
  const urlParams = new URLSearchParams(window.location.search);
  var selectedArtists = urlParams.getAll("artist");
  var selectedGenres = urlParams.getAll("genre");

  var populateGenres = function () {
    let genresDiv = $("#genres");
    $.each(GENRES, function (index, value) {
      let $genre = $("<div>", {
        class: `genre search__pills${selectedGenres.includes(value) ? " selected" : ""}`,
        text: value,
      }).on(`click`, function () {
        toggleGenre($(this), value);
      });
      genresDiv.append($genre);
    });

    let artistsDiv = $("#artists");
    $.each(ARTISTS, function (index, value) {
      let $artist = $("<div>", {
        id: value,
        class: `artist search__pills${selectedArtists.includes(value) ? " selected" : ""}`,
        text: value,
      }).on(`click`, function () {
        toggleArtists($(this), value);
      });
      artistsDiv.append($artist);
    });
  };

  var toggleGenre = function ($element, value) {
    if (selectedGenres.includes(value)) {
      selectedGenres = selectedGenres.filter((genre) => genre !== value);
      $element.removeClass("selected");
    } else {
      selectedGenres.push(value);
      $element.addClass("selected");
    }
  };

  var toggleArtists = function ($element, value) {
    if (selectedArtists.includes(value)) {
      selectedArtists = selectedArtists.filter((artist) => artist !== value);
      $element.removeClass("selected");
    } else {
      selectedArtists.push(value);
      $element.addClass("selected");
    }
  };

  // Populate genres and playlists
  populateGenres();
  // Populate default playlists
  populatePlaylists(selectedArtists, selectedGenres);

  var handleSearch = function () {
    const queryParams = new URLSearchParams();
    selectedArtists.forEach((artist) => queryParams.append("artist", artist));
    selectedGenres.forEach((genre) => queryParams.append("genre", genre));

    const queryString = queryParams.toString();
    const url = new URL(window.location.href);
    url.search = queryString;
    const newUrl = url.toString();
    window.history.pushState(null, null, newUrl);
    console.log(selectedArtists, selectedGenres);
    populatePlaylists(selectedArtists, selectedGenres);
  };

  $("#search").on("click", handleSearch);
});

export { generatePlaylist, populatePlaylists };
