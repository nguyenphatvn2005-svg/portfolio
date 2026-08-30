const projects = Array.isArray(window.PROJECTS) ? window.PROJECTS : [];

/* =========================
   SECURITY / HELPERS
========================= */

function escapeHTML(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function safeUrl(value = "") {
  const url = String(value).trim();

  if (!url) return "";

  if (/^(https?:\/\/|mailto:|tel:)/i.test(url)) {
    return escapeHTML(url);
  }

  if (/^[a-z0-9_./?=&%#-]+$/i.test(url)) {
    return escapeHTML(url);
  }

  return "#";
}

/* =========================
   ICONS
========================= */

function initIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

/* =========================
   SCROLL REVEAL
========================= */

function initReveal() {
  const items = document.querySelectorAll(".reveal");

  if (!items.length) return;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (reducedMotion || !("IntersectionObserver" in window)) {
    items.forEach((item) => {
      item.classList.add("is-visible");
    });

    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");

          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -4%",
    },
  );

  items.forEach((item) => {
    observer.observe(item);
  });
}

/* =========================
   HEADER
========================= */

function initHeader() {
  const header = document.querySelector("[data-header]");

  if (!header) return;

  const update = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 20);
  };

  update();

  window.addEventListener("scroll", update, {
    passive: true,
  });
}

/* =========================
   SCROLL PROGRESS
========================= */

function initScrollProgress() {
  const bar = document.querySelector("[data-scroll-progress]");

  if (!bar) return;

  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;

    const progress =
      max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0;

    bar.style.width = `${progress}%`;
  };

  update();

  window.addEventListener("scroll", update, {
    passive: true,
  });

  window.addEventListener("resize", update);
}

/* =========================
   MOBILE MENU
========================= */

function initMobileMenu() {
  const button = document.querySelector("[data-menu-button]");

  const menu = document.querySelector("[data-mobile-menu]");

  if (!button || !menu) return;

  const setOpen = (open) => {
    button.setAttribute("aria-expanded", String(open));

    button.setAttribute("aria-label", open ? "Đóng menu" : "Mở menu");

    menu.classList.toggle("is-open", open);

    menu.setAttribute("aria-hidden", String(!open));

    document.body.classList.toggle("menu-open", open);
  };

  button.addEventListener("click", () => {
    const open = button.getAttribute("aria-expanded") !== "true";

    setOpen(open);
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setOpen(false);
    }
  });
}

/* =========================
   ACTIVE NAVIGATION
========================= */

function initActiveNavigation() {
  const links = [...document.querySelectorAll("[data-nav-link]")];

  if (!links.length || !("IntersectionObserver" in window)) {
    return;
  }

  const sections = links
    .map((link) => {
      const href = link.getAttribute("href");

      return document.querySelector(href);
    })
    .filter(Boolean);

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;

      links.forEach((link) => {
        const active = link.getAttribute("href") === `#${visible.target.id}`;

        link.classList.toggle("is-active", active);
      });
    },
    {
      rootMargin: "-30% 0px -55%",

      threshold: [0.05, 0.2, 0.5],
    },
  );

  sections.forEach((section) => {
    observer.observe(section);
  });
}

/* =========================
   PROJECT COUNT
========================= */

function renderProjectCount() {
  const element = document.querySelector("[data-project-count]");

  if (element) {
    element.textContent = String(projects.length).padStart(2, "0");
  }
}

/* =========================
   HOMEPAGE PROJECTS
========================= */

function renderProjectCards() {
  const grid = document.querySelector("[data-project-grid]");

  if (!grid) return;

  if (!projects.length) {
    grid.innerHTML = `
      <p class="section-intro">
        Chưa có dự án để hiển thị.
      </p>
      `;

    return;
  }

  grid.innerHTML = projects
    .map((project, index) => {
      const number = project.number || String(index + 1).padStart(2, "0");

      const tags =
        Array.isArray(project.tags) && project.tags.length
          ? `
                <div class="project-tags">

                  ${project.tags
                    .map(
                      (tag) =>
                        `
                        <span>
                          ${escapeHTML(tag)}
                        </span>
                        `,
                    )
                    .join("")}

                </div>
              `
          : "";

      return `
          <article
            class="
              project-preview
              ${index % 2 ? "is-reverse" : ""}
              reveal
            "
          >

            <a
              class="project-media"
              href="project.html?id=${encodeURIComponent(project.id)}"
              aria-label="
                Xem case study
                ${escapeHTML(project.title)}
              "
            >

              <img
                src="${safeUrl(project.cover)}"
                alt="${escapeHTML(project.title)}"
                loading="lazy"
                decoding="async"
                style="
                  object-position:
                  ${escapeHTML(project.coverPosition || "50% 50%")};
                "
              >

            </a>


            <div class="project-copy">

              <div class="project-topline">

                <span
                  class="project-number"
                >
                  ${escapeHTML(number)}
                </span>


                <span
                  class="project-role"
                >
                  ${escapeHTML(project.eyebrow || "Project")}
                </span>

              </div>


              <h3>
                ${escapeHTML(project.title)}
              </h3>


              <p>
                ${escapeHTML(
                  project.shortDescription || project.heroDescription || "",
                )}
              </p>


              ${tags}


              <a
                class="project-cta"
                href="project.html?id=${encodeURIComponent(project.id)}"
              >

                View Case Study

                <i
                  data-lucide="arrow-up-right"
                  aria-hidden="true"
                ></i>

              </a>

            </div>

          </article>
          `;
    })
    .join("");
}

