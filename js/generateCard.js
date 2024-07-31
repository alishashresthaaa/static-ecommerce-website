import { addCartItem } from "./db/indexed_db.js";

// Image grid for playlist card
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

  var $addToCartButton = $("<button>", {
    class: "btn btn-primary playlist__card__btn",
    text: "Add to cart",
  }).on("click", function (event) {
    event.stopPropagation();
    $(this).text("Added to cart").prop("disabled", true);
    // $(this).prop("disabled", true);
    addToCart(playlist, $(this));
  });

  $playlistContent.append($addToCartButton);
  $playlist.append($playlistContent);
  return $playlist;
};

// Function to add the playlist to the cart
function addToCart(playlist, component) {
  addCartItem(playlist)
    .then(() => {
      component.prop("disabled", true);
      console.log("Added to the database");
      $.toast({
        hideAfter:4000,
        heading: "Success",
        text: "Item added to cart",
        icon: "success",
        position: "top-center",})
    })
    .catch((error) => console.log("Error to add item ", error));
}

var wrapPlaylistInSwiperSlide = function (playlist) {
  return $("<div>", {
    class: "swiper-slide",
  }).append(getPlaylistItem(playlist));
};

export { getPlaylistImage, getPlaylistItem, wrapPlaylistInSwiperSlide };
