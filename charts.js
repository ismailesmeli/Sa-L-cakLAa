// ZoomPlugin güvenli kayıt (farklı CDN isimleri için)
if (typeof ZoomPlugin !== 'undefined') {
    Chart.register(ZoomPlugin);
} else if (typeof ChartZoom !== 'undefined') {
    Chart.register(ChartZoom);
} else if (window['chartjs-plugin-zoom']) {
    Chart.register(window['chartjs-plugin-zoom']);
} else {
    console.warn("⚠️ ZoomPlugin bulunamadı, zoom özelliği devre dışı.");
}
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

function getThemeColors() {
    const style = getComputedStyle(document.body);
    return {
        primary: style.getPropertyValue('--primary').trim(),
        secondary: style.getPropertyValue('--secondary').trim(),
        success: style.getPropertyValue('--success').trim(),
        danger: style.getPropertyValue('--danger').trim(),
        warning: style.getPropertyValue('--orange').trim(),
        purple: style.getPropertyValue('--purple').trim(),
        text: style.getPropertyValue('--text-secondary').trim(),
        border: style.getPropertyValue('--border').trim()
    };
}


function refreshCharts() {
    if (!window.Chart) return;

    // ============ DÜZELTME 1: Sadece veri olan günleri al ============
    var allDates = Object.keys(dailyEntries);
    var dates = allDates.filter(function(d) {
        var e = dailyEntries[d];
        if (!e) return false;
        var t = getDailyTotal(e);
        return t.calories > 0 || (e.water && e.water > 0) || (e.steps && e.steps > 0) || (e.exerciseDuration && e.exerciseDuration > 0);
    }).sort();

    // Eğer hiç veri yoksa boş grafik gösterme, uyarı göster
    if (dates.length === 0) {
        showEmptyChartMessage();
        return;
    }

    // Kilo ve yağ ölçümü tarihleri
    var measurementDates = Object.keys(bodyMeasurements).sort();
    // Kilo grafiği için tüm tarihleri (veri + ölçüm) birleştir
    var allChartDates = dates.slice();
    measurementDates.forEach(function(d) {
        if (allChartDates.indexOf(d) === -1) allChartDates.push(d);
    });
    allChartDates.sort();

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

    // ============ DÜZELTME 2: Kilo Trendi çift sayım hatası düzeltildi ============
    // Sadece bugünden başlayıp geriye doğru hesaplama yap
    var currentEstWeight = userProfile.weight || 70;

    // İlk olarak verilerin olduğu tarihleri işle
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

        // Gerçek kilo
        var aw = null;
        if (bodyMeasurements[d] && bodyMeasurements[d].weight) {
            aw = bodyMeasurements[d].weight;
        }
        actualWeightData.push(aw);

        // Yağ oranı
        var fp = null;
        if (bodyMeasurements[d] && bodyMeasurements[d].fatPercentage) {
            fp = bodyMeasurements[d].fatPercentage;
        }
        fatPercentData.push(fp);

        // Tahmini kilo (kalori açığına göre)
        if (total.calories > 0) {
            currentEstWeight += (deficit / 7700);
        }
        estWeightData.push(currentEstWeight);
    }

    // Grafik yoksa uyarı ver, varsa destroy et
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

    const themeColors = getThemeColors();

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
        },
        scales: {
            x: { grid: { color: themeColors.border }, ticks: { color: themeColors.text } },
            y: { grid: { color: themeColors.border }, ticks: { color: themeColors.text } }
        },
        color: themeColors.text,
        borderColor: themeColors.border
    };

    const chartBackgroundColorPlugin = {
        id: 'customCanvasBackgroundColor',
        beforeDraw: (chart, args, options) => {
            const { ctx } = chart;
            ctx.save();
            ctx.globalCompositeOperation = 'destination-over';
            ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--surface').trim() || '#ffffff';
            ctx.fillRect(0, 0, chart.width, chart.height);
            ctx.restore();
        }
    };

    weightChart = new Chart(weightCtx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: "Gerçek Kilo",
                data: actualWeightData,
                borderColor: themeColors.purple,
                backgroundColor: themeColors.purple,
                spanGaps: true,
                tension: 0.3,
                pointRadius: 4
            }, {
                label: "Tahmini Kilo",
                data: estWeightData,
                borderColor: themeColors.primary,
                borderDash: [5, 5],
                tension: 0.3,
                pointRadius: 0
            }]
        },
        options: chartOptions,
        plugins: [chartBackgroundColorPlugin]
    });

    fatPercentChart = new Chart(fatPercentCtx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: "Vücut Yağ Oranı (%)",
                data: fatPercentData,
                borderColor: themeColors.success,
                backgroundColor: themeColors.success + "1A",
                fill: true,
                spanGaps: true,
                tension: 0.3
            }]
        },
        options: chartOptions,
        plugins: [chartBackgroundColorPlugin]
    });

    calChart = new Chart(calCtx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: "Alınan (kcal)",
                data: calData,
                borderColor: themeColors.primary,
                backgroundColor: themeColors.primary + "1A",
                fill: true
            }, {
                label: "Yakılan (kcal)",
                data: burnedData,
                borderColor: themeColors.warning,
                backgroundColor: themeColors.warning + "1A",
                fill: true
            }, {
                label: "Açık/Fazla",
                data: deficitData,
                borderColor: themeColors.danger,
                borderDash: [5, 5]
            }]
        },
        options: chartOptions,
        plugins: [chartBackgroundColorPlugin]
    });

    stepChart = new Chart(stepCtx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Adım Sayısı",
                data: stepData,
                backgroundColor: themeColors.success,
                borderRadius: 4
            }]
        },
        options: chartOptions,
        plugins: [chartBackgroundColorPlugin]
    });

    sportDurationChart = new Chart(sportCtx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Spor Süresi (dk)",
                data: sportData,
                backgroundColor: themeColors.purple,
                borderRadius: 4
            }]
        },
        options: chartOptions,
        plugins: [chartBackgroundColorPlugin]
    });

    waterChart = new Chart(waterCtx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Su Tüketimi (ml)",
                data: waterData,
                backgroundColor: themeColors.primary,
                borderRadius: 4
            }]
        },
        options: chartOptions,
        plugins: [chartBackgroundColorPlugin]
    });

    proChart = new Chart(proCtx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{ label: "Protein", data: proData, borderColor: themeColors.success }]
        },
        options: chartOptions,
        plugins: [chartBackgroundColorPlugin]
    });

    carbsChart = new Chart(carbsCtx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{ label: "Karbonhidrat", data: carbsData, borderColor: themeColors.warning }]
        },
        options: chartOptions,
        plugins: [chartBackgroundColorPlugin]
    });

    fatChart = new Chart(fatCtx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{ label: "Yağ", data: fatData, borderColor: themeColors.purple }]
        },
        options: chartOptions,
        plugins: [chartBackgroundColorPlugin]
    });

    var trendData = [];
    for (var t = 0; t < calData.length; t++) {
        if (t < 2) trendData.push(null);
        else trendData.push((calData[t - 2] + calData[t - 1] + calData[t]) / 3);
    }
    trendChart = new Chart(trendCtx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: "Günlük",
                data: calData,
                borderColor: themeColors.primary
            }, {
                label: "Trend",
                data: trendData,
                borderColor: themeColors.warning,
                borderDash: [5, 5]
            }]
        },
        options: chartOptions,
        plugins: [chartBackgroundColorPlugin]
    });

    // ============ ÖZETLERİ GÜNCELLE ============
    updateChartSummaries({
        dates: dates,
        calData: calData,
        burnedData: burnedData,
        proData: proData,
        carbsData: carbsData,
        fatData: fatData,
        stepData: stepData,
        sportData: sportData,
        waterData: waterData,
        actualWeightData: actualWeightData,
        estWeightData: estWeightData,
        fatPercentData: fatPercentData
    });
}