/* =========================
   PROJECT METADATA
========================= */

function makeMeta(project) {
  const items = [
    ["Role", project.eyebrow],

    ["Category", project.category],

    ["Year", project.year],
  ].filter(([, value]) => value);

  if (!items.length) {
    return "";
  }

  return `
    <dl class="project-meta-row">

      ${items
        .map(
          ([label, value]) => `
            <div>

              <dt>
                ${escapeHTML(label)}
              </dt>

              <dd>
                ${escapeHTML(value)}
              </dd>

            </div>
          `,
        )
        .join("")}

    </dl>
  `;
}

/* =========================
   TEXT SECTION
========================= */

function makeTextSection(number, label, title, body) {
  if (!body) {
    return "";
  }

  return `
    <section
      class="
        case-section
        reveal
      "
    >

      <div
        class="
          container
          case-grid
        "
      >

        <div>

          <p class="case-label">
            ${escapeHTML(number)}
            —
            ${escapeHTML(label)}
          </p>


          <h2 class="case-title">
            ${escapeHTML(title)}
          </h2>

        </div>


        <p class="case-copy">
          ${escapeHTML(body)}
        </p>

      </div>

    </section>
  `;
}

/* =========================
   ROLE
========================= */

function makeRoleSection(project) {
  if (!Array.isArray(project.roles) || !project.roles.length) {
    return "";
  }

  return `
    <section
      class="
        case-section
        reveal
      "
    >

      <div
        class="
          container
          case-grid
        "
      >

        <div>

          <p class="case-label">
            06 — My Role
          </p>


          <h2 class="case-title">
            Phạm vi<br>
            trách nhiệm
          </h2>

        </div>


        <ol class="editorial-list">

          ${project.roles
            .map(
              (item, index) => `
                <li>

                  <span
                    class="list-number"
                  >
                    ${String(index + 1).padStart(2, "0")}
                  </span>


                  <span
                    class="list-text"
                  >
                    ${escapeHTML(item)}
                  </span>

                </li>
              `,
            )
            .join("")}

        </ol>

      </div>

    </section>
  `;
}

/* =========================
   PROCESS
========================= */

function makeProcessSection(project) {
  if (!Array.isArray(project.process) || !project.process.length) {
    return "";
  }

  return `
    <section
      class="
        case-section
        reveal
      "
    >

      <div
        class="
          container
          case-grid
        "
      >

        <div>

          <p class="case-label">
            07 — Creative Process
          </p>


          <h2 class="case-title">
            Quy trình<br>
            thực hiện
          </h2>

        </div>


        <ol class="editorial-list">

          ${project.process
            .map(
              (item, index) => `
                <li>

                  <span
                    class="list-number"
                  >
                    ${String(index + 1).padStart(2, "0")}
                  </span>


                  <span
                    class="list-text"
                  >
                    ${escapeHTML(
                      typeof item === "string" ? item : item.title || "",
                    )}
                  </span>

                </li>
              `,
            )
            .join("")}

        </ol>

      </div>

    </section>
  `;
}

/* =========================
   MEDIA
========================= */

