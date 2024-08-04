import { slider } from "./slider.js";
import { ticker } from "./ticker.js";

let participantsSlider;

let topslider;
let topSliderOpts = {
  container: document.querySelector(".stages .slider"),
  slides: document.querySelectorAll(".stages .slider .slide"),
  nextButton: document.querySelector(".stages  .controls .arrow.right"),
  prevButton: document.querySelector(".stages  .controls .arrow.left"),
  dots: document.querySelectorAll(".stages .dots .dot"),
  realSlidesCount: 5,
  loop: false,
};
window.addEventListener("load", () => {
  for (const participant of participants) {
    document
      .querySelector(".participants-inner  > .slider-wrapper .slider")
      .insertAdjacentHTML("beforeend", genSlide(participant));
  }
  ticker(".ticker-wrap", 0.3);
  if (window.innerWidth <= 1300) {
    topslider = slider(topSliderOpts);
  }
  let participantsSliderOpts = {
    container: document.querySelector(".participants-inner .slider"),
    slides: document.querySelectorAll(".participants-inner .slider .slide"),
    nextButton: document.querySelector(
      ".participants-inner  .controls .arrow.right"
    ),
    prevButton: document.querySelector(
      ".participants-inner  .controls .arrow.left"
    ),
    loop: true,
    autoplay: true,
    interval: 4000,
    // корректное отборажение для разных устройств на старте
    slidesPerView: (() => {
      if (window.innerWidth < 768) return 1;
      if (window.innerWidth < 1200) return 2;
      return 3;
    })(),
    counts: document.querySelector(".participants-inner  .controls .counts"),
  };
  participantsSlider = slider(participantsSliderOpts);
});

window.addEventListener("resize", () => {
  if (window.innerWidth <= 1300) {
    if (!topslider) {
      topslider = slider(topSliderOpts);
    }
    participantsSlider.setSlidesPerView(1);
    return;
  }
  if (window.innerWidth <= 1100) {
    participantsSlider.setSlidesPerView(2);
    return;
  }
  if (window.innerWidth > 1300) {
    if (topslider) {
      topslider.destroy();
      topslider = null;
    }
  }
  participantsSlider.setSlidesPerView(3);
});

// генерим слыйды
let participants = [
  {
    image: "",
    name: "Хозе-Рауль Капабланка",
    title: "",
  },
  {
    image: "",
    name: "Эммануил Ласкер",
    title: "",
  },
  {
    image: "",
    name: "Александр Алехин",
    title: "",
  },
  {
    image: "",
    name: "Арон Нимцович",
    title: "",
  },
  {
    image: "",
    name: "Рихард Рети",
    title: "",
  },
  {
    image: "",
    name: "Остап Бендер",
    title: "Гроссмейстер",
  },
];
const genSlide = (item) =>
  `<div class="slide">
    <div class="image">
        <img src="${item.image ? item.image : "images/man.webp"}" alt="">
    </div>
    <div class="text">
        <div class="name">${item.name}</div>
        <div class="title">${
          item.title ? item.title : "Чемпион мира по шахматам"
        }</div>
    </div>
    <button>Подробнее</button>
  </div>`;
