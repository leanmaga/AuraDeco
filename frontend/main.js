const images = ["./image/1.png", "./image/2.png", "./image/3.jpg", "./image/4.png", "./image/5.png", "./image/6.jpg","./image/7.jpg", "./image/8.jpg", "./image/9.jpg", "./image/10.jpg","./image/11.jpg", "./image/12.jpg", "./image/13.jpg", "./image/14.jpg","./image/15.jpg", "./image/16.jpg", "./image/17.jpg","./image/alas.png","./image/candy.png", "./image/globo.png", "./image/piscina.jpg"];

let currentIndex = 0;

function openSlider(index) {
  currentIndex = index;
  showSlider();
  updateSliderContent();
}

function showSlider() {
  const sliderContainer = document.getElementById("slider-container");
  sliderContainer.style.display = "flex";
}

function closeSlider() {
  const sliderContainer = document.getElementById("slider-container");
  sliderContainer.style.display = "none";
}

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeSlider();
  } else if (event.key === "ArrowRight") {
    showNextImage();
  } else if (event.key === "ArrowLeft") {
    showPreviousImage();
  }
});

function showNextImage() {
  currentIndex = (currentIndex + 1) % images.length;
  updateSliderContent();
}

function showPreviousImage() {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  updateSliderContent();
}

function updateSliderContent() {
  const sliderImages = document.querySelectorAll(".slider-image");
  sliderImages.forEach((image, index) => {
    if (index === currentIndex) {
      image.style.display = "block";
    } else {
      image.style.display = "none";
    }
  });
}


// Agrega estas líneas para los botones de flecha
document.querySelector(".arrow-btn.left").addEventListener("click", showPreviousImage);
document.querySelector(".arrow-btn.right").addEventListener("click", showNextImage);

// Agrega esta función para abrir el slider con un índice específico
function openSliderWithIndex(index) {
  currentIndex = index;
  showSlider();
  updateSliderContent();
}
