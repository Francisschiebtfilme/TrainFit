let currentTraining = [];
let index = 0;

const exercises = {
    push: ["Beinpresse", "Brustpresse", "Plank"],
    pull: ["Latzug", "Rudern", "Beinbeuger"]
};

function startTraining(type) {
    currentTraining = exercises[type];
    index = 0;
    document.getElementById("start-screen").classList.add("hidden");
    document.getElementById("exercise-screen").classList.remove("hidden");
    showExercise();
}

function showExercise() {
    const title = currentTraining[index];
    document.getElementById("exercise-title").innerText = title;
    document.getElementById("exercise-weight").value = "";
    document.getElementById("exercise-reps").value = "";
}

function nextExercise() {
    saveCurrent();
    if (index < currentTraining.length - 1) {
        index++;
        showExercise();
    } else {
        alert("Training abgeschlossen!");
        location.reload();
    }
}

function prevExercise() {
    if (index > 0) {
        index--;
        showExercise();
    }
}

function saveCurrent() {
    const weight = document.getElementById("exercise-weight").value;
    const reps = document.getElementById("exercise-reps").value;
    const title = currentTraining[index];
    const entry = {
        title,
        weight,
        reps,
        date: new Date().toISOString()
    };
    let log = JSON.parse(localStorage.getItem("trainingLog") || "[]");
    log.push(entry);
    localStorage.setItem("trainingLog", JSON.stringify(log));
}

function saveWeight() {
    const weight = document.getElementById("weight").value;
    if (weight) {
        localStorage.setItem("bodyWeight", JSON.stringify({ weight, date: new Date().toISOString() }));
        alert("Gewicht gespeichert!");
    }
}

function showHistory() {
    const log = JSON.parse(localStorage.getItem("trainingLog") || "[]");
    if (log.length === 0) {
        alert("Kein Verlauf gespeichert.");
    } else {
        let last = log.slice(-1)[0];
        alert(`${last.title}: ${last.weight} kg, ${last.reps} Wdh. am ${new Date(last.date).toLocaleString()}`);
    }
}

function toggleDarkMode() {
    document.body.classList.toggle("dark");
}