function makeMediaSections(project) {
  if (!Array.isArray(project.mediaSections) || !project.mediaSections.length) {
    return "";
  }

  return project.mediaSections
    .map((section, sectionIndex) => {
      const items = Array.isArray(section.items) ? section.items : [];

      if (!items.length) {
        return "";
      }

      const layout = ["full", "two", "three"].includes(section.layout)
        ? `layout-${section.layout}`
        : "";

      const cards = items
        .map((item, itemIndex) => {
          if (section.type === "video") {
            return `
                    <figure
                      class="
                        media-card
                        video-card
                      "
                    >

                      <video
                        controls
                        preload="metadata"
                        playsinline
                        aria-label="
                          ${escapeHTML(item.label || `Video ${itemIndex + 1}`)}
                        "
                      >

                        <source
                          src="${safeUrl(item.src)}"
                          type="video/mp4"
                        >

                        Trình duyệt
                        của bạn không
                        hỗ trợ video
                        HTML5.

                      </video>


                      ${
                        item.label
                          ? `
                            <figcaption
                              class="
                                media-caption
                              "
                            >
                              ${escapeHTML(item.label)}
                            </figcaption>
                          `
                          : ""
                      }

                    </figure>
                  `;
          }

          let style = "";

          if (section.aspect === "portrait") {
            style = "aspect-ratio:4/5;object-fit:cover;";
          }

          if (section.aspect === "square") {
            style = "aspect-ratio:1/1;object-fit:cover;";
          }

          if (section.aspect === "landscape") {
            style = "aspect-ratio:16/10;object-fit:cover;";
          }

          return `
                  <figure
                    class="media-card"
                  >

                    <img
                      src="${safeUrl(item.src)}"
                      alt="${escapeHTML(item.alt || project.title)}"
                      loading="lazy"
                      decoding="async"
                      style="${style}"
                    >


                    ${
                      item.label
                        ? `
                          <figcaption
                            class="
                              media-caption
                            "
                          >
                            ${escapeHTML(item.label)}
                          </figcaption>
                        `
                        : ""
                    }

                  </figure>
                `;
        })
        .join("");

      return `
          <section
            class="
              media-section
              reveal
            "
          >

            <div class="container">

              <div
                class="
                  media-heading
                "
              >

                <div>

                  <p
                    class="
                      section-kicker
                    "
                  >
                    08 /
                    Selected Work
                  </p>


                  <h2>
                    ${escapeHTML(section.title || "Selected Work")}
                  </h2>

                </div>


                <span
                  class="
                    media-count
                  "
                >
                  ${String(sectionIndex + 1).padStart(2, "0")}
                  /
                  ${String(project.mediaSections.length).padStart(2, "0")}
                </span>

              </div>


              <div
                class="
                  media-grid
                  ${layout}
                "
              >

                ${cards}

              </div>

            </div>

          </section>
        `;
    })
    .join("");
}

/* =========================
   RESULTS
========================= */

function makeResultsSection(project) {
  if (!Array.isArray(project.results) || !project.results.length) {
    return "";
  }

  return `
    <section
      class="
        case-section
        results-section
        reveal
      "
    >

      <div
        class="
          container
          case-grid
        "
      >

        <div>

          <p class="case-label">
            09 — Results
          </p>


          <h2 class="case-title">
            Kết quả<br>
            ghi nhận
          </h2>

        </div>


        <ul class="results-list">

          ${project.results
            .map(
              (item, index) => `
                <li>

                  <span>
                    ${String(index + 1).padStart(2, "0")}
                  </span>


                  <strong>
                    ${escapeHTML(item)}
                  </strong>

                </li>
              `,
            )
            .join("")}

        </ul>

      </div>

    </section>
  `;
}

/* =========================
   EXTERNAL LINKS
========================= */

function makeExternalLinks(project) {
  if (!Array.isArray(project.links) || !project.links.length) {
    return "";
  }

  return `
    <div class="external-links">

      ${project.links
        .map(
          (link) => `
            <a
              class="
                btn
                btn-secondary
              "
              href="${safeUrl(link.url)}"
              target="_blank"
              rel="
                noopener
                noreferrer
              "
            >

              ${escapeHTML(link.label || "Xem chi tiết")}

              <i
                data-lucide="
                  arrow-up-right
                "
                aria-hidden="true"
              ></i>

            </a>
          `,
        )
        .join("")}

    </div>
  `;
}

/* =========================
   PROJECT DETAIL PAGE
========================= */

