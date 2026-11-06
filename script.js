const BOOKS = [
  {id:"b01",title:"The Secret Garden",genre:"nature",color:"#71866a",mark:"❀",spine:"01",height:61,width:21},
  {id:"b02",title:"A Year of Flowers",genre:"nature",color:"#a7a16e",mark:"✿",spine:"02",height:88,width:25},
  {id:"b03",title:"The Quiet Woods",genre:"nature",color:"#54705c",mark:"♧",spine:"03",height:73,width:19},
  {id:"b04",title:"Little Green Things",genre:"nature",color:"#b17b58",mark:"❋",spine:"04",height:95,width:28},
  {id:"b05",title:"Moss & Morning",genre:"nature",color:"#718b78",mark:"✦",spine:"05",height:67,width:23},
  {id:"b06",title:"The Wild Orchard",genre:"nature",color:"#9a7654",mark:"❀",spine:"06",height:82,width:20},
  {id:"b07",title:"A Field Guide",genre:"nature",color:"#647b63",mark:"♧",spine:"07",height:58,width:18},
  {id:"b08",title:"The Fern House",genre:"nature",color:"#82906a",mark:"✿",spine:"08",height:91,width:26},
  {id:"b09",title:"Garden of Small Things",genre:"nature",color:"#b28b67",mark:"❋",spine:"09",height:76,width:22},
  {id:"b10",title:"The Green Hour",genre:"nature",color:"#536d57",mark:"☘",spine:"10",height:64,width:19},
  {id:"b11",title:"Where Lilies Grow",genre:"nature",color:"#9b9b70",mark:"✾",spine:"11",height:86,width:27},
  {id:"b12",title:"A Pocket of Spring",genre:"nature",color:"#bd896b",mark:"❀",spine:"12",height:70,width:21},
  {id:"b13",title:"The Paper Moon",genre:"fiction",color:"#8a718c",mark:"☾",spine:"13",height:85,width:24},
  {id:"b14",title:"Letters to June",genre:"fiction",color:"#b56f63",mark:"♡",spine:"14",height:66,width:20},
  {id:"b15",title:"The Last Postcard",genre:"fiction",color:"#66818a",mark:"✉",spine:"15",height:94,width:27},
  {id:"b16",title:"A Small Wonder",genre:"fiction",color:"#c0955d",mark:"✧",spine:"16",height:72,width:22},
  {id:"b17",title:"The Blue Parlor",genre:"fiction",color:"#687b9b",mark:"✦",spine:"17",height:59,width:18},
  {id:"b18",title:"A Map of Elsewhere",genre:"fiction",color:"#9b6f78",mark:"⌑",spine:"18",height:89,width:25},
  {id:"b19",title:"The Little Circus",genre:"fiction",color:"#bd8b62",mark:"✧",spine:"19",height:76,width:21},
  {id:"b20",title:"When Stars Fell",genre:"fiction",color:"#6c6888",mark:"☾",spine:"20",height:98,width:29},
  {id:"b21",title:"The Velvet Season",genre:"fiction",color:"#a76e62",mark:"♡",spine:"21",height:63,width:19},
  {id:"b22",title:"House of Stories",genre:"fiction",color:"#788b83",mark:"✉",spine:"22",height:81,width:24},
  {id:"b23",title:"The Other Summer",genre:"fiction",color:"#b38a9a",mark:"❀",spine:"23",height:69,width:20},
  {id:"b24",title:"A Thousand Windows",genre:"fiction",color:"#7b718d",mark:"✦",spine:"24",height:92,width:26},
  {id:"b25",title:"The Missing Key",genre:"mystery",color:"#59677a",mark:"⚿",spine:"25",height:92,width:25},
  {id:"b26",title:"Midnight Notes",genre:"mystery",color:"#78617b",mark:"☽",spine:"26",height:68,width:20},
  {id:"b27",title:"The Old Clock",genre:"mystery",color:"#9a7654",mark:"◷",spine:"27",height:82,width:23},
  {id:"b28",title:"A Curious Case",genre:"mystery",color:"#657b78",mark:"⌕",spine:"28",height:59,width:18},
  {id:"b29",title:"The Locked Room",genre:"mystery",color:"#4f6170",mark:"⚿",spine:"29",height:97,width:28},
  {id:"b30",title:"Ink After Dark",genre:"mystery",color:"#76617b",mark:"✦",spine:"30",height:74,width:21},
  {id:"b31",title:"The Silent Witness",genre:"mystery",color:"#8a725e",mark:"◈",spine:"31",height:88,width:25},
  {id:"b32",title:"A Study in Shadows",genre:"mystery",color:"#59636d",mark:"☾",spine:"32",height:64,width:19},
  {id:"b33",title:"The Vanishing Hour",genre:"mystery",color:"#9b795d",mark:"◷",spine:"33",height:79,width:22},
  {id:"b34",title:"The Blackthorn File",genre:"mystery",color:"#5d7467",mark:"⌕",spine:"34",height:94,width:27},
  {id:"b35",title:"Whispers Upstairs",genre:"mystery",color:"#806b83",mark:"✧",spine:"35",height:71,width:20},
  {id:"b36",title:"The Last Alibi",genre:"mystery",color:"#687b88",mark:"⚿",spine:"36",height:86,width:24}
];
const STORAGE_KEY="theLittleHours_v1";
const basket=document.getElementById("bookBasket"), basketCount=document.getElementById("basketCount"), basketEmpty=document.getElementById("basketEmpty");
const progressText=document.getElementById("progressText"), progressFill=document.getElementById("progressFill"), progressHint=document.getElementById("progressHint");
const journalText=document.getElementById("journalText"), taskText=document.getElementById("taskText"), taskCheck=document.getElementById("taskCheck");
const toast=document.getElementById("toast"), letterOverlay=document.getElementById("letterOverlay");
let state=loadState(), draggedBookId=null, toastTimer;

