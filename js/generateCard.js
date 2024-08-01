import { UNAUTHORIZED } from "./constants.js";
import { addCartItem } from "./db/indexed_db.js";
import { addCurretnPlaylist } from "./db/local_storage.js";
import { redirectToLogin } from "./main.js";
import { getRandomInt } from "./utils.js";

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
        text: `+ ${playlist.playlist.length - 3} more`,
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
        text: "Can't add item to cart",
        icon: "error",
        position: "top-center",
      });
      console.log("Error to add item ", error);
    });
}

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

export {
  getPlaylistImage,
  getPlaylistItem,
  wrapPlaylistInSwiperSlide,
  addToCart,
};
