const BOOKS = [
  { id:"b01", title:"The Secret Garden", genre:"nature", color:"#71866a", mark:"❀", spine:"01" },
  { id:"b02", title:"A Year of Flowers", genre:"nature", color:"#a7a16e", mark:"✿", spine:"02" },
  { id:"b03", title:"The Quiet Woods", genre:"nature", color:"#54705c", mark:"♧", spine:"03" },
  { id:"b04", title:"Little Green Things", genre:"nature", color:"#b17b58", mark:"❋", spine:"04" },
  { id:"b05", title:"The Paper Moon", genre:"fiction", color:"#8a718c", mark:"☾", spine:"05" },
  { id:"b06", title:"Letters to June", genre:"fiction", color:"#b56f63", mark:"♡", spine:"06" },
  { id:"b07", title:"The Last Postcard", genre:"fiction", color:"#66818a", mark:"✉", spine:"07" },
  { id:"b08", title:"A Small Wonder", genre:"fiction", color:"#c0955d", mark:"✧", spine:"08" },
  { id:"b09", title:"The Missing Key", genre:"mystery", color:"#59677a", mark:"⚿", spine:"09" },
  { id:"b10", title:"Midnight Notes", genre:"mystery", color:"#78617b", mark:"☽", spine:"10" },
  { id:"b11", title:"The Old Clock", genre:"mystery", color:"#9a7654", mark:"◷", spine:"11" },
  { id:"b12", title:"A Curious Case", genre:"mystery", color:"#657b78", mark:"⌕", spine:"12" }
];

const STORAGE_KEY = "theLittleHours_v1";
const basket = document.getElementById("bookBasket");
const basketCount = document.getElementById("basketCount");
const basketEmpty = document.getElementById("basketEmpty");
const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");
const progressHint = document.getElementById("progressHint");
const journalText = document.getElementById("journalText");
const taskText = document.getElementById("taskText");
const taskCheck = document.getElementById("taskCheck");
const toast = document.getElementById("toast");
const letterOverlay = document.getElementById("letterOverlay");

let state = loadState();
let draggedBookId = null;
let toastTimer;

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && Array.isArray(saved.placed)) return { placed: saved.placed.filter(id => BOOKS.some(b => b.id === id)) };
  } catch (error) { console.warn("Could not load saved game.", error); }
  return { placed: [] };
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function makeBook(book, inShelf = false) {
  const el = document.createElement("div");
  el.className = "book";
  el.draggable = !inShelf;
  el.dataset.bookId = book.id;
  el.style.setProperty("--book-color", book.color);
  el.setAttribute("aria-label", `${book.title}, ${book.genre} book`);
  el.innerHTML = `<span class="book-mark">${book.mark}</span><span class="book-title">${book.title}</span><span class="book-spine">${book.spine}</span>`;

  if (!inShelf) {
    el.addEventListener("dragstart", event => {
      draggedBookId = book.id;
      event.dataTransfer.setData("text/plain", book.id);
      event.dataTransfer.effectAllowed = "move";
      requestAnimationFrame(() => el.classList.add("dragging"));
    });
    el.addEventListener("dragend", () => {
      el.classList.remove("dragging");
      draggedBookId = null;
      document.querySelectorAll(".shelf-slot.drag-over").forEach(slot => slot.classList.remove("drag-over"));
    });
  }
  return el;
}