function renderProjectPage() {
  const root = document.querySelector("[data-project-page]");

  if (!root) return;

  const id = new URLSearchParams(window.location.search).get("id");

  const project = projects.find((item) => item.id === id);

  /* PROJECT 404 */

  if (!project) {
    document.title = "Không tìm thấy dự án | Mai Minh Đương";

    root.innerHTML = `
      <main class="project-404">

        <div>

          <div class="big-404">
            404
          </div>


          <p class="section-kicker">
            404 / Project
          </p>


          <h1>
            Không tìm thấy dự án.
          </h1>


          <p>
            ID dự án không tồn tại
            hoặc đường dẫn chưa đúng.
          </p>


          <a
            class="
              btn
              btn-primary
            "
            href="
              index.html#projects
            "
          >

            <i
              data-lucide="
                arrow-left
              "
              aria-hidden="true"
            ></i>

            Quay lại
            Selected Work

          </a>

        </div>

      </main>
    `;

    return;
  }

  const currentIndex = projects.findIndex((item) => item.id === project.id);

  const nextProject = projects[(currentIndex + 1) % projects.length];

  const number = project.number || String(currentIndex + 1).padStart(2, "0");

  document.title = `${project.title} | Mai Minh Đương`;

  const strategy =
    project.strategy ||
    project.approach ||
    (project.story && project.story.body) ||
    "";

  const strategyTitle = project.strategy
    ? "Chiến lược triển khai"
    : project.approach
      ? "Approach"
      : (project.story && project.story.title) || "Strategy";

  root.innerHTML = `

    <main class="case-study">


      <!-- PROJECT HERO -->

      <section class="project-hero">

        <div
          class="
            container
            project-hero-grid
          "
        >


          <div
            class="
              project-hero-copy
              reveal
            "
          >

            <p class="section-kicker">

              Project
              ${escapeHTML(number)}

              ·

              ${escapeHTML(project.eyebrow || "Case Study")}

            </p>


            <h1>
              ${escapeHTML(project.title)}
            </h1>


            <p
              class="
                project-hero-desc
              "
            >

              ${escapeHTML(
                project.heroDescription || project.shortDescription || "",
              )}

            </p>


            ${makeMeta(project)}

          </div>


          <div
            class="
              project-hero-image
              reveal
            "
            data-delay="1"
          >

            <span
              class="
                project-hero-number
              "
            >
              ${escapeHTML(number)}
            </span>


            <img
              src="${safeUrl(project.heroImage || project.cover)}"
              alt="${escapeHTML(project.title)}"
              decoding="async"
              fetchpriority="high"
              style="
                object-position:
                ${escapeHTML(project.coverPosition || "50% 50%")};
              "
            >

          </div>

        </div>

      </section>


      ${makeTextSection("02", "Overview", "Tổng quan dự án", project.overview)}


      ${makeTextSection("03", "Challenge", "The Challenge", project.challenge)}


      ${makeTextSection("04", "Insight", "The Insight", project.insight)}


      ${makeTextSection("05", "Strategy", strategyTitle, strategy)}


      ${makeRoleSection(project)}


      ${makeProcessSection(project)}


      ${makeMediaSections(project)}


      ${makeResultsSection(project)}


      ${
        project.links && project.links.length
          ? `

            <section
              class="
                case-section
                reveal
              "
            >

              <div
                class="
                  container
                  case-grid
                "
              >

                <div>

                  <p class="case-label">
                    External
                  </p>


                  <h2 class="case-title">
                    Xem thêm<br>
                    về dự án
                  </h2>

                </div>


                <div>

                  ${makeExternalLinks(project)}

                </div>

              </div>

            </section>

          `
          : ""
      }


      ${
        nextProject
          ? `

            <a
              class="next-project"
              href="
                project.html?id=${encodeURIComponent(nextProject.id)}
              "
              aria-label="
                Dự án tiếp theo:
                ${escapeHTML(nextProject.title)}
              "
            >

              <div
                class="
                  container
                  next-project-inner
                "
              >


                <div
                  class="
                    next-project-copy
                  "
                >

                  <p
                    class="
                      section-kicker
                    "
                  >
                    10 / Next Project
                  </p>


                  <h2>
                    ${escapeHTML(nextProject.title)}
                  </h2>


                  <span
                    class="
                      next-project-arrow
                    "
                  >

                    Xem case study

                    <i
                      data-lucide="
                        arrow-right
                      "
                      aria-hidden="true"
                    ></i>

                  </span>

                </div>


                <div
                  class="
                    next-project-image
                  "
                >

                  <img
                    src="${safeUrl(nextProject.cover)}"
                    alt=""
                    loading="lazy"
                    decoding="async"
                    style="
                      object-position:
                      ${escapeHTML(nextProject.coverPosition || "50% 50%")};
                    "
                  >

                </div>

              </div>

            </a>

          `
          : ""
      }

    </main>
  `;
}

/* =========================
   START WEBSITE
========================= */

function boot() {
  renderProjectCount();

  renderProjectCards();

  renderProjectPage();

  initMobileMenu();

  initHeader();

  initScrollProgress();

  initActiveNavigation();

  initReveal();

  initIcons();
}

document.addEventListener("DOMContentLoaded", boot);
