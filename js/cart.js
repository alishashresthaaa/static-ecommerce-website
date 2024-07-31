import { openDB, getMyCartItems, removeCartItem } from "./db/indexed_db.js";

const truncateText = function (text, limit) {
  return text.length > limit ? text.substring(0, limit) + "..." : text;
};

// Function to populate the table
function populateTable(data) {
  const $table = $("#cartTable");
  let totalCost = 0;

  data.forEach((item) => {
    totalCost += item.price;
    console.log(totalCost, item.price);
    let duration = 0;
    let artists = [];

    const playlist = item.playlist;
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
          .then(() => {
            $row.remove();
            location.reload();
          })
          //   .then(getMyCartItems)
          //   .then((playlists) => {
          //     $row.remove();
          //     populateTable(playlists);
          //   })
          .catch((error) => console.log("Error: ", error));
      });
    $removeCell.append($removeIcon);
    $row.append($removeCell);

    $table.append($row);
  });

  $("#sub-total").text("$ " + totalCost.toFixed(2));
  $("#total-track-items").text(data.length);
  $("#total-items-count").text(data.length);
}

const getArtistsName = function (artists) {
  const combinedArtists = artists.flat();
  const uniqueArtistsSet = new Set(combinedArtists);
  const uniqueArtistsString = Array.from(uniqueArtistsSet).join(", ");
  return uniqueArtistsString;
};

const durationToSeconds = function (duration) {
  const [minutes, seconds] = duration.split(":").map(Number);
  return minutes * 60 + seconds;
};

// Function to convert seconds to duration string (MM:SS)
const secondsToDuration = function (seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")} Mins`;
};

// Function to handle place order button
$("#placeOrder").on("click", function () {
  // Show the modal
  $("#successModal").fadeIn();

  openDB()
    .then((db) => {
      const tx = db.transaction("cart", "readwrite");
      const cartStore = tx.objectStore("cart");
      cartStore.clear();
    })
    .catch((error) => console.log("Error: ", error));
});

$("#closeDialog").on("click", function () {
  window.location.href = "orders.html";
});

$(document).ready(() => {
  openDB()
    .then(getMyCartItems)
    .then((playlists) => {
      console.log(JSON.stringify(playlists));
      populateTable(playlists);
    })
    .catch((error) => console.log("Error: ", error));
});