function render() {
  basket.innerHTML = "";
  document.querySelectorAll(".shelf-slots").forEach(el => el.innerHTML = "");

  const remaining = BOOKS.filter(book => !state.placed.includes(book.id));
  remaining.forEach(book => basket.appendChild(makeBook(book)));

  ["nature", "fiction", "mystery"].forEach(genre => {
    const shelf = document.getElementById(`${genre}Slots`);
    const placedBooks = BOOKS.filter(book => book.genre === genre && state.placed.includes(book.id));
    for (let index = 0; index < 4; index++) {
      const slot = document.createElement("div");
      slot.className = "shelf-slot";
      slot.dataset.genre = genre;
      slot.addEventListener("dragover", event => {
        event.preventDefault();
        slot.classList.add("drag-over");
        event.dataTransfer.dropEffect = "move";
      });
      slot.addEventListener("dragleave", () => slot.classList.remove("drag-over"));
      slot.addEventListener("drop", event => {
        event.preventDefault();
        slot.classList.remove("drag-over");
        const id = event.dataTransfer.getData("text/plain") || draggedBookId;
        placeBook(id, genre);
      });
      if (placedBooks[index]) {
        slot.classList.add("filled");
        slot.appendChild(makeBook(placedBooks[index], true));
      }
      shelf.appendChild(slot);
    }
  });

  updateUI();
}

function placeBook(id, targetGenre) {
  const book = BOOKS.find(item => item.id === id);
  if (!book || state.placed.includes(id)) return;
  if (book.genre !== targetGenre) {
    showToast("Not quite — look at the book's little label. ♡");
    return;
  }
  state.placed.push(id);
  saveState();
  render();
  showToast("A lovely choice. This book is home. ✨");
  if (state.placed.length === BOOKS.length) {
    journalText.textContent = "Every book has found its place. But wait... something is tucked behind the last shelf.";
    taskText.textContent = "All 12 books have found a home.";
    taskCheck.textContent = "✓";
    progressHint.textContent = "The Reading Room has been restored!";
    setTimeout(() => letterOverlay.classList.add("visible"), 850);
    letterOverlay.setAttribute("aria-hidden", "false");
  }
}

function updateUI() {
  const count = state.placed.length;
  const left = BOOKS.length - count;
  basketCount.textContent = left;
  basketEmpty.hidden = left !== 0;
  basket.style.display = left === 0 ? "none" : "grid";
  progressText.textContent = `${count} / ${BOOKS.length}`;
  progressFill.style.width = `${(count / BOOKS.length) * 100}%`;
  if (count === 0) progressHint.textContent = "A few stories are still waiting...";
  else if (count < 5) progressHint.textContent = "The first stories are finding their way.";
  else if (count < 9) progressHint.textContent = "The room is beginning to feel like home.";
  else if (count < 12) progressHint.textContent = "Almost there. One shelf at a time.";
  if (count > 0 && count < 12) {
    journalText.textContent = "One by one, the stories are settling in. The room feels a little warmer already.";
    taskText.textContent = `Find a home for ${left} more ${left === 1 ? "book" : "books"}.`;
    taskCheck.textContent = "◔";
  }
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

document.getElementById("resetButton").addEventListener("click", () => {
  if (!confirm("Start the room over? Your saved progress will be cleared.")) return;
  state.placed = [];
  saveState();
  letterOverlay.classList.remove("visible");
  letterOverlay.setAttribute("aria-hidden", "true");
  journalText.textContent = "The library feels a little sleepy. Perhaps the books are waiting for someone to listen.";
  taskText.textContent = "Find a home for all 12 books.";
  taskCheck.textContent = "○";
  render();
  showToast("A fresh little beginning. ♡");
});

function closeLetter() {
  letterOverlay.classList.remove("visible");
  letterOverlay.setAttribute("aria-hidden", "true");
}
document.getElementById("closeLetter").addEventListener("click", closeLetter);
document.getElementById("keepLetter").addEventListener("click", closeLetter);
letterOverlay.addEventListener("click", event => {
  if (event.target === letterOverlay) closeLetter();
});

let soundOn = false;
document.getElementById("soundButton").addEventListener("click", event => {
  soundOn = !soundOn;
  event.currentTarget.textContent = soundOn ? "♫" : "♪";
  showToast(soundOn ? "A little music would be lovely here. Sound is coming in a future update." : "Quiet, cozy silence. ♡");
});

render();
