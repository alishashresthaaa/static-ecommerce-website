document.addEventListener("DOMContentLoaded", () => {
  fetch("data/hotpicks.json")
    .then((response) => response.json())
    .then((data) => {
      const swiperWrapper = document.getElementById("hot-picks");
      data.forEach((item) => {
        const slide = document.createElement("div");
        slide.classList.add("swiper-slide");
        slide.innerHTML = `
            <div class="music-card">
              <div class="music-card-image-container">
                <img src="${item.image}" alt="Image" class="music-card-image" />
                <div class="overlay">
                  <div class="play-button">&#9658;</div>
                </div>
              </div>
              <p class="music-card-title">${item.title}</p>
              <p class="music-card-info">${item.info}</p>
            </div>
          `;
        swiperWrapper.appendChild(slide);
      });
    })
    .catch((error) => console.error("Error fetching the JSON data:", error));
});


document.addEventListener("DOMContentLoaded", () => {
    fetch("data/madeforyou.json")
      .then((response) => response.json())
      .then((data) => {
        const swiperWrapper = document.getElementById("made-for-you");
        data.forEach((item) => {
          const slide = document.createElement("div");
          slide.classList.add("swiper-slide");
          slide.innerHTML = `
              <div class="music-card">
                <div class="music-card-image-container">
                  <img src="${item.image}" alt="Image" class="music-card-image" />
                  <div class="overlay">
                    <div class="play-button">&#9658;</div>
                  </div>
                </div>
                <p class="music-card-title">${item.title}</p>
                <p class="music-card-info">${item.info}</p>
              </div>
            `;
          swiperWrapper.appendChild(slide);
        });
      })
      .catch((error) => console.error("Error fetching the JSON data:", error));
  });

  
const swiper = new Swiper(".swiper", {
  direction: "horizontal",
  loop: true,
  slidesPerView: "auto",
  spaceBetween: 20,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});
