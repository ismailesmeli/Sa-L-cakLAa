var dailyMacroChart = null;
var calChart = null,
    weightChart = null,
    fatPercentChart = null,
    stepChart = null,
    sportDurationChart = null,
    waterChart = null,
    proChart = null,
    carbsChart = null,
    fatChart = null,
    trendChart = null;

function resetAllChartsZoom() {
    if (weightChart) weightChart.resetZoom();
    if (fatPercentChart) fatPercentChart.resetZoom();
    if (calChart) calChart.resetZoom();
    if (stepChart) stepChart.resetZoom();
    if (sportDurationChart) sportDurationChart.resetZoom();
    if (waterChart) waterChart.resetZoom();
    if (proChart) proChart.resetZoom();
    if (carbsChart) carbsChart.resetZoom();
    if (fatChart) fatChart.resetZoom();
    if (trendChart) trendChart.resetZoom();
}

function refreshCharts() {
    if (!window.Chart) return;

    var dates = Object.keys(dailyEntries).sort();
    var calData = [],
        actualWeightData = [],
        fatPercentData = [],
        estWeightData = [],
        burnedData = [],
        deficitData = [],
        stepData = [],
        sportData = [],
        waterData = [],
        proData = [],
        carbsData = [],
        fatData = [],
        labels = [];

    var totalHistoricalDeficit = 0;
    for (var i = 0; i < dates.length; i++) {
        var total = getDailyTotal(dailyEntries[dates[i]]);
        if (total.calories > 0) {
            totalHistoricalDeficit += (total.calories - getDailyNeeds(dates[i]));
        }
    }
    var currentEstWeight = (userProfile.weight || 70) - (totalHistoricalDeficit / 7700);

    for (var i = 0; i < dates.length; i++) {
        var d = dates[i];
        var entry = dailyEntries[d];
        var total = getDailyTotal(entry);
        var need = getDailyNeeds(d);
        var deficit = total.calories - need;

        calData.push(total.calories);
        burnedData.push(need);
        deficitData.push(deficit);
        stepData.push(entry.steps || 0);
        sportData.push(entry.exerciseDuration || 0);
        waterData.push((entry.water || 0) * 200);
        proData.push(total.protein);
        carbsData.push(total.carbs || 0);
        fatData.push(total.fat || 0);
        labels.push(d.slice(5));

        var aw = null;
        if (bodyMeasurements[d] && bodyMeasurements[d].weight) {
            aw = bodyMeasurements[d].weight;
        }

        var fp = null;
        if (bodyMeasurements[d] && bodyMeasurements[d].fatPercentage) {
            fp = bodyMeasurements[d].fatPercentage;
        }
        fatPercentData.push(fp);
        actualWeightData.push(aw);

        if (total.calories > 0) {
            currentEstWeight += (deficit / 7700);
        }
        estWeightData.push(currentEstWeight);
    }

    if (calChart) calChart.destroy();
    if (fatPercentChart) fatPercentChart.destroy();
    if (weightChart) weightChart.destroy();
    if (stepChart) stepChart.destroy();
    if (sportDurationChart) sportDurationChart.destroy();
    if (waterChart) waterChart.destroy();
    if (proChart) proChart.destroy();
    if (carbsChart) carbsChart.destroy();
    if (fatChart) fatChart.destroy();
    if (trendChart) trendChart.destroy();

    var calCtx = document.getElementById("calChart").getContext("2d");
    var weightCtx = document.getElementById("weightChart").getContext("2d");
    var fatPercentCtx = document.getElementById("fatPercentChart").getContext("2d");
    var stepCtx = document.getElementById("stepChart").getContext("2d");
    var sportCtx = document.getElementById("sportDurationChart").getContext("2d");
    var waterCtx = document.getElementById("waterChart").getContext("2d");
    var proCtx = document.getElementById("proteinChart").getContext("2d");
    var carbsCtx = document.getElementById("carbsChart").getContext("2d");
    var fatCtx = document.getElementById("fatChart").getContext("2d");
    var trendCtx = document.getElementById("trendChart").getContext("2d");

    var chartOptions = {
        plugins: {
            zoom: {
                pan: { enabled: true, mode: 'x' },
                zoom: {
                    wheel: { enabled: true },
                    pinch: { enabled: true },
                    mode: 'x'
                }
            }
        }
    };

    weightChart = new Chart(weightCtx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: "Gerçek Kilo",
                data: actualWeightData,
                borderColor: "#a855f7",
                backgroundColor: "#a855f7",
                spanGaps: true,
                tension: 0.3,
                pointRadius: 4
            }, {
                label: "Tahmini Kilo",
                data: estWeightData,
                borderColor: "#3b82f6",
                borderDash: [5, 5],
                tension: 0.3,
                pointRadius: 0
            }]
        },
        options: chartOptions
    });

    fatPercentChart = new Chart(fatPercentCtx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: "Vücut Yağ Oranı (%)",
                data: fatPercentData,
                borderColor: "#10b981",
                backgroundColor: "rgba(16, 185, 129, 0.1)",
                fill: true,
                spanGaps: true,
                tension: 0.3
            }]
        },
        options: chartOptions
    });

    calChart = new Chart(calCtx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: "Alınan (kcal)",
                data: calData,
                borderColor: "#3b82f6",
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                fill: true
            }, {
                label: "Yakılan (kcal)",
                data: burnedData,
                borderColor: "#f97316",
                backgroundColor: "rgba(249, 115, 22, 0.1)",
                fill: true
            }, {
                label: "Açık/Fazla",
                data: deficitData,
                borderColor: "#ef4444",
                borderDash: [5, 5]
            }]
        },
        options: chartOptions
    });

    stepChart = new Chart(stepCtx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Adım Sayısı",
                data: stepData,
                backgroundColor: "#10b981",
                borderRadius: 4
            }]
        },
        options: chartOptions
    });

    sportDurationChart = new Chart(sportCtx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Spor Süresi (dk)",
                data: sportData,
                backgroundColor: "#a855f7",
                borderRadius: 4
            }]
        },
        options: chartOptions
    });

    waterChart = new Chart(waterCtx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Su Tüketimi (ml)",
                data: waterData,
                backgroundColor: "#3b82f6",
                borderRadius: 4
            }]
        },
        options: chartOptions
    });

    proChart = new Chart(proCtx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{ label: "Protein", data: proData, borderColor: "#10b981" }]
        },
        options: chartOptions
    });

    carbsChart = new Chart(carbsCtx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{ label: "Karbonhidrat", data: carbsData, borderColor: "#f97316" }]
        },
        options: chartOptions
    });

    fatChart = new Chart(fatCtx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{ label: "Yağ", data: fatData, borderColor: "#a855f7" }]
        },
        options: chartOptions
    });

    var trendData = [];
    for (var i = 0; i < calData.length; i++) {
        if (i < 2) trendData.push(null);
        else trendData.push((calData[i - 2] + calData[i - 1] + calData[i]) / 3);
    }
    trendChart = new Chart(trendCtx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: "Günlük",
                data: calData,
                borderColor: "#3b82f6"
            }, {
                label: "Trend",
                data: trendData,
                borderColor: "#f59e0b",
                borderDash: [5, 5]
            }]
        },
        options: chartOptions
    });
}