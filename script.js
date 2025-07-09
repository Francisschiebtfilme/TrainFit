document.addEventListener("DOMContentLoaded", function () {

const pushExercises = ["Brustpresse", "Schulterpresse", "Beinpresse"];
const pullExercises = ["Latzug", "Rudern", "Beinbeuger"];
let currentSession = [];

document.getElementById("btn-push").onclick = () => startTraining(pushExercises);
document.getElementById("btn-pull").onclick = () => startTraining(pullExercises);
document.getElementById("btn-history").onclick = showHistory;

function startTraining(exercises) {
  const container = document.getElementById("exercise-container");
  container.innerHTML = "<h3>Training</h3>";
  currentSession = [];

  exercises.forEach(name => {
    const div = document.createElement("div");
    div.innerHTML = `
      <h4>${name}</h4>
      Gewicht (kg): <input type="number" class="input-weight"/><br>
      Wiederholungen: <input type="number" class="input-reps"/><br><br>
    `;
    container.appendChild(div);
  });

  const saveBtn = document.createElement("button");
  saveBtn.textContent = "Training speichern 💾";
  saveBtn.onclick = () => {
    const weights = container.querySelectorAll(".input-weight");
    const reps = container.querySelectorAll(".input-reps");
    exercises.forEach((name, i) => {
      currentSession.push({
        name,
        weight: weights[i].value,
        reps: reps[i].value
      });
    });

    const data = JSON.parse(localStorage.getItem("trainfit_sessions") || "[]");
    data.push({ date: new Date().toISOString(), sessionResults: currentSession });
    localStorage.setItem("trainfit_sessions", JSON.stringify(data));
    alert("Training gespeichert!");
    container.innerHTML = "";
  };

  container.appendChild(saveBtn);
}

function showHistory() {
  document.getElementById("history-container").innerHTML = "";
  generateCharts();
  drawBodyweightChart();
  renderWeightHistory();
}

function generateCharts() {
  const store = JSON.parse(localStorage.getItem('trainfit_sessions') || '[]').reverse();
  const allExercises = {};

  store.forEach(session => {
    session.sessionResults.forEach(entry => {
      const name = entry.name || "Unbekannt";
      if (!allExercises[name]) {
        allExercises[name] = [];
      }
      allExercises[name].push({
        date: session.date,
        weight: parseFloat(entry.weight) || 0,
        reps: parseInt(entry.reps) || 0
      });
    });
  });

  const chartWrapper = document.createElement('div');
  chartWrapper.id = "chart-wrapper";
  const tabsContainer = document.getElementById("exercise-tabs");
  tabsContainer.innerHTML = "";
  chartWrapper.innerHTML = "";
  document.getElementById("history-container").appendChild(chartWrapper);

  Object.entries(allExercises).forEach(([exName, data], idx) => {
    const safeId = "chart-" + exName.replace(/[^a-zA-Z0-9]/g, "_");
    const tabButton = document.createElement('button');
    tabButton.textContent = exName;
    tabButton.className = "tab-button";
    tabButton.onclick = () => {
      document.querySelectorAll(".tab-canvas").forEach(c => c.style.display = "none");
      document.getElementById(safeId + "-container").style.display = "block";
    };
    tabsContainer.appendChild(tabButton);

    const container = document.createElement('div');
    container.className = "tab-canvas";
    container.id = safeId + "-container";
    container.style.display = idx === 0 ? "block" : "none";
    container.innerHTML = `<h4>${exName}</h4><canvas id="${safeId}" height="200"></canvas>`;
    chartWrapper.appendChild(container);

    const labels = data.map(d => new Date(d.date).toLocaleDateString());
    const weights = data.map(d => d.weight);

    new Chart(document.getElementById(safeId), {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: exName + " Gewicht (kg)",
          data: weights,
          borderColor: "blue",
          borderWidth: 2,
          fill: false,
          tension: 0.2
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: true } },
        scales: {
          y: { beginAtZero: true, title: { display: true, text: 'kg' }},
          x: { title: { display: true, text: 'Datum' }}
        }
      }
    });
  });
}

document.getElementById("save-weight").addEventListener("click", () => {
  const value = parseFloat(document.getElementById("bodyweight").value);
  if (!value) return alert("Bitte gültiges Gewicht eingeben.");
  const weightLog = JSON.parse(localStorage.getItem("trainfit_bodyweights") || "[]");
  weightLog.push({ date: new Date().toISOString(), weight: value });
  localStorage.setItem("trainfit_bodyweights", JSON.stringify(weightLog));
  alert("Körpergewicht gespeichert!");
  document.getElementById("bodyweight").value = "";
  renderWeightHistory();
  drawBodyweightChart();
});

function renderWeightHistory() {
  const data = JSON.parse(localStorage.getItem("trainfit_bodyweights") || "[]");
  const history = document.getElementById("weight-history");
  if (!history || !data.length) return;
  const latest = data.slice(-20).reverse().map(e => {
    const d = new Date(e.date);
    return `<li>${d.toLocaleDateString()} ${d.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}: ${e.weight} kg</li>`;
  }).join("");
  history.innerHTML = "<strong>Letzte Einträge:</strong><ul>" + latest + "</ul>";
}

function drawBodyweightChart() {
  const ctx = document.getElementById("bodyweight-chart").getContext("2d");
  const data = JSON.parse(localStorage.getItem("trainfit_bodyweights") || "[]");
  if (!data.length) return;
  const labels = data.map(e => new Date(e.date).toLocaleDateString());
  const weights = data.map(e => e.weight);

  new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: "Körpergewicht (kg)",
        data: weights,
        borderColor: "green",
        borderWidth: 2,
        fill: false,
        tension: 0.2
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: true } },
      scales: {
        y: { beginAtZero: false, title: { display: true, text: 'kg' }},
        x: { title: { display: true, text: 'Datum' }}
      }
    }
  });
}

});