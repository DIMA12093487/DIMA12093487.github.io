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
