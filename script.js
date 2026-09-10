// Бургер-меню на мобильных
const burger = document.getElementById("burger");
const nav = document.getElementById("nav");

burger.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  burger.setAttribute("aria-expanded", String(open));
});

// Закрываем меню при клике по ссылке
nav.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    nav.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
  })
);

// Калькулятор отзывов
const cnt = document.getElementById("cnt");
const cntVal = document.getElementById("cntVal");
const totalVal = document.getElementById("totalVal");
const giftVal = document.getElementById("giftVal");

if (cnt && cntVal && totalVal) {
  const update = () => {
    const n = Number(cnt.value);
    const gift = Math.floor(n / 10);
    const paid = n - gift;
    cntVal.textContent = n;
    totalVal.textContent = (paid * 900).toLocaleString("ru-RU") + " ₽";
    if (giftVal) {
      giftVal.textContent = gift > 0
        ? "в подарок " + gift + " отз. · экономия " + (gift * 900).toLocaleString("ru-RU") + " ₽"
        : "каждый 10-й отзыв — в подарок";
    }
  };
  cnt.addEventListener("input", update);
  update();
}
