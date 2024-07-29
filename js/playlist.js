import { ARTISTS, GENRES, SONGS } from "./constants.js";

function shufflePlaylist(array) {
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
}

const generatePlaylist = function (artists, genres, limit = 50) {
  let playlist = SONGS.filter((song) => {
    return (
      artists.some((element) => song.artists.includes(element)) ||
      genres.includes(song.genre)
    );
  });
  shufflePlaylist(playlist);
  return playlist.slice(0, limit);
};

const getPlaylistItem = function (song) {
  let $playlistItem = $("<div>").addClass("playlist-item");
  let $songImage = $("<img>")
    .addClass("song-image")
    .attr("src", song.image)
    .attr("alt", song.title);
  $playlistItem.append($songImage);

  let $songInfo = $("<div>").addClass("song-info");

  let $songTitle = $("<div>").addClass("song-title").text(song.title);
  $songInfo.append($songTitle);

  let $album = $("<div>").addClass("album-artist").text(`${song.album}`);
  $songInfo.append($album);

  $playlistItem.append($songInfo);
  return $playlistItem;
};

const populatePlaylist = function (playlist) {
  let playlistDiv = $("#playlist");
  playlistDiv.empty();

  $.each(playlist, function (index, song) {
    playlistDiv.append(getPlaylistItem(song));
  });
};

$(document).ready(function () {
  var selectedGenres = [];
  var selectedArtists = [];

  var populateGenres = function () {
    let genresDiv = $("#genres");
    $.each(GENRES, function (index, value) {
      let $genre = $("<div>")
        .addClass("genre category-item ")
        .text(value)
        .on(`click`, function () {
          toggleGenre($(this), value);
        });
      genresDiv.append($genre);
    });

    let artistsDiv = $("#artists");

    $.each(ARTISTS, function (index, value) {
      let $artist = $("<div>")
        .addClass("artist category-item")
        .text(value)
        .on(`click`, function () {
          toggleArtists($(this), value);
        });
      artistsDiv.append($artist);
    });
  };

  populateGenres();

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

  var handleSubmit = function () {
    const playlist = generatePlaylist(selectedArtists, selectedGenres);
    populatePlaylist(playlist);
  };

  $("#generate").on("click", handleSubmit);
});
