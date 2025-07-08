
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

const exerciseName = document.getElementById('exercise-name');
const exerciseInfo = document.getElementById('exercise-info');
const weightInput = document.getElementById('weight-input');
const btnNext = document.getElementById('btn-next');
const progress = document.getElementById('progress');
const summaryList = document.getElementById('summary-list');

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
  weightInput.focus();
  btnNext.textContent = currentIndex === trainingPlans[selectedDay].length - 1 ? "Fertig ✓" : "Weiter ✓";
}

btnNext.onclick = () => {
  const weight = weightInput.value.trim();
  sessionResults.push({name: trainingPlans[selectedDay][currentIndex].name, weight});
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
      li.textContent = `${r.name}: ${r.weight || '?'} kg`;
      summaryList.appendChild(li);
    });
    const store = JSON.parse(localStorage.getItem('trainfit_sessions') || '[]');
    store.push({date: new Date().toISOString(), sessionResults});
    localStorage.setItem('trainfit_sessions', JSON.stringify(store));
  }
};

document.getElementById('btn-finish').onclick = () => {
  summarySection.classList.add('hidden');
  setup.classList.remove('hidden');
};
