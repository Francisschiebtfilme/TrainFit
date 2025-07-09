
let exercises = {
  push: ["Bankdrücken", "Schulterdrücken", "Trizepsdrücken"],
  pull: ["Klimmzüge", "Rudern", "Bizepscurls"]
};
let currentTraining = [];
let currentIndex = 0;
let currentType = "";

function startTraining(type) {
  currentType = type;
  currentTraining = exercises[type];
  currentIndex = 0;
  document.getElementById("main-screen").classList.add("hidden");
  document.getElementById("training-screen").classList.remove("hidden");
  showExercise();
}

function showExercise() {
  document.getElementById("exercise-title").textContent = currentTraining[currentIndex];
  document.getElementById("exercise-weight").value = "";
  document.getElementById("exercise-reps").value = "";
}

function nextExercise() {
  saveCurrentExercise();
  if (currentIndex < currentTraining.length - 1) {
    currentIndex++;
    showExercise();
  } else {
    alert("Training abgeschlossen!");
    document.getElementById("training-screen").classList.add("hidden");
    document.getElementById("main-screen").classList.remove("hidden");
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
  if (!weight || !reps) return;

  const logs = JSON.parse(localStorage.getItem("trainingLog") || "[]");
  logs.push({
    date: new Date().toISOString(),
    title: currentTraining[currentIndex],
    weight: parseFloat(weight),
    reps: parseInt(reps),
    type: currentType
  });
  localStorage.setItem("trainingLog", JSON.stringify(logs));
}

function goToWeightEntry() {
  document.getElementById("main-screen").classList.add("hidden");
  document.getElementById("weight-screen").classList.remove("hidden");
}

function saveWeight() {
  const gewicht = document.getElementById("body-weight").value;
  if (!gewicht) return;
  const daten = JSON.parse(localStorage.getItem("bodyWeightLog") || "[]");
  daten.push({ date: new Date().toISOString(), weight: parseFloat(gewicht) });
  localStorage.setItem("bodyWeightLog", JSON.stringify(daten));
  alert("Gewicht gespeichert!");
}

function goToVerlauf() {
  document.getElementById("main-screen").classList.add("hidden");
  document.getElementById("verlauf-screen").classList.remove("hidden");

  const daten = JSON.parse(localStorage.getItem("bodyWeightLog") || "[]");
  const labels = daten.map(d => new Date(d.date).toLocaleDateString());
  const werte = daten.map(d => d.weight);
  new Chart(document.getElementById("weight-chart"), {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Gewicht (kg)',
        data: werte,
        borderColor: 'green',
        fill: false
      }]
    }
  });
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}

function goHome() {
  document.querySelectorAll(".container").forEach(div => div.classList.add("hidden"));
  document.getElementById("main-screen").classList.remove("hidden");
}
