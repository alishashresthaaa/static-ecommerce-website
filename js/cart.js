import { openDB, getMyCartItems, removeCartItem } from "./db/indexed_db.js";

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

    const $artistCell = $("<td>").text(getArtistsName(artists));
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
          .then(() => $row.remove())
          .catch((error) => console.log("Error: ", error));
      });
    $removeCell.append($removeIcon);
    $row.append($removeCell);

    $table.append($row);
  });

  $("#sub-total").text("$ " + totalCost.toFixed(2));
  $("#total-track-items").text(data.length);
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

$(document).ready(() => {
  openDB()
    .then(getMyCartItems)
    .then((playlists) => {
      console.log(JSON.stringify(playlists));
      populateTable(playlists);
    })
    .catch((error) => console.log("Error: ", error));
});
