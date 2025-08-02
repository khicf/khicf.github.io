// assets/js/calendar.js

// ---- Config & State ----
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
let currentDate = new Date();
let birthdays = [];
let events = [];
let isDragging = false;
let dragStartDate = null;

// ---- DOM refs ----
const calendarHeader = document.getElementById("calendarHeader");
const contentArea = document.getElementById("contentArea");
const todayBtn = document.getElementById("todayBtn");
const showBdayChk = document.getElementById("showBirthdays");
const showEventsChk = document.getElementById("showEvents");
const modalBg = document.getElementById("modalBg");
const modalDateEl = document.getElementById("modalDate");
const modalListEl = document.getElementById("modalList");
const closeModalBtn = document.getElementById("closeModal");

// ---- Load data & kick off ----
async function loadData() {
  birthdays = await fetch("data/birthdays.json")
    .then((r) => r.json())
    .catch(() => []);
  events = await fetch("data/events.json")
    .then((r) => r.json())
    .catch(() => []);
  attachControls();
  renderCalendar();
  renderNews();
}
loadData();

// ---- Attach UI handlers ----
function attachControls() {
  todayBtn.addEventListener("click", () => {
    currentDate = new Date();
    renderCalendar();
  });
  showBdayChk.addEventListener("change", renderCalendar);
  showEventsChk.addEventListener("change", renderCalendar);
  closeModalBtn.addEventListener(
    "click",
    () => (modalBg.style.display = "none")
  );
}

// ---- Build & display the calendar ----
function renderCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Header with prev/next
  calendarHeader.innerHTML = `
    <button id="prevBtn">&lt;</button>
    <strong>${monthNames[month]} ${year}</strong>
    <button id="nextBtn">&gt;</button>
  `;
  document.getElementById("prevBtn").onclick = () => {
    currentDate.setMonth(month - 1);
    renderCalendar();
  };
  document.getElementById("nextBtn").onclick = () => {
    currentDate.setMonth(month + 1);
    renderCalendar();
  };

  // Clear the grid
  contentArea.innerHTML = "";

  // Day-of-week headers
  ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].forEach((d) => {
    const hd = document.createElement("div");
    hd.classList.add("header");
    hd.textContent = d;
    contentArea.appendChild(hd);
  });

  // Spacer cells for first day offset
  const firstDow = new Date(year, month, 1).getDay();
  for (let i = 0; i < firstDow; i++) {
    const empty = document.createElement("div");
    contentArea.appendChild(empty);
  }

  // Date cells
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayIso = new Date().toISOString().slice(0, 10);

  for (let day = 1; day <= daysInMonth; day++) {
    const cellDate = new Date(year, month, day);
    const iso = cellDate.toISOString().slice(0, 10);
    const isToday = iso === todayIso;

    const cell = document.createElement("div");
    cell.dataset.date = iso;

    if (isToday) cell.classList.add("today");
    cell.innerHTML = `<span class="date-num">${day}</span>`;

    // Dots for birthdays
    if (showBdayChk.checked) {
      birthdays
        .filter((b) => b.date === iso)
        .forEach((_) => {
          const dot = document.createElement("span");
          dot.classList.add("dot");
          cell.appendChild(dot);
        });
    }
    // Dots for events
    if (showEventsChk.checked) {
      events
        .filter((e) => e.date === iso)
        .forEach((_) => {
          const dot = document.createElement("span");
          dot.classList.add("dot");
          dot.style.backgroundColor = "#f09228";
          cell.appendChild(dot);
        });
    }

    // Click to open modal
    cell.style.cursor = "pointer";
    cell.addEventListener("click", () => openModal(iso));
    cell.addEventListener("dblclick", () => {
      const title = prompt(`Enter event title for ${iso}:`);
      if (title) {
        events.push({ date: iso, title });
        renderCalendar();
        renderNews();
      }
    });

    // attach drag handlers:
    cell.addEventListener("mousedown", dragStart);
    cell.addEventListener("mouseenter", dragging);
    cell.addEventListener("mouseup", dragEnd);

    contentArea.appendChild(cell);
  }
}

