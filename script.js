
const pushExercises = ['Beinpresse', 'Brustpresse', 'Beinstrecker', 'Schulterpresse', 'Wadenheben', 'Plank (Sekunden)'];
const pullExercises = ['Rudermaschine', 'Latzug', 'Beinbeuger', 'Rückenstrecker', 'Face Pulls', 'Russian Twist (Wdh)'];

let currentWorkout = null;
let workoutLog = JSON.parse(localStorage.getItem("trainingsverlauf") || "[]");

function startTraining(type) {
  const area = document.getElementById("training-area");
  area.style.display = "block";
  area.innerHTML = "";

  const title = document.createElement("h3");
  title.textContent = type === "push" ? "Push-Training" : "Pull-Training";
  area.appendChild(title);

  const form = document.createElement("form");
  form.id = "training-form";

  const selected = type === "push" ? pushExercises : pullExercises;
  currentWorkout = { type, date: new Date().toLocaleString(), entries: [] };

  selected.forEach((exercise) => {
    const div = document.createElement("div");
    const safeId = exercise.replace(/\s|\(|\)|\./g, "_");
    div.innerHTML = `
      <label><strong>${exercise}</strong></label><br>
      Gewicht (kg): <input type='number' name='weight_${safeId}' step='0.5' required><br>
      Wiederholungen: <input type='number' name='reps_${safeId}' required><br><br>
    `;
    form.appendChild(div);
  });

  const saveBtn = document.createElement("button");
  saveBtn.textContent = "Training speichern";
  saveBtn.type = "submit";
  form.appendChild(saveBtn);

  form.onsubmit = (e) => {
    e.preventDefault();
    selected.forEach((exercise) => {
      const safeId = exercise.replace(/\s|\(|\)|\./g, "_");
      const w = form[`weight_${safeId}`].value;
      const r = form[`reps_${safeId}`].value;
      if (w && r) {
        currentWorkout.entries.push({ exercise: exercise, weight: parseFloat(w), reps: parseInt(r) });
      }
    });
    workoutLog.push(currentWorkout);
    localStorage.setItem("trainingsverlauf", JSON.stringify(workoutLog));
    alert("Training gespeichert!");
    area.innerHTML = "";
    document.getElementById("last-training").textContent = currentWorkout.date + " (" + currentWorkout.type + ")";
  };
  area.appendChild(form);
}
