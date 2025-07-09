const trainingsplan = {'1': ['Beinpresse', 'Brustpresse', 'Sitzendes Rudern', 'Schulterpresse', 'Rückenstrecker', 'Bauchmaschine'], '2': ['Beinbeuger', 'Lat Pulldown', 'Schrägbank-Brustpresse', 'Butterfly', 'Beinstrecker', 'Seitheben']};

let currentTag = "";
let currentIndex = 0;

function startTraining(tag) {
  currentTag = tag;
  currentIndex = 0;
  document.getElementById("main-screen").classList.add("hidden");
  document.getElementById("training-screen").classList.remove("hidden");
  showExercise();
}

function showExercise() {
  const title = trainingsplan[currentTag][currentIndex];
  document.getElementById("exercise-title").innerText = title;
  document.getElementById("exercise-weight").value = "";
  document.getElementById("exercise-reps").value = "";
}

function nextExercise() {
  saveCurrentExercise();
  if (currentIndex < trainingsplan[currentTag].length - 1) {
    currentIndex++;
    showExercise();
  } else {
    alert("Training abgeschlossen!");
    goHome();
  }
}

function prevExercise() {
  if (currentIndex > 0) {
    currentIndex--;
    showExercise();
  }
}

function saveCurrentExercise() {
  const weight = document.getElementById("exercise-weight").value;
  const reps = document.getElementById("exercise-reps").value;
  const title = trainingsplan[currentTag][currentIndex];
  if (!weight || !reps) return;

  const log = JSON.parse(localStorage.getItem("trainingLog") || "[]");
  log.push({
    title,
    weight: parseFloat(weight),
    reps: parseInt(reps),
    date: new Date().toISOString()
  });
  localStorage.setItem("trainingLog", JSON.stringify(log));
}

function saveWeight() {
  const gewicht = document.getElementById("body-weight").value;
  if (!gewicht) return;
  const daten = JSON.parse(localStorage.getItem("bodyWeightLog") || "[]");
  daten.push({ date: new Date().toISOString(), weight: parseFloat(gewicht) });
  localStorage.setItem("bodyWeightLog", JSON.stringify(daten));
  alert("Gewicht gespeichert!");
}

function goToWeightEntry() {
  document.getElementById("main-screen").classList.add("hidden");
  document.getElementById("weight-screen").classList.remove("hidden");
}

function goToVerlauf() {
  document.getElementById("main-screen").classList.add("hidden");
  document.getElementById("verlauf-screen").classList.remove("hidden");

  const trainingData = JSON.parse(localStorage.getItem("trainingLog") || "[]");
  const grouped = {};
  trainingData.forEach(entry => {
    if (!grouped[entry.title]) grouped[entry.title] = [];
    grouped[entry.title].push(entry);
  });

  const chartsContainer = document.getElementById("charts-container");
  chartsContainer.innerHTML = "";

  Object.keys(grouped).forEach(title => {
    const canvasId = title.replace(/\s+/g, "") + "-chart";
    chartsContainer.innerHTML += `<h3>${title}</h3><canvas id="${canvasId}" height="200"></canvas>`;
    const ctx = document.getElementById(canvasId).getContext("2d");
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: grouped[title].map(e => new Date(e.date).toLocaleDateString()),
        datasets: [{
          label: title + " Gewicht (kg)",
          data: grouped[title].map(e => e.weight),
          borderColor: '#007aff',
          fill: false
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  });

  const weightData = JSON.parse(localStorage.getItem("bodyWeightLog") || "[]");
  const weightLabels = weightData.map(d => new Date(d.date).toLocaleDateString());
  const weightValues = weightData.map(d => d.weight);
  new Chart(document.getElementById("weight-chart"), {
    type: 'line',
    data: {
      labels: weightLabels,
      datasets: [{
        label: "Körpergewicht (kg)",
        data: weightValues,
        borderColor: "green",
        fill: false
      }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}

function goHome() {
  document.querySelectorAll(".container").forEach(div => div.classList.add("hidden"));
  document.getElementById("main-screen").classList.remove("hidden");
}