// ---- Modal logic ----
function openModal(iso) {
  // Title
  const [y, m, d] = iso.split("-");
  modalDateEl.textContent = `${m}/${d}/${y}`;

  // List items
  modalListEl.innerHTML = "";
  if (showBdayChk.checked) {
    birthdays
      .filter((b) => b.date === iso)
      .forEach((b) => {
        const li = document.createElement("li");
        li.textContent = `🎂 ${b.name}`;
        modalListEl.appendChild(li);
      });
  }
  if (showEventsChk.checked) {
    events
      .filter((e) => e.date === iso)
      .forEach((e) => {
        const li = document.createElement("li");
        li.textContent = `📅 ${e.title}`;

        // create delete button
        const del = document.createElement("button");
        del.textContent = "Delete";
        del.style.marginLeft = "8px";
        del.style.fontSize = "0.8rem";
        del.addEventListener("click", () => deleteEvent(e));

        li.appendChild(del);
        modalListEl.appendChild(li);
      });
  }
  if (!modalListEl.childElementCount) {
    const li = document.createElement("li");
    li.textContent = "No items.";
    modalListEl.appendChild(li);
  }

  const modalContent = document.querySelector("#modalBg .modal");
  let addBtn = modalContent.querySelector("#addEventBtn");
  if (!addBtn) {
    addBtn = document.createElement("button");
    addBtn.id = "addEventBtn";
    addBtn.textContent = "Add Event";
    addBtn.style.marginRight = "8px";
    addBtn.addEventListener("click", () => {
      const title = prompt(`New event title for ${modalDateEl.textContent}:`);
      if (title) {
        events.push({ date: iso, title });
        renderCalendar();
        renderNews();
        openModal(iso); // re-open to show the new item
      }
    });
    // put it before the Close button
    modalContent.insertBefore(addBtn, closeModalBtn);
  }

  modalBg.style.display = "flex";
}

// ---- Sidebar “Latest News” ----
function renderNews() {
  const todayIso = new Date().toISOString().slice(0, 10);
  const newsEl = document.getElementById("newsList");
  newsEl.innerHTML = "";
  events
    .filter((e) => e.date >= todayIso)
    .forEach((e) => {
      const [y, m, d] = e.date.split("-");
      const li = document.createElement("li");
      li.textContent = `${m}/${d}/${y} – ${e.title}`;
      newsEl.appendChild(li);
    });
}

// End a drag if mouseup happens anywhere off-cell
document.addEventListener("mouseup", () => {
  if (isDragging) {
    isDragging = false;
    clearSelection();
  }
});

function dragStart(e) {
  e.preventDefault(); // avoid text‐select
  isDragging = true;
  dragStartDate = e.currentTarget.dataset.date;
  clearSelection();
  e.currentTarget.classList.add("selected");
}

function dragging(e) {
  if (!isDragging) return;
  const currentDate = e.currentTarget.dataset.date;
  highlightRange(dragStartDate, currentDate);
}

function dragEnd(e) {
  if (!isDragging) return;
  isDragging = false;
  const endDate = e.currentTarget.dataset.date;
  const title = prompt(
    `Enter a title for your new event from ${dragStartDate} to ${endDate}:`
  );
  if (title) {
    addEventRange(dragStartDate, endDate, title);
    renderCalendar();
    renderNews();
  }
  clearSelection();
}

// Helpers
function highlightRange(startIso, endIso) {
  clearSelection();
  // ensure start ≤ end
  const [start, end] =
    startIso <= endIso ? [startIso, endIso] : [endIso, startIso];
  contentArea.querySelectorAll("div[data-date]").forEach((cell) => {
    const d = cell.dataset.date;
    if (d >= start && d <= end) {
      cell.classList.add("selected");
    }
  });
}

function clearSelection() {
  contentArea
    .querySelectorAll(".selected")
    .forEach((c) => c.classList.remove("selected"));
}

function addEventRange(startIso, endIso, title) {
  // ensure correct order
  let [start, end] =
    startIso <= endIso
      ? [new Date(startIso), new Date(endIso)]
      : [new Date(endIso), new Date(startIso)];

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const iso = d.toISOString().slice(0, 10);
    events.push({ date: iso, title });
  }
}

/**
 * Remove an event object from the array, re-draw, and close the modal.
 */
function deleteEvent(eventObj) {
  // Filter it out
  events = events.filter((e) => e !== eventObj);
  // Refresh
  renderCalendar();
  renderNews();
  // Close modal
  modalBg.style.display = "none";
}
