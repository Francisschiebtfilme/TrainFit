
const pushExercises = ['Beinpresse', 'Brustpresse', 'Beinstrecker', 'Schulterpresse', 'Wadenheben', 'Plank (Sekunden)'];
const pullExercises = ['Rudermaschine', 'Latzug', 'Beinbeuger', 'Rückenstrecker', 'Face Pulls', 'Russian Twist (Wdh)'];

let workoutLog = JSON.parse(localStorage.getItem("trainingsverlauf") || "[]");
let currentWorkout = null;
let currentType = "";
let currentIndex = 0;
let currentEntries = [];

function startTraining(type) {
  currentType = type;
  currentIndex = 0;
  currentEntries = [];
  currentWorkout = {
    type,
    date: new Date().toLocaleString(),
    entries: []
  };
  renderExercise();
}

function renderExercise() {
  const area = document.getElementById("training-area");
  area.innerHTML = "";
  area.style.display = "block";

  const list = currentType === "push" ? pushExercises : pullExercises;
  const exercise = list[currentIndex];
  const safeId = exercise.replace(/\s|\(|\)|\./g, "_");

  const div = document.createElement("div");
  div.innerHTML = `
    <h3>\${exercise}</h3>
    Gewicht (kg): <input type='number' id='weight' step='0.5'><br>
    Wiederholungen: <input type='number' id='reps'><br><br>
  `;

  const prevBtn = document.createElement("button");
  prevBtn.textContent = "⬅️ Zurück";
  prevBtn.onclick = () => {
    saveCurrent(false);
    currentIndex = Math.max(0, currentIndex - 1);
    renderExercise();
  };
  if (currentIndex > 0) div.appendChild(prevBtn);

  const nextBtn = document.createElement("button");
  nextBtn.textContent = currentIndex < list.length - 1 ? "Weiter ➡️" : "Training speichern ✅";
  nextBtn.onclick = () => {
    saveCurrent(true);
    if (currentIndex < list.length - 1) {
      currentIndex++;
      renderExercise();
    } else {
      currentWorkout.entries = currentEntries;
      workoutLog.push(currentWorkout);
      localStorage.setItem("trainingsverlauf", JSON.stringify(workoutLog));
      localStorage.setItem("last", currentWorkout.type);
      alert("Training gespeichert!");
      area.innerHTML = "";
      document.getElementById("last-training").textContent = currentWorkout.date + " (" + currentWorkout.type + ")";
    }
  };
  div.appendChild(nextBtn);

  area.appendChild(div);
}

function saveCurrent(merge) {
  const list = currentType === "push" ? pushExercises : pullExercises;
  const exercise = list[currentIndex];
  const weight = parseFloat(document.getElementById("weight").value);
  const reps = parseInt(document.getElementById("reps").value);
  if (merge) {
    currentEntries[currentIndex] = {
      exercise,
      weight: isNaN(weight) ? 0 : weight,
      reps: isNaN(reps) ? 0 : reps
    };
  }
}


function showHistory() {
  const history = JSON.parse(localStorage.getItem("trainingsverlauf") || "[]");
  if (!history.length) return;

  const tabs = {};
  history.forEach(entry => {
    entry.entries.forEach(ex => {
      if (!tabs[ex.exercise]) tabs[ex.exercise] = [];
      tabs[ex.exercise].push({ date: entry.date, weight: ex.weight });
    });
  });

  const tabArea = document.getElementById("tabs");
  const chartsArea = document.getElementById("charts");
  tabArea.innerHTML = "";
  chartsArea.innerHTML = "";

  Object.keys(tabs).forEach((name, idx) => {
    const btn = document.createElement("button");
    btn.className = "tab";
    btn.textContent = name;
    btn.onclick = () => showChart(name);
    tabArea.appendChild(btn);

    const canvas = document.createElement("canvas");
    canvas.id = "chart_" + name;
    canvas.style.display = idx === 0 ? "block" : "none";
    canvas.height = 150;
    chartsArea.appendChild(canvas);

    new Chart(canvas.getContext("2d"), {
      type: 'line',
      data: {
        labels: tabs[name].map(e => new Date(e.date).toLocaleDateString()),
        datasets: [{
          label: name + " (kg)",
          data: tabs[name].map(e => e.weight),
          borderColor: "blue",
          tension: 0.2
        }]
      }
    });
  });

  document.getElementById("training-history").style.display = "block";
  document.querySelectorAll(".tab")[0]?.classList.add("active");
}

function showChart(name) {
  document.querySelectorAll("canvas[id^='chart_']").forEach(c => c.style.display = "none");
  document.getElementById("chart_" + name).style.display = "block";
  document.querySelectorAll(".tab").forEach(b => b.classList.remove("active"));
  [...document.querySelectorAll(".tab")].find(b => b.textContent === name)?.classList.add("active");
}


function exportToCSV() {
  const log = JSON.parse(localStorage.getItem("trainingsverlauf") || "[]");
  if (!log.length) return;

  let csv = "Datum,Typ,Übung,Gewicht (kg),Wiederholungen\n";
  log.forEach(entry => {
    entry.entries.forEach(ex => {
      csv += `\${entry.date},\${entry.type},\${ex.exercise},\${ex.weight},\${ex.reps}\n`;
    });
  });

  const blob = new Blob([csv], {{ type: "text/csv" }});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "Trainingsverlauf.csv";
  a.click();
  URL.revokeObjectURL(url);
}

// Zielvorgaben pro Übung
const exerciseGoals = {
  "Beinpresse": 200,
  "Brustpresse": 90,
  "Beinstrecker": 70,
  "Schulterpresse": 50,
  "Wadenheben": 120,
  "Plank (Sekunden)": 90,
  "Rudermaschine": 80,
  "Latzug": 85,
  "Beinbeuger": 60,
  "Rückenstrecker": 70,
  "Face Pulls": 30,
  "Russian Twist (Wdh)": 30
};

// Optional: Dark Mode Toggle
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}


function drawWeightChart(filter = 'all') {
  const list = JSON.parse(localStorage.getItem("gewichtshistorie") || "[]");
  if (!list.length) return;

  const now = new Date();
  let filtered = list;

  if (filter === '30') {
    filtered = list.filter(e => (now - new Date(e.date)) / (1000 * 60 * 60 * 24) <= 30);
  } else if (filter === '90') {
    filtered = list.filter(e => (now - new Date(e.date)) / (1000 * 60 * 60 * 24) <= 90);
  }

  const ctx = document.getElementById("weight-chart").getContext("2d");
  if (window.weightChart) window.weightChart.destroy();
  window.weightChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: filtered.map(e => new Date(e.date).toLocaleDateString()),
      datasets: [{
        label: 'Körpergewicht (kg)',
        data: filtered.map(e => e.weight),
        borderColor: "orange",
        fill: false,
        tension: 0.2
      }]
    }
  });
}
