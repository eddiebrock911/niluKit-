/* ============================================================
   ANKIT & NILU — Main Script
   Advanced interactions, animations & features
   ============================================================ */

// ─── CONFIG ───────────────────────────────────────────────
const CORRECT_PASSWORD = "nilu";
const START_DATE = new Date("2026-09-18T08:05:09");

// ─── PASSWORD ─────────────────────────────────────────────
function createPwStars() {
  const layer = document.getElementById("pw-stars");
  if (!layer) return;
  for (let i = 0; i < 60; i++) {
    const s = document.createElement("div");
    s.className = "pw-star";
    s.style.left = Math.random() * 100 + "%";
    s.style.top = Math.random() * 100 + "%";
    s.style.setProperty("--d", 2 + Math.random() * 4 + "s");
    s.style.animationDelay = Math.random() * 3 + "s";
    s.style.width = s.style.height = 1 + Math.random() * 3 + "px";
    layer.appendChild(s);
  }
}

function togglePwVisibility() {
  const input = document.getElementById("pw-input");
  const btn = document.getElementById("pw-toggle");
  if (!input) return;
  const show = input.type === "password";
  input.type = show ? "text" : "password";
  if (btn) btn.textContent = show ? "🙈" : "👁️";
}

function checkPassword() {
  const input = document.getElementById("pw-input");
  const err = document.getElementById("pw-error");
  if (!input) return;

  const val = input.value.trim().toLowerCase().replace(/\s+/g, "");
  const ok = val === CORRECT_PASSWORD;

  if (ok) {
    unlockWorld();
  } else {
    if (err) {
      err.textContent = "Hmm, not quite… try again 💌";
      err.classList.add("show");
      setTimeout(() => err.classList.remove("show"), 2500);
    }
    input.classList.add("shake");
    const card = document.getElementById("pw-card");
    if (card) {
      card.style.animation = "none";
      void card.offsetWidth;
      card.style.animation = "shake 0.4s ease";
    }
  }
}

function unlockWorld() {
  spawnConfetti();
  const screen = document.getElementById("password-screen");
  const main = document.getElementById("main-content");
  if (screen) screen.classList.add("unlocked");
  if (main) main.classList.add("visible");
  // sessionStorage.setItem("nilukit_unlocked", "1");
  initHearts();
  startCounter();
  observeReveals();
  initLoveLetter();
  showNewQuote();
}

function spawnConfetti() {
  const colors = ["#ff4d8d", "#9b5cff", "#ffd6a0", "#ff7aa8", "#c4a1ff", "#fff", "#ff9ec8"];
  for (let i = 0; i < 50; i++) {
    const p = document.createElement("div");
    p.className = "confetti-piece";
    p.style.left = Math.random() * 100 + "vw";
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    p.style.setProperty("--cd", 2 + Math.random() * 2.5 + "s");
    p.style.animationDelay = Math.random() * 0.5 + "s";
    p.style.width = 6 + Math.random() * 8 + "px";
    p.style.height = 6 + Math.random() * 8 + "px";
    p.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 4000);
  }
}

// ─── FLOATING HEARTS ──────────────────────────────────────
function initHearts() {
  const layer = document.getElementById("hearts-layer");
  if (!layer || layer.dataset.ready) return;
  layer.dataset.ready = "1";
  const emojis = ["💕", "💗", "🌸", "✨", "💖", "🦋", "🌺", "💫"];
  for (let i = 0; i < 18; i++) {
    const h = document.createElement("span");
    h.className = "float-heart";
    h.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    h.style.left = Math.random() * 100 + "%";
    h.style.setProperty("--size", 12 + Math.random() * 18 + "px");
    h.style.setProperty("--dur", 10 + Math.random() * 14 + "s");
    h.style.setProperty("--delay", Math.random() * 12 + "s");
    h.style.setProperty("--drift", -40 + Math.random() * 80 + "px");
    h.style.setProperty("--rot", -30 + Math.random() * 60 + "deg");
    h.style.setProperty("--op", 0.25 + Math.random() * 0.4);
    layer.appendChild(h);
  }
}

// ─── COUNTER ──────────────────────────────────────────────
function startCounter() {
  function tick() {
    const now = new Date();
    let diff = now - START_DATE;
    const future = diff < 0;
    diff = Math.abs(diff);

    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);

    const d = document.getElementById("c-days");
    const h = document.getElementById("c-hours");
    const m = document.getElementById("c-mins");
    const s = document.getElementById("c-secs");

    if (d) d.textContent = days;
    if (h) h.textContent = String(hours).padStart(2, "0");
    if (m) m.textContent = String(mins).padStart(2, "0");
    if (s) s.textContent = String(secs).padStart(2, "0");

    if (s) {
      s.style.transform = "scale(1.08)";
      setTimeout(() => (s.style.transform = "scale(1)"), 150);
    }
  }
  tick();
  setInterval(tick, 1000);
}

// ─── REVEAL ON SCROLL ─────────────────────────────────────
function observeReveals() {
  const els = document.querySelectorAll(".reveal");
  if (!els.length) return;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  els.forEach((el) => io.observe(el));
}

// ─── SLIDESHOW ────────────────────────────────────────────
let currentSlide = 0;
let slideTimer = null;

function goSlide(n) {
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".slide-dot");
  if (!slides.length) return;
  document.querySelectorAll(".slide video").forEach((video) => video.pause());
  currentSlide = ((n % slides.length) + slides.length) % slides.length;
  slides.forEach((s, i) => s.classList.toggle("active", i === currentSlide));
  dots.forEach((d, i) => {
    const isActive = i === currentSlide;
    d.classList.toggle("active", isActive);
    d.setAttribute("aria-current", String(isActive));
  });
  const status = document.getElementById("slideshow-video-status");
  if (status) status.textContent = "";
  updateSlidePlayButton();
  resetSlideTimer();
}

function nextSlide() {
  goSlide(currentSlide + 1);
}

function prevSlide() {
  goSlide(currentSlide - 1);
}

