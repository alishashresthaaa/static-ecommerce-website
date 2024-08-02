window.onload = function () {
  let newSongs = [];
  SONGS.forEach((song, index) => {
    newSongs.push({ ...song, id: 100 + index });
  });
};
