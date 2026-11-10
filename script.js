const pages=["welcome","memories","game","final","album"];
function showPage(id){pages.forEach(p=>document.getElementById(p).classList.toggle("active",p===id));window.scrollTo({top:0,behavior:"smooth"});}
const photoNotes=[
  {title:"Your smile makes<br>ordinary days special.",copy:"Some people bring a little extra warmth wherever they go. You have that kind of magic. Keep smiling and being your lovely self.",caption:"A moment worth keeping ♡"},
  {title:"A little grace,<br>a lot of charm.",copy:"May you always see the beauty in yourself that others get to see. You deserve all the kindness, happiness and good things life can offer.",caption:"A beautiful smile ♡"},
  {title:"The little details<br>make you, you.",copy:"Every picture holds a different little moment. I hope the year ahead gives you a hundred more reasons to smile and memories to treasure.",caption:"Little details, lovely memories ♡"},
  {title:"Stay just as lovely<br>as you are.",copy:"Never stop being curious, kind and wonderfully yourself. May your dreams grow bigger and your worries feel smaller with every passing day.",caption:"Simply you ♡"}
];
let current=0;
const photo=document.getElementById("memoryPhoto");
function renderMemory(){
  const n=photoNotes[current];
  photo.src=`photos/nisha-${current+1}.webp`;
  photo.alt=`Nisha — memory ${current+1}`;
  document.getElementById("photoCount").textContent=`0${current+1} / 04`;
  document.getElementById("memoryEyebrow").textContent=`A LITTLE NOTE FOR YOU · 0${current+1}`;
  document.getElementById("memoryTitle").innerHTML=n.title;
  document.getElementById("memoryCopy").textContent=n.copy;
  document.querySelector(".photo-caption").textContent=n.caption;
  document.getElementById("stepLabel").textContent=`MEMORY ${current+1} OF 4`;
  document.getElementById("progressFill").style.width=`${(current+1)*25}%`;
  document.getElementById("nextMemory").innerHTML=current===3?"Play a tiny game ♡":"Next memory <span>→</span>";
}
document.getElementById("begin").addEventListener("click",()=>{current=0;renderMemory();showPage("memories");});
document.getElementById("nextMemory").addEventListener("click",()=>{if(current<3){current++;renderMemory();}else{resetGame();showPage("game");}});
document.getElementById("openAlbum").addEventListener("click",()=>showPage("album"));
document.getElementById("backToWish").addEventListener("click",()=>showPage("final"));

let score=0,gameTimer=null,gameRunning=false;
const area=document.getElementById("playArea");
function resetGame(){
  clearInterval(gameTimer);gameRunning=false;score=0;
  document.getElementById("score").textContent="0";
  document.getElementById("gameStatus").textContent="Ready when you are!";
  document.getElementById("gameHint").style.display="grid";
  area.querySelectorAll(".catch-heart").forEach(x=>x.remove());
  document.getElementById("startGame").textContent="Start game";
}
function spawnHeart(){
  if(!gameRunning)return;
  const heart=document.createElement("button");
  heart.className="catch-heart";heart.type="button";heart.textContent=["♥","♡","❤"][Math.floor(Math.random()*3)];
  heart.setAttribute("aria-label","Catch heart");
  const maxX=Math.max(10,area.clientWidth-45),maxY=Math.max(10,area.clientHeight-50);
  heart.style.left=(8+Math.random()*Math.max(10,maxX-8))+"px";
  heart.style.top=(8+Math.random()*Math.max(10,maxY-8))+"px";
  heart.style.animationDelay=(Math.random()*.7)+"s";
  heart.addEventListener("click",()=>{
    if(!gameRunning)return;
    score++;document.getElementById("score").textContent=score;
    heart.remove();
    if(score>=10){
      gameRunning=false;clearInterval(gameTimer);
      area.querySelectorAll(".catch-heart").forEach(x=>x.remove());
      document.getElementById("gameHint").textContent="You collected all the love! ♡";
      document.getElementById("gameHint").style.display="grid";
      document.getElementById("gameStatus").textContent="You did it! Happy birthday, Nisha!";
      document.getElementById("startGame").textContent="See your birthday wish";
      document.getElementById("startGame").onclick=()=>showPage("final");
    }else spawnHeart();
  });
  area.appendChild(heart);
  window.setTimeout(()=>heart.remove(),2600);
}
document.getElementById("startGame").addEventListener("click",()=>{
  if(score>=10){showPage("final");return;}
  if(gameRunning)return;
  gameRunning=true;document.getElementById("gameHint").style.display="none";
  document.getElementById("gameStatus").textContent="Catch 10 hearts!";
  document.getElementById("startGame").textContent="Playing…";
  for(let i=0;i<3;i++)spawnHeart();
  gameTimer=window.setInterval(()=>{if(gameRunning&&area.querySelectorAll(".catch-heart").length<4)spawnHeart();},650);
});

let albumIndex=0;
const lightbox=document.getElementById("lightbox");
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
document.getElementById("startGame").onclick=null;
