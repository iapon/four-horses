export const ticker = (selector, speed) => {
  document.querySelectorAll(selector).forEach((el) => {
    const first = el.querySelector(".ticker");
    first.insertAdjacentHTML("beforeend", first.innerHTML);
    first.insertAdjacentHTML("beforeend", first.innerHTML);
    first.insertAdjacentHTML("beforeend", first.innerHTML);
    first.insertAdjacentHTML("beforeend", first.innerHTML);
    first.insertAdjacentHTML("beforeend", first.innerHTML);
    let i = 0;

    setInterval(() => {
      first.style.left = `-${i}px`;
      i > first.clientWidth ? (i = 0) : (i += speed);
    }, 0);
  });
};
