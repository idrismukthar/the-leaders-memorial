/* ========== SLIDESHOW FUNCTIONALITY ========== */
let slideIndex = 1;
let slideTimer;

function initSlideshow() {
  showSlide(slideIndex);
  autoSlide();
}

function changeSlide(n) {
  clearTimeout(slideTimer);
  showSlide((slideIndex += n));
  autoSlide();
}

function currentSlide(n) {
  clearTimeout(slideTimer);
  showSlide((slideIndex = n));
  autoSlide();
}

function showSlide(n) {
  let slides = document.getElementsByClassName("slide");
  let dots = document.getElementsByClassName("dot");

  if (n > slides.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = slides.length;
  }

  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (let i = 0; i < dots.length; i++) {
    dots[i].classList.remove("active");
  }

  slides[slideIndex - 1].style.display = "flex";
  dots[slideIndex - 1].classList.add("active");
}

function autoSlide() {
  slideTimer = setTimeout(() => {
    slideIndex++;
    showSlide(slideIndex);
    autoSlide();
  }, 5000); // Change slide every 5 seconds
}

/* ========== COUNTER ANIMATION ========== */
function animateCounters() {
  const counters = document.querySelectorAll(".counter");
  const speed = 200;

  counters.forEach((counter) => {
    const target = parseInt(counter.getAttribute("data-target"));
    const increment = target / speed;

    const updateCount = () => {
      const current = parseInt(counter.innerText);
      if (current < target) {
        counter.innerText = Math.ceil(current + increment);
        setTimeout(updateCount, 10);
      } else {
        counter.innerText = target;
      }
    };

    updateCount();
  });
}

function animateProgressBars() {
  const progressFills = document.querySelectorAll(".progress-fill");

  progressFills.forEach((fill) => {
    const target = parseInt(fill.getAttribute("data-target"));
    let current = 0;
    const increment = target / 50;

    const updateProgress = () => {
      if (current < target) {
        current += increment;
        fill.style.width = current + "%";
        setTimeout(updateProgress, 30);
      } else {
        fill.style.width = target + "%";
      }
    };

    updateProgress();
  });
}

// Intersection Observer for scroll-triggered animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -100px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // ADD THE ANIMATED CLASS TO SHOW THE ELEMENT
      entry.target.classList.add("animated");

      if (entry.target.classList.contains("counter")) {
        animateCounters();
      }
      if (entry.target.closest(".results-stats")) {
        animateProgressBars();
      }

      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all scroll-animate elements
document.addEventListener("DOMContentLoaded", () => {
  const animateElements = document.querySelectorAll(".scroll-animate");
  animateElements.forEach((el) => {
    observer.observe(el);
  });

  // Initialize slideshow
  initSlideshow();

  // Mobile menu functionality
  setupMobileMenu();

  // Form submissions
  setupFormSubmissions();

  // Smooth scroll for navigation links
  setupSmoothScroll();
});

/* ========== MOBILE MENU ========== */
function setupMobileMenu() {
  const menuButton = document.getElementById("mobile-menu-button");
  const navMenu = document.querySelector(".main-nav");

  if (menuButton) {
    menuButton.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      navMenu.classList.toggle("active");
      menuButton.style.transition = "none";
      menuButton.style.color = navMenu.classList.contains("active")
        ? "#b399d4"
        : "white";
    });

    // Close menu when a link is clicked
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("active");
        menuButton.style.color = "white";
      });
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (
        !e.target.closest(".header") &&
        navMenu.classList.contains("active")
      ) {
        navMenu.classList.remove("active");
        menuButton.style.color = "white";
      }
    });
  }
}

/* ========== FORM SUBMISSIONS ========== */
function setupFormSubmissions() {
  const admissionForm = document.getElementById("admissionForm");
  const contactForm = document.getElementById("contactForm");

  if (admissionForm) {
    admissionForm.addEventListener("submit", (e) => {
      e.preventDefault();
      handleFormSubmit("Admission Form");
      admissionForm.reset();
    });
  }

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      handleFormSubmit("Contact Form");
      contactForm.reset();
    });
  }
}

function handleFormSubmit(formName) {
  // Create success message
  const message = document.createElement("div");
  message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(76, 175, 80, 0.9);
        color: white;
        padding: 30px 50px;
        border-radius: 10px;
        font-size: 18px;
        font-weight: 700;
        z-index: 10000;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        animation: slideDown 0.5s ease-out;
    `;
  message.innerText = `${formName} Submitted Successfully! 🎉`;

  document.body.appendChild(message);

  setTimeout(() => {
    message.style.animation = "slideUp 0.5s ease-out";
    setTimeout(() => message.remove(), 500);
  }, 3000);
}

/* ========== SMOOTH SCROLL ========== */
function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
}

/* ========== ADD ANIMATION STYLES DYNAMICALLY ========== */
const style = document.createElement("style");
style.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translate(-50%, -100%);
        }
        to {
            opacity: 1;
            transform: translate(-50%, -50%);
        }
    }

    @keyframes slideUp {
        from {
            opacity: 1;
            transform: translate(-50%, -50%);
        }
        to {
            opacity: 0;
            transform: translate(-50%, 100%);
        }
    }

    .slide.fade {
        animation: fadeIn 0.8s;
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;
document.head.appendChild(style);

/* ========== SCROLL TO TOP BUTTON ========== */
let scrollTopButton;

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    if (!scrollTopButton) {
      scrollTopButton = document.createElement("button");
      scrollTopButton.innerHTML = "↑";
      scrollTopButton.style.cssText = `
                position: fixed;
                bottom: 30px;
                right: 30px;
                width: 50px;
                height: 50px;
                background: rgba(74, 144, 226, 0.8);
                border: 2px solid rgba(255, 255, 255, 0.3);
                color: white;
                border-radius: 50%;
                cursor: pointer;
                font-size: 24px;
                font-weight: 700;
                z-index: 999;
                transition: all 0.3s ease;
                backdrop-filter: blur(10px);
            `;

      scrollTopButton.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });

      scrollTopButton.addEventListener("mouseenter", () => {
        scrollTopButton.style.transform = "scale(1.1)";
        scrollTopButton.style.background = "rgba(74, 144, 226, 1)";
      });

      scrollTopButton.addEventListener("mouseleave", () => {
        scrollTopButton.style.transform = "scale(1)";
        scrollTopButton.style.background = "rgba(74, 144, 226, 0.8)";
      });

      document.body.appendChild(scrollTopButton);
    }
    scrollTopButton.style.display = "block";
  } else if (scrollTopButton) {
    scrollTopButton.style.display = "none";
  }
});

/* ========== ACTIVE NAV LINK ON SCROLL ========== */
window.addEventListener("scroll", () => {
  let current = "";
  const sections = document.querySelectorAll("section");

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (scrollY >= sectionTop - 200) {
      current = section.getAttribute("id");
    }
  });

  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href").slice(1) === current) {
      link.classList.add("active");
    }
  });
});

/* ========== KEYBOARD NAVIGATION ========== */
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") {
    changeSlide(-1);
  } else if (e.key === "ArrowRight") {
    changeSlide(1);
  }
});

console.log("School Portal - All JavaScript loaded successfully!");
