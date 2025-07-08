const trainingPlans = {
  "1": [
    {name: "Beinpresse", sets: 4, reps: "10–12"},
    {name: "Brustpresse", sets: 4, reps: "10–12"},
    {name: "Schulterpresse", sets: 3, reps: "10–12"},
    {name: "Beinstrecker", sets: 3, reps: "12–15"},
    {name: "Crunchmaschine", sets: 3, reps: "15–20"},
    {name: "Wadenheben (sitzend)", sets: 3, reps: "15"}
  ],
  "2": [
    {name: "Latzug", sets: 4, reps: "10–12"},
    {name: "Ruderzugmaschine", sets: 4, reps: "10–12"},
    {name: "Beinbeuger", sets: 4, reps: "12–15"},
    {name: "Beinpresse (leicht)", sets: 3, reps: "12–15"},
    {name: "Rückenstrecker", sets: 3, reps: "15"},
    {name: "Seitliches Rumpfheben", sets: 3, reps: "20 pro Seite"}
  ]
};

let selectedDay = "";
let currentIndex = 0;
let sessionResults = [];

const setup = document.getElementById('setup');
const checklistSection = document.getElementById('checklist-section');
const checklistList = document.getElementById('exercise-checklist');
const guidedSection = document.getElementById('guided-section');
const summarySection = document.getElementById('summary');
const historySection = document.getElementById('history');
const historyContainer = document.getElementById('history-container');

const exerciseName = document.getElementById('exercise-name');
const exerciseInfo = document.getElementById('exercise-info');
const weightInput = document.getElementById('weight-input');
const btnNext = document.getElementById('btn-next');
const btnPrev = document.getElementById('btn-prev');
const progress = document.getElementById('progress');
const summaryList = document.getElementById('summary-list');
const lastSessionInfo = document.getElementById('last-session-info');

const repsInput = document.createElement('input');
repsInput.type = 'number';
repsInput.id = 'reps-input';
repsInput.placeholder = 'Wiederholungen';
repsInput.min = 1;
weightInput.after(repsInput);

function updateLastSessionDisplay() {
  const info = JSON.parse(localStorage.getItem('trainfit_last') || 'null');
  if (info) {
    const date = new Date(info.timestamp).toLocaleString();
    const label = info.day === "1" ? "Push" : "Pull";
    lastSessionInfo.innerHTML = `Letztes Training: <strong>${label}</strong> am <em>${date}</em>`;
  }
}

updateLastSessionDisplay();

document.querySelectorAll('button[data-day]').forEach(btn => {
  btn.onclick = () => {
    selectedDay = btn.dataset.day;
    checklistList.innerHTML = "";
    trainingPlans[selectedDay].forEach((ex, i) => {
      const li = document.createElement('li');
      const cb = document.createElement('input');
      cb.type = "checkbox";
      cb.id = "cb-" + i;
      const label = document.createElement('label');
      label.htmlFor = cb.id;
      label.textContent = `${ex.name} (${ex.sets}×${ex.reps})`;
      li.appendChild(cb);
      li.appendChild(label);
      checklistList.appendChild(li);
    });
    setup.classList.add('hidden');
    checklistSection.classList.remove('hidden');
  };
});

document.getElementById('start-guided').onclick = () => {
  currentIndex = 0;
  sessionResults = [];
  checklistSection.classList.add('hidden');
  guidedSection.classList.remove('hidden');
  showExercise();
};

function showExercise(){
  const ex = trainingPlans[selectedDay][currentIndex];
  exerciseName.textContent = ex.name;
  exerciseInfo.textContent = `${ex.sets} Sätze × ${ex.reps} Wdh.`;
  progress.textContent = `Übung ${currentIndex+1} von ${trainingPlans[selectedDay].length}`;
  weightInput.value = "";
  repsInput.value = "";
  weightInput.focus();
  btnNext.textContent = currentIndex === trainingPlans[selectedDay].length - 1 ? "Fertig ✓" : "Weiter ✓";
}

btnNext.onclick = () => {
  const weight = weightInput.value.trim();
  const reps = repsInput.value.trim();
  sessionResults.push({
    name: trainingPlans[selectedDay][currentIndex].name,
    weight,
    reps
  });
  document.getElementById('cb-' + currentIndex).checked = true;
  if (currentIndex < trainingPlans[selectedDay].length - 1) {
    currentIndex++;
    showExercise();
  } else {
    guidedSection.classList.add('hidden');
    summarySection.classList.remove('hidden');
    summaryList.innerHTML = "";
    sessionResults.forEach(r => {
      const li = document.createElement('li');
      li.textContent = `${r.name}: ${r.weight || '?'} kg × ${r.reps || '?'} Wdh.`;
      summaryList.appendChild(li);
    });
    const store = JSON.parse(localStorage.getItem('trainfit_sessions') || '[]');
    const newEntry = {
      date: new Date().toISOString(),
      day: selectedDay,
      sessionResults
    };
    store.push(newEntry);
    localStorage.setItem('trainfit_sessions', JSON.stringify(store));
    localStorage.setItem('trainfit_last', JSON.stringify({day: selectedDay, timestamp: newEntry.date}));
    updateLastSessionDisplay();
  }
};

btnPrev.onclick = () => {
  if (currentIndex > 0) {
    currentIndex--;
    showExercise();
  }
};

document.getElementById('btn-finish').onclick = () => {
  summarySection.classList.add('hidden');
  setup.classList.remove('hidden');
};

document.getElementById('btn-history').onclick = () => {
  setup.classList.add('hidden');
  historySection.classList.remove('hidden');
  const store = JSON.parse(localStorage.getItem('trainfit_sessions') || '[]');
  historyContainer.innerHTML = '';
  store.reverse().forEach(session => {
    const date = new Date(session.date).toLocaleString();
    const type = session.day === "1" ? "Push" : "Pull";
    const div = document.createElement('div');
    div.innerHTML = `<strong>${type} am ${date}</strong>`;
    const ul = document.createElement('ul');
    session.sessionResults.forEach(r => {
      const li = document.createElement('li');
      li.textContent = `${r.name}: ${r.weight || '?'} kg × ${r.reps || '?'} Wdh.`;
      ul.appendChild(li);
    });
    div.appendChild(ul);
    historyContainer.appendChild(div);
  });
};

function goBack() {
  checklistSection.classList.add('hidden');
  setup.classList.remove('hidden');
}
function hideHistory() {
  historySection.classList.add('hidden');
  setup.classList.remove('hidden');
}



const chartContainer = document.createElement('div');
chartContainer.innerHTML = '<canvas id="progressChart" width="400" height="300"></canvas>';
historyContainer.before(chartContainer);


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
  historyContainer.before(chartWrapper);

  Object.entries(allExercises).forEach(([exName, data], idx) => {
    const safeId = "chart-" + exName.replace(/[^a-zA-Z0-9]/g, "_");
    const tabButton = document.createElement('button');
    tabButton.textContent = exName;
    tabButton.className = "tab-button";
    tabButton.style.margin = "0 5px 5px 0";
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
          y: {
            beginAtZero: true,
            title: { display: true, text: 'kg' }
          },
          x: {
            title: { display: true, text: 'Datum' }
          }
        }
      }
    });
  });
}
