
const exercises = {
  push: ["Beinpresse", "Brustpresse", "Beinheben"],
  pull: ["Latziehen", "Rudern", "Beincurl"]
};

function startTraining(type) {
  const area = document.getElementById("training-area");
  area.innerHTML = "";
  area.style.display = "block";
  const list = exercises[type].map(name => {
    return \`
      <h4>\${name}</h4>
      Gewicht (kg): <input type="number" id="\${name}_weight"><br>
      Wiederholungen: <input type="number" id="\${name}_reps"><br><br>
    \`;
  }).join("");
  area.innerHTML = list + \`<button onclick="saveTraining('\${type}')">Speichern ✅</button>\`;
}

function saveTraining(type) {
  const data = exercises[type].map(name => ({
    name,
    weight: parseFloat(document.getElementById(name + "_weight").value || 0),
    reps: parseInt(document.getElementById(name + "_reps").value || 0)
  }));
  const log = JSON.parse(localStorage.getItem("trainings") || "[]");
  log.push({ type, date: new Date().toISOString(), data });
  localStorage.setItem("trainings", JSON.stringify(log));
  localStorage.setItem("last", type);
  alert("Training gespeichert!");
  location.reload();
}

function saveBodyweight() {
  const val = parseFloat(document.getElementById("bodyweight").value);
  if (!val) return;
  const log = JSON.parse(localStorage.getItem("weights") || "[]");
  log.push({ date: new Date().toISOString(), kg: val });
  localStorage.setItem("weights", JSON.stringify(log));
  document.getElementById("bodyweight").value = "";
  showWeightHistory();
  drawWeightChart();
}

function showWeightHistory() {
  const data = JSON.parse(localStorage.getItem("weights") || "[]").slice(-20).reverse();
  document.getElementById("weight-history").innerHTML = data.map(e => {
    const d = new Date(e.date);
    return \`<li>\${d.toLocaleDateString()} \${d.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}: \${e.kg} kg</li>\`;
  }).join("");
}

function drawWeightChart() {
  const ctx = document.getElementById("weight-chart").getContext("2d");
  const data = JSON.parse(localStorage.getItem("weights") || "[]");
  if (!data.length) return;
  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.map(d => new Date(d.date).toLocaleDateString()),
      datasets: [{
        label: "Körpergewicht",
        data: data.map(d => d.kg),
        borderColor: "green",
        tension: 0.2
      }]
    }
  });
}

function showHistory() {
  const history = JSON.parse(localStorage.getItem("trainings") || "[]");
  const tabs = {};
  history.forEach(log => {
    log.data.forEach(e => {
      if (!tabs[e.name]) tabs[e.name] = [];
      tabs[e.name].push({ date: log.date, weight: e.weight });
    });
  });

  const tabButtons = Object.keys(tabs).map((name, i) => 
    \`<button class="tab" onclick="showChart('\${name}')">\${name}</button>\`).join("");
  document.getElementById("tabs").innerHTML = tabButtons;

  const chartsDiv = document.getElementById("charts");
  chartsDiv.innerHTML = Object.keys(tabs).map(name => {
    return \`<canvas id="chart_\${name}" style="display:none;" height="150"></canvas>\`;
  }).join("");

  Object.keys(tabs).forEach(name => {
    const ctx = document.getElementById("chart_" + name).getContext("2d");
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: tabs[name].map(e => new Date(e.date).toLocaleDateString()),
        datasets: [{
          label: name + " (kg)",
          data: tabs[name].map(e => e.weight),
          borderColor: "blue",
          tension: 0.2
        }]
      }
    });
  });

  document.getElementById("training-history").style.display = "block";
  showChart(Object.keys(tabs)[0]);

  const list = history.map(log => {
    const d = new Date(log.date);
    return \`<div><strong>\${log.type} am \${d.toLocaleDateString()}, \${d.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</strong><ul>\` +
      log.data.map(e => \`<li>\${e.name}: \${e.weight} kg × \${e.reps} Wdh.</li>\`).join("") + "</ul></div>";
  }).reverse().join("<hr>");
  document.getElementById("log-list").innerHTML = list;
}

function showChart(name) {
  document.querySelectorAll("canvas[id^='chart_']").forEach(c => c.style.display = "none");
  document.getElementById("chart_" + name).style.display = "block";
  document.querySelectorAll(".tab").forEach(b => b.classList.remove("active"));
  Array.from(document.querySelectorAll(".tab")).find(b => b.textContent === name).classList.add("active");
}

document.addEventListener("DOMContentLoaded", () => {
  const last = localStorage.getItem("last");
  document.getElementById("last-training").textContent = last || "nicht bekannt";
  showWeightHistory();
  drawWeightChart();
});
