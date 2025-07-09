function showHistory() {
    const log = JSON.parse(localStorage.getItem("trainingLog") || "[]");
    const weightEntry = JSON.parse(localStorage.getItem("bodyWeightLog") || "[]");

    const byExercise = {};
    log.forEach(entry => {
        if (!byExercise[entry.title]) byExercise[entry.title] = [];
        byExercise[entry.title].push(entry);
    });

    document.getElementById("start-screen").classList.add("hidden");
    document.getElementById("exercise-screen").classList.add("hidden");
    document.getElementById("history-screen").classList.remove("hidden");

    const chartsDiv = document.getElementById("charts");
    chartsDiv.innerHTML = "";

    Object.keys(byExercise).forEach(exName => {
        const canvasId = exName.replace(/\s+/g, '') + "Chart";
        chartsDiv.innerHTML += \`
            <h3>\${exName}</h3>
            <canvas id="\${canvasId}" height="200"></canvas>
        \`;

        const ctx = document.getElementById(canvasId).getContext("2d");
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: byExercise[exName].map(e => new Date(e.date).toLocaleDateString("de-DE")),
                datasets: [{
                    label: exName + " (kg)",
                    data: byExercise[exName].map(e => e.weight),
                    borderColor: '#007aff',
                    fill: false
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    });

    const weightId = "WeightChart";
    chartsDiv.innerHTML += \`
        <h3>Körpergewicht</h3>
        <canvas id="\${weightId}" height="200"></canvas>
    \`;

    const weightCtx = document.getElementById(weightId).getContext("2d");
    new Chart(weightCtx, {
        type: 'line',
        data: {
            labels: weightEntry.map(w => new Date(w.date).toLocaleDateString("de-DE")),
            datasets: [{
                label: "Gewicht (kg)",
                data: weightEntry.map(w => w.weight),
                borderColor: '#00cc99',
                fill: false
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

function backToStart() {
    document.getElementById("history-screen").classList.add("hidden");
    document.getElementById("start-screen").classList.remove("hidden");
}