
(() => {
  "use strict";

  const welcome = document.getElementById("welcome");
  const cakePage = document.getElementById("cakePage");
  const birthdayWish = document.getElementById("birthdayWish");

  function showPage(page) {
    [welcome, cakePage, birthdayWish].forEach(section => {
      section.classList.toggle("active", section === page);
    });

    window.scrollTo({ top: 0, behavior: "smooth" });

    if (page === birthdayWish) {
      document.body.classList.add("birthday-mode");
      musicStep = 0;
    }
  }

  // WELCOME TO CAKE
  document.getElementById("begin").addEventListener("click", () => {
    showPage(cakePage);
  });

  // ANIMATED KNIFE AND CAKE CUTTING
  const cake = document.getElementById("cake3d");
  const knife = document.getElementById("knife");
  const cutButton = document.getElementById("cutCake");
  const cakeStatus = document.getElementById("cakeStatus");

  let cakeHasBeenCut = false;

  cutButton.addEventListener("click", () => {
    if (cakeHasBeenCut) return;

    cakeHasBeenCut = true;
    cutButton.disabled = true;
    cutButton.textContent = "Cutting your cake...";
    cakeStatus.textContent = "Yay! Cake cut hone wala hai... ♡";

    knife.classList.add("slice-motion");

    window.setTimeout(() => {
      cake.classList.add("cut");
      cakeStatus.textContent =
        "Happy Birthday, Nisha! Cake cut ho gaya! ♡";
      cutButton.textContent = "Birthday wish loading...";
    }, 850);

    window.setTimeout(() => {
      showPage(birthdayWish);
    }, 2900);
  });

  // SOFT ORIGINAL INSTRUMENTAL MUSIC
  // Music starts after the visitor taps the Music on button.

  let audioContext = null;
  let musicTimer = null;
  let musicOn = false;
  let musicStep = 0;

  const musicToggle = document.getElementById("musicToggle");
  const musicLabel = document.getElementById("musicLabel");

  const introNotes = [
    523.25,659.25,783.99,659.25,
    587.33,698.46,880,698.46,
    523.25,659.25,783.99,1046.5
  ];

  const birthdayNotes = [
    523.25,659.25,783.99,1046.5,
    783.99,659.25,587.33,698.46,
    880,1046.5,880,698.46,
    659.25,783.99,1046.5,1174.66
  ];

  function playTone(frequency, duration, when, volume = 0.035, wave = "sine") {
    if (!audioContext || !musicOn) return;

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = wave;
    oscillator.frequency.setValueAtTime(frequency, when);

    gain.gain.setValueAtTime(0.0001, when);
    gain.gain.exponentialRampToValueAtTime(volume, when + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, when + duration);

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.start(when);
    oscillator.stop(when + duration + 0.03);
  }

  function musicBeat() {
    if (!audioContext || !musicOn) return;

    const notes = document.body.classList.contains("birthday-mode")
      ? birthdayNotes
      : introNotes;

    const now = audioContext.currentTime;
    const note = notes[musicStep % notes.length];

    playTone(note, 0.48, now, 0.032, "sine");
    playTone(note / 2, 0.58, now, 0.014, "triangle");

    musicStep++;
  }

  async function startMusic() {
    const AudioContextClass =
      window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) {
      musicLabel.textContent = "Audio unavailable";
      return;
    }

    try {
      if (!audioContext) {
        audioContext = new AudioContextClass();
      }

      await audioContext.resume();

      musicOn = true;
      musicToggle.setAttribute("aria-pressed", "true");
      musicLabel.textContent = "Music on";

      if (musicTimer) {
        window.clearInterval(musicTimer);
      }

      musicBeat();
      musicTimer = window.setInterval(musicBeat, 540);

    } catch (error) {
      console.error("Could not start music:", error);
      musicLabel.textContent = "Try music again";
    }
  }

  function stopMusic() {
    musicOn = false;

    if (musicTimer) {
      window.clearInterval(musicTimer);
    }

    musicTimer = null;

    if (audioContext) {
      audioContext.suspend();
    }

    musicToggle.setAttribute("aria-pressed", "false");
    musicLabel.textContent = "Music off";
  }

  musicToggle.addEventListener("click", () => {
    if (musicOn) {
      stopMusic();
    } else {
      startMusic();
    }
  });

})();
