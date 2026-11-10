(() => {
"use strict";
const pages=["welcome","memories","game","final","album"];
function showPage(id){
  pages.forEach(p=>{const el=document.getElementById(p);if(el)el.classList.toggle("active",p===id);});
  window.scrollTo({top:0,behavior:"smooth"});
}
const notes=[
 {title:"Tumhari smile<br>har din special bana deti hai.",copy:"Kuch log apni presence se har jagah khushi bhar dete hain. Tum bhi unhi mein se ho. Hamesha aise hi muskurati rehna aur apni simplicity se sabka dil jeetti rehna.",caption:"Ek pyaari si yaad ♡"},
 {title:"Tumhari saadgi mein<br>ek alag si baat hai.",copy:"Dua hai ki tumhari zindagi mein hamesha khushiyan rahein. Jo bhi sapne dekho, woh poore hon aur har naya din tumhare liye kuch achha lekar aaye.",caption:"Ek khoobsurat pal ♡"},
 {title:"Har tasveer mein<br>ek nayi kahaani hai.",copy:"Ye chhote-chhote moments hi toh yaadon ko khaas banate hain. Aane wala saal tumhare liye aur bhi khoobsurat memories lekar aaye.",caption:"Chhoti chhoti baatein ♡"},
 {title:"Hamesha aisi hi<br>pyaari rehna.",copy:"Apni smile kabhi mat khona. Tumhe life mein dher saara pyaar, sukoon, success aur woh sab mile jo tumhara dil chahta hai.",caption:"Bas tum ♡"}
];
let current=0;
function renderMemory(){
 const n=notes[current];
 document.getElementById("memoryPhoto").src=`photos/nisha-${current+1}.webp`;
 document.getElementById("photoCount").textContent=`0${current+1} / 04`;
 document.getElementById("memoryEyebrow").textContent=`TUMHARE LIYE EK CHHOTI SI BAAT · 0${current+1}`;
 document.getElementById("memoryTitle").innerHTML=n.title;
 document.getElementById("memoryCopy").textContent=n.copy;
 document.getElementById("photoCaption").textContent=n.caption;
 document.getElementById("stepLabel").textContent=`YAAD ${current+1} / 4`;
 document.getElementById("progressFill").style.width=`${(current+1)*25}%`;
 document.getElementById("nextMemory").innerHTML=current===3?"Cake cut karein ♡":"Agli yaad dekho <span>→</span>";
}
document.getElementById("begin").addEventListener("click",()=>{current=0;renderMemory();showPage("memories");});
document.getElementById("nextMemory").addEventListener("click",()=>{if(current<3){current++;renderMemory();}else{showPage("game");}});
document.getElementById("openAlbum").addEventListener("click",()=>showPage("album"));
document.getElementById("backToWish").addEventListener("click",()=>showPage("final"));

// Cake-cutting interaction: tap once to cut the cake, then reveal the birthday wish.
let cakeHasBeenCut=false;
const cake=document.getElementById("cake3d");
const cutButton=document.getElementById("cutCake");
cutButton.addEventListener("click",()=>{
 if(cakeHasBeenCut)return;
 cakeHasBeenCut=true;
 cake.classList.add("cut");
 document.getElementById("cakeStatus").textContent="Yayyy! Cake cut ho gaya! Ab ek pyaari si wish maango, Nisha! ♡";
 cutButton.textContent="Birthday wish dekho ♡";
 cutButton.disabled=true;
 window.setTimeout(()=>showPage("final"),1800);
});

// Original soft instrumental made with Web Audio (no external music file needed).
let audioContext=null,musicTimer=null,musicOn=false,musicStep=0;
const musicToggle=document.getElementById("musicToggle");
const musicLabel=document.getElementById("musicLabel");
function playTone(freq,duration,when,volume=.045,wave="sine"){
 if(!audioContext||!musicOn)return;
 const osc=audioContext.createOscillator(),gain=audioContext.createGain();
 osc.type=wave;osc.frequency.setValueAtTime(freq,when);
 gain.gain.setValueAtTime(.0001,when);
 gain.gain.exponentialRampToValueAtTime(volume,when+.035);
 gain.gain.exponentialRampToValueAtTime(.0001,when+duration);
 osc.connect(gain);gain.connect(audioContext.destination);
 osc.start(when);osc.stop(when+duration+.03);
}
const introNotes=[523.25,659.25,783.99,659.25,587.33,698.46,880,698.46,523.25,659.25,783.99,1046.5];
const birthdayNotes=[523.25,659.25,783.99,1046.5,783.99,659.25,587.33,698.46,880,1046.5,880,698.46,659.25,783.99,1046.5,1174.66];
function musicBeat(){
 if(!audioContext||!musicOn)return;
 const notes=document.body.classList.contains("birthday-mode")?birthdayNotes:introNotes;
 const now=audioContext.currentTime;
 const f=notes[musicStep%notes.length];
 playTone(f,.42,now,.035,"sine");
 playTone(f/2,.55,now,.018,"triangle");
 musicStep++;
}
function startMusic(){
 const AudioCtx=window.AudioContext||window.webkitAudioContext;
 if(!AudioCtx){musicLabel.textContent="Audio unavailable";return;}
 if(!audioContext)audioContext=new AudioCtx();
 audioContext.resume().then(()=>{
  musicOn=true;musicToggle.setAttribute("aria-pressed","true");musicLabel.textContent="Music on";
  if(musicTimer)clearInterval(musicTimer);
  musicBeat();musicTimer=setInterval(musicBeat,520);
 });
}
function stopMusic(){
 musicOn=false;if(musicTimer){clearInterval(musicTimer);musicTimer=null;}
 if(audioContext)audioContext.suspend();
 musicToggle.setAttribute("aria-pressed","false");musicLabel.textContent="Music off";
}
musicToggle.addEventListener("click",()=>{if(musicOn)stopMusic();else startMusic();});
const originalShowPage=showPage;
showPage=function(id){
 if(id==="final"){document.body.classList.add("birthday-mode");}
 originalShowPage(id);
 if(id==="final"&&musicOn){musicStep=0;}
};
let albumIndex=0;const lightbox=document.getElementById("lightbox");
function showLightbox(i){
 albumIndex=(i+4)%4;
 document.getElementById("lightboxImage").src=`photos/nisha-${albumIndex+1}.webp`;
 document.getElementById("lightboxCount").textContent=`0${albumIndex+1} / 04`;
 lightbox.classList.add("open");lightbox.setAttribute("aria-hidden","false");
}
function closeLightbox(){lightbox.classList.remove("open");lightbox.setAttribute("aria-hidden","true");}
document.querySelectorAll(".album-item").forEach(item=>item.addEventListener("click",()=>showLightbox(Number(item.dataset.photo))));
document.getElementById("closeLightbox").addEventListener("click",closeLightbox);
document.getElementById("prevPhoto").addEventListener("click",()=>showLightbox(albumIndex-1));
document.getElementById("nextPhoto").addEventListener("click",()=>showLightbox(albumIndex+1));
lightbox.addEventListener("click",e=>{if(e.target===lightbox)closeLightbox();});
document.addEventListener("keydown",e=>{if(!lightbox.classList.contains("open"))return;if(e.key==="Escape")closeLightbox();if(e.key==="ArrowLeft")showLightbox(albumIndex-1);if(e.key==="ArrowRight")showLightbox(albumIndex+1);});
})();