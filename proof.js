(() => {
  const track = document.getElementById("proofTrack");
  if (!track) return;
  const slides = [...track.querySelectorAll(".proof-slide")];
  const dots = [...document.querySelectorAll("[data-proof-index]")];
  const counter = document.getElementById("proofCounter");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  let index = 0, visible = false, interacting = false, frame = 0;
  const show = (n) => {
    const target = ((n % slides.length) + slides.length) % slides.length;
    track.scrollTo({left: target * track.clientWidth, behavior: reduced.matches ? "instant" : "smooth"});
  };
  const sync = () => {
    index = Math.max(0, Math.min(slides.length - 1, Math.round(track.scrollLeft / track.clientWidth)));
    counter.textContent = (index + 1) + " / " + slides.length;
    dots.forEach((dot, n) => dot.setAttribute("aria-current", String(n === index)));
  };
  track.addEventListener("scroll", () => {cancelAnimationFrame(frame);frame = requestAnimationFrame(sync);}, {passive:true});
  document.getElementById("proofPrev").addEventListener("click", () => show(index - 1));
  document.getElementById("proofNext").addEventListener("click", () => show(index + 1));
  dots.forEach(dot => dot.addEventListener("click", () => show(Number(dot.dataset.proofIndex))));
  track.addEventListener("keydown", e => {if (e.key === "ArrowRight" || e.key === "ArrowLeft") {e.preventDefault();show(index + (e.key === "ArrowRight" ? 1 : -1));}});
  const section = document.getElementById("cases");
  section.addEventListener("mouseenter", () => interacting = true);
  section.addEventListener("mouseleave", () => interacting = false);
  new IntersectionObserver(entries => visible = entries[0].isIntersecting, {threshold:0.25}).observe(track);
  setInterval(() => {if (visible && !interacting && !document.hidden && !reduced.matches && !section.contains(document.activeElement)) show(index + 1);}, 6500);
  window.addEventListener("resize", () => {track.scrollTo({left:index * track.clientWidth,behavior:"instant"});sync();});
  sync();
})();
