import { ARTISTS, GENRES } from "./constants.js";

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

var handleSearch = function () {
  let genre = $("#genre").val();
  let artist = $("#artist").val();
  let query = `?genre=${genre}&artist=${artist}`;
  console.log(query);
  window.location.href = `\search.html${query}`;
};

$(document).ready(function () {
  populateGenres();
  populateArtists();

  $("#search").on("submit", handleSearch);
});
