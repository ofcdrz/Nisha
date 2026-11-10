const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const maybeYes = document.getElementById("maybeYes");
const stillNo = document.getElementById("stillNo");
const loveBtn = document.getElementById("loveBtn");
const musicToggle = document.getElementById("musicToggle");
const toast = document.getElementById("toast");

function openModal(id) {
  const modal = document.getElementById(id);
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
}
function closeModal(id) {
  const modal = document.getElementById(id);
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}
document.querySelectorAll("[data-close]").forEach(button => {
  button.addEventListener("click", () => closeModal(button.dataset.close));
});
document.querySelectorAll(".modal").forEach(modal => {
  modal.addEventListener("click", event => {
    if (event.target === modal) closeModal(modal.id);
  });
});
yesBtn.addEventListener("click", () => {
  openModal("yesModal");
  burstHearts(34);
});
noBtn.addEventListener("click", () => openModal("noModal"));
maybeYes.addEventListener("click", () => {
  closeModal("noModal");
  openModal("yesModal");
  burstHearts(34);
});
stillNo.addEventListener("click", () => {
  closeModal("noModal");
  showToast("Thank you for being honest. ❤️");
});
loveBtn.addEventListener("click", () => {
  closeModal("yesModal");
  openModal("loveModal");
  burstHearts(50);
});

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2600);
}

const heartLayer = document.getElementById("floatingHearts");
function makeHeart() {
  const heart = document.createElement("span");
  heart.className = "float-heart";
  heart.textContent = ["♥", "♡", "❤", "💕"][Math.floor(Math.random() * 4)];
  heart.style.left = `${Math.random() * 100}%`;
  heart.style.fontSize = `${12 + Math.random() * 23}px`;
  heart.style.animationDuration = `${7 + Math.random() * 7}s`;
  heartLayer.appendChild(heart);
  window.setTimeout(() => heart.remove(), 14500);
}
function burstHearts(count) {
  for (let i = 0; i < count; i++) {
    window.setTimeout(makeHeart, i * 55);
  }
}
window.setInterval(makeHeart, 850);

// A gentle synthesized chime; no external audio file is required.
let audioContext = null;
let musicOn = false;
let chimeTimer = null;
function playChime() {
  if (!musicOn) return;
  try {
    audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
    const now = audioContext.currentTime;
    [523.25, 659.25, 783.99].forEach((frequency, index) => {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, now + index * .18);
      gain.gain.exponentialRampToValueAtTime(.035, now + index * .18 + .04);
      gain.gain.exponentialRampToValueAtTime(.0001, now + index * .18 + .55);
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start(now + index * .18);
      oscillator.stop(now + index * .18 + .6);
    });
  } catch (error) {
    showToast("Audio is not available in this browser.");
  }
}
musicToggle.addEventListener("click", async () => {
  musicOn = !musicOn;
  musicToggle.setAttribute("aria-pressed", String(musicOn));
  if (musicOn) {
    try {
      audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
      await audioContext.resume();
      playChime();
      chimeTimer = window.setInterval(playChime, 5200);
      showToast("A little music for this moment. ♫");
    } catch (error) {
      musicOn = false;
      musicToggle.setAttribute("aria-pressed", "false");
      showToast("Audio could not start in this browser.");
    }
  } else {
    window.clearInterval(chimeTimer);
    showToast("Music turned off.");
  }
});
