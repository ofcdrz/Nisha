const pages=["welcome","memories","game","final","album"];
function showPage(id){pages.forEach(p=>document.getElementById(p).classList.toggle("active",p===id));window.scrollTo({top:0,behavior:"smooth"});}
const photoNotes=[
{title:"Tumhari smile<br>har din special bana deti hai.",copy:"Kuch log apni presence se har jagah khushi bhar dete hain. Tum bhi unhi mein se ho. Hamesha aise hi muskurati rehna aur apni simplicity se sabka dil jeetti rehna.",caption:"Ek pyaari si yaad ♡"},
{title:"Tumhari saadgi mein<br>ek alag si baat hai.",copy:"Dua hai ki tumhari zindagi mein hamesha khushiyan rahein. Jo bhi sapne dekho, woh poore hon aur har naya din tumhare liye kuch achha lekar aaye.",caption:"Ek khoobsurat pal ♡"},
{title:"Har tasveer mein<br>ek nayi kahaani hai.",copy:"Ye chhote-chhote moments hi toh yaadon ko khaas banate hain. Aane wala saal tumhare liye aur bhi khoobsurat memories lekar aaye.",caption:"Chhoti chhoti baatein ♡"},
{title:"Hamesha aisi hi<br>pyaari rehna.",copy:"Apni smile kabhi mat khona. Tumhe life mein dher saara pyaar, sukoon, success aur woh sab mile jo tumhara dil chahta hai.",caption:"Bas tum ♡"}
];
let current=0;
const photo=document.getElementById("memoryPhoto");
function renderMemory(){
 const n=photoNotes[current];photo.src=`photos/nisha-${current+1}.webp`;photo.alt=`Nisha ki yaad ${current+1}`;
 document.getElementById("photoCount").textContent=`0${current+1} / 04`;
 document.getElementById("memoryEyebrow").textContent=`TUMHARE LIYE EK CHHOTI SI BAAT · 0${current+1}`;
 document.getElementById("memoryTitle").innerHTML=n.title;document.getElementById("memoryCopy").textContent=n.copy;
 document.querySelector(".photo-caption").textContent=n.caption;document.getElementById("stepLabel").textContent=`YAAD ${current+1} / 4`;
 document.getElementById("progressFill").style.width=`${(current+1)*25}%`;
 document.getElementById("nextMemory").innerHTML=current===3?"Love game khelo ♡":"Agli yaad dekho <span>→</span>";
}
document.getElementById("begin").addEventListener("click",()=>{current=0;renderMemory();showPage("memories");});
document.getElementById("nextMemory").addEventListener("click",()=>{if(current<3){current++;renderMemory();}else{resetGame();showPage("game");}});
document.getElementById("openAlbum").addEventListener("click",()=>showPage("album"));
document.getElementById("backToWish").addEventListener("click",()=>showPage("final"));

const symbols=["♡","♥","🌷"];
let deck=[],first=null,lock=false,matches=0,turns=0;
const cards=[...document.querySelectorAll(".match-card")];
function resetGame(){
 deck=["♡","♡","♥","♥","🌷","🌷"].sort(()=>Math.random()-.5);
 first=null;lock=false;matches=0;turns=0;
 document.getElementById("score").textContent="0";
 document.getElementById("gameStatus").textContent="Ready? Chalo shuru karein!";
 cards.forEach((card,i)=>{card.textContent="♡";card.className="match-card";card.disabled=false;card.dataset.value=deck[i];});
}
function flipCard(card){
 if(lock||card.classList.contains("matched")||card.classList.contains("revealed"))return;
 card.textContent=card.dataset.value;card.classList.add("revealed");
 if(!first){first=card;return;}
 turns++;lock=true;
 if(first.dataset.value===card.dataset.value){
  first.classList.add("matched");card.classList.add("matched");first.classList.remove("revealed");card.classList.remove("revealed");
  first.disabled=true;card.disabled=true;matches++;document.getElementById("score").textContent=matches;
  first=null;lock=false;
  if(matches===3){document.getElementById("gameStatus").textContent=`Wah Nisha! ${turns} tries mein saare pairs mil gaye. ♡`;setTimeout(()=>showPage("final"),1100);}
  else document.getElementById("gameStatus").textContent="Yay! Ek pair mil gaya. Do aur dhoondo!";
 }else{
  const previous=first;first=null;
  document.getElementById("gameStatus").textContent="Oops! Match nahi hua, phir try karo.";
  setTimeout(()=>{previous.textContent="♡";card.textContent="♡";previous.classList.remove("revealed");card.classList.remove("revealed");lock=false;},750);
 }
}
cards.forEach(card=>card.addEventListener("click",()=>flipCard(card)));
document.getElementById("resetGame").addEventListener("click",resetGame);
resetGame();

let albumIndex=0;const lightbox=document.getElementById("lightbox");
function showLightbox(i){albumIndex=(i+4)%4;document.getElementById("lightboxImage").src=`photos/nisha-${albumIndex+1}.webp`;document.getElementById("lightboxCount").textContent=`0${albumIndex+1} / 04`;lightbox.classList.add("open");lightbox.setAttribute("aria-hidden","false");}
function closeLightbox(){lightbox.classList.remove("open");lightbox.setAttribute("aria-hidden","true");}
document.querySelectorAll(".album-item").forEach(item=>item.addEventListener("click",()=>showLightbox(Number(item.dataset.photo))));
document.getElementById("closeLightbox").addEventListener("click",closeLightbox);
document.getElementById("prevPhoto").addEventListener("click",()=>showLightbox(albumIndex-1));
document.getElementById("nextPhoto").addEventListener("click",()=>showLightbox(albumIndex+1));
lightbox.addEventListener("click",e=>{if(e.target===lightbox)closeLightbox();});
document.addEventListener("keydown",e=>{if(!lightbox.classList.contains("open"))return;if(e.key==="Escape")closeLightbox();if(e.key==="ArrowLeft")showLightbox(albumIndex-1);if(e.key==="ArrowRight")showLightbox(albumIndex+1);});
