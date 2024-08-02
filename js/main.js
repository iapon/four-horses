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
        <img src="${item.image ? item.image : "/images/man.png"}" alt="">
    </div>
    <div class="text">
        <div class="name">${item.name}</div>
        <div class="title">${
          item.title ? item.title : "Чемпион мира по шахматам"
        }</div>
    </div>
    <button>Подробнее</button>
  </div>`;
let participantsSlider;
window.addEventListener("load", () => {
  for (const participant of participants) {
    document
      .querySelector(".participants  > .slider-wrapper .slider")
      .insertAdjacentHTML("beforeend", genSlide(participant));
  }
  ticker(".ticker-wrap", 0.3);
  slider({
    container: document.querySelector(".stages .slider"),
    slides: document.querySelectorAll(".stages .slider .slide"),
    nextButton: document.querySelector(".stages  .controls .arrow.right"),
    prevButton: document.querySelector(".stages  .controls .arrow.left"),
    dots: document.querySelectorAll(".stages .dots .dot"),
    // autoplay: true,
    // interval: 10000,
    loop: false,
  });
  participantsSlider = slider({
    container: document.querySelector(".participants .slider"),
    slides: document.querySelectorAll(".participants .slider .slide"),
    nextButton: document.querySelector(".participants  .controls .arrow.right"),
    prevButton: document.querySelector(".participants  .controls .arrow.left"),
    slidesPerView: 3,
    counts: document.querySelector(".participants  .controls .counts"),
    // dots: document.querySelectorAll(".stages .dots .dot"),
    autoplay: true,
    interval: 10000,
    // loop: true,
  });
});

function ticker(selector, speed) {
  document.querySelectorAll(selector).forEach((el) => {
    const first = el.querySelector(".ticker");
    first.insertAdjacentHTML("beforeend", first.innerHTML);
    first.insertAdjacentHTML("beforeend", first.innerHTML);
    let i = 0;

    setInterval(() => {
      first.style.left = `-${i}px`;
      i > first.clientWidth ? (i = 0) : (i += speed);
    }, 0);
  });
}

const slider = ({
  container,
  slides,
  prevButton,
  nextButton,
  dots,
  autoplay = false,
  interval = 5000,
  onSlideChange = () => {},
  loop = true,
  slidesPerView = 1,
  counts,
}) => {
  let currentSlide = 0;
  const totalSlides = slides.length;
  let intervalId;

  const updateActiveDot = () => {
    if (dots?.length === totalSlides) {
      dots.forEach((dot, index) =>
        dot.classList.toggle("active", index === currentSlide)
      );
    }
  };

  const updateButtonStates = () => {
    if (!loop) {
      prevButton?.classList.toggle("disabled", currentSlide === 0);
      nextButton?.classList.toggle(
        "disabled",
        currentSlide === totalSlides - slidesPerView
      );
    }
  };

  const updateCounts = () => {
    if (counts) {
      counts.textContent = `${currentSlide + slidesPerView}/${totalSlides}`;
    }
  };

  const changeSlide = (direction = 0, isAutoplay = false) => {
    if (!loop && !isAutoplay) {
      if (
        (direction === -1 && currentSlide === 0) ||
        (direction === 1 && currentSlide === totalSlides - slidesPerView)
      ) {
        return;
      }
    }

    if (isAutoplay) {
      currentSlide = calculateAutoplaySlide(direction);
    } else {
      currentSlide = calculateNormalSlide(direction);
    }

    updateSlidePosition();
    resetAutoplay();
    updateActiveDot();
    updateButtonStates();
    updateCounts();
    onSlideChange(currentSlide);
  };

  const calculateAutoplaySlide = (direction) => {
    if (direction === 1 && currentSlide + slidesPerView >= totalSlides) {
      return 0;
    }
    if (direction === -1 && currentSlide === 0) {
      return totalSlides - slidesPerView;
    }
    return calculateNormalSlide(direction);
  };

  const calculateNormalSlide = (direction) => {
    return Math.max(
      0,
      Math.min(
        totalSlides - slidesPerView,
        currentSlide + direction * slidesPerView
      )
    );
  };

  const updateSlidePosition = () => {
    const slideWidth = 100 / slidesPerView;
    const offset = currentSlide * slideWidth;
    container.style.transform = `translateX(-${offset}%)`;
    container.style.transition = "transform 0.5s ease-in-out";
  };
  const resetAutoplay = () => {
    if (autoplay) {
      clearInterval(intervalId);
      intervalId = setInterval(() => changeSlide(1, true), interval);
    }
  };

  prevButton?.addEventListener("click", () => changeSlide(-1));
  nextButton?.addEventListener("click", () => changeSlide(1));

  if (autoplay) {
    intervalId = setInterval(() => changeSlide(1, true), interval);
  }

  dots?.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      currentSlide = index;
      changeSlide();
    });
  });

  updateButtonStates();
  updateActiveDot();
  updateCounts();
  return {
    next: () => changeSlide(1),
    prev: () => changeSlide(-1),
    goTo: (index) => changeSlide(index - currentSlide),
    stop: () => clearInterval(intervalId),
    setSlidesPerView: (sp) => {
      if (slidesPerView !== sp) {
        slidesPerView = sp;
        currentSlide = 0;
        changeSlide();
      }
    },
    updateActiveDot,
  };
};

window.addEventListener("resize", () => {
  if (window.innerWidth > 700 && window.innerWidth <= 1100) {
    participantsSlider.setSlidesPerView(2);
  } else if (window.innerWidth > 1100) {
    participantsSlider.setSlidesPerView(3);
  } else {
    participantsSlider.setSlidesPerView(1);
  }
});
