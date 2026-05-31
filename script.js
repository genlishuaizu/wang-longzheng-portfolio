const slideCount = 34;

const sectionNames = [
  { start: 1, title: "封面" },
  { start: 2, title: "个人信息" },
  { start: 5, title: "品牌商业设计" },
  { start: 12, title: "包装与视觉" },
  { start: 16, title: "空间与家居" },
  { start: 20, title: "社媒与电商" },
  { start: 24, title: "海报与广告" },
  { start: 29, title: "书籍画册" },
  { start: 34, title: "联系" },
];

const pngSlides = new Set([2, 16]);
const slides = Array.from({ length: slideCount }, (_, index) => {
  const number = index + 1;
  const padded = String(number).padStart(2, "0");
  const section =
    sectionNames
      .filter((item) => item.start <= number)
      .at(-1)?.title || "Portfolio";

  return {
    number,
    id: `slide-${padded}`,
    title: `${section} ${padded}`,
    image: `assets/web/slide-${padded}.webp`,
    fallback: `assets/slides/slide-${padded}.${pngSlides.has(number) ? "png" : "jpeg"}`,
    thumb: `assets/thumbs/slide-${padded}.jpg`,
  };
});

const slidesRoot = document.querySelector("#slides");
const progressBar = document.querySelector("#progressBar");
const backToTop = document.querySelector("#backToTop");
const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector("#lightboxImage");
const lightboxCaption = document.querySelector("#lightboxCaption");
let currentSlide = 0;

function createPicture(slide, eager = false) {
  const picture = document.createElement("picture");
  const source = document.createElement("source");
  source.type = "image/webp";
  source.srcset = slide.image;

  const image = document.createElement("img");
  image.src = slide.fallback;
  image.alt = `王泷正作品集第 ${String(slide.number).padStart(2, "0")} 页`;
  image.width = 1920;
  image.height = 1080;
  image.loading = eager ? "eager" : "lazy";
  image.decoding = "async";

  picture.append(source, image);
  return picture;
}

function buildSlides() {
  const fragment = document.createDocumentFragment();

  slides.slice(1).forEach((slide) => {
    const panel = document.createElement("article");
    panel.className = "slide-panel";
    panel.id = slide.id;
    panel.dataset.slide = String(slide.number);

    const header = document.createElement("div");
    header.className = "slide-header";
    header.innerHTML = `
      <p class="slide-kicker">Page ${String(slide.number).padStart(2, "0")}</p>
      <h2>${slide.title}</h2>
    `;

    const frame = document.createElement("button");
    frame.className = "slide-frame";
    frame.type = "button";
    frame.setAttribute("aria-label", `放大查看第 ${slide.number} 页`);
    frame.append(createPicture(slide, slide.number <= 4));
    frame.addEventListener("click", () => openLightbox(slide.number - 1));

    panel.append(header, frame);
    fragment.append(panel);
  });

  slidesRoot.append(fragment);
}

function updateProgress() {
  const scrollTop = window.scrollY;
  const fullHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = fullHeight > 0 ? (scrollTop / fullHeight) * 100 : 0;
  progressBar.style.width = `${progress}%`;
  backToTop.classList.toggle("is-visible", scrollTop > window.innerHeight * 0.75);
}

function updateActiveThumb(number) {
  document.querySelectorAll(".thumb-card").forEach((thumb) => {
    thumb.classList.toggle("is-active", thumb.dataset.slide === String(number));
  });
}

function openLightbox(index) {
  currentSlide = Math.max(0, Math.min(slides.length - 1, index));
  const slide = slides[currentSlide];
  lightboxImage.src = slide.image;
  lightboxImage.alt = `王泷正作品集第 ${slide.number} 页放大图`;
  lightboxCaption.textContent = `${String(slide.number).padStart(2, "0")} / ${slideCount}`;
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImage.removeAttribute("src");
  document.body.style.overflow = "";
}

function moveLightbox(step) {
  openLightbox((currentSlide + step + slides.length) % slides.length);
}

function observeSlides() {
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) updateActiveThumb(visible.target.dataset.slide || 1);
    },
    { rootMargin: "-35% 0px -50% 0px", threshold: [0.25, 0.5, 0.75] },
  );

  document.querySelectorAll(".hero, .slide-panel").forEach((item) => observer.observe(item));
}

buildSlides();
observeSlides();
updateProgress();

window.addEventListener("scroll", updateProgress, { passive: true });
backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
document.querySelector("#lightboxClose").addEventListener("click", closeLightbox);
document.querySelector("#lightboxPrev").addEventListener("click", () => moveLightbox(-1));
document.querySelector("#lightboxNext").addEventListener("click", () => moveLightbox(1));
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (event) => {
  if (!lightbox.classList.contains("is-open")) return;
  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") moveLightbox(-1);
  if (event.key === "ArrowRight") moveLightbox(1);
});
