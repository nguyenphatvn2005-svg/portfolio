const projects = window.PROJECTS || [];

function escapeHTML(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function initIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function initReveal() {
  const items = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    items.forEach(item => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  items.forEach(item => observer.observe(item));
}

function initMobileMenu() {
  const button = document.querySelector("[data-menu-button]");
  const menu = document.querySelector("[data-mobile-menu]");

  if (!button || !menu) return;

  button.addEventListener("click", () => {
    const open = !menu.classList.contains("hidden");

    if (open) {
      menu.classList.add("hidden");
      button.setAttribute("aria-expanded", "false");
    } else {
      menu.classList.remove("hidden");
      button.setAttribute("aria-expanded", "true");
    }
  });

  menu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      menu.classList.add("hidden");
      button.setAttribute("aria-expanded", "false");
    });
  });
}

function renderProjectCards() {
  const grid = document.querySelector("[data-project-grid]");
  if (!grid) return;

  grid.innerHTML = projects
    .map(
      (project, index) => `
        <a
          href="project.html?id=${encodeURIComponent(project.id)}"
          class="project-card group relative min-h-[430px] overflow-hidden rounded-[2rem] border border-white/10 bg-[#111318] reveal"
          aria-label="Xem dự án ${escapeHTML(project.title)}"
        >
          <img
            src="${escapeHTML(project.cover)}"
            alt="${escapeHTML(project.title)}"
            loading="lazy"
            class="absolute inset-0 h-full w-full object-cover"
            style="object-position:${escapeHTML(project.coverPosition || "50% 50%")};"
          >

          <div class="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/5"></div>

          <div class="absolute inset-x-0 bottom-0 p-7 md:p-9">
            <div class="mb-4 flex items-center justify-between gap-4">
              <span class="text-[11px] font-bold uppercase tracking-[.22em] text-[#d9b66f]">
                ${escapeHTML(project.eyebrow)}
              </span>
              <span class="text-[11px] uppercase tracking-[.18em] text-white/45">
                ${String(index + 1).padStart(2, "0")}
              </span>
            </div>

            <h3 class="font-display text-3xl italic text-white md:text-4xl">
              ${escapeHTML(project.title)}
            </h3>

            <p class="mt-3 max-w-md text-sm leading-6 text-white/65">
              ${escapeHTML(project.shortDescription)}
            </p>

            <span class="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white">
              Xem case study
              <i data-lucide="arrow-up-right" class="arrow h-4 w-4 text-[#d9b66f]"></i>
            </span>
          </div>
        </a>
      `
    )
    .join("");
}

