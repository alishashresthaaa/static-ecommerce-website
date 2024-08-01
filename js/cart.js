import {
  openDB,
  getMyCartItems,
  removeCartItem,
  placeOrderItem,
  clearCartItems,
} from "./db/indexed_db.js";

import { getLoggedUser } from "./db/local_storage.js";

let cartItems = [];
let totalCost = 0;
let totalSongs = 0;

const truncateText = function (text, limit) {
  return text.length > limit ? text.substring(0, limit) + "..." : text;
};

// Function to populate the table
function populateTable(data) {
  totalCost = 0;
  totalSongs = 0;
  cartItems = data;
  const $table = $("#cartTable");
  const $tableBody = $table.find("tbody");
  // Clear all existing rows from the table body
  $tableBody.empty();
  if (data.length === 0) {
    $("#summaryContainer").hide();
  } else {
    $("#summaryContainer").show();
  }
  data.forEach((item) => {
    totalCost += item.price;
    console.log(totalCost, item.price);
    let duration = 0;
    let artists = [];

    const playlist = item.playlist;
    totalSongs += playlist.length;
    if (playlist) {
      playlist.forEach((song) => {
        artists.push(song.artists);
        duration += durationToSeconds(song.duration);
      });
    }
    const $row = $("<tr>");

    const artistNames = getArtistsName(artists);
    const truncatedArtists = truncateText(artistNames, 80);
    const $artistCell = $("<td>");
    const $artistContainer = $("<div>").addClass("artist-container");

    const $artistNames = $("<span>")
      .addClass("artist-names")
      .text(truncatedArtists);
    $artistContainer.append($artistNames);

    if (artistNames.length > 80) {
      const $toggleButton = $("<a>")
        .addClass("toggle-button")
        .text("Show all")
        .on("click", function () {
          if ($artistNames.text().endsWith("...")) {
            $artistNames.text(artistNames);
            $toggleButton.text("Show less");
          } else {
            $artistNames.text(truncatedArtists);
            $toggleButton.text("Show all");
          }
        });

      $artistContainer.append($toggleButton);
    }

    $artistCell.append($artistContainer);
    $row.append($artistCell);

    const $durationCell = $("<td>").text(secondsToDuration(duration));
    $row.append($durationCell);

    const $priceCell = $("<td>").text("$" + item.price);
    $row.append($priceCell);

    const $totalSongsCell = $("<td>").text(playlist.length);
    $row.append($totalSongsCell);

    const $removeCell = $("<td>");
    const $removeIcon = $("<i>")
      .addClass("fa-solid fa-trash")
      .on("click", function () {
        removeCartItem(item.id)
          .then(getMyCartItems)
          .then((playlists) => {
            populateTable(playlists);
          })
          .catch((error) => console.log("Error: ", error));
      });
    $removeCell.append($removeIcon);
    $row.append($removeCell);

    $tableBody.append($row);
  });

  $("#sub-total").text("$ " + totalCost.toFixed(2));
  $("#total-track-items").text(data.length);
  $("#total-items-count").text(data.length);
}

export const getArtistsName = function (artists) {
  const combinedArtists = artists.flat();
  const uniqueArtistsSet = new Set(combinedArtists);
  const uniqueArtistsString = Array.from(uniqueArtistsSet).join(", ");
  return uniqueArtistsString;
};

export const durationToSeconds = function (duration) {
  const [minutes, seconds] = duration.split(":").map(Number);
  return minutes * 60 + seconds;
};

// Function to convert seconds to duration string (MM:SS)
export const secondsToDuration = function (seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")} Mins`;
};

function placeOrder() {
  if (cartItems.length === 0) {
    $.toast({
      hideAfter: 4000,
      heading: "Error",
      text: "Cart is empty. Please add items to cart.",
      icon: "error",
      position: "top-center",
    });
    return;
  }
  const order = {
    items: cartItems,
    totalCost: totalCost,
    totalSongs: totalSongs,
  };
  placeOrderItem(order)
    .then(clearCartItems)
    .then(() => {
      $("#successModal").fadeIn();
    })
    .catch((error) => {
      console.log("Error: ", error);
      alert("Error placing order. Please try again.");
    });
}

$(document).ready(() => {
  openDB()
    .then(getMyCartItems)
    .then((playlists) => {
      populateTable(playlists);
    })
    .catch((error) => console.log("Error: ", error));

  $("#userEamil").text(getLoggedUser().email);

  // Get the current date and time
  let currentDate = new Date();
  // Add one day to the current date
  currentDate.setDate(currentDate.getDate() + 1);
  // Format the date to YYYY-MM-DD
  let formattedDate = currentDate.toISOString().split("T")[0];
  // Display the formatted date and time
  $("#dateTimeToday").text(formattedDate);

  // On place order
  $("#buttonPlaceOrder").on("click", placeOrder);

  $("#closeDialog").on("click", function () {
    window.location.href = "orders.html";
  });
});
