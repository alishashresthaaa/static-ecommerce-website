import { openDB, getMyOrders } from "./db/indexed_db.js";

// Function to populate the table
function populateTable(data) {
  const $table = $("#orderTable");

  data.forEach((item) => {
    const $row = $("<tr>");

    const $orderId = $("<td>").text("#" + item.id);
    $row.append($orderId);

    const formattedDate = new Date(item.orderDate).toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const $deliveredOn = $("<td>").text(formattedDate);
    $row.append($deliveredOn);

    const $priceCell = $("<td>").text("$" + (item.totalCost || 0).toFixed(2));
    $row.append($priceCell);

    const $totalSongsCell = $("<td>").text(item.totalSongs);
    $row.append($totalSongsCell);

    const $totalPlayList = $("<td>").text(item.items.length);
    $row.append($totalPlayList);
    $table.append($row);
  });

  $("#total-items-count").text(data.length);
}

$(document).ready(() => {
  openDB()
    .then(getMyOrders)
    .then((playlists) => {
      console.log(JSON.stringify(playlists));
      populateTable(playlists);
    })
    .catch((error) => console.log("Error: ", error));
});
