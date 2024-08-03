export const slider = ({
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
  swipeXTreshold = 50,
  swipeYTreshold = 50,
}) => {
  let currentSlide = 0;
  const totalSlides = slides.length;
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

  container.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  });

  container.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].clientX;
    touchEndY = e.changedTouches[0].clientY;
    handleSwipe();
  });

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
