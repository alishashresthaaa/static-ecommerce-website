$(document).ready(function () {
  // connect to database
  openDB()
    .then(() => {
      console.log("Database connected");
    })
    .catch((error) => console.error(error));

  // Initialize selected artists and genres from url params
  const urlParams = new URLSearchParams(window.location.search);
  var selectedArtists = urlParams.getAll("artist");
  var selectedGenres = urlParams.getAll("genre");

  // function to populate genres and artists
  var populateGenresAndArtists = function () {
    // Get genres div and populate with genres
    let genresDiv = $("#genres");
    $.each(GENRES, function (index, value) {
      let $genre = $("<div>", {
        class: `genre search__pills${
          selectedGenres.includes(value) ? " selected" : ""
        }`,
        text: value,
      }).on(`click`, function () {
        toggleGenre($(this), value);
      });
      genresDiv.append($genre);
    });

    // Get artists div and populate with artists
    let artistsDiv = $("#artists");
    $.each(ARTISTS, function (index, value) {
      let $artist = $("<div>", {
        id: value,
        class: `artist search__pills${
          selectedArtists.includes(value) ? " selected" : ""
        }`,
        text: value,
      }).on(`click`, function () {
        toggleArtists($(this), value);
      });
      artistsDiv.append($artist);
    });
  };

  // Handle genre toggle
  var toggleGenre = function ($element, value) {
    if (selectedGenres.includes(value)) {
      selectedGenres = selectedGenres.filter((genre) => genre !== value);
      $element.removeClass("selected");
    } else {
      selectedGenres.push(value);
      $element.addClass("selected");
    }
  };

  // Handle artist toggle
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
  populateGenresAndArtists();
  // Populate default playlists
  populatePlaylists(selectedArtists, selectedGenres);

  // handle search click
  var handleSearch = function () {
    const queryParams = new URLSearchParams();
    selectedArtists.forEach((artist) => queryParams.append("artist", artist));
    selectedGenres.forEach((genre) => queryParams.append("genre", genre));

    // Add the query params to the url
    const queryString = queryParams.toString();
    const url = new URL(window.location.href);
    url.search = queryString;
    const newUrl = url.toString();
    window.history.pushState(null, null, newUrl);

    // populate the playlist
    populatePlaylists(selectedArtists, selectedGenres);
  };

  // Add event listener to search button
  $("#search").on("click", handleSearch);
});
