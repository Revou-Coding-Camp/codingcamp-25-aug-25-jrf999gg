// ===========================================
// Main Script: Welcome Message + Form Handling + Slider + Mobile Menu
// File: js/script.js
// ===========================================

document.addEventListener("DOMContentLoaded", function () {
  // ========================
  // 1. WELCOME MESSAGE: "Hi Name"
  // ========================
  const welcomeEl = document.getElementById("welcome");
  const nameSpan = document.getElementById("user-name");

  if (welcomeEl && nameSpan) {
    let userName = null;

    if (!userName) {
      userName = prompt("Hi! What’s your name?", "Hari") || "there";
      localStorage.setItem("userName", userName);
    }

    nameSpan.textContent = userName;
    welcomeEl.style.opacity = 1;
  }

// ========================
// 2. MESSAGE US FORM HANDLING
// ========================
const form = document.getElementById("messageForm");
const output = document.getElementById("output");

// Fungsi: Tampilkan error di bawah input
function showError(input, message) {
  const formGroup = input.parentElement;
  const errorMsg = formGroup.querySelector(".error-message") || document.createElement("p");
  
  errorMsg.textContent = message;
  errorMsg.className = "error-message";
  errorMsg.style.color = "#d32f2f";
  errorMsg.style.fontSize = "0.85rem";
  errorMsg.style.marginTop = "4px";
  errorMsg.style.fontStyle = "italic";

  if (!formGroup.querySelector(".error-message")) {
    formGroup.appendChild(errorMsg);
  }
}

// Fungsi: Hapus error
function clearError(input) {
  const formGroup = input.parentElement;
  const errorMsg = formGroup.querySelector(".error-message");
  if (errorMsg) errorMsg.remove();
}

// Fungsi: Sanitasi input
const sanitize = (str) => {
  const temp = document.createElement("div");
  temp.textContent = str;
  return temp.innerHTML;
};

// Format waktu Indonesia
const formatTime = () => {
  const now = new Date();
  return now.toLocaleString("id-ID", {
    dateStyle: "full",
    timeStyle: "short",
  });
};

if (form && output) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone");
    const messageInput = document.getElementById("message");

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const message = messageInput.value.trim();

    // Bersihkan error sebelumnya
    [nameInput, emailInput, phoneInput, messageInput].forEach(clearError);

    let isValid = true;

    // Validasi: Semua field wajib diisi
    if (!name) {
      showError(nameInput, "Name is required");
      isValid = false;
    }

    if (!email) {
      showError(emailInput, "Email is required");
      isValid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showError(emailInput, "Please enter a valid email address");
        isValid = false;
      }
    }

    if (!phone) {
      showError(phoneInput, "Phone number is required");
      isValid = false;
    } else {
      // Hanya boleh angka dan opsional awalan + (misal: +62)
      const phoneRegex = /^\+?\d+$/;
      if (!phoneRegex.test(phone)) {
        showError(phoneInput, "Phone number can only contain numbers and optional '+' at start");
        isValid = false;
      } else {
        const digitsOnly = phone.replace(/\D/g, "");
        if (digitsOnly.length < 10 || digitsOnly.length > 15) {
          showError(phoneInput, "Phone number must be 10–15 digits");
          isValid = false;
        }
      }
    }

    if (!message) {
      showError(messageInput, "Message is required");
      isValid = false;
    }

    // Jika valid, proses
    if (isValid) {
      const newMessage = `
        <div class="message-card">
          <strong>📅 Waktu Pengiriman:</strong> ${sanitize(formatTime())}<br>
          <strong>👤 Nama:</strong> ${sanitize(name)}<br>
          <strong>✉️ Email:</strong> ${sanitize(email)}<br>
          <strong>📞 Telepon:</strong> ${sanitize(phone)}<br>
          <strong>💬 Pesan:</strong> ${sanitize(message)}
        </div>
        <hr class="message-divider">
      `;

      output.insertAdjacentHTML("beforeend", newMessage);
      form.reset();
      output.style.display = "block";
      output.scrollIntoView({ behavior: "smooth", block: "end" });

      // Hapus error jika ada (untuk keamanan)
      [nameInput, emailInput, phoneInput, messageInput].forEach(clearError);
    }
  });

  // Hapus error saat user mulai ketik
  ["name", "email", "phone", "message"].forEach(id => {
    const input = document.getElementById(id);
    input.addEventListener("input", () => clearError(input));
    input.addEventListener("focus", () => clearError(input));
  });
}
  // Smooth Scroll untuk Anchor Link
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 80, // -80px untuk offset navbar
          behavior: "smooth",
        });
      }
    });
  });

  // ========================
  // 3. AUTO SLIDING BANNER + LOOP + ARROWS + DOTS
  // ========================
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".dot");
  const slider = document.querySelector(".slider");
  const prevBtn = document.querySelector(".slider-btn.prev");
  const nextBtn = document.querySelector(".slider-btn.next");
  const sliderContainer = document.querySelector(".slider-container");

  const totalSlides = slides.length;

  if (slider && totalSlides > 0) {
    let currentSlide = 0;
    let slideInterval;

    function goToSlide(index) {
      if (index >= totalSlides) currentSlide = 0;
      else if (index < 0) currentSlide = totalSlides - 1;
      else currentSlide = index;

      slider.style.transform = `translateX(-${currentSlide * 100}%)`;
      dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === currentSlide);
      });
    }

    function nextSlide() {
      goToSlide(currentSlide + 1);
    }

    function prevSlide() {
      goToSlide(currentSlide - 1);
    }

    function startAutoSlide() {
      slideInterval = setInterval(nextSlide, 4000);
    }

    function resetAutoSlide() {
      clearInterval(slideInterval);
      startAutoSlide();
    }

    if (sliderContainer) {
      sliderContainer.addEventListener("mouseenter", () =>
        clearInterval(slideInterval)
      );
      sliderContainer.addEventListener("mouseleave", startAutoSlide);
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        prevSlide();
        resetAutoSlide();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        nextSlide();
        resetAutoSlide();
      });
    }

    dots.forEach((dot) => {
      dot.addEventListener("click", () => {
        const index = parseInt(dot.getAttribute("data-index"));
        goToSlide(index);
        resetAutoSlide();
      });
    });

    // Inisialisasi
    goToSlide(0);
    startAutoSlide();
  }

  // ========================
  // 4. MOBILE MENU TOGGLE
  // ========================
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      hamburger.classList.toggle("active");
    });

    document.querySelectorAll(".nav-links a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        hamburger.classList.remove("active");
      });
    });
  }

  // ========================
  // 5. ANIMASI TIMELINE SAAT SCROLL
  // ========================
  const timelineItems = document.querySelectorAll(".timeline-item");

  function checkTimelineVisibility() {
    timelineItems.forEach((item) => {
      const rect = item.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.8) {
        item.classList.add("visible");
      }
    });
  }

  window.addEventListener("load", checkTimelineVisibility);
  window.addEventListener("scroll", checkTimelineVisibility);
});

// ========================
// 6. CLEAR ALL MESSAGES
// ========================
function clearAllMessages() {
  const output = document.getElementById("output");
  if (output && output.innerHTML.trim() !== "") {
    if (confirm("Are you sure you want to delete all messages?")) {
      output.innerHTML = ""; // Hapus semua pesan
      output.style.display = "none"; // Sembunyikan output
    }
  } else {
    alert("There are no messages to clear.");
  }
}
