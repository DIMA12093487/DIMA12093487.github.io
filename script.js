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

// Заявка отправляется на сервер, который пересылает её владельцу в личный Telegram.
const leadForm = document.getElementById("leadForm");
if (leadForm) {
  const submitButton = leadForm.querySelector('button[type="submit"]');
  const formNote = document.getElementById("formNote");
  leadForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (submitButton.disabled || !leadForm.reportValidity()) return;

    const data = {
      name: document.getElementById("leadName").value.trim(),
      contact: document.getElementById("leadContact").value.trim(),
      card: document.getElementById("leadCard").value.trim(),
      task: document.getElementById("leadTask").value.trim(),
      website: document.getElementById("leadWebsite")?.value || ""
    };
    submitButton.disabled = true;
    submitButton.textContent = "Отправляем...";
    formNote.textContent = "Отправляем заявку...";
    formNote.dataset.state = "";
    try {
      const response = await fetch("https://repustar-leads.coolfreezezzz.workers.dev/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error("Delivery failed");
      leadForm.reset();
      formNote.textContent = "Заявка отправлена! Мы сами напишем вам по указанному контакту.";
      formNote.dataset.state = "success";
    } catch {
      formNote.textContent = "Не удалось отправить заявку. Попробуйте ещё раз или напишите на repustar@yandex.com.";
      formNote.dataset.state = "error";
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Отправить заявку";
    }
  });
}

// Цены по достигнутому порогу объёма, без подарочных отзывов.
function reviewUnitPrice(n) {
  for (const [min, price] of [[1000,650],[500,700],[300,750],[200,800],[100,850],[50,900]]) {
    if (n >= min) return price;
  }
  return 950;
}
// Калькулятор отзывов
const cnt = document.getElementById("cnt");
const cntVal = document.getElementById("cntVal");
const totalVal = document.getElementById("totalVal");
const giftVal = document.getElementById("giftVal");

if (cnt && cntVal && totalVal) {
  const update = () => {
    const n = Number(cnt.value);
    const unit = reviewUnitPrice(n);
    cntVal.textContent = n;
    totalVal.textContent = (n * unit).toLocaleString("ru-RU") + " ₽";
    const unitVal = document.getElementById("unitVal");
    if (unitVal) unitVal.textContent = "по " + unit + " ₽ за отзыв";
    if (giftVal) giftVal.textContent = unit < 950
      ? "экономия " + (n * (950 - unit)).toLocaleString("ru-RU") + " ₽ относительно цены 950 ₽/шт"
      : "Скидка за объём: от 50 отзывов";
  };
  cnt.addEventListener("input", update);
  update();
}

// Выбранный пакет или пробный отзыв попадает в существующее поле заявки.
function prepareReviewOrder(text) {
  const field = document.getElementById("leadTask");
  if (!field) return;
  const previous = field.value.split("\n").filter(line => !line.startsWith("Заказ: ")).join("\n").trim();
  field.value = ("Заказ: " + text + (previous ? "\n" + previous : "")).slice(0,1000);
}
document.querySelectorAll("[data-package-count]").forEach(link => {
  link.addEventListener("click", () => {
    const n = Number(link.dataset.packageCount);
    cnt.value = n;
    cnt.dispatchEvent(new Event("input", {bubbles:true}));
    prepareReviewOrder("пакет «" + link.dataset.packageName + "», " + n + " отзывов, " + reviewUnitPrice(n) + " ₽/шт, итого " + (n * reviewUnitPrice(n)).toLocaleString("ru-RU") + " ₽.");
  });
});
document.querySelectorAll("[data-trial]").forEach(link => link.addEventListener("click", () => prepareReviewOrder("1 пробный отзыв бесплатно. Новый клиент; условия согласовать по карточке.")));
document.querySelectorAll("[data-order-calculator]").forEach(link => link.addEventListener("click", () => {
  const n = Number(cnt.value);
  prepareReviewOrder(n + " отзывов, " + reviewUnitPrice(n) + " ₽/шт, итого " + (n * reviewUnitPrice(n)).toLocaleString("ru-RU") + " ₽.");
}));
