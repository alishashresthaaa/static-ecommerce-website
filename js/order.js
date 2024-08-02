// Function to populate the table with order data
function populateTable(data) {
  const $table = $("#orderTable"); // Get the table element

  // Iterate over each order item and create table rows
  data.forEach((item) => {
    const $row = $("<tr>"); // Create a new table row

    // Create and append the order ID cell
    const $orderId = $("<td>").text("#" + item.id);
    $row.append($orderId);

    // Format the order date and create the delivered on cell
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

    // Create and append the total cost cell
    const $priceCell = $("<td>").text("$" + (item.totalCost || 0).toFixed(2));
    $row.append($priceCell);

    // Create and append the total songs cell
    const $totalSongsCell = $("<td>").text(item.totalSongs);
    $row.append($totalSongsCell);

    // Create and append the total playlist items cell
    const $totalPlayList = $("<td>").text(item.items.length);
    $row.append($totalPlayList);
    // Append the row to the table
    $table.append($row);
  });

  // Update the total items count
  $("#total-items-count").text(data.length);
}

// Document ready function to initialize the page
$(document).ready(() => {
  // Open the database and fetch the orders
  openDB()
    .then(getMyOrders) // Get the orders from the database
    .then((playlists) => {
      // Populate the table with the orders
      populateTable(playlists);
    })
    .catch((error) => console.log("Error: ", error));
});