function resetSlideTimer() {
  if (slideTimer) clearInterval(slideTimer);
  const activeVideo = document.querySelector(".slide.active video");
  if (activeVideo && !activeVideo.paused && !activeVideo.ended) return;
  slideTimer = setInterval(nextSlide, 4500);
}

function updateSlidePlayButton() {
  const button = document.getElementById("slide-play-btn");
  const activeVideo = document.querySelector(".slide.active video");
  if (button) button.textContent = activeVideo && !activeVideo.paused ? "⏸ Pause video" : "▶ Play video";
}

function toggleCurrentSlideVideo() {
  const activeVideo = document.querySelector(".slide.active video");
  const status = document.getElementById("slideshow-video-status");
  if (!activeVideo) {
    if (status) status.textContent = "No video is available on this slide.";
    return;
  }

  if (!activeVideo.paused) {
    activeVideo.pause();
    return;
  }

  if (status) status.textContent = "";
  activeVideo.play().catch((error) => {
    console.error("Unable to play slideshow video:", error);
    if (status) status.textContent = "Video couldn't be played. Check that the video file is available.";
  });
}

function initSlideshow() {
  document.querySelectorAll(".slide video").forEach((video) => {
    video.addEventListener("play", () => {
      if (video.closest(".slide")?.classList.contains("active")) {
        if (slideTimer) clearInterval(slideTimer);
        updateSlidePlayButton();
      }
    });
    video.addEventListener("pause", () => {
      updateSlidePlayButton();
      if (video.closest(".slide")?.classList.contains("active")) resetSlideTimer();
    });
    video.addEventListener("ended", () => {
      updateSlidePlayButton();
      if (video.closest(".slide")?.classList.contains("active")) resetSlideTimer();
    });
    video.addEventListener("error", () => {
      const status = document.getElementById("slideshow-video-status");
      if (video.closest(".slide")?.classList.contains("active") && status) {
        status.textContent = "This browser couldn't play the video. Check that it supports MP4 video playback.";
      }
      console.error("Unable to load slideshow video:", video.currentSrc);
    });
  });
  updateSlidePlayButton();
}