function renderProjectPage() {
  const root = document.querySelector("[data-project-page]");
  if (!root) return;

  const id = new URLSearchParams(window.location.search).get("id");
  const project = projects.find(item => item.id === id);

  if (!project) {
    document.title = "Không tìm thấy dự án | Mai Minh Đương";

    root.innerHTML = `
      <main class="mx-auto flex min-h-[70vh] max-w-3xl items-center px-6 py-32 text-center">
        <div class="w-full">
          <p class="text-xs font-bold uppercase tracking-[.24em] text-[#d9b66f]">404 / Project</p>
          <h1 class="font-display mt-5 text-5xl italic">Không tìm thấy dự án</h1>
          <p class="mx-auto mt-5 max-w-xl text-gray-400">ID dự án không tồn tại hoặc đường dẫn chưa đúng.</p>
          <a class="btn-primary mt-8" href="index.html#projects">Quay lại dự án</a>
        </div>
      </main>
    `;
    return;
  }

  document.title = `${project.title} | Mai Minh Đương`;

  const story = project.story
    ? `
      <section class="reveal border-t border-white/10 py-16 md:py-20">
        <div class="grid gap-8 md:grid-cols-[.7fr_1.3fr]">
          <div>
            <p class="text-xs font-bold uppercase tracking-[.24em] text-[#d9b66f]">Approach</p>
            <h2 class="font-display mt-3 text-3xl italic text-white">${escapeHTML(project.story.title)}</h2>
          </div>
          <p class="text-base leading-8 text-gray-400 md:text-lg">${escapeHTML(project.story.body)}</p>
        </div>
      </section>
    `
    : "";

  const mediaSections = (project.mediaSections || [])
    .map(section => {
      const cards = section.items
        .map(item => {
          if (section.type === "video") {
            return `
              <figure class="media-card">
                <video controls preload="metadata" playsinline class="aspect-[9/16] w-full bg-black object-cover">
                  <source src="${escapeHTML(item.src)}" type="video/mp4">
                  Trình duyệt của bạn không hỗ trợ video HTML5.
                </video>
                <figcaption class="px-4 py-3 text-xs uppercase tracking-[.16em] text-white/45">
                  ${escapeHTML(item.label || "Video")}
                </figcaption>
              </figure>
            `;
          }

          const aspect = section.aspect === "portrait" ? "aspect-[4/5]" : "aspect-square";

          return `
            <figure class="media-card">
              <img
                src="${escapeHTML(item.src)}"
                alt="${escapeHTML(item.alt || project.title)}"
                loading="lazy"
                class="${aspect} w-full object-cover"
              >
            </figure>
          `;
        })
        .join("");

      return `
        <section class="reveal border-t border-white/10 py-16 md:py-20">
          <div class="mb-8 flex items-end justify-between gap-6">
            <div>
              <p class="text-xs font-bold uppercase tracking-[.24em] text-[#d9b66f]">Selected Work</p>
              <h2 class="font-display mt-3 text-3xl italic text-white md:text-4xl">${escapeHTML(section.title)}</h2>
            </div>
          </div>
          <div class="grid gap-5 md:grid-cols-3">${cards}</div>
        </section>
      `;
    })
    .join("");

  const externalLinks = (project.links || [])
    .map(
      link => `
        <a class="btn-secondary" href="${escapeHTML(link.url)}" target="_blank" rel="noopener noreferrer">
          ${escapeHTML(link.label)} <i data-lucide="external-link" class="h-4 w-4"></i>
        </a>
      `
    )
    .join("");

  const currentIndex = projects.findIndex(item => item.id === project.id);
  const nextProject = projects[(currentIndex + 1) % projects.length];

  root.innerHTML = `
    <header class="relative min-h-[78vh] overflow-hidden border-b border-white/10 noise">
      <img
        src="${escapeHTML(project.heroImage)}"
        alt="${escapeHTML(project.title)}"
        class="absolute inset-0 h-full w-full object-cover opacity-45"
        style="object-position:${escapeHTML(project.coverPosition || "50% 50%")};"
      >

      <div class="absolute inset-0 bg-gradient-to-t from-[#090a0d] via-black/55 to-black/25"></div>

      <div class="relative mx-auto flex min-h-[78vh] max-w-6xl items-end px-6 pb-16 pt-36 md:pb-20">
        <div class="max-w-4xl reveal">
          <a href="index.html#projects" class="mb-8 inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-[#d9b66f]">
            <i data-lucide="arrow-left" class="h-4 w-4"></i>
            Tất cả dự án
          </a>

          <p class="text-xs font-bold uppercase tracking-[.3em] text-[#d9b66f]">
            ${escapeHTML(project.eyebrow)} · Case Study
          </p>

          <h1 class="font-display mt-5 text-5xl italic leading-[.98] text-white sm:text-6xl md:text-8xl">
            ${escapeHTML(project.title)}
          </h1>

          <p class="mt-6 max-w-2xl text-base leading-7 text-white/65 md:text-lg">
            ${escapeHTML(project.heroDescription)}
          </p>
        </div>
      </div>
    </header>

    <main class="mx-auto max-w-6xl px-6">
      <section class="reveal py-16 md:py-24">
        <div class="grid gap-10 md:grid-cols-[.72fr_1.28fr]">
          <div>
            <p class="text-xs font-bold uppercase tracking-[.24em] text-[#d9b66f]">Overview</p>
            <h2 class="font-display mt-3 text-3xl italic text-white md:text-4xl">Tổng quan dự án</h2>
          </div>
          <p class="text-base leading-8 text-gray-400 md:text-lg">${escapeHTML(project.overview)}</p>
        </div>
      </section>

      <section class="reveal border-t border-white/10 py-16 md:py-20">
        <div class="grid gap-12 md:grid-cols-2">
          <div>
            <p class="text-xs font-bold uppercase tracking-[.24em] text-[#d9b66f]">Responsibility</p>
            <h2 class="font-display mt-3 text-3xl italic text-white">Vai trò</h2>
            <ul class="mt-7 space-y-4">
              ${project.roles
                .map(
                  item => `
                    <li class="flex gap-3 text-gray-400">
                      <span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d9b66f]"></span>
                      <span>${escapeHTML(item)}</span>
                    </li>
                  `
                )
                .join("")}
            </ul>
          </div>

          <div>
            <p class="text-xs font-bold uppercase tracking-[.24em] text-[#d9b66f]">Outcome</p>
            <h2 class="font-display mt-3 text-3xl italic text-white">Kết quả</h2>
            <ul class="mt-7 space-y-4">
              ${project.results
                .map(
                  item => `
                    <li class="flex gap-3 text-gray-400">
                      <span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d9b66f]"></span>
                      <span>${escapeHTML(item)}</span>
                    </li>
                  `
                )
                .join("")}
            </ul>
          </div>
        </div>
      </section>

      ${story}
      ${mediaSections}

      <section class="reveal border-t border-white/10 py-16 md:py-24">
        <div class="flex flex-col items-start justify-between gap-8 rounded-[2rem] border border-white/10 bg-white/[.025] p-7 md:flex-row md:items-end md:p-10">
          <div>
            <p class="text-xs font-bold uppercase tracking-[.24em] text-[#d9b66f]">Next case study</p>
            <h2 class="font-display mt-3 text-3xl italic text-white md:text-4xl">${escapeHTML(nextProject.title)}</h2>
            <a class="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-[#d9b66f]" href="project.html?id=${encodeURIComponent(nextProject.id)}">
              Xem dự án tiếp theo
              <i data-lucide="arrow-right" class="h-4 w-4"></i>
            </a>
          </div>

          <div class="flex flex-wrap gap-3">
            ${externalLinks}
            <a class="btn-primary" href="index.html#projects">Về trang chủ</a>
          </div>
        </div>
      </section>
    </main>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  renderProjectCards();
  renderProjectPage();
  initMobileMenu();
  initReveal();
  initIcons();
});