// ============ BOŞ GRAFİK MESAJI ============
function showEmptyChartMessage() {
    var charts = ["weightChart", "fatPercentChart", "calChart", "stepChart", "sportDurationChart", "waterChart", "proteinChart", "carbsChart", "fatChart", "trendChart"];
    charts.forEach(function(id) {
        var canvas = document.getElementById(id);
        if (!canvas) return;
        var ctx = canvas.getContext("2d");
        var w = canvas.width;
        var h = canvas.height;
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-secondary').trim() || '#94a3b8';
        ctx.font = "600 14px Nunito, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("📊 Henüz veri yok", w / 2, h / 2);
    });
} // ==================== GRAFİK ÖZETLERİ ====================
function updateChartSummaries(data) {
    // Kilo özeti
    var weightSummary = document.getElementById("summary-weight");
    if (weightSummary) {
        var firstW = null,
            lastW = null;
        for (var i = 0; i < data.actualWeightData.length; i++) {
            if (data.actualWeightData[i] !== null && data.actualWeightData[i] !== undefined) {
                if (firstW === null) firstW = data.actualWeightData[i];
                lastW = data.actualWeightData[i];
            }
        }
        if (firstW !== null && lastW !== null && firstW !== lastW) {
            var diff = lastW - firstW;
            var icon = diff < 0 ? "📉" : "📈";
            var color = diff < 0 ? "var(--success)" : "var(--danger)";
            weightSummary.innerHTML = '<span style="color:' + color + '; font-weight: 900;">' + icon + ' ' + (diff > 0 ? "+" : "") + diff.toFixed(1) + ' kg</span>';
        } else if (lastW !== null) {
            weightSummary.innerHTML = '<span style="color: var(--text-secondary); font-weight: 700;">' + lastW.toFixed(1) + ' kg</span>';
        } else {
            weightSummary.innerHTML = '<span style="color: var(--text-secondary); font-weight: 700;">Kayıt yok</span>';
        }
    }

    // Yağ oranı özeti
    var fatSummary = document.getElementById("summary-fatPercent");
    if (fatSummary) {
        var firstF = null,
            lastF = null;
        for (var i = 0; i < data.fatPercentData.length; i++) {
            if (data.fatPercentData[i] !== null && data.fatPercentData[i] !== undefined) {
                if (firstF === null) firstF = data.fatPercentData[i];
                lastF = data.fatPercentData[i];
            }
        }
        if (firstF !== null && lastF !== null && firstF !== lastF) {
            var dF = lastF - firstF;
            var iF = dF < 0 ? "📉" : "📈";
            var cF = dF < 0 ? "var(--success)" : "var(--danger)";
            fatSummary.innerHTML = '<span style="color:' + cF + '; font-weight: 900;">' + iF + ' ' + (dF > 0 ? "+" : "") + dF.toFixed(1) + ' %</span>';
        } else if (lastF !== null) {
            fatSummary.innerHTML = '<span style="color: var(--text-secondary); font-weight: 700;">' + lastF.toFixed(1) + ' %</span>';
        } else {
            fatSummary.innerHTML = '<span style="color: var(--text-secondary); font-weight: 700;">Kayıt yok</span>';
        }
    }

    // Kalori özeti
    var calSummary = document.getElementById("summary-cal");
    if (calSummary) {
        var sumCal = 0,
            countCal = 0;
        data.calData.forEach(function(c) {
            if (c > 0) {
                sumCal += c;
                countCal++;
            }
        });
        var avgCal = countCal > 0 ? Math.round(sumCal / countCal) : 0;
        calSummary.innerHTML = '<span style="color: var(--text-secondary); font-weight: 700;">Ort. <b style="color: var(--primary);">' + avgCal + '</b> kcal</span>';
    }

    // Adım özeti
    var stepSummary = document.getElementById("summary-step");
    if (stepSummary) {
        var sumStep = 0,
            countStep = 0;
        data.stepData.forEach(function(s) {
            if (s > 0) {
                sumStep += s;
                countStep++;
            }
        });
        var avgStep = countStep > 0 ? Math.round(sumStep / countStep) : 0;
        stepSummary.innerHTML = '<span style="color: var(--text-secondary); font-weight: 700;">Ort. <b style="color: var(--success);">' + avgStep.toLocaleString('tr-TR') + '</b> adım</span>';
    }

    // Spor süresi özeti
    var sportSummary = document.getElementById("summary-sport");
    if (sportSummary) {
        var sumSport = 0,
            countSport = 0;
        data.sportData.forEach(function(s) {
            if (s > 0) {
                sumSport += s;
                countSport++;
            }
        });
        var avgSport = countSport > 0 ? Math.round(sumSport / countSport) : 0;
        sportSummary.innerHTML = '<span style="color: var(--text-secondary); font-weight: 700;">Ort. <b style="color: var(--purple);">' + avgSport + '</b> dk/gün</span>';
    }

    // Su özeti
    var waterSummary = document.getElementById("summary-water");
    if (waterSummary) {
        var sumW = 0,
            countW = 0;
        data.waterData.forEach(function(w) {
            if (w > 0) {
                sumW += w;
                countW++;
            }
        });
        var avgW = countW > 0 ? Math.round(sumW / countW) : 0;
        waterSummary.innerHTML = '<span style="color: var(--text-secondary); font-weight: 700;">Ort. <b style="color: var(--primary);">' + avgW + '</b> ml</span>';
    }

    // Protein özeti
    var proSummary = document.getElementById("summary-pro");
    if (proSummary) {
        var sumP = 0,
            countP = 0;
        data.proData.forEach(function(p) {
            if (p > 0) {
                sumP += p;
                countP++;
            }
        });
        var avgP = countP > 0 ? Math.round(sumP / countP) : 0;
        proSummary.innerHTML = '<span style="color: var(--text-secondary); font-weight: 700;">Ort. <b style="color: var(--success);">' + avgP + '</b> g/gün</span>';
    }

    // Karb özeti
    var carbSummary = document.getElementById("summary-carbs");
    if (carbSummary) {
        var sumC = 0,
            countC = 0;
        data.carbsData.forEach(function(c) {
            if (c > 0) {
                sumC += c;
                countC++;
            }
        });
        var avgC = countC > 0 ? Math.round(sumC / countC) : 0;
        carbSummary.innerHTML = '<span style="color: var(--text-secondary); font-weight: 700;">Ort. <b style="color: var(--orange);">' + avgC + '</b> g/gün</span>';
    }

    // Yağ özeti
    var fatDataSummary = document.getElementById("summary-fatData");
    if (fatDataSummary) {
        var sumF = 0,
            countFd = 0;
        data.fatData.forEach(function(f) {
            if (f > 0) {
                sumF += f;
                countFd++;
            }
        });
        var avgF = countFd > 0 ? Math.round(sumF / countFd) : 0;
        fatDataSummary.innerHTML = '<span style="color: var(--text-secondary); font-weight: 700;">Ort. <b style="color: var(--purple);">' + avgF + '</b> g/gün</span>';
    }

    // Trend özeti
    var trendSummary = document.getElementById("summary-trend");
    if (trendSummary) {
        var son = data.calData.slice(-3);
        var onceki = data.calData.slice(-6, -3);
        var sonAvg = son.length > 0 ? son.reduce(function(a, b) { return a + b; }, 0) / son.length : 0;
        var oncekiAvg = onceki.length > 0 ? onceki.reduce(function(a, b) { return a + b; }, 0) / onceki.length : 0;
        if (sonAvg > 0 && oncekiAvg > 0) {
            var trendDiff = Math.round(sonAvg - oncekiAvg);
            if (Math.abs(trendDiff) < 50) {
                trendSummary.innerHTML = '<span style="color: var(--text-secondary); font-weight: 700;">↔ Stabil</span>';
            } else if (trendDiff > 0) {
                trendSummary.innerHTML = '<span style="color: var(--danger); font-weight: 900;">📈 +' + trendDiff + ' kcal</span>';
            } else {
                trendSummary.innerHTML = '<span style="color: var(--success); font-weight: 900;">📉 ' + trendDiff + ' kcal</span>';
            }
        } else {
            trendSummary.innerHTML = '<span style="color: var(--text-secondary); font-weight: 700;">Yetersiz veri</span>';
        }
    }
}
