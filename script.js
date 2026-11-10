const screens = ["intro","ask","yay","date","finish"];
function show(id){
  screens.forEach(name=>document.getElementById(name).classList.toggle("active",name===id));
  window.scrollTo({top:0,behavior:"smooth"});
}
const toast=document.getElementById("toast");
function notify(message){
  toast.textContent=message;toast.classList.add("show");
  window.setTimeout(()=>toast.classList.remove("show"),1900);
}
document.getElementById("openMail").addEventListener("click",()=>show("ask"));
document.getElementById("yes").addEventListener("click",()=>{show("yay");sprinkle();});
document.getElementById("no").addEventListener("click",()=>{
  notify("Oops! That button seems a little shy 🙈 Try again?"); 
  const button=document.getElementById("no");
  button.textContent="ARE YOU SURE?";
  button.animate([{transform:"translateX(0)"},{transform:"translateX(-5px)"},{transform:"translateX(5px)"},{transform:"translateX(0)"}],{duration:260});
});
document.getElementById("plan").addEventListener("click",()=>show("date"));
document.querySelectorAll(".date-option").forEach(option=>{
  option.addEventListener("click",()=>{
    document.querySelectorAll(".date-option").forEach(item=>item.classList.remove("selected"));
    option.classList.add("selected");
    document.getElementById("chosenDate").textContent=option.dataset.choice;
    window.setTimeout(()=>show("finish"),220);
    sprinkle();
  });
});
document.getElementById("restart").addEventListener("click",()=>{
  document.getElementById("no").textContent="NO...";
  show("intro");
});
function sprinkle(){
  const symbols=["♥","✦","✧","♡"];
  for(let i=0;i<16;i++){
    const bit=document.createElement("span");
    bit.textContent=symbols[Math.floor(Math.random()*symbols.length)];
    Object.assign(bit.style,{position:"fixed",left:Math.random()*100+"vw",top:"-25px",zIndex:9,pointerEvents:"none",color:"#ed4f91",fontSize:(16+Math.random()*18)+"px"});
    document.body.appendChild(bit);
    bit.animate([{transform:"translateY(0) rotate(0)",opacity:1},{transform:`translateY(${innerHeight+70}px) rotate(${Math.random()*260}deg)`,opacity:0}],{duration:1700+Math.random()*900,easing:"ease-in"});
    window.setTimeout(()=>bit.remove(),2800);
  }
}
