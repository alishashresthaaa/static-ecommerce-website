import { ARTISTS, GENRES, PRICE_PER_SONG, SONGS } from "./constants.js";
import { getRandomInt } from "./utils.js";

var shuffleSongs = function (array) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
};

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

var getPlaylistImage = function (playlist) {
  var $playlistImage = $("<div>", {
    class: "playlist__img__grid",
  });
  const imagesSet = new Set(playlist.map((song) => song.image));
  const images = [...imagesSet].slice(0, 4);
  $.each(images, function (index, image) {
    $playlistImage.append(
      $("<img>", {
        src: image,
        alt: "playlist image",
        class: "song_image",
      })
    );
  });
  return $playlistImage;
};

var getPlaylistItem = function (playlist) {
  var $playlist = $("<div>", {
    class: "playlist__card",
  }).on("click", function () {
    window.location.href = `playlist-detail.html?playlistId=${playlist.id}`;
  });

  $playlist.append(getPlaylistImage(playlist.playlist));
  var $playlistContent = $("<div>", {
    class: "playlist__card__content",
  });

  $playlistContent.append(
    $("<div>", {
      class: "playlist__price",
      html: `<span class="card__key">Price: </span><span class="card__value">${playlist.price.toLocaleString("en-US", {
        style: "currency",
        currency: "CAD",
      })}</span>`,
    })
  );

  var $playlistTracks = $("<div>", { class: "playlist__tracks" });
  $.each(playlist.playlist.slice(0, 3), function (index, song) {
    $playlistTracks.append(
      $("<div>", {
        class: "playlist__track",
      })
        .append(
          $("<i>", {
            class: "fa-regular fa-circle-play playlist__icon",
          })
        )
        .append(
          $("<span>", {
            class: "card__tracks",
            text: `${song.title} - ${song.artists.join(", ")}`,
          })
        )
    );
  });

  $playlistTracks.append(
    $("<div>", {
      class: "playlist__track",
    }).append(
      $("<span>", {
        text: `+ ${playlist.playlist.length - 3} more`,
      })
    )
  );
  $playlistContent.append($playlistTracks);

  $playlistContent.append(
    $("<button>", {
      class: "btn btn-primary playlist__card__btn",
      text: "Add to cart",
    })
  );
  $playlist.append($playlistContent);
  return $playlist;
};

var populatePlaylists = function (artists, genres) {
  const playlists = generatePlaylist(artists, genres);
  var $playlists = $("#playlist");

  $playlists.empty();
  playlists.forEach((element) => {
    const playlistItem = getPlaylistItem(element);
    $playlists.append(playlistItem);
  });
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
