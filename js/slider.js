export const slider = ({
  container,
  slides,
  // это костыль
  realSlidesCount,
  prevButton,
  nextButton,
  dots,
  autoplay = false,
  interval = 5000,
  onSlideChange = () => {},
  loop = true,
  slidesPerView = 1,
  counts,
  swipeXTreshold = 50,
  swipeYTreshold = 50,
}) => {
  let currentSlide = 0;
  const totalSlides = realSlidesCount ? realSlidesCount : slides.length;
  let intervalId;
  let touchStartX = 0;
  let touchEndX = 0;
  let touchStartY = 0;
  let touchEndY = 0;

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
    if (!loop || !isAutoplay) {
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

  const handleSwipe = () => {
    const deltaX = touchStartX - touchEndX;
    const deltaY = Math.abs(touchStartY - touchEndY);

    if (deltaY < swipeYTreshold) {
      if (deltaX > swipeXTreshold) {
        changeSlide(1);
      } else if (deltaX < -swipeXTreshold) {
        changeSlide(-1);
      }
    }
  };

  const handlePrevClick = () => changeSlide(-1);
  const handleNextClick = () => changeSlide(1);
  const handleDotClick = (index) => () => {
    currentSlide = index;
    changeSlide();
  };
  const handleTouchStart = (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  };
  const handleTouchEnd = (e) => {
    touchEndX = e.changedTouches[0].clientX;
    touchEndY = e.changedTouches[0].clientY;
    handleSwipe();
  };

  const addEventListeners = () => {
    prevButton?.addEventListener("click", handlePrevClick);
    nextButton?.addEventListener("click", handleNextClick);

    dots?.forEach((dot, index) => {
      dot.addEventListener("click", handleDotClick(index));
    });

    container.addEventListener("touchstart", handleTouchStart);
    container.addEventListener("touchend", handleTouchEnd);
  };

  const removeEventListeners = () => {
    prevButton?.removeEventListener("click", handlePrevClick);
    nextButton?.removeEventListener("click", handleNextClick);

    dots?.forEach((dot, index) => {
      dot.removeEventListener("click", handleDotClick(index));
    });

    container.removeEventListener("touchstart", handleTouchStart);
    container.removeEventListener("touchend", handleTouchEnd);
  };
  // много лишней логики только для того чтобы сделать destroy(), бесит
  const destroy = () => {
    clearInterval(intervalId);
    removeEventListeners();
    container.style.transform = "";
    container.style.transition = "";
    if (dots) {
      dots.forEach((dot) => dot.classList.remove("active"));
    }
    if (counts) {
      counts.textContent = "";
    }
    if (prevButton) prevButton.classList.remove("disabled");
    if (nextButton) nextButton.classList.remove("disabled");
  };

  addEventListeners();

  if (autoplay) {
    intervalId = setInterval(() => changeSlide(1, true), interval);
  }

  updateButtonStates();
  updateActiveDot();
  updateCounts();

  return {
    // не знаю зачем возвращаю это всё, но возможно когда нибудь поюзаю
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
    destroy,
  };
};