function loadState(){
  try{
    const saved=JSON.parse(localStorage.getItem(STORAGE_KEY));
    if(saved&&Array.isArray(saved.placed)) return {placed:[...new Set(saved.placed)].filter(id=>BOOKS.some(book=>book.id===id))};
  }catch(error){console.warn("Could not load saved game.",error)}
  return {placed:[]};
}
function saveState(){localStorage.setItem(STORAGE_KEY,JSON.stringify(state))}

function makeBook(book,inShelf=false){
  const el=document.createElement("div");
  el.className=inShelf?"book in-shelf":"book"; el.draggable=!inShelf; el.dataset.bookId=book.id;
  el.style.setProperty("--book-color",book.color);
  el.style.setProperty("--book-height",`${book.height}px`);
  el.style.setProperty("--book-width",`${book.width}px`);
  el.setAttribute("aria-label",`${book.title}, ${book.genre} book`);
  el.innerHTML=`<span class="book-mark">${book.mark}</span><span class="book-title">${book.title}</span><span class="book-spine">${book.spine}</span>`;
  if(!inShelf){
    el.addEventListener("dragstart",event=>{
      draggedBookId=book.id; event.dataTransfer.setData("text/plain",book.id); event.dataTransfer.effectAllowed="move";
      requestAnimationFrame(()=>el.classList.add("dragging"));
    });
    el.addEventListener("dragend",()=>{
      el.classList.remove("dragging"); draggedBookId=null;
      document.querySelectorAll(".shelf-slots.drag-over").forEach(s=>s.classList.remove("drag-over"));
    });
  }
  return el;
}
function setupShelfDropZones(){
  ["nature","fiction","mystery"].forEach(genre=>{
    const shelf=document.getElementById(`${genre}Slots`);
    shelf.addEventListener("dragover",event=>{
      event.preventDefault(); shelf.classList.add("drag-over"); event.dataTransfer.dropEffect="move";
    });
    shelf.addEventListener("dragleave",event=>{
      if(!shelf.contains(event.relatedTarget)) shelf.classList.remove("drag-over");
    });
    shelf.addEventListener("drop",event=>{
      event.preventDefault(); shelf.classList.remove("drag-over");
      placeBook(event.dataTransfer.getData("text/plain")||draggedBookId,genre);
    });
  });
}
function render(){
  basket.innerHTML="";
  document.querySelectorAll(".shelf-slots").forEach(s=>s.innerHTML="");
  BOOKS.filter(b=>!state.placed.includes(b.id)).forEach(b=>basket.appendChild(makeBook(b)));
  ["nature","fiction","mystery"].forEach(genre=>{
    const shelf=document.getElementById(`${genre}Slots`);
    BOOKS.filter(b=>b.genre===genre&&state.placed.includes(b.id)).forEach(b=>shelf.appendChild(makeBook(b,true)));
  });
  updateUI();
}
function placeBook(id,genre){
  const book=BOOKS.find(b=>b.id===id);
  if(!book||state.placed.includes(id)) return;
  if(book.genre!==genre){showToast("Not quite — look at the book's little label. ♡");return}
  state.placed.push(id);saveState();render();showToast("A lovely choice. This book is home. ✨");
  if(state.placed.length===BOOKS.length){
    journalText.textContent="Every book has found its place. But wait... something is tucked behind the last shelf.";
    taskText.textContent=`All ${BOOKS.length} books have found a home.`;taskCheck.textContent="✓";
    progressHint.textContent="The Reading Room has been restored!";
    setTimeout(()=>letterOverlay.classList.add("visible"),850);letterOverlay.setAttribute("aria-hidden","false");
  }
}
function updateUI(){
  const count=state.placed.length,left=BOOKS.length-count;
  basketCount.textContent=left;basketEmpty.hidden=left!==0;basket.style.display=left===0?"none":"grid";
  progressText.textContent=`${count} / ${BOOKS.length}`;progressFill.style.width=`${count/BOOKS.length*100}%`;
  if(count===0)progressHint.textContent="A few stories are still waiting...";
  else if(count<10)progressHint.textContent="The first stories are finding their way.";
  else if(count<22)progressHint.textContent="The room is beginning to feel like home.";
  else if(count<BOOKS.length)progressHint.textContent="Almost there. One shelf at a time.";
  if(count>0&&count<BOOKS.length){
    journalText.textContent="One by one, the stories are settling in. The room feels a little warmer already.";
    taskText.textContent=`Find a home for ${left} more ${left===1?"book":"books"}.`;taskCheck.textContent="◔";
  }
}
function showToast(message){
  toast.textContent=message;toast.classList.add("show");clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>toast.classList.remove("show"),2200);
}
document.getElementById("resetButton").addEventListener("click",()=>{
  if(!confirm("Start the room over? Your saved progress will be cleared."))return;
  state.placed=[];saveState();letterOverlay.classList.remove("visible");letterOverlay.setAttribute("aria-hidden","true");
  journalText.textContent="The library feels a little sleepy. Perhaps the books are waiting for someone to listen.";
  taskText.textContent=`Find a home for all ${BOOKS.length} books.`;taskCheck.textContent="○";render();showToast("A fresh little beginning. ♡");
});
function closeLetter(){letterOverlay.classList.remove("visible");letterOverlay.setAttribute("aria-hidden","true")}
document.getElementById("closeLetter").addEventListener("click",closeLetter);
document.getElementById("keepLetter").addEventListener("click",closeLetter);
letterOverlay.addEventListener("click",event=>{if(event.target===letterOverlay)closeLetter()});
let soundOn=false;
document.getElementById("soundButton").addEventListener("click",event=>{
  soundOn=!soundOn;event.currentTarget.textContent=soundOn?"♫":"♪";
  showToast(soundOn?"A little music would be lovely here. Sound is coming in a future update.":"Quiet, cozy silence. ♡");
});
setupShelfDropZones();render();
