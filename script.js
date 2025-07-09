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
        let log = JSON.parse(localStorage.getItem("bodyWeightLog") || "[]");
        log.push({ weight, date: new Date().toISOString() });
        localStorage.setItem("bodyWeightLog", JSON.stringify(log));
        alert("Gewicht gespeichert!");
    }
}

function toggleDarkMode() {
    document.body.classList.toggle("dark");
}

// Buttons verbinden
window.onload = () => {
    document.getElementById("nextBtn").onclick = nextExercise;
    document.getElementById("prevBtn").onclick = prevExercise;
};