// ─── ZOOM ─────────────────────────────────────────────────
function openZoom(el) {
  const img = el.querySelector("img");
  if (!img || !img.src) return;
  const overlay = document.getElementById("zoom-overlay");
  const zoomImg = document.getElementById("zoom-img");
  if (!overlay || !zoomImg) return;
  zoomImg.src = img.src;
  zoomImg.alt = img.alt || "Photo";
  overlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

function openZoomFromPolaroid(el) {
  openZoom(el);
}

function closeZoom() {
  const overlay = document.getElementById("zoom-overlay");
  if (overlay) overlay.classList.remove("open");
  document.body.style.overflow = "";
}

// ═══════════════════════════════════════════════════════════
// 🤗 VIRTUAL HUG FEATURE
// ═══════════════════════════════════════════════════════════
const HUG_MESSAGES = [
  { emoji: "🤗💕", title: "A warm hug just for you!", text: "Close your eyes and feel my arms around you. You are so loved, Nilu. I'm always here for you, no matter what. 💕" },
  { emoji: "🌸✨", title: "You're doing amazing!", text: "Even on tough days, remember — you're the strongest, bravest, most beautiful person I know. This hug is my way of saying I'm proud of you. 💪" },
  { emoji: "💗🦋", title: "My love wraps around you", text: "No distance is too far, no moment too dark — my love finds its way to you, always. Feel it now, like sunshine on your face. ☀️" },
  { emoji: "🌙💫", title: "You are never alone", text: "Even when the world feels heavy, remember you have someone who believes in you unconditionally. I'm your safe place, always. 🤗" },
  { emoji: "🌹💕", title: "Sending all my warmth", text: "Imagine me holding you tight, whispering that everything will be okay — because it will. We'll get through everything together. 💕" },
  { emoji: "⚖️💪", title: "Future Lawyer needs a hug too!", text: "Even superheroes need a break. Take a deep breath, my love. You're working so hard and it WILL pay off. I believe in you! ⚖️✨" },
  { emoji: "🫂🌺", title: "A hug full of butterflies", text: "Every time I think of you, my heart does a little dance. This hug carries all those butterflies straight to you. 🦋💕" },
  { emoji: "☀️💛", title: "You're my sunshine!", text: "On cloudy days, remember — you are someone's sunshine. You are MY sunshine. And I'll always be yours. ☀️💕" }
];

let hugCount = parseInt(localStorage.getItem("nilukit_hugs") || "0");

function sendVirtualHug() {
  hugCount++;
  localStorage.setItem("nilukit_hugs", String(hugCount));
  const countEl = document.getElementById("hug-count");
  if (countEl) countEl.textContent = hugCount;

  // Pick random message
  const msg = HUG_MESSAGES[Math.floor(Math.random() * HUG_MESSAGES.length)];
  const titleEl = document.getElementById("hug-title");
  const textEl = document.getElementById("hug-text");
  const emojiEl = document.querySelector(".hug-emoji");
  if (titleEl) titleEl.textContent = msg.title;
  if (textEl) textEl.textContent = msg.text;
  if (emojiEl) emojiEl.textContent = msg.emoji;

  // Show overlay
  const overlay = document.getElementById("hug-overlay");
  if (overlay) {
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
    spawnHugHearts();
  }
}

function spawnHugHearts() {
  const container = document.getElementById("hug-hearts-burst");
  if (!container) return;
  container.innerHTML = "";
  const hearts = ["💕", "💗", "💖", "💝", "🤗", "🌸", "✨", "💫", "🦋", "❤️", "🌹", "💘"];
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  for (let i = 0; i < 30; i++) {
    const h = document.createElement("span");
    h.className = "hug-burst-heart";
    h.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    const angle = (Math.PI * 2 * i) / 30 + Math.random() * 0.5;
    const dist = 100 + Math.random() * 250;
    h.style.left = centerX + "px";
    h.style.top = centerY + "px";
    h.style.setProperty("--hx", Math.cos(angle) * dist + "px");
    h.style.setProperty("--hy", Math.sin(angle) * dist + "px");
    h.style.setProperty("--hr", -30 + Math.random() * 60 + "deg");
    h.style.setProperty("--hs", 18 + Math.random() * 24 + "px");
    h.style.setProperty("--hd", 1.5 + Math.random() * 1.5 + "s");
    h.style.animationDelay = Math.random() * 0.4 + "s";
    container.appendChild(h);
  }
}

function closeHug() {
  const overlay = document.getElementById("hug-overlay");
  if (overlay) {
    overlay.classList.remove("open");
    document.body.style.overflow = "";
  }
}

// ═══════════════════════════════════════════════════════════
// 💌 REASONS I LOVE YOU — RANDOM GENERATOR
// ═══════════════════════════════════════════════════════════
const LOVE_REASONS = [
  { emoji: "😍", text: "Your smile — it lights up my entire world and makes every bad day disappear." },
  { emoji: "🧠", text: "Your brilliant mind — the way you think, analyze, and dream about becoming a lawyer inspires me daily." },
  { emoji: "💪", text: "Your determination — you never give up, no matter how tough things get. That's my future lawyer!" },
  { emoji: "🌸", text: "Your kindness — the way you care about everyone around you shows what a beautiful heart you have." },
  { emoji: "😂", text: "Your laughter — it's the most beautiful sound in the universe and I'd do anything to hear it." },
  { emoji: "🌙", text: "Your late-night conversations — those moments when the world sleeps but we're still talking about everything." },
  { emoji: "🦋", text: "The butterflies you give me — even after all this time, you still make my heart race." },
  { emoji: "📚", text: "Your dedication to studies — watching you work so hard for your dream makes me fall for you even more." },
  { emoji: "💕", text: "The way you say my name — nobody else makes it sound as special as you do." },
  { emoji: "🌟", text: "Your ambition — you dream big and work harder. That combination is irresistible." },
  { emoji: "🤗", text: "Your hugs — they feel like coming home. Safe, warm, and perfect." },
  { emoji: "🎵", text: "The songs that remind me of you — every love song suddenly makes sense because of you." },
  { emoji: "✨", text: "Your eyes — they hold entire galaxies and I could get lost in them forever." },
  { emoji: "🌹", text: "Your strength during tough times — you handle everything with such grace and courage." },
  { emoji: "☕", text: "Our chai dates — even the simplest moments feel magical when I'm with you." },
  { emoji: "🫶", text: "The way you support me — you believe in me even when I don't believe in myself." },
  { emoji: "🌈", text: "Your positivity — you find beauty and hope even in the darkest moments." },
  { emoji: "📖", text: "Your love for learning — you're going to be the most knowledgeable lawyer in the courtroom!" },
  { emoji: "💫", text: "How you make ordinary days extraordinary — with you, every day feels like an adventure." },
  { emoji: "🎀", text: "Your cute little habits — the things you don't even notice about yourself that I adore." },
  { emoji: "🌺", text: "Your voice — whether you're happy, sad, or arguing a mock case, I love every word." },
  { emoji: "🔥", text: "Your passion — when you talk about your dreams, your eyes sparkle like stars." },
  { emoji: "💝", text: "How you remember the little things — it shows how deeply you care." },
  { emoji: "🌻", text: "Your warmth — being near you feels like sunshine on a winter morning." },
  { emoji: "⚖️", text: "Your sense of justice — you'll fight for what's right, and that makes me so proud." },
  { emoji: "🥰", text: "The way you look at me — like I'm the only person in the world." },
  { emoji: "🎭", text: "Your expressions — every little face you make tells a story I love reading." },
  { emoji: "💐", text: "How you make me want to be better — you bring out the best version of me." },
  { emoji: "🌊", text: "Your calm presence — you're my peace in this chaotic world." },
  { emoji: "🏠", text: "You feel like home — wherever you are, that's where I belong." }
];

let reasonsSeen = parseInt(localStorage.getItem("nilukit_reasons_seen") || "0");
let lastReasonIndex = -1;

function showRandomReason() {
  let idx;
  do {
    idx = Math.floor(Math.random() * LOVE_REASONS.length);
  } while (idx === lastReasonIndex && LOVE_REASONS.length > 1);
  lastReasonIndex = idx;

  const reason = LOVE_REASONS[idx];
  const display = document.getElementById("reasons-display");
  const emojiEl = document.getElementById("reasons-emoji");
  const textEl = document.getElementById("reasons-text");
  const seenEl = document.getElementById("reasons-seen");

  if (display) display.classList.add("active");
  if (emojiEl) {
    emojiEl.style.animation = "none";
    void emojiEl.offsetWidth;
    emojiEl.textContent = reason.emoji;
    emojiEl.style.animation = "reasonPop 0.6s var(--ease-spring)";
  }
  if (textEl) {
    textEl.style.opacity = "0";
    setTimeout(() => {
      textEl.textContent = reason.text;
      textEl.style.opacity = "1";
    }, 200);
  }

  reasonsSeen++;
  localStorage.setItem("nilukit_reasons_seen", String(reasonsSeen));
  if (seenEl) seenEl.textContent = reasonsSeen;
}

// ═══════════════════════════════════════════════════════════
// 💪 DAILY MOTIVATION QUOTES
// ═══════════════════════════════════════════════════════════
const QUOTES = [
  { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs", icon: "💫", note: "Nilu, your passion for law will take you places you can't even imagine yet! 💪⚖️" },
  { quote: "Justice cannot be for one side alone, but must be for both.", author: "Eleanor Roosevelt", icon: "⚖️", note: "This is exactly the kind of lawyer you'll be — fair, balanced, and extraordinary! 🌟" },
  { quote: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt", icon: "🌸", note: "Your dream of becoming a lawyer IS beautiful, and I believe in it with all my heart! 💕" },
  { quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill", icon: "💪", note: "Every tough exam, every hard day — you keep going. That's true strength, my love! 🔥" },
  { quote: "The only impossible journey is the one you never begin.", author: "Tony Robbins", icon: "🚀", note: "You've already begun your journey, Nilu. And I'll walk every step with you! 🤝💕" },
  { quote: "Injustice anywhere is a threat to justice everywhere.", author: "Martin Luther King Jr.", icon: "🏛️", note: "Future Advocate Nilu will fight against injustice — and win! ⚖️✨" },
  { quote: "Believe you can and you're halfway there.", author: "Theodore Roosevelt", icon: "🌟", note: "I believe in you Nilu. And I know YOU believe in yourself too. That's unstoppable! 💪" },
  { quote: "The pen is mightier than the sword.", author: "Edward Bulwer-Lytton", icon: "📝", note: "And your pen, dear future lawyer, will change the world! Keep writing your story! 🌍" },
  { quote: "She believed she could, so she did.", author: "R.S. Grey", icon: "👑", note: "That's you, Nilu. Believe, fight, achieve. Your crown is waiting! 👑⚖️" },
  { quote: "Hard work beats talent when talent doesn't work hard.", author: "Tim Notke", icon: "🔨", note: "And baby, nobody works harder than you. Your success is inevitable! 💯" },
  { quote: "The law is reason, free from passion.", author: "Aristotle", icon: "🧠", note: "But you'll bring both reason AND passion to the law — that's what'll make you special! 💕⚖️" },
  { quote: "Dream big. Start small. Act now.", author: "Robin Sharma", icon: "🎯", note: "You're doing exactly this right now, Nilu. Every study session counts! 📚✨" },
  { quote: "You are braver than you believe, stronger than you seem, and smarter than you think.", author: "A.A. Milne", icon: "🦁", note: "Read this again whenever you doubt yourself, my love. It's all true! 💕" },
  { quote: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb", icon: "🌱", note: "You're planting the seeds of your future right now. Keep growing, my love! 🌳" },
  { quote: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin", icon: "📖", note: "Every page you read, every concept you learn — it's all building your empire! 🏰" }
];

let lastQuoteIndex = -1;

function showNewQuote() {
  let idx;
  do {
    idx = Math.floor(Math.random() * QUOTES.length);
  } while (idx === lastQuoteIndex && QUOTES.length > 1);
  lastQuoteIndex = idx;

  const q = QUOTES[idx];
  const quoteEl = document.getElementById("motivation-quote");
  const authorEl = document.getElementById("motivation-author");
  const iconEl = document.getElementById("motivation-icon");
  const noteEl = document.getElementById("motivation-note");

  if (quoteEl) {
    quoteEl.style.opacity = "0";
    setTimeout(() => {
      quoteEl.textContent = `"${q.quote}"`;
      quoteEl.style.opacity = "1";
    }, 250);
  }
  if (authorEl) authorEl.textContent = `— ${q.author}`;
  if (iconEl) iconEl.textContent = q.icon;
  if (noteEl) noteEl.innerHTML = `<em>${q.note}</em>`;
}

// ═══════════════════════════════════════════════════════════
// 📚 STUDY TIMER (POMODORO)
// ═══════════════════════════════════════════════════════════
let studyDuration = 25 * 60; // seconds
let studyRemaining = 25 * 60;
let studyInterval = null;
let studyRunning = false;
let studySessions = parseInt(localStorage.getItem("nilukit_study_sessions_" + new Date().toDateString()) || "0");

const STUDY_MESSAGES = {
  start: [
    "Let's go, my love! Focus time begins! You've got this! ⚖️💕",
    "Future Lawyer study mode: ON! I'm so proud of you! 📚✨",
    "Time to make your dreams come true, one page at a time! 💪🌟",
    "Ankit believes in you! Now believe in yourself too! 💕🔥"
  ],
  halfway: [
    "Halfway there, superstar! Keep going! 🌟💕",
    "You're doing amazing, Nilu! More than halfway! 💪",
    "Look at you go! Future Lawyer in the making! ⚖️✨",
  ],
  fiveMin: [
    "Just 5 more minutes! You're almost done! 🏆",
    "So close, my love! Finish strong! 💕💪",
  ],
  done: [
    "🎉 AMAZING! You completed a study session! I'm SO proud of you! 🏆💕",
    "🎊 SESSION COMPLETE! You're one step closer to your dream, my love! ⚖️✨",
    "🌟 WOW! Look at you go, Future Lawyer! Take a break, you deserve it! ☕💕",
  ],
  idle: [
    "Ready to study, my love? You've got this! ⚖️💕",
    "Whenever you're ready, I'm here cheering for you! 📚💪",
  ]
};

function getStudyMsg(category) {
  const msgs = STUDY_MESSAGES[category];
  return msgs[Math.floor(Math.random() * msgs.length)];
}

function updateStudyDisplay() {
  const timeEl = document.getElementById("study-timer-time");
  const labelEl = document.getElementById("study-timer-label");
  const countEl = document.getElementById("study-sessions-count");

  if (timeEl) {
    const mins = Math.floor(studyRemaining / 60);
    const secs = studyRemaining % 60;
    timeEl.textContent = String(mins).padStart(2, "0") + ":" + String(secs).padStart(2, "0");
  }
  if (countEl) countEl.textContent = studySessions;
}

function setStudyTime(minutes) {
  if (studyRunning) return;
  studyDuration = minutes * 60;
  studyRemaining = minutes * 60;
  updateStudyDisplay();

  // Update active preset
  document.querySelectorAll(".study-preset").forEach(btn => {
    btn.classList.toggle("active", parseInt(btn.dataset.time) === minutes);
  });

  const ring = document.getElementById("study-timer-ring");
  if (ring) {
    ring.classList.remove("running", "done");
  }
}

function startStudyTimer() {
  if (studyRunning) return;
  if (studyRemaining <= 0) {
    studyRemaining = studyDuration;
  }
  studyRunning = true;

  const ring = document.getElementById("study-timer-ring");
  const startBtn = document.getElementById("study-start-btn");
  const pauseBtn = document.getElementById("study-pause-btn");
  const msgText = document.getElementById("study-msg-text");
  const msgIcon = document.querySelector(".study-msg-icon");
  const msgBox = document.getElementById("study-message");

  if (ring) ring.classList.add("running");
  if (ring) ring.classList.remove("done");
  if (startBtn) startBtn.style.display = "none";
  if (pauseBtn) pauseBtn.style.display = "inline-flex";
  if (msgText) msgText.textContent = getStudyMsg("start");
  if (msgIcon) msgIcon.textContent = "📖";
  if (msgBox) msgBox.classList.remove("complete");

  const totalDuration = studyDuration;
  studyInterval = setInterval(() => {
    studyRemaining--;
    updateStudyDisplay();

    // Halfway message
    if (studyRemaining === Math.floor(totalDuration / 2)) {
      const mt = document.getElementById("study-msg-text");
      const mi = document.querySelector(".study-msg-icon");
      if (mt) mt.textContent = getStudyMsg("halfway");
      if (mi) mi.textContent = "🌟";
    }

    // 5 min warning
    if (studyRemaining === 300 && totalDuration > 300) {
      const mt = document.getElementById("study-msg-text");
      const mi = document.querySelector(".study-msg-icon");
      if (mt) mt.textContent = getStudyMsg("fiveMin");
      if (mi) mi.textContent = "⏰";
    }

    // Done
    if (studyRemaining <= 0) {
      clearInterval(studyInterval);
      studyInterval = null;
      studyRunning = false;
      studySessions++;
      localStorage.setItem("nilukit_study_sessions_" + new Date().toDateString(), String(studySessions));

      if (ring) ring.classList.remove("running");
      if (ring) ring.classList.add("done");
      if (startBtn) startBtn.style.display = "inline-flex";
      if (pauseBtn) pauseBtn.style.display = "none";
      if (msgText) msgText.textContent = getStudyMsg("done");
      if (msgIcon) msgIcon.textContent = "🎉";
      if (msgBox) msgBox.classList.add("complete");

      updateStudyDisplay();

      // Celebration confetti
      spawnConfetti();
    }
  }, 1000);
}

function pauseStudyTimer() {
  if (!studyRunning) return;
  clearInterval(studyInterval);
  studyInterval = null;
  studyRunning = false;

  const ring = document.getElementById("study-timer-ring");
  const startBtn = document.getElementById("study-start-btn");
  const pauseBtn = document.getElementById("study-pause-btn");
  const msgText = document.getElementById("study-msg-text");
  const msgIcon = document.querySelector(".study-msg-icon");

  if (ring) ring.classList.remove("running");
  if (startBtn) startBtn.style.display = "inline-flex";
  if (pauseBtn) pauseBtn.style.display = "none";
  if (msgText) msgText.textContent = "Paused! Take a breather, you're doing great! ☕💕";
  if (msgIcon) msgIcon.textContent = "⏸️";
}

function resetStudyTimer() {
  clearInterval(studyInterval);
  studyInterval = null;
  studyRunning = false;
  studyRemaining = studyDuration;

  const ring = document.getElementById("study-timer-ring");
  const startBtn = document.getElementById("study-start-btn");
  const pauseBtn = document.getElementById("study-pause-btn");
  const msgText = document.getElementById("study-msg-text");
  const msgIcon = document.querySelector(".study-msg-icon");
  const msgBox = document.getElementById("study-message");

  if (ring) ring.classList.remove("running", "done");
  if (startBtn) startBtn.style.display = "inline-flex";
  if (pauseBtn) pauseBtn.style.display = "none";
  if (msgText) msgText.textContent = getStudyMsg("idle");
  if (msgIcon) msgIcon.textContent = "📖";
  if (msgBox) msgBox.classList.remove("complete");

  updateStudyDisplay();
}

// ═══════════════════════════════════════════════════════════
// 📝 LOVE LETTER — TYPEWRITER EFFECT
// ═══════════════════════════════════════════════════════════
const LOVE_LETTER_TEXT = `I don't even know where to begin, because no words feel big enough for what you mean to me.

From the moment you came into my life, everything changed — the colours got brighter, the music got sweeter, and my heart found a reason to beat a little faster every single day.

Nilu, you are not just my love — you are my best friend, my biggest inspiration, and my greatest blessing. Watching you chase your dream of becoming a lawyer fills me with so much pride that sometimes I can't even express it.

You study so hard, you fight so bravely, and you shine so bright — even on days when you don't feel like it. I want you to know that I see all of it, and I admire every single bit of it.

I promise to always be your safe place, your biggest fan, and your forever home. Through every exam, every late night, every victory and every setback — I'll be right here, holding your hand and cheering the loudest.

You are going to change the world, my love. And I'll be the luckiest person alive, watching it happen from the front row. 💕

I love you — more than words, more than stars, more than forever.`;

let letterTyping = false;
let letterTimeout = null;

function initLoveLetter() {
  // Only start when letter section is visible
  const letterSection = document.querySelector(".letter-section");
  if (!letterSection) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          typeLetter();
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.3 }
  );
  io.observe(letterSection);
}

function typeLetter() {
  if (letterTyping) return;
  letterTyping = true;

  const typedEl = document.getElementById("letter-typed");
  const cursorEl = document.getElementById("letter-cursor");
  if (!typedEl) return;

  typedEl.textContent = "";
  if (cursorEl) cursorEl.style.display = "inline-block";

  let i = 0;
  function typeNext() {
    if (i < LOVE_LETTER_TEXT.length) {
      typedEl.textContent += LOVE_LETTER_TEXT[i];
      i++;
      const delay = LOVE_LETTER_TEXT[i - 1] === "\n" ? 120 : 
                    LOVE_LETTER_TEXT[i - 1] === "." ? 80 :
                    LOVE_LETTER_TEXT[i - 1] === "," ? 50 : 
                    22 + Math.random() * 18;
      letterTimeout = setTimeout(typeNext, delay);
    } else {
      letterTyping = false;
      // Cursor keeps blinking at end
    }
  }
  typeNext();
}

function replayLetter() {
  if (letterTimeout) clearTimeout(letterTimeout);
  letterTyping = false;
  typeLetter();
}

// ═══════════════════════════════════════════════════════════
// ROMANTIC MUSIC PLAYER
// ═══════════════════════════════════════════════════════════
const PLAYLIST = [
  {
    title: "Soft Hearts",
    artist: "For Nilu 💕",
    emoji: "💗",
    src: "music\\music1.mp3"
  },
  {
    title: "Moonlight Whisper",
    artist: "Romantic Nights 🌙",
    emoji: "🌙",
    src: "music\\music2.mp3"
  },
  {
    title: "Cherry Blossom",
    artist: "Our Spring 🌸",
    emoji: "🌸",
    src: "music\\music3.mp3"
  },
  {
    title: "Forever Yours",
    artist: "Love Notes 💌",
    emoji: "💌",
    src: "music\\music4.mp3"
  },
  {
    title: "Starlit Dance",
    artist: "Ankit & Nilu ✨",
    emoji: "✨",
    src: "music\\music5.mp3"
  },
  {
    title: "Golden Hour",
    artist: "Sweet Moments ☀️",
    emoji: "☀️",
    src: "music\\music6.mp3"
    // src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3"
  }
];

let musicPlaying = false;
let currentTrack = 0;
let isShuffle = false;
let isRepeat = false;
let lastVolume = 0.55;
let seeking = false;

function getAudio() {
  return document.getElementById("bg-music");
}

function formatTime(sec) {
  if (!isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return m + ":" + String(s).padStart(2, "0");
}

function setVolumeUI(vol) {
  const slider = document.getElementById("volume-slider");
  const pct = document.getElementById("vol-pct");
  const icon = document.getElementById("vol-icon");
  const v = Math.round(vol * 100);
  if (slider) {
    slider.value = v;
    slider.style.setProperty("--vol", v + "%");
  }
  if (pct) pct.textContent = v + "%";
  if (icon) {
    if (v === 0) icon.className = "fas fa-volume-mute";
    else if (v < 40) icon.className = "fas fa-volume-down";
    else icon.className = "fas fa-volume-up";
  }
}

function updateNowPlaying() {
  const track = PLAYLIST[currentTrack];
  if (!track) return;
  const title = document.getElementById("player-title");
  const artist = document.getElementById("player-artist");
  const art = document.getElementById("player-art-icon");
  const label = document.getElementById("music-label");
  if (title) title.textContent = track.title;
  if (artist) artist.textContent = track.artist;
  if (art) art.textContent = track.emoji;
  if (label) label.textContent = musicPlaying ? "Playing" : "Music";
  renderPlaylist();
}

function renderPlaylist() {
  const list = document.getElementById("player-playlist");
  const count = document.getElementById("playlist-count");
  if (!list) return;
  if (count) count.textContent = PLAYLIST.length + " songs";

  list.innerHTML = PLAYLIST.map((t, i) => {
    const active = i === currentTrack;
    const numHtml =
      active && musicPlaying
        ? `<span class="playlist-num playing-eq"><i></i><i></i><i></i></span>`
        : `<span class="playlist-num">${i + 1}</span>`;
    return `
      <button type="button" class="playlist-item${active ? " active" : ""}" onclick="playTrack(${i})" aria-label="Play ${t.title}">
        ${numHtml}
        <div class="playlist-info">
          <div class="playlist-title">${t.title}</div>
          <div class="playlist-sub">${t.artist}</div>
        </div>
        <span class="playlist-emoji">${t.emoji}</span>
      </button>`;
  }).join("");
}

function loadTrack(index, autoplay = false) {
  const audio = getAudio();
  if (!audio || !PLAYLIST.length) return;
  currentTrack = ((index % PLAYLIST.length) + PLAYLIST.length) % PLAYLIST.length;
  const track = PLAYLIST[currentTrack];
  audio.src = track.src;
  audio.load();
  updateNowPlaying();
  updateProgress(0, 0);

  if (autoplay) {
    audio.play()
      .then(() => setPlayingState(true))
      .catch(() => setPlayingState(false));
  }
}

function setPlayingState(playing) {
  musicPlaying = playing;
  const navBtn = document.getElementById("music-btn");
  const panel = document.getElementById("player-panel");
  const playIcon = document.getElementById("play-icon");
  const label = document.getElementById("music-label");

  if (navBtn) navBtn.classList.toggle("playing", playing);
  if (panel) panel.classList.toggle("playing", playing);
  if (playIcon) playIcon.className = playing ? "fas fa-pause" : "fas fa-play";
  if (label) label.textContent = playing ? "Playing" : "Music";
  renderPlaylist();
}

function toggleMusic() {
  const audio = getAudio();
  if (!audio) return;

  if (!audio.src) {
    loadTrack(currentTrack, true);
    return;
  }

  if (musicPlaying) {
    audio.pause();
    setPlayingState(false);
  } else {
    audio.play()
      .then(() => setPlayingState(true))
      .catch(() => setPlayingState(false));
  }
}

function playTrack(index) {
  loadTrack(index, true);
}

function nextTrack() {
  if (isShuffle) {
    let n;
    do {
      n = Math.floor(Math.random() * PLAYLIST.length);
    } while (n === currentTrack && PLAYLIST.length > 1);
    loadTrack(n, true);
  } else {
    loadTrack(currentTrack + 1, true);
  }
}

function prevTrack() {
  const audio = getAudio();
  if (audio && audio.currentTime > 3) {
    audio.currentTime = 0;
    return;
  }
  if (isShuffle) {
    nextTrack();
  } else {
    loadTrack(currentTrack - 1, true);
  }
}

function toggleShuffle() {
  isShuffle = !isShuffle;
  const btn = document.getElementById("shuffle-btn");
  if (btn) btn.classList.toggle("active", isShuffle);
}

function toggleRepeat() {
  if (!isRepeat) isRepeat = "all";
  else if (isRepeat === "all") isRepeat = "one";
  else isRepeat = false;

  const btn = document.getElementById("repeat-btn");
  if (btn) {
    btn.classList.toggle("active", !!isRepeat);
    btn.title =
      isRepeat === "one" ? "Repeat one" : isRepeat === "all" ? "Repeat all" : "Repeat off";
    btn.dataset.mode = isRepeat || "off";
  }
}

function toggleMute() {
  const audio = getAudio();
  if (!audio) return;
  if (audio.volume > 0) {
    lastVolume = audio.volume;
    audio.volume = 0;
  } else {
    audio.volume = lastVolume || 0.55;
  }
  setVolumeUI(audio.volume);
}

function updateProgress(current, duration) {
  const fill = document.getElementById("player-progress-fill");
  const thumb = document.getElementById("player-progress-thumb");
  const curEl = document.getElementById("player-current");
  const durEl = document.getElementById("player-duration");
  const pct = duration > 0 ? (current / duration) * 100 : 0;

  if (fill) fill.style.width = pct + "%";
  if (thumb) thumb.style.left = pct + "%";
  if (curEl) curEl.textContent = formatTime(current);
  if (durEl) durEl.textContent = formatTime(duration);
}

function seekFromEvent(e) {
  const audio = getAudio();
  const bar = document.getElementById("player-progress");
  if (!audio || !bar || !audio.duration) return;
  const rect = bar.getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  let ratio = (clientX - rect.left) / rect.width;
  ratio = Math.max(0, Math.min(1, ratio));
  audio.currentTime = ratio * audio.duration;
  updateProgress(audio.currentTime, audio.duration);
}

function togglePlayerPanel() {
  const panel = document.getElementById("player-panel");
  const backdrop = document.getElementById("player-backdrop");
  if (!panel) return;
  const open = !panel.classList.contains("open");
  panel.classList.toggle("open", open);
  panel.setAttribute("aria-hidden", open ? "false" : "true");
  if (backdrop) backdrop.classList.toggle("open", open);
}

function initMusicPlayer() {
  const audio = getAudio();
  if (!audio) return;

  const savedVol = parseFloat(localStorage.getItem("nilukit_vol"));
  audio.volume = isFinite(savedVol) ? savedVol : 0.55;
  lastVolume = audio.volume || 0.55;
  setVolumeUI(audio.volume);

  const slider = document.getElementById("volume-slider");
  if (slider) {
    slider.addEventListener("input", () => {
      const v = Number(slider.value) / 100;
      audio.volume = v;
      if (v > 0) lastVolume = v;
      setVolumeUI(v);
      localStorage.setItem("nilukit_vol", String(v));
    });
  }

  audio.addEventListener("timeupdate", () => {
    if (!seeking) updateProgress(audio.currentTime, audio.duration || 0);
  });
  audio.addEventListener("loadedmetadata", () => {
    updateProgress(audio.currentTime, audio.duration || 0);
  });
  audio.addEventListener("ended", () => {
    if (isRepeat === "one") {
      audio.currentTime = 0;
      audio.play().catch(() => setPlayingState(false));
    } else if (isRepeat === "all" || isShuffle) {
      nextTrack();
    } else if (currentTrack < PLAYLIST.length - 1) {
      nextTrack();
    } else {
      setPlayingState(false);
      updateProgress(0, audio.duration || 0);
    }
  });
  audio.addEventListener("play", () => setPlayingState(true));
  audio.addEventListener("pause", () => {
    if (!audio.seeking) setPlayingState(false);
  });

  const bar = document.getElementById("player-progress");
  if (bar) {
    const onDown = (e) => {
      seeking = true;
      bar.classList.add("dragging");
      seekFromEvent(e);
    };
    const onMove = (e) => {
      if (seeking) seekFromEvent(e);
    };
    const onUp = () => {
      seeking = false;
      bar.classList.remove("dragging");
    };
    bar.addEventListener("mousedown", onDown);
    bar.addEventListener("touchstart", onDown, { passive: true });
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchend", onUp);
  }

  loadTrack(0, false);
  renderPlaylist();
}

// ─── THEME ────────────────────────────────────────────────
function toggleTheme() {
  document.body.classList.toggle("light");
  const icon = document.querySelector(".theme-toggle i");
  const isLight = document.body.classList.contains("light");
  if (icon) {
    icon.className = isLight ? "fas fa-sun" : "fas fa-moon";
  }
  localStorage.setItem("nilukit_theme", isLight ? "light" : "dark");
}

// ─── SCROLL / NAV ─────────────────────────────────────────
function onScroll() {
  const nav = document.querySelector(".nav");
  const topBtn = document.querySelector(".back-to-top");
  const y = window.scrollY;
  if (nav) nav.classList.toggle("scrolled", y > 40);
  if (topBtn) topBtn.classList.toggle("show", y > 500);
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ─── LIGHTBOX (legacy support) ────────────────────────────
function initLightbox() {
  const lb = document.getElementById("lightbox");
  const close = document.getElementById("lightboxClose");
  if (close) {
    close.addEventListener("click", () => {
      if (lb) {
        lb.classList.remove("open");
        lb.setAttribute("aria-hidden", "true");
      }
    });
  }
  if (lb) {
    lb.addEventListener("click", (e) => {
      if (e.target === lb) {
        lb.classList.remove("open");
        lb.setAttribute("aria-hidden", "true");
      }
    });
  }
}

// ─── KEYBOARD ─────────────────────────────────────────────
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeZoom();
    closeHug();
    const chat = document.getElementById("chat-box");
    if (chat && chat.classList.contains("open")) {
      chat.classList.remove("open");
    }
    const panel = document.getElementById("player-panel");
    if (panel && panel.classList.contains("open")) {
      togglePlayerPanel();
    }
  }
  const tag = (e.target && e.target.tagName) || "";
  if (tag === "INPUT" || tag === "TEXTAREA") return;
  if (e.key === "ArrowRight") nextSlide();
  if (e.key === "ArrowLeft") prevSlide();
  if (e.key === " " && document.getElementById("player-panel")?.classList.contains("open")) {
    e.preventDefault();
    toggleMusic();
  }
});

// ─── PARALLAX ORBS (subtle) ───────────────────────────────
function initParallax() {
  const orbs = document.querySelectorAll(".orb");
  if (!orbs.length) return;
  let mx = 0, my = 0, cx = 0, cy = 0;
  window.addEventListener(
    "mousemove",
    (e) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 20;
      my = (e.clientY / window.innerHeight - 0.5) * 20;
    },
    { passive: true }
  );
  function loop() {
    cx += (mx - cx) * 0.05;
    cy += (my - cy) * 0.05;
    orbs.forEach((orb, i) => {
      const f = (i + 1) * 0.4;
      orb.style.marginLeft = cx * f + "px";
      orb.style.marginTop = cy * f + "px";
    });
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

// ─── TYPED HERO EFFECT (optional polish) ──────────────────
function enhanceHero() {
  const title = document.querySelector(".hero-title");
  if (!title) return;
  const em = title.querySelector("em");
  if (em) {
    em.style.backgroundSize = "200% auto";
    em.style.animation = "gradient-shift 4s ease infinite";
  }
}

// ─── CUSTOM ANIMATED CURSOR ────────────────────────────────
const CURSOR_HOVER_SELECTOR =
  "a, button, input, textarea, select, [role='button'], [role='slider'], [onclick]";
const CURSOR_SPARKLES = ["💕", "✨", "💫", "🌸"];

function spawnCursorSpark(layer, x, y) {
  const s = document.createElement("span");
  s.className = "cursor-spark";
  s.textContent = CURSOR_SPARKLES[Math.floor(Math.random() * CURSOR_SPARKLES.length)];
  s.style.left = x + "px";
  s.style.top = y + "px";
  s.style.setProperty("--spark-size", 10 + Math.random() * 6 + "px");
  layer.appendChild(s);
  setTimeout(() => s.remove(), 900);
}

function initCustomCursor() {
  const fineHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!fineHover || reduceMotion) return;

  const dot = document.getElementById("cursor-dot");
  const ring = document.getElementById("cursor-ring");
  const sparkLayer = document.getElementById("cursor-particles");
  if (!dot || !ring) return;

  document.body.classList.add("has-custom-cursor");

  let mx = 0, my = 0;
  let dx = 0, dy = 0, rx = 0, ry = 0;
  let started = false;
  let lastSpark = 0;

  function onMove(e) {
    mx = e.clientX;
    my = e.clientY;
    if (!started) {
      started = true;
      dx = rx = mx;
      dy = ry = my;
      dot.style.opacity = "1";
      ring.style.opacity = "1";
    }
    const now = performance.now();
    if (sparkLayer && now - lastSpark > 110) {
      lastSpark = now;
      spawnCursorSpark(sparkLayer, mx, my);
    }
  }
  function onDown() {
    ring.classList.add("cursor-click");
    dot.classList.add("cursor-click");
  }
  function onUp() {
    ring.classList.remove("cursor-click");
    dot.classList.remove("cursor-click");
  }
  function onOver(e) {
    if (e.target.closest && e.target.closest(CURSOR_HOVER_SELECTOR)) {
      ring.classList.add("cursor-hover");
    }
  }
  function onOut(e) {
    if (e.target.closest && e.target.closest(CURSOR_HOVER_SELECTOR)) {
      ring.classList.remove("cursor-hover");
    }
  }
  function onTouch() {
    document.body.classList.remove("has-custom-cursor");
    dot.style.opacity = "0";
    ring.style.opacity = "0";
    window.removeEventListener("mousemove", onMove);
    window.removeEventListener("mousedown", onDown);
    window.removeEventListener("mouseup", onUp);
    document.removeEventListener("mouseover", onOver);
    document.removeEventListener("mouseout", onOut);
  }

  window.addEventListener("mousemove", onMove, { passive: true });
  window.addEventListener("mousedown", onDown);
  window.addEventListener("mouseup", onUp);
  document.addEventListener("mouseover", onOver, { passive: true });
  document.addEventListener("mouseout", onOut, { passive: true });
  window.addEventListener("touchstart", onTouch, { passive: true, once: true });

  function loop() {
    if (started) {
      dx += (mx - dx) * 0.9;
      dy += (my - dy) * 0.9;
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      dot.style.transform = `translate(${dx}px, ${dy}px) translate(-50%, -50%)`;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

// ─── INIT ─────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  createPwStars();
  initLightbox();
  initParallax();
  enhanceHero();
  initCustomCursor();
  initMusicPlayer();
  initSlideshow();
  resetSlideTimer();
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Restore hug count
  const hugCountEl = document.getElementById("hug-count");
  if (hugCountEl) hugCountEl.textContent = hugCount;

  // Restore reasons seen
  const reasonsSeenEl = document.getElementById("reasons-seen");
  if (reasonsSeenEl) reasonsSeenEl.textContent = reasonsSeen;

  // Init study timer display
  updateStudyDisplay();
  const studySessionsEl = document.getElementById("study-sessions-count");
  if (studySessionsEl) studySessionsEl.textContent = studySessions;

  // Theme restore
  if (localStorage.getItem("nilukit_theme") === "light") {
    document.body.classList.add("light");
    const icon = document.querySelector(".theme-toggle i");
    if (icon) icon.className = "fas fa-sun";
  }

  // Always show password screen on every visit / refresh
  const pw = document.getElementById("pw-input");
  if (pw) {
    setTimeout(() => pw.focus(), 400);
  }
});



// Expose for inline handlers
window.checkPassword = checkPassword;
window.togglePwVisibility = togglePwVisibility;
window.toggleMusic = toggleMusic;
window.togglePlayerPanel = togglePlayerPanel;
window.playTrack = playTrack;
window.nextTrack = nextTrack;
window.prevTrack = prevTrack;
window.toggleShuffle = toggleShuffle;
window.toggleRepeat = toggleRepeat;
window.toggleMute = toggleMute;
window.toggleTheme = toggleTheme;
window.nextSlide = nextSlide;
window.prevSlide = prevSlide;
window.goSlide = goSlide;
window.openZoom = openZoom;
window.openZoomFromPolaroid = openZoomFromPolaroid;
window.closeZoom = closeZoom;
window.scrollToTop = scrollToTop;
window.sendVirtualHug = sendVirtualHug;
window.closeHug = closeHug;
window.showRandomReason = showRandomReason;
window.showNewQuote = showNewQuote;
window.setStudyTime = setStudyTime;
window.startStudyTimer = startStudyTimer;
window.pauseStudyTimer = pauseStudyTimer;
window.resetStudyTimer = resetStudyTimer;
window.replayLetter = replayLetter;
