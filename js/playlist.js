/**
 * Generates a grid of images for a playlist.
 * @param {Array} playlist - Array of song objects.
 * @returns {jQuery} - A jQuery object containing the playlist image grid.
 */
const getPlaylistImage = function (playlist) {
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

/**
 * Generates a playlist card element.
 * @param {Object} playlist - Playlist object containing songs and price.
 * @returns {jQuery} - A jQuery object containing the playlist card.
 */
var getPlaylistItem = function (playlist) {
  var $playlist = $("<div>", {
    class: "playlist__card",
  }).on("click", function () {
    addCurretnPlaylist(playlist);
    window.location.href = `playlist-detail.html?playlistId=${getRandomInt(
      100,
      1000
    )}`;
  });

  $playlist.append(getPlaylistImage(playlist.playlist));
  var $playlistContent = $("<div>", {
    class: "playlist__card__content",
  });

  // Append playlist price
  $playlistContent.append(
    $("<div>", {
      class: "playlist__price",
      html: `<span class="card__key">Price: </span><span class="card__value">${playlist.price.toLocaleString(
        "en-US",
        {
          style: "currency",
          currency: "CAD",
        }
      )}</span>`,
    })
  );

  var $playlistTracks = $("<div>", { class: "playlist__tracks" });
  // Append up to 3 tracks from the playlist
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

  // Append remaining tracks count
  $playlistTracks.append(
    $("<div>", {
      class: "playlist__track",
    }).append(
      $("<span>", {
        text: `+ ${Math.max(playlist.playlist.length - 3, 0)} more`,
      })
    )
  );
  $playlistContent.append($playlistTracks);

  var $addToCartButton = $("<button>", {
    class: "btn btn-primary playlist__card__btn",
    text: "Add to cart",
  }).on("click", function (event) {
    event.stopPropagation();
    addToCart(playlist, $(this));
  });

  $playlistContent.append($addToCartButton);
  $playlist.append($playlistContent);
  return $playlist;
};

// function to generate `count` no of playlists
// uses given artists and genres to generate a playlist
// NOTE:  limit is not given then it will be a random number between 10 and 25
var generatePlaylist = function (
  artists = [],
  genres = [],
  limit = null,
  count = 12
) {
  let playlists = [];

  // filter songs based on artists and genres
  let fiilteredSongs = SONGS.filter((song) => {
    if (artists.length == 0 && genres.length == 0) {
      return true;
    }
    return (
      artists.some((element) => song.artists.includes(element)) ||
      genres.includes(song.genre)
    );
  });

  if (fiilteredSongs.length == 0) {
    return playlists;
  }

  // Shuffle and generate playlist
  for (let i = 0; i < count; i++) {
    shuffleSongs(fiilteredSongs);

    var realLimit = limit ? limit : getRandomInt(10, 25);
    playlists.push({
      playlist: fiilteredSongs.slice(0, realLimit),
      price: PRICE_PER_SONG * realLimit,
    });
  }
  return playlists;
};

// function to populate playlists in element with given id
var populatePlaylists = function (artists, genres, id = "playlist") {
  const playlists = generatePlaylist(artists, genres);
  var $playlists = $("#" + id);
  $playlists.empty();

  // Chec if no playlists are found
  if (playlists.length == 0) {
    let $noresult = $("<div>", { class: "no-results" });
    $noresult.append($("<img>", { src: "./images/empty.jpg" }));
    $noresult.append(
      $("<h2>", { text: "Oops! Your search hit a flat note." })
    );
    $noresult.append(
      $("<p>", {
        text: "We couldn't find any playlists matching your search! Try spicing up the search by adding more artists or genres.",
      })
    );
    $playlists.append($noresult);
    return playlists;
  }

  playlists.forEach((element) => {
    const playlistItem = getPlaylistItem(element);
    $playlists.append(playlistItem);
  });
  return playlists;
};

/**
 * Wraps a playlist card in a Swiper slide.
 * @param {Object} playlist - Playlist object to be wrapped.
 * @returns {jQuery} - A jQuery object containing the Swiper slide.
 */
var wrapPlaylistInSwiperSlide = function (playlist) {
  return $("<div>", {
    class: "swiper-slide",
  }).append(getPlaylistItem(playlist));
};

/**
 * Adds a playlist to the cart.
 * @param {Object} playlist - Playlist object to be added to the cart.
 * @param {jQuery} component - jQuery object representing the "Add to cart" button.
 */
function addToCart(playlist, component) {
  addCartItem(playlist)
    .then(() => {
      component.text("Added to cart").prop("disabled", true);
      console.log("Added to the database");
      $.toast({
        hideAfter: 4000,
        heading: "Success",
        text: "Item added to cart",
        icon: "success",
        position: "top-center",
      });
    })
    .catch((error) => {
      if (error.name === UNAUTHORIZED) {
        redirectToLogin();
        return;
      }
      $.toast({
        hideAfter: 4000,
        heading: "Error",
        text: "Login to add item to cart",
        icon: "error",
        position: "top-center",
      });
      console.error("Error to add item ", error);
    });
}
