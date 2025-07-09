function showHistory() {
    const log = JSON.parse(localStorage.getItem("trainingLog") || "[]");
    const weightEntry = JSON.parse(localStorage.getItem("bodyWeightLog") || "[]");

    const byExercise = {};
    log.forEach(entry => {
        if (!byExercise[entry.title]) byExercise[entry.title] = [];
        byExercise[entry.title].push(entry);
    });

    const historyWindow = window.open("", "Trainingsverlauf", "width=400,height=600");
    historyWindow.document.write(\`
        <html><head><title>Verlauf</title>
        <style>body{font-family:sans-serif;padding:10px;} canvas{max-width:100%;}</style>
        </head><body>
        <h2>Trainingsverlauf</h2>
    \`);

    Object.keys(byExercise).forEach(exName => {
        historyWindow.document.write(\`
            <h3>\${exName}</h3>
            <canvas id="\${exName.replace(/\s+/g, '')}Chart" height="200"></canvas>
        \`);
    });

    historyWindow.document.write(\`
        <h2>Körpergewicht Verlauf</h2>
        <canvas id="WeightChart" height="200"></canvas>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <script>
        const dataMap = \${JSON.stringify(byExercise)};
        const weightData = \${JSON.stringify(weightEntry)};
        Object.keys(dataMap).forEach(exName => {
            const ctx = document.getElementById(exName.replace(/\s+/g, '') + "Chart").getContext("2d");
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: dataMap[exName].map(e => new Date(e.date).toLocaleString("de-DE", { hour: '2-digit', minute: '2-digit' })),
                    datasets: [{
                        label: exName + " (kg)",
                        data: dataMap[exName].map(e => e.weight),
                        borderColor: '#007aff',
                        fill: false
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false }
            });
        });

        const weightCtx = document.getElementById("WeightChart").getContext("2d");
        new Chart(weightCtx, {
            type: 'line',
            data: {
                labels: weightData.map(w => new Date(w.date).toLocaleDateString("de-DE")),
                datasets: [{
                    label: "Körpergewicht (kg)",
                    data: weightData.map(w => w.weight),
                    borderColor: '#00cc99',
                    fill: false
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
        </script></body></html>\`);
}