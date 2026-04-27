// ==================== UYGULAMA ARAYÜZ (UI) ve MANTIK ====================

function showNotification(message) {
    var notif = document.createElement("div");
    notif.className = "notification";
    notif.innerHTML = message;
    document.body.appendChild(notif);
    setTimeout(function() {
        notif.remove();
    }, 3000);
}

function updateUI() {
    var entry = dailyEntries[currentDate];
    if (!entry) {
        entry = getEmptyMeals();
        dailyEntries[currentDate] = entry;
    }

    document.getElementById("morningCal").value = entry.morning ? entry.morning.cal : 0;
    document.getElementById("morningProtein").value = entry.morning ? entry.morning.protein : 0;
    document.getElementById("morningCarbs").value = entry.morning ? (entry.morning.carbs || 0) : 0;
    document.getElementById("morningFat").value = entry.morning ? (entry.morning.fat || 0) : 0;

    document.getElementById("noonCal").value = entry.noon ? entry.noon.cal : 0;
    document.getElementById("noonProtein").value = entry.noon ? entry.noon.protein : 0;
    document.getElementById("noonCarbs").value = entry.noon ? (entry.noon.carbs || 0) : 0;
    document.getElementById("noonFat").value = entry.noon ? (entry.noon.fat || 0) : 0;

    document.getElementById("eveningCal").value = entry.evening ? entry.evening.cal : 0;
    document.getElementById("eveningProtein").value = entry.evening ? entry.evening.protein : 0;
    document.getElementById("eveningCarbs").value = entry.evening ? (entry.evening.carbs || 0) : 0;
    document.getElementById("eveningFat").value = entry.evening ? (entry.evening.fat || 0) : 0;

    document.getElementById("snackCal").value = entry.snack ? entry.snack.cal : 0;
    document.getElementById("snackProtein").value = entry.snack ? entry.snack.protein : 0;
    document.getElementById("snackCarbs").value = entry.snack ? (entry.snack.carbs || 0) : 0;
    document.getElementById("snackFat").value = entry.snack ? (entry.snack.fat || 0) : 0;

    document.getElementById("activitySelect").value = entry.activity || 1.375;
    document.getElementById("exerciseCal").value = entry.exercise || 0;
    if (document.getElementById("exerciseDurationTotal")) document.getElementById("exerciseDurationTotal").value = entry.exerciseDuration || "";
    if (document.getElementById("stepCount")) document.getElementById("stepCount").value = entry.steps || "";
    document.getElementById("currentDate").innerHTML = currentDate.replace(/-/g, "/");
    document.getElementById("waterCount").innerText = entry.water || 0;
    document.getElementById("waterMl").innerText = (entry.water || 0) * 200;

    var morningCal = entry.morning ? entry.morning.cal : 0;
    var morningProt = entry.morning ? entry.morning.protein : 0;
    var morningC = entry.morning ? (entry.morning.carbs || 0) : 0;
    var morningF = entry.morning ? (entry.morning.fat || 0) : 0;
    var noonCal = entry.noon ? entry.noon.cal : 0;
    var noonProt = entry.noon ? entry.noon.protein : 0;
    var noonC = entry.noon ? (entry.noon.carbs || 0) : 0;
    var noonF = entry.noon ? (entry.noon.fat || 0) : 0;
    var eveningCal = entry.evening ? entry.evening.cal : 0;
    var eveningProt = entry.evening ? entry.evening.protein : 0;
    var eveningC = entry.evening ? (entry.evening.carbs || 0) : 0;
    var eveningF = entry.evening ? (entry.evening.fat || 0) : 0;
    var snackCal = entry.snack ? entry.snack.cal : 0;
    var snackProt = entry.snack ? entry.snack.protein : 0;
    var snackC = entry.snack ? (entry.snack.carbs || 0) : 0;
    var snackF = entry.snack ? (entry.snack.fat || 0) : 0;

    document.getElementById("morningTotal").innerHTML = "🔥 " + morningCal + " kcal | 🥩 " + morningProt.toFixed(1) + "g | 🍞 " + morningC.toFixed(1) + "g | 🥑 " + morningF.toFixed(1) + "g";
    document.getElementById("noonTotal").innerHTML = "🔥 " + noonCal + " kcal | 🥩 " + noonProt.toFixed(1) + "g | 🍞 " + noonC.toFixed(1) + "g | 🥑 " + noonF.toFixed(1) + "g";
    document.getElementById("eveningTotal").innerHTML = "🔥 " + eveningCal + " kcal | 🥩 " + eveningProt.toFixed(1) + "g | 🍞 " + eveningC.toFixed(1) + "g | 🥑 " + eveningF.toFixed(1) + "g";
    document.getElementById("snackTotal").innerHTML = "🔥 " + snackCal + " kcal | 🥩 " + snackProt.toFixed(1) + "g | 🍞 " + snackC.toFixed(1) + "g | 🥑 " + snackF.toFixed(1) + "g";

    var total = getDailyTotal(entry);
    document.getElementById("totalCalories").innerText = total.calories;
    document.getElementById("totalProtein").innerText = total.protein.toFixed(1);
    document.getElementById("totalCarbs").innerText = total.carbs.toFixed(1);
    document.getElementById("totalFat").innerText = total.fat.toFixed(1);

    var need = getDailyNeeds(currentDate);
    var deficit = total.calories - need;
    document.getElementById("dailyNeedDisplay").innerHTML = "Hedef: " + need + " kcal";
    var ds = document.getElementById("deficitDisplay");
    if (deficit > 0) {
        if (deficit > 9999) deficit = 9999;
        ds.innerHTML = "+" + deficit + " kcal (Fazla)";
        ds.className = "stat-value surplus";
    } else {
        ds.innerHTML = deficit + " kcal (Açık)";
        ds.className = "stat-value deficit";
    }

    var fatPercent = bodyMeasurements[currentDate] ? bodyMeasurements[currentDate].fatPercentage : null;
    var fatPercentEl = document.getElementById("fatPercentVal");
    if (fatPercent) {
        fatPercentEl.innerHTML = fatPercent.toFixed(1) + " %";
    }

    if (window.Chart) {
        if (dailyMacroChart) {
            dailyMacroChart.destroy();
        }

        var macroCtx = document.getElementById("dailyMacroChart").getContext("2d");
        var hasData = total.protein > 0 || total.carbs > 0 || total.fat > 0;

        dailyMacroChart = new Chart(macroCtx, {
            type: "doughnut",
            data: {
                labels: ["Protein (g)", "Karb (g)", "Yağ (g)"],
                datasets: [{
                    data: hasData ? [total.protein, total.carbs, total.fat] : [1],
                    backgroundColor: hasData ? ["#10b981", "#f97316", "#a855f7"] : ["#e2e8f0"],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: "75%",
                plugins: {
                    legend: {
                        position: "right",
                        labels: {
                            color: document.body.classList.contains("dark") ? "#94a3b8" : "#475569",
                            font: { size: 11 }
                        }
                    },
                    tooltip: { enabled: hasData }
                }
            }
        });
    }

    renderHistory();
    renderQuickDates();
    refreshCharts();
    renderReports();
    renderGoalInfo();
    renderMoodHistory();
    updateWorkoutUI();
    updateSuggestions();
}

function renderQuickDates() {
    var container = document.getElementById("quickDates");
    container.innerHTML = "";
    var today = new Date();
    for (var i = -2; i <= 5; i++) {
        var d = new Date();
        d.setDate(today.getDate() + i);
        var iso = d.toISOString().slice(0, 10);
        var btn = document.createElement("button");
        btn.className = "secondary small";
        btn.innerText = iso === getToday() ? "Bugün" : iso.slice(5);
        if (iso === currentDate) btn.style.background = "var(--primary)";
        btn.onclick = (function(date) {
            return function() {
                currentDate = date;
                updateUI();
            };
        })(iso);
        container.appendChild(btn);
    }
}

function renderHistory() {
    var container = document.getElementById("historyList");
    var dates = Object.keys(dailyEntries).sort().reverse();
    container.innerHTML = "";
    for (var i = 0; i < dates.length; i++) {
        var date = dates[i];
        var total = getDailyTotal(dailyEntries[date]);
        var need = getDailyNeeds(date);
        var deficit = total.calories - need;
        var div = document.createElement("div");
        div.className = "daily-item";
        var deficitText = deficit > 0 ? "+" + deficit : deficit;
        div.innerHTML = "<b>" + date + "</b> 🔥 " + total.calories + "/" + need + " kcal | 🥩 " + total.protein.toFixed(1) + "g | " + deficitText + " kcal";
        div.onclick = (function(date) {
            return function() {
                currentDate = date;
                updateUI();
                switchTab("daily");
            };
        })(date);
        container.appendChild(div);
    }
}

function renderReports() {
    var dates = Object.keys(dailyEntries).sort().reverse();
    var weeklyCal = 0,
        weeklyCount = 0,
        monthlyCal = 0,
        monthlyCount = 0,
        monthlyProt = 0;
    for (var i = 0; i < dates.length; i++) {
        var total = getDailyTotal(dailyEntries[dates[i]]);
        if (total.calories > 0) {
            if (i < 7) {
                weeklyCal = weeklyCal + total.calories;
                weeklyCount++;
            }
            if (i < 30) {
                monthlyCal = monthlyCal + total.calories;
                monthlyProt = monthlyProt + total.protein;
                monthlyCount++;
            }
        }
    }
    var weeklyAvg = weeklyCount > 0 ? Math.round(weeklyCal / weeklyCount) : 0;
    var monthlyAvg = monthlyCount > 0 ? Math.round(monthlyCal / monthlyCount) : 0;
    var monthlyAvgProt = monthlyCount > 0 ? (monthlyProt / monthlyCount).toFixed(1) : 0;
    document.getElementById("weeklyReport").innerHTML = "<div class='stat-grid'><div class='stat-item'><div class='small-text'>Gün</div><div>" + weeklyCount + "</div></div><div class='stat-item'><div class='small-text'>Ort. Kalori</div><div>" + weeklyAvg + " kcal</div></div><div class='stat-item'><div class='small-text'>Toplam</div><div>" + weeklyCal + " kcal</div></div></div>";
    document.getElementById("monthlyReport").innerHTML = "<div class='stat-grid'><div class='stat-item'><div class='small-text'>Gün</div><div>" + monthlyCount + "</div></div><div class='stat-item'><div class='small-text'>Ort. Kalori</div><div>" + monthlyAvg + " kcal</div></div><div class='stat-item'><div class='small-text'>Ort. Protein</div><div>" + monthlyAvgProt + " g</div></div></div>";
}

function renderGoalInfo() {
    var container = document.getElementById("goalInfo");
    var remainingDiv = document.getElementById("remainingInfo");
    if (userProfile.weight && userProfile.targetWeight) {
        var current = userProfile.weight;
        var target = userProfile.targetWeight;
        var diff = current - target;
        var percent = 0;
        if (diff > 0) {
            percent = (diff / current) * 100;
            if (percent > 100) percent = 100;
        }
        container.innerHTML = "<div class='stat-item'><div class='small-text'>Mevcut</div><div>" + current + " kg</div></div><div class='stat-item'><div class='small-text'>Hedef</div><div>" + target + " kg</div></div><div class='stat-item'><div class='small-text'>Fark</div><div>" + Math.abs(diff).toFixed(1) + " kg</div></div>";
        document.getElementById("weightProgressFill").style.width = percent + "%";
        remainingDiv.innerHTML = "<div class='stat-item'><div class='small-text'>Kalan</div><div>" + Math.abs(diff).toFixed(1) + " kg</div></div>";
    } else {
        container.innerHTML = "<div class='small-text'>Hedef kilonuzu girin</div>";
        remainingDiv.innerHTML = "<div class='small-text'>Hedef belirleyin</div>";
    }
}

function renderMoodHistory() {
    var container = document.getElementById("moodHistory");
    var dates = Object.keys(moodEntries).sort().reverse();
    if (dates.length === 0) {
        container.innerHTML = "<div class='small-text' style='text-align:center; padding:1rem;'>Henüz ruh hali kaydı yok. İlk kaydını yukarıdan yapabilirsin!</div>";
        return;
    }
    var html = "";
    for (var i = 0; i < dates.length && i < 7; i++) {
        var entry = moodEntries[dates[i]];
        var moodColors = {
            sad: "rgba(59, 130, 246, 0.15)",
            neutral: "rgba(148, 163, 184, 0.15)",
            good: "rgba(16, 185, 129, 0.15)",
            happy: "rgba(245, 158, 11, 0.15)",
            excellent: "rgba(168, 85, 247, 0.15)"
        };
        var bgColor = moodColors[entry.type] || "var(--bg)";
        html += "<div class='daily-item flex-between' style='padding: 0.8rem 1rem; margin-bottom: 0.5rem; background: " + bgColor + "; border:none; box-shadow: 0 2px 5px rgba(0,0,0,0.02);'>" +
            "<span style='font-weight:600;'>" + dates[i] + "</span>" +
            "<span style='font-size:1.5rem; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));'>" + (entry.mood || "😐") + "</span>" +
            "</div>";
    }
    container.innerHTML = html;
}

function updateSuggestions() {
    var dates = Object.keys(dailyEntries).sort().reverse();
    var validDays = [];
    for (var i = 0; i < dates.length; i++) {
        var entry = dailyEntries[dates[i]];
        var total = getDailyTotal(entry);
        if (total.calories > 0 || (entry.water && entry.water > 0) || (entry.exerciseDuration && entry.exerciseDuration > 0)) {
            validDays.push(dates[i]);
        }
        if (validDays.length === 5) break;
    }

    var suggestionEl = document.getElementById("suggestionText");
    if (validDays.length < 5) {
        var kalan = 5 - validDays.length;
        suggestionEl.innerHTML = "💡 Kişiselleştirilmiş öneriler için <b>" + kalan + " gün</b> daha beslenme kaydı girmelisiniz.";
        return;
    }

    var avgCal = 0,
        avgProt = 0,
        avgWater = 0;
    for (var j = 0; j < validDays.length; j++) {
        var entry = dailyEntries[validDays[j]];
        var total = getDailyTotal(entry);
        avgCal += total.calories;
        avgProt += total.protein;
        avgWater += (entry.water || 0);
    }
    avgCal /= 5;
    avgProt /= 5;
    avgWater /= 5;

    var targetNeed = getDailyNeeds(currentDate);
    var targetProt = userProfile.targetProtein || Math.round((userProfile.weight || 70) * 1.8);
    var suggestion = "Harika bir denge kurmuşsunuz, son 5 gün verileriniz çok iyi! 🌟";

    if (avgWater < 6) suggestion = "Son 5 günde ortalama " + avgWater.toFixed(1) + " bardak su içtiniz. Su tüketiminizi artırmalısınız! 💧";
    else if (avgProt < targetProt * 0.8) suggestion = "Son 5 günlük protein ortalamanız (" + avgProt.toFixed(0) + "g) hedefinizin altında. Kas gelişimi için daha fazla protein ekleyin! 🥩";
    else if (avgCal > targetNeed + 200) suggestion = "Son 5 günde günlük ihtiyacınızın ortalama " + Math.round(avgCal - targetNeed) + " kcal üzerinde kalori aldınız. Porsiyon kontrolüne dikkat edebilirsiniz. 🥗";
    else if (avgCal < targetNeed - 500 && avgCal > 0) suggestion = "Son 5 günde çok düşük kalori almışsınız. Metabolizmanızın yavaşlamaması için sağlıklı atıştırmalıklar ekleyebilirsiniz. 🥜";

    suggestionEl.innerHTML = suggestion;
}

function renderBadges() {
    var badges = [
        { id: "water", icon: "💧", title: "Su Şampiyonu", desc: "Bir günde en az 8 bardak su iç." },
        { id: "water_pro", icon: "🌊", title: "Su Kolik", desc: "Bir günde en az 12 bardak su iç." },
        { id: "steps", icon: "🚶", title: "Adım Ustası", desc: "Bir günde 10.000 adım at." },
        { id: "workout", icon: "💪", title: "İlk Antrenman", desc: "Sisteme ilk egzersizini kaydet." },
        { id: "cardio", icon: "🔥", title: "Kardiyo Canavarı", desc: "Bir günde egzersizle 500 kcal yak." },
        { id: "protein", icon: "🥩", title: "Protein Canavarı", desc: "Günlük protein hedefine tam ulaş." },
        { id: "target", icon: "🎯", title: "Tam İsabet", desc: "Kalori hedefine tam yaklaş (+- 100 kcal)." },
        { id: "early", icon: "🌅", title: "Erkenci Kuş", desc: "Sabah kahvaltısını kaydet." },
        { id: "streak", icon: "📅", title: "7 Günlük Seri", desc: "Son 7 gün üst üste veri gir." },
        { id: "streak_pro", icon: "⚡", title: "Demir İrade", desc: "Son 14 gün üst üste veri gir." }
    ];

    for (var b = 0; b < badges.length; b++) badges[b].unlocked = false;

    var dates = Object.keys(dailyEntries).sort().reverse();
    for (var i = 0; i < dates.length; i++) {
        var date = dates[i];
        var entry = dailyEntries[date];
        var total = getDailyTotal(entry);
        var need = getDailyNeeds(date);
        var hasData = total.calories > 0 || (entry.water && entry.water > 0) || (entry.steps && entry.steps > 0) || (entry.exerciseDuration && entry.exerciseDuration > 0);

        if (hasData) {
            if (entry.water >= 8) badges[0].unlocked = true;
            if (entry.water >= 12) badges[1].unlocked = true;
            if (entry.steps >= 10000) badges[2].unlocked = true;
            if (entry.exerciseDuration > 0 || entry.exercise > 0) badges[3].unlocked = true;
            if (entry.exercise >= 500) badges[4].unlocked = true;
            var targetP = userProfile.targetProtein || Math.round((userProfile.weight || 70) * 1.8);
            if (total.protein >= targetP && total.protein > 0) badges[5].unlocked = true;
            if (total.calories > 0 && Math.abs(total.calories - need) <= 100) badges[6].unlocked = true;
            if (entry.morning && entry.morning.cal > 0) badges[7].unlocked = true;
        }
    }

    var streakCount = 0;
    var todayObj = new Date();
    for (var i = 0; i < 14; i++) {
        var d = new Date();
        d.setDate(todayObj.getDate() - i);
        var iso = d.toISOString().slice(0, 10);
        var entry = dailyEntries[iso];
        if (entry) {
            var total = getDailyTotal(entry);
            if (total.calories > 0 || (entry.water && entry.water > 0) || (entry.steps && entry.steps > 0) || (entry.exerciseDuration && entry.exerciseDuration > 0)) {
                streakCount++;
            } else {
                break; // Seriyi bozarsa saymayı bırak
            }
        } else {
            break;
        }
    }
    if (streakCount >= 7) badges[8].unlocked = true;
    if (streakCount >= 14) badges[9].unlocked = true;

    var container = document.getElementById("badgesList");
    if (!container) return;
    container.innerHTML = "";

    for (var j = 0; j < badges.length; j++) {
        var b = badges[j];
        var div = document.createElement("div");
        var statusClass = b.unlocked ? "unlocked" : "locked";
        var statusIcon = b.unlocked ? "✨" : "🔒";

        div.className = "badge-card " + statusClass;
        div.innerHTML =
            "<div class='badge-status'>" + statusIcon + "</div>" +
            "<div class='badge-icon'>" + b.icon + "</div>" +
            "<div class='badge-title'>" + b.title + "</div>" +
            "<div class='badge-desc'>" + b.desc + "</div>";

        container.appendChild(div);
    }
}

function saveCurrentFromInputs() {
    var inputs = {
        morning: { cal: Number(document.getElementById("morningCal").value) || 0, protein: Number(document.getElementById("morningProtein").value) || 0, carbs: Number(document.getElementById("morningCarbs").value) || 0, fat: Number(document.getElementById("morningFat").value) || 0 },
        noon: { cal: Number(document.getElementById("noonCal").value) || 0, protein: Number(document.getElementById("noonProtein").value) || 0, carbs: Number(document.getElementById("noonCarbs").value) || 0, fat: Number(document.getElementById("noonFat").value) || 0 },
        evening: { cal: Number(document.getElementById("eveningCal").value) || 0, protein: Number(document.getElementById("eveningProtein").value) || 0, carbs: Number(document.getElementById("eveningCarbs").value) || 0, fat: Number(document.getElementById("eveningFat").value) || 0 },
        snack: { cal: Number(document.getElementById("snackCal").value) || 0, protein: Number(document.getElementById("snackProtein").value) || 0, carbs: Number(document.getElementById("snackCarbs").value) || 0, fat: Number(document.getElementById("snackFat").value) || 0 },
        activity: Number(document.getElementById("activitySelect").value) || 1.375,
        exercise: Number(document.getElementById("exerciseCal").value) || 0,
        exerciseDuration: Number(document.getElementById("exerciseDurationTotal").value) || 0,
        steps: Number(document.getElementById("stepCount") ? document.getElementById("stepCount").value : 0) || 0
    };

    var existingEntry = dailyEntries[currentDate] || {};
    existingEntry.morning = inputs.morning;
    existingEntry.noon = inputs.noon;
    existingEntry.evening = inputs.evening;
    existingEntry.snack = inputs.snack;
    existingEntry.activity = inputs.activity;
    existingEntry.exercise = inputs.exercise;
    existingEntry.exerciseDuration = inputs.exerciseDuration;
    existingEntry.steps = inputs.steps;
    if (!existingEntry.habits) existingEntry.habits = {};

    dailyEntries[currentDate] = existingEntry;
    saveAllData();
    updateUI();

    var btn = document.getElementById("saveDailyBtn");
    var oldText = btn.innerText;
    btn.innerText = "✓ Kaydedildi!";
    setTimeout(function() { btn.innerText = oldText; }, 1500);
    showNotification("✅ Günlük veriler kaydedildi!");
}

function clearMeal(meal) {
    document.getElementById(meal + "Cal").value = 0;
    document.getElementById(meal + "Protein").value = 0;
    document.getElementById(meal + "Carbs").value = 0;
    document.getElementById(meal + "Fat").value = 0;
    saveCurrentFromInputs();
}

function exportToCSV() {
    var data = "Tarih,Kalori,Protein,İhtiyaç,Denge\n";
    var dates = Object.keys(dailyEntries).sort();
    for (var i = 0; i < dates.length; i++) {
        var date = dates[i];
        var total = getDailyTotal(dailyEntries[date]);
        var need = getDailyNeeds(date);
        data += date + "," + total.calories + "," + total.protein.toFixed(1) + "," + need + "," + (total.calories - need) + "\n";
    }
    var blob = new Blob([data], { type: "text/csv" });
    var link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "nutritrack_verilerim.csv";
    link.click();
    showNotification("✅ Veriler Excel'e aktarıldı!");
}

function saveProfileFromForm() {
    var w = Number(document.getElementById("weight").value);
    var h = Number(document.getElementById("height").value);
    var a = Number(document.getElementById("age").value);
    var g = document.getElementById("gender").value;

    if (!isNaN(w)) userProfile.weight = w;
    if (!isNaN(h)) userProfile.height = h;
    if (!isNaN(a)) userProfile.age = a;
    userProfile.gender = g;
    saveAllData();

    var bmr = calculateBMR();
    if (bmr) {
        document.getElementById("bmrVal").innerHTML = bmr + " kcal";
        document.getElementById("needVal").innerHTML = Math.round(bmr * 1.375) + " kcal";
        document.getElementById("proteinTarget").innerHTML = Math.round((userProfile.weight || 0) * 1.8) + " g";
    }
    updateUI();

    var btn = document.getElementById("saveProfileBtn");
    if (btn) {
        btn.innerText = "✓ Kaydedildi!";
        setTimeout(function() { btn.innerText = "💾 Kaydet"; }, 1500);
    }
    showNotification("✅ Profil kaydedildi!");
}

function saveGoal() {
    var tw = Number(document.getElementById("targetWeight").value);
    var td = document.getElementById("targetDate").value;
    var tpEl = document.getElementById("targetProteinInput");
    var tcEl = document.getElementById("targetCarbsInput");
    var tfEl = document.getElementById("targetFatInput");
    var tp = tpEl ? Number(tpEl.value) : 0;
    var tc = tcEl ? Number(tcEl.value) : 0;
    var tf = tfEl ? Number(tfEl.value) : 0;

    if (!isNaN(tw)) userProfile.targetWeight = tw;
    if (td) userProfile.targetDate = td;
    userProfile.targetProtein = tp > 0 ? tp : null;
    userProfile.targetCarbs = tc > 0 ? tc : null;
    userProfile.targetFat = tf > 0 ? tf : null;
    saveAllData();
    updateUI();
    renderGoalInfo();

    var btn = document.getElementById("saveGoalBtn");
    if (btn) {
        btn.innerText = "✓ Kaydedildi!";
        setTimeout(function() { btn.innerText = "💾 Hedefleri Kaydet"; }, 1500);
    }
    showNotification("🎯 Hedef kaydedildi!");
}

function saveMood(mood, moodType) {
    moodEntries[currentDate] = { mood: mood, type: moodType };
    saveAllData();
    renderMoodHistory();

    var motivasyonSozleri = {
        sad: "Bugün kötü hissetmek normal. Yarın yepyeni bir gün. Derin bir nefes al ve kendine vakit ayır. 💙",
        neutral: "Sakin ve dengeli bir gün. Bazen en iyisi sadece akışına bırakmaktır. 🧘",
        good: "Harika! Bu güzel enerjini bedenine iyi bakarak taçlandır. 🌿",
        happy: "Gülümsemen parlıyor! Bu yüksek frekansla bugün her şeyi başarabilirsin. ⭐",
        excellent: "İnanılmaz bir enerji! 🔥 Dünyayı fethedecek gücün var, durma!"
    };

    var soz = motivasyonSozleri[moodType] || "Bugün güzel bir gün! Hedeflerine odaklan. 💪";
    var card = document.getElementById("motivationCard");

    card.innerHTML = "<div style='font-size:3rem; margin-bottom:0.5rem; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.2));'>" + mood + "</div>" +
        "<div style='font-size:1.1rem; font-weight:600; line-height:1.5;'>" + soz + "</div>";

    card.style.display = "block";
    card.style.animation = "none";
    setTimeout(function() { card.style.animation = "fadeSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards"; }, 10);

    setTimeout(function() { card.style.display = "none"; }, 6000);
    showNotification("😊 Ruh hali kaydedildi!");
}

function toggleAccordion(el) {
    el.classList.toggle("open");
    var content = el.nextElementSibling;
    if (content.classList.contains("show")) content.classList.remove("show");
    else content.classList.add("show");
}

function switchTab(tab, skipHistory) {
    var tabs = ["home", "profile", "daily", "activity", "goals", "reports", "mood", "history", "stats", "ai", "workout", "badges", "recipes", "habits", "info"];
    for (var i = 0; i < tabs.length; i++) {
        var el = document.getElementById(tabs[i] + "Tab");
        if (el) el.classList.add("hidden");
    }
    var active = document.getElementById(tab + "Tab");
    if (active) active.classList.remove("hidden");

    var homeBtn = document.getElementById("homeBtn");
    if (homeBtn) {
        if (tab === "home") {
            homeBtn.style.display = "none";
        } else {
            homeBtn.style.display = "flex";
        }
    }

    if (tab === "stats") refreshCharts();
    if (tab === "history") renderHistory();
    if (tab === "reports") renderReports();
    if (tab === "badges") renderBadges();
    if (tab === "goals") renderGoalInfo();
    if (tab === "daily") updateUI();
    if (tab === "activity") updateUI();
    if (tab === "recipes") renderRecipes();
    if (tab === "habits") {
        document.getElementById("habitsDateDisplay").innerText = currentDate.replace(/-/g, "/");
        renderHabits();
    }
    if (tab === "profile") {
        populateMeasurementsForm();
        renderMeasurementsHistory();
    }

    if (!skipHistory) {
        history.pushState({ tab: tab }, "", "#" + tab);
    }
}

function initTheme() {
    var dark = localStorage.getItem("dark") === "true";
    if (dark) document.body.classList.add("dark");
    document.getElementById("themeToggle").innerText = dark ? "☀️ Açık Mod" : "🌙 Karanlık Mod";
    if (window.Chart) {
        Chart.defaults.color = dark ? "#94a3b8" : "#475569";
        Chart.defaults.borderColor = dark ? "#334155" : "#e2e8f0";
    }
    document.getElementById("themeToggle").onclick = function() {
        document.body.classList.toggle("dark");
        var isDark = document.body.classList.contains("dark");
        localStorage.setItem("dark", isDark);
        this.innerText = isDark ? "☀️ Açık Mod" : "🌙 Karanlık Mod";
        if (window.Chart) {
            var textColor = isDark ? "#94a3b8" : "#475569";
            Chart.defaults.color = textColor;
            Chart.defaults.borderColor = isDark ? "#334155" : "#e2e8f0";
            if (dailyMacroChart && dailyMacroChart.options.plugins.legend) {
                dailyMacroChart.options.plugins.legend.labels.color = textColor;
                dailyMacroChart.update();
            }
        }
        if (!document.getElementById("statsTab").classList.contains("hidden")) refreshCharts();
    };
}

function populateProfileForm() {
    if (userProfile.avatar) {
        document.getElementById("profileAvatar").src = userProfile.avatar;
    }
    document.getElementById("weight").value = userProfile.weight !== null ? userProfile.weight : "";
    document.getElementById("height").value = userProfile.height !== null ? userProfile.height : "";
    document.getElementById("age").value = userProfile.age !== null ? userProfile.age : "";
    document.getElementById("gender").value = userProfile.gender;
    document.getElementById("targetWeight").value = userProfile.targetWeight !== null ? userProfile.targetWeight : "";
    document.getElementById("targetDate").value = userProfile.targetDate !== null ? userProfile.targetDate : "";
    document.getElementById("targetProteinInput").value = userProfile.targetProtein !== null ? userProfile.targetProtein : "";
    document.getElementById("targetCarbsInput").value = userProfile.targetCarbs !== null ? userProfile.targetCarbs : "";
    document.getElementById("targetFatInput").value = userProfile.targetFat !== null ? userProfile.targetFat : "";
}

function addAiToMeal(mealType, cal, prot, carbs, fat) {
    carbs = carbs || 0;
    fat = fat || 0;
    var currentCal = Number(document.getElementById(mealType + "Cal").value) || 0;
    var currentProt = Number(document.getElementById(mealType + "Protein").value) || 0;
    var currentCarbs = Number(document.getElementById(mealType + "Carbs").value) || 0;
    var currentFat = Number(document.getElementById(mealType + "Fat").value) || 0;

    document.getElementById(mealType + "Cal").value = Math.round(currentCal + cal);
    document.getElementById(mealType + "Protein").value = parseFloat((currentProt + prot).toFixed(1));
    document.getElementById(mealType + "Carbs").value = parseFloat((currentCarbs + carbs).toFixed(1));
    document.getElementById(mealType + "Fat").value = parseFloat((currentFat + fat).toFixed(1));

    saveCurrentFromInputs();
    switchTab("daily");
    showNotification("✅ Öğüne eklendi!");
}

function playWaterSound() {
    try {
        var AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        var ctx = new AudioContext();
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(700, ctx.currentTime + 0.1);

        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.2);
    } catch (e) { console.log("Ses oynatılamadı", e); }
}

function addWater(amount) {
    if (amount > 0) playWaterSound();
    var entry = dailyEntries[currentDate];
    if (!entry) {
        entry = getEmptyMeals();
        dailyEntries[currentDate] = entry;
    }
    entry.water = (entry.water || 0) + amount;
    if (entry.water < 0) entry.water = 0;
    saveAllData();
    updateUI();
}

function addFavorite(name, cal, prot, carbs, fat) {
    favoriteMeals.push({ name: name, cal: cal, prot: prot, carbs: carbs, fat: fat });
    localStorage.setItem("nutritrack_favorites", JSON.stringify(favoriteMeals));
    showNotification("⭐ Favorilere eklendi!");
    renderFavorites();
}

function removeFavorite(index) {
    favoriteMeals.splice(index, 1);
    localStorage.setItem("nutritrack_favorites", JSON.stringify(favoriteMeals));
    renderFavorites();
}

function toggleFavAdd(index) {
    var box = document.getElementById("favAddBox_" + index);
    box.style.display = (box.style.display === "none") ? "flex" : "none";
}

function renderFavorites() {
    var container = document.getElementById("favoritesList");
    if (!container) return;
    container.innerHTML = "";
    if (favoriteMeals.length === 0) {
        container.innerHTML = "<div class='small-text'>Henüz favori yemeğiniz yok. Yapay zeka ile bulduğunuz yemekleri buraya ekleyebilirsiniz.</div>";
        return;
    }
    for (var i = 0; i < favoriteMeals.length; i++) {
        var fav = favoriteMeals[i];
        var div = document.createElement("div");
        div.className = "daily-item";
        div.innerHTML = "<div class='flex-between'><div><div style='font-weight:bold;'>" + fav.name + "</div>" +
            "<div class='small-text'>🔥 " + fav.cal + " kcal | 🥩 " + fav.prot + "g | 🍞 " + fav.carbs + "g | 🥑 " + fav.fat + "g</div></div>" +
            "<div><button class='small' onclick='toggleFavAdd(" + i + ")'>Ekle</button> <button class='small secondary' onclick='removeFavorite(" + i + ")'>🗑️</button></div></div>" +
            "<div id='favAddBox_" + i + "' style='display:none; margin-top: 0.5rem; gap: 0.2rem; flex-wrap: wrap;'>" +
            "<button onclick='addAiToMeal(\"morning\", " + fav.cal + ", " + fav.prot + ", " + fav.carbs + ", " + fav.fat + ")' style='flex: 1; background: var(--orange); font-size: 0.7rem; padding: 0.4rem;'>Sabah</button>" +
            "<button onclick='addAiToMeal(\"noon\", " + fav.cal + ", " + fav.prot + ", " + fav.carbs + ", " + fav.fat + ")' style='flex: 1; background: var(--success); font-size: 0.7rem; padding: 0.4rem;'>Öğle</button>" +
            "<button onclick='addAiToMeal(\"evening\", " + fav.cal + ", " + fav.prot + ", " + fav.carbs + ", " + fav.fat + ")' style='flex: 1; background: var(--primary); font-size: 0.7rem; padding: 0.4rem;'>Akşam</button>" +
            "<button onclick='addAiToMeal(\"snack\", " + fav.cal + ", " + fav.prot + ", " + fav.carbs + ", " + fav.fat + ")' style='flex: 1; background: var(--purple); font-size: 0.7rem; padding: 0.4rem;'>Ara</button></div>";
        container.appendChild(div);
    }
}

function updateWorkoutUI() {
    var parts = currentDate.split("-");
    var dObj = new Date(parts[0], parts[1] - 1, parts[2]);
    var currentDayNum = dObj.getDay();
    var todayDisplay = document.getElementById("todayWorkoutDisplay");
    if (todayDisplay) {
        var txt = workoutProgram[currentDayNum];
        todayDisplay.innerText = txt ? txt : "Bugün için dinlenme veya program eklenmemiş.";
    }
    if (document.getElementById("workoutDaySelect")) {
        document.getElementById("workoutDaySelect").value = currentDayNum;
        document.getElementById("workoutText").value = workoutProgram[currentDayNum] || "";
    }
}

function initWelcomeScreen() {
    var d = new Date();
    var options = { weekday: 'long', month: 'long', day: 'numeric' };
    document.getElementById("welcomeDate").innerText = d.toLocaleDateString('tr-TR', options);
    var motivationalQuotes = [
        "Bugün hedeflerine bir adım daha yaklaşmak için harika bir gün! 💪",
        "Küçük adımlar, büyük sonuçlar doğurur. Asla pes etme! 🏃‍♂️",
        "Vücudun senin tapınağındır, ona iyi bak. 🥦",
        "Disiplin, ne istediğinle şimdi ne istediğin arasında seçim yapmaktır. 🎯",
        "Mazeretler kalori yakmaz! Bugün elinden gelenin en iyisini yap. 🔥",
        "Başarı, her gün tekrarlanan küçük çabaların toplamıdır. 🌟",
        "Bugün dünden daha iyi ol. Sadece kendine rakipsin! 🏆",
        "Sağlıklı beslenmek bir diyet değil, bir yaşam tarzıdır. 🥑",
        "Her yeni gün, yeni bir başlangıçtır. Hadi başlayalım! ✨"
    ];
    document.getElementById("welcomeQuote").innerText = "\"" + motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)] + "\"";

    var entry = dailyEntries[getToday()];
    var hasData = entry && (getDailyTotal(entry).calories > 0 || (entry.water && entry.water > 0) || (entry.steps && entry.steps > 0) || (entry.exerciseDuration && entry.exerciseDuration > 0));

    var btn = document.getElementById("welcomeBtn");
    btn.innerText = hasData ? "🚀 Güne Devam Et" : "✨ Güne Başla";
    btn.onclick = function() {
        var screen = document.getElementById("welcomeScreen");
        screen.style.opacity = "0";
        setTimeout(function() { screen.style.display = "none"; }, 500);
    };
}

function saveMeasurements() {
    var today = getToday();
    var weight = Number(document.getElementById("measureWeight").value) || null;
    var fatManual = Number(document.getElementById("measureFat").value) || null;
    var waist = Number(document.getElementById("measureWaist").value) || null;
    var hip = Number(document.getElementById("measureHip").value) || null;
    var arm = Number(document.getElementById("measureArm").value) || null;
    var chest = Number(document.getElementById("measureChest").value) || null;
    var neck = Number(document.getElementById("measureNeck").value) || null;

    if (!weight && !waist && !hip && !arm && !chest && !neck && !fatManual) {
        showNotification("⚠️ Girecek bir ölçü değeri yok.");
        return;
    }
    bodyMeasurements[today] = { weight: weight, waist: waist, hip: hip, arm: arm, chest: chest, neck: neck, fatPercentage: fatManual };

    if (weight) {
        userProfile.weight = weight;
        document.getElementById("weight").value = weight;
        var bmr = calculateBMR();
        if (bmr) {
            document.getElementById("bmrVal").innerHTML = bmr + " kcal";
            document.getElementById("needVal").innerHTML = Math.round(bmr * 1.375) + " kcal";
            document.getElementById("proteinTarget").innerHTML = Math.round((userProfile.weight || 0) * 1.8) + " g";
        }
    }

    if (!fatManual) {
        var calculatedFat = calculateBodyFat(userProfile.gender, userProfile.height, neck, waist, hip);
        if (calculatedFat) bodyMeasurements[today].fatPercentage = calculatedFat;
    }

    var finalFat = bodyMeasurements[today].fatPercentage;
    if (finalFat) {
        var fatPercentEl = document.getElementById("fatPercentVal");
        if (fatPercentEl) fatPercentEl.innerHTML = finalFat.toFixed(1) + " %";
    }
    saveAllData();
    renderMeasurementsHistory();
    updateUI();
    showNotification("📏 Vücut ölçüleri kaydedildi!");
}

function renderMeasurementsHistory() {
    var container = document.getElementById("measurementsHistory");
    if (!container) return;
    var dates = Object.keys(bodyMeasurements).sort().reverse();
    if (dates.length === 0) { container.innerHTML = "<div class='small-text'>Henüz ölçüm kaydı yok.</div>"; return; }
    var html = "<div class='card-title' style='margin-bottom:0.5rem; font-size:0.9rem;'>📜 Ölçüm Geçmişi (Son 5)</div>";
    for (var i = 0; i < dates.length && i < 5; i++) {
        var entry = bodyMeasurements[dates[i]];
        var entryText = [];
        if (entry.weight) entryText.push("Kilo: " + entry.weight + "kg");
        if (entry.waist) entryText.push("Bel: " + entry.waist + "cm");
        if (entry.fatPercentage) entryText.push("Yağ: " + entry.fatPercentage.toFixed(1) + "%");
        if (entry.hip) entryText.push("Kalça: " + entry.hip + "cm");
        if (entry.arm) entryText.push("Kol: " + entry.arm + "cm");
        if (entry.chest) entryText.push("Göğüs: " + entry.chest + "cm");
        html += "<div class='flex-between daily-item' style='padding: 0.5rem; margin-bottom:0.3rem;'><span><b>" + dates[i] + "</b></span><span class='small-text'>" + entryText.join(' | ') + "</span></div>";
    }
    container.innerHTML = html;
}

function populateMeasurementsForm() {
    var entry = bodyMeasurements[getToday()];
    if (entry) {
        document.getElementById("measureWeight").value = entry.weight || "";
        document.getElementById("measureFat").value = entry.fatPercentage || "";
        document.getElementById("measureWaist").value = entry.waist || "";
        document.getElementById("measureHip").value = entry.hip || "";
        document.getElementById("measureNeck").value = entry.neck || "";
        document.getElementById("measureArm").value = entry.arm || "";
        document.getElementById("measureChest").value = entry.chest || "";
    }
}

function saveRecipe() {
    var name = document.getElementById("recipeName").value.trim();
    var details = document.getElementById("recipeDetails").value.trim();
    var cal = Number(document.getElementById("recipeCal").value) || 0;
    var prot = Number(document.getElementById("recipeProt").value) || 0;
    var carbs = Number(document.getElementById("recipeCarbs").value) || 0;
    var fat = Number(document.getElementById("recipeFat").value) || 0;

    if (!name) {
        showNotification("❌ Lütfen tarifin adını girin.");
        return;
    }

    myRecipes.push({ name: name, details: details, cal: cal, prot: prot, carbs: carbs, fat: fat });
    localStorage.setItem("nutritrack_recipes", JSON.stringify(myRecipes));

    document.getElementById("recipeName").value = "";
    document.getElementById("recipeDetails").value = "";
    document.getElementById("recipeCal").value = "";
    document.getElementById("recipeProt").value = "";
    document.getElementById("recipeCarbs").value = "";
    document.getElementById("recipeFat").value = "";

    renderRecipes();
    var btn = document.getElementById("saveRecipeBtn");
    var oldText = btn.innerText;
    btn.innerText = "✓ Kaydedildi!";
    setTimeout(function() { btn.innerText = oldText; }, 1500);
    showNotification("📖 Tarif başarıyla kaydedildi!");
}

function deleteRecipe(index) {
    if (confirm("Bu tarifi silmek istediğinize emin misiniz?")) {
        myRecipes.splice(index, 1);
        localStorage.setItem("nutritrack_recipes", JSON.stringify(myRecipes));
        renderRecipes();
        showNotification("🗑️ Tarif silindi.");
    }
}

function toggleRecipeDetails(index) {
    var detailsDiv = document.getElementById("recipeDetails_" + index);
    if (detailsDiv.style.display === "none") {
        detailsDiv.style.display = "block";
    } else {
        detailsDiv.style.display = "none";
    }
}

function renderRecipes() {
    var container = document.getElementById("recipesList");
    if (!container) return;
    container.innerHTML = "";

    if (myRecipes.length === 0) {
        container.innerHTML = "<div class='small-text'>Henüz kayıtlı tarifiniz bulunmuyor. Yukarıdan ilk tarifinizi ekleyin!</div>";
        return;
    }

    for (var i = 0; i < myRecipes.length; i++) {
        var r = myRecipes[i];
        var div = document.createElement("div");
        div.className = "daily-item";

        var safeDetails = (r.details || "").replace(/\n/g, "<br>");

        div.innerHTML =
            "<div class='flex-between' style='cursor:pointer;' onclick='toggleRecipeDetails(" + i + ")'>" +
            "<div>" +
            "<div style='font-weight:bold; font-size:1.05rem; color:var(--primary); margin-bottom: 0.2rem;'>" + r.name + "</div>" +
            "<div class='small-text'>🔥 " + r.cal + " kcal | 🥩 " + r.prot + "g | 🍞 " + r.carbs + "g | 🥑 " + r.fat + "g</div>" +
            "</div>" +
            "<div style='font-size:1rem; color:var(--text-secondary);'>▼</div>" +
            "</div>" +
            "<div id='recipeDetails_" + i + "' style='display:none; margin-top:0.8rem; padding-top:0.8rem; border-top:1px solid var(--border);'>" +
            "<div class='small-text' style='color:var(--text); margin-bottom:0.8rem; line-height: 1.4;'>" + safeDetails + "</div>" +
            "<button class='small secondary' onclick='event.stopPropagation(); deleteRecipe(" + i + ")' style='width:100%; border-color:var(--danger); color:var(--danger);'>🗑️ Tarifi Sil</button>" +
            "</div>";
        container.appendChild(div);
    }
}

// ==================== ALIŞKANLIK TAKİBİ (HABITS) ====================
function addNewHabit() {
    var input = document.getElementById("newHabitInput");
    var val = input.value.trim();
    if (!val) return;
    if (customHabits.indexOf(val) !== -1) {
        showNotification("⚠️ Bu alışkanlık zaten var.");
        return;
    }
    customHabits.push(val);
    localStorage.setItem("nutritrack_habits", JSON.stringify(customHabits));
    input.value = "";
    renderHabits();
    showNotification("✅ Yeni alışkanlık eklendi!");
}

function deleteHabit(index) {
    if (confirm("Bu alışkanlığı silmek istediğinize emin misiniz? (Geçmiş günlerdeki işaretlemeleriniz etkilenmez)")) {
        customHabits.splice(index, 1);
        localStorage.setItem("nutritrack_habits", JSON.stringify(customHabits));
        renderHabits();
    }
}

function toggleHabit(habitName) {
    var entry = dailyEntries[currentDate];
    if (!entry) {
        entry = getEmptyMeals();
        dailyEntries[currentDate] = entry;
    }
    if (!entry.habits) entry.habits = {};

    entry.habits[habitName] = !entry.habits[habitName];
    saveAllData();
    renderHabits();

    if (entry.habits[habitName]) {
        playWaterSound(); // İşaretlendiğinde başarı sesi çal
        showNotification("🎉 Harika! Zinciri kırmıyorsun.");
    }
}

function renderHabits() {
    var container = document.getElementById("habitsList");
    if (!container) return;
    container.innerHTML = "";

    if (customHabits.length === 0) {
        container.innerHTML = "<div class='small-text' style='text-align:center; padding:1rem;'>Henüz bir alışkanlık eklemediniz.</div>";
        return;
    }

    var entry = dailyEntries[currentDate] || {};
    var entryHabits = entry.habits || {};

    for (var i = 0; i < customHabits.length; i++) {
        var h = customHabits[i];
        var isDone = entryHabits[h] === true;
        var safeH = h.replace(/'/g, "\\'").replace(/"/g, "&quot;");

        var div = document.createElement("div");
        div.className = "daily-item flex-between";
        div.style.padding = "1rem";
        if (isDone) {
            div.style.background = "linear-gradient(145deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05))";
            div.style.borderColor = "var(--success)";
        }

        div.innerHTML =
            "<div style='display:flex; align-items:center; gap:0.8rem; cursor:pointer; flex:1;' onclick='toggleHabit(\"" + safeH + "\")'>" +
            "<div style='width:24px; height:24px; border-radius:50%; border:2px solid " + (isDone ? "var(--success)" : "var(--border)") + "; background:" + (isDone ? "var(--success)" : "transparent") + "; display:flex; align-items:center; justify-content:center; color:white; font-size:0.8rem; transition:all 0.2s ease;'>" + (isDone ? "✓" : "") + "</div>" +
            "<span style='font-size:1.05rem; font-weight:600; text-decoration:" + (isDone ? "line-through" : "none") + "; color:" + (isDone ? "var(--text-secondary)" : "var(--text)") + "'>" + h + "</span>" +
            "</div>" +
            "<button class='small secondary' onclick='deleteHabit(" + i + ")' style='border:none; background:transparent; padding:0.2rem; box-shadow:none;'>🗑️</button>";

        container.appendChild(div);
    }
}

// ==================== KRONOMETRE & ZAMANLAYICI ====================
var swInterval = null;
var swStartTime = 0;
var swElapsedTime = 0;
var isSwRunning = false;
var restInterval = null;

function formatSwTime(ms) {
    var totalSeconds = Math.floor(ms / 1000);
    var minutes = Math.floor(totalSeconds / 60);
    var seconds = totalSeconds % 60;
    var milliseconds = Math.floor((ms % 1000) / 10);
    return (minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds + "." + (milliseconds < 10 ? "0" : "") + milliseconds;
}

function toggleStopwatch() {
    clearInterval(restInterval);
    document.getElementById("stopwatchDisplay").style.color = "var(--primary)";

    var btn = document.getElementById("startStopwatchBtn");
    if (isSwRunning) {
        clearInterval(swInterval);
        isSwRunning = false;
        btn.innerHTML = "▶ Başlat";
        btn.style.background = "var(--success)";
    } else {
        swStartTime = Date.now() - swElapsedTime;
        swInterval = setInterval(function() {
            swElapsedTime = Date.now() - swStartTime;
            document.getElementById("stopwatchDisplay").innerHTML = formatSwTime(swElapsedTime);
        }, 10);
        isSwRunning = true;
        btn.innerHTML = "⏸ Duraklat";
        btn.style.background = "var(--warning)";
    }
}

function resetStopwatch() {
    clearInterval(swInterval);
    clearInterval(restInterval);
    isSwRunning = false;
    swElapsedTime = 0;
    var display = document.getElementById("stopwatchDisplay");
    display.innerHTML = "00:00.00";
    display.style.color = "var(--primary)";

    var btn = document.getElementById("startStopwatchBtn");
    btn.innerHTML = "▶ Başlat";
    btn.style.background = "var(--success)";
}

function startRestTimer(seconds) {
    resetStopwatch(); // Kronometreyi sıfırla

    var endTime = Date.now() + seconds * 1000;
    var display = document.getElementById("stopwatchDisplay");
    display.style.color = "var(--orange)";

    restInterval = setInterval(function() {
        var remaining = Math.max(0, endTime - Date.now());
        var totalSeconds = Math.ceil(remaining / 1000);
        var m = Math.floor(totalSeconds / 60);
        var s = totalSeconds % 60;
        display.innerHTML = "⏳ " + (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;

        if (remaining <= 0) {
            clearInterval(restInterval);
            display.innerHTML = "00:00.00";
            display.style.color = "var(--primary)";
            playWaterSound(); // Bittiğinde ses çal
            showNotification("🔔 Dinlenme süresi bitti! Sete geri dönün.");
            sendLocalNotification("🔔 Dinlenme Bitti!", "Sete geri dönme vakti geldi. Hadi başlayalım!");
        }
    }, 100);
}

// ==================== OLAY DİNLEYİCİLERİ VE BAŞLATMA ====================

document.getElementById("saveProfileBtn").onclick = saveProfileFromForm;
document.getElementById("saveDailyBtn").onclick = saveCurrentFromInputs;
document.getElementById("exportBtn").onclick = exportToCSV;

document.getElementById("prevDayBtn").onclick = function() {
    var d = new Date(currentDate);
    d.setDate(d.getDate() - 1);
    currentDate = d.toISOString().slice(0, 10);
    updateUI();
};
document.getElementById("nextDayBtn").onclick = function() {
    var d = new Date(currentDate);
    d.setDate(d.getDate() + 1);
    currentDate = d.toISOString().slice(0, 10);
    updateUI();
};

document.getElementById("shareDayBtn").onclick = function() {
    var total = getDailyTotal(dailyEntries[currentDate]);
    var need = getDailyNeeds(currentDate);
    var entry = dailyEntries[currentDate];
    var water = entry.water || 0;
    var sport = entry.exerciseDuration || 0;
    var text = "🍽️ NutriTrack Günlük Özetim (" + currentDate + ")\n\n🔥 Kalori: " + total.calories + " / " + need + " kcal\n🥩 Protein: " + total.protein.toFixed(1) + "g\n💧 Su: " + water + " bardak (" + (water * 200) + " ml)\n⏱️ Spor: " + sport + " dk\n\nSen de NutriTrack ile hedeflerine ulaş! 💪";
    if (navigator.share) { navigator.share({ title: 'Günlük Özetim', text: text }).catch(console.log); } else {
        navigator.clipboard.writeText(text);
        showNotification("📋 Özet panoya kopyalandı!");
    }
};

var clearBtns = document.querySelectorAll(".clear-meal");
for (var i = 0; i < clearBtns.length; i++) {
    clearBtns[i].onclick = function() { clearMeal(this.getAttribute("data-meal")); };
}

var moodBtns = document.querySelectorAll(".mood-btn");
for (var i = 0; i < moodBtns.length; i++) {
    moodBtns[i].onclick = function() { saveMood(this.getAttribute("data-mood"), this.getAttribute("data-mood-type")); };
}

if (document.getElementById("addSportBtn")) {
    document.getElementById("addSportBtn").onclick = function() {
        var dur = Number(document.getElementById("sportDuration").value) || 0;
        if (dur <= 0) return;
        var calPerMin = Number(document.getElementById("sportType").value);
        var burned = Math.round(dur * calPerMin);
        document.getElementById("exerciseCal").value = (Number(document.getElementById("exerciseCal").value) || 0) + burned;
        document.getElementById("exerciseDurationTotal").value = (Number(document.getElementById("exerciseDurationTotal").value) || 0) + dur;
        document.getElementById("sportDuration").value = "";
        saveCurrentFromInputs();
        showNotification("✅ " + dur + " dk egzersiz ile " + burned + " kcal yakıldı!");
    };
}

document.getElementById("workoutDaySelect").onchange = function() {
    document.getElementById("workoutText").value = workoutProgram[this.value] || "";
};

document.getElementById("saveWorkoutBtn").onclick = function() {
    workoutProgram[document.getElementById("workoutDaySelect").value] = document.getElementById("workoutText").value;
    localStorage.setItem("nutritrack_workout", JSON.stringify(workoutProgram));
    updateWorkoutUI();
    var btn = document.getElementById("saveWorkoutBtn");
    var oldText = btn.innerText;
    btn.innerText = "✓ Kaydedildi!";
    setTimeout(function() { btn.innerText = oldText; }, 1500);
    showNotification("💪 Program kaydedildi!");
};

if (document.getElementById("saveGoalBtn")) document.getElementById("saveGoalBtn").onclick = saveGoal;
if (document.getElementById("saveMeasurementsBtn")) document.getElementById("saveMeasurementsBtn").onclick = saveMeasurements;
if (document.getElementById("saveRecipeBtn")) document.getElementById("saveRecipeBtn").onclick = saveRecipe;

if (document.getElementById("startStopwatchBtn")) document.getElementById("startStopwatchBtn").onclick = toggleStopwatch;
if (document.getElementById("resetStopwatchBtn")) document.getElementById("resetStopwatchBtn").onclick = resetStopwatch;

if (document.getElementById("avatarInput")) {
    document.getElementById("avatarInput").onchange = function(event) {
        var file = event.target.files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function(e) {
                userProfile.avatar = e.target.result;
                document.getElementById("profileAvatar").src = userProfile.avatar;
                saveAllData();
                showNotification("📷 Profil fotoğrafı kaydedildi!");
            };
            reader.readAsDataURL(file);
        }
    };
}

function applyAppTheme(theme) {
    document.body.classList.remove("theme-sport", "theme-nature", "theme-luxury", "theme-fun");
    if (theme && theme !== "classic") {
        document.body.classList.add("theme-" + theme);
    }

    if (window.Chart) {
        // Siyah ağırlıklı temalar için grafik yazılarını açık renk yapıyoruz
        var isDarkTheme = theme === "sport" || theme === "luxury" || (theme === "classic" && document.body.classList.contains("dark"));
        var textColor = isDarkTheme ? "#94a3b8" : "#475569";
        Chart.defaults.color = textColor;
        Chart.defaults.borderColor = isDarkTheme ? "#334155" : (theme === "classic" ? "#e2e8f0" : "rgba(0,0,0,0.05)");

        if (dailyMacroChart && dailyMacroChart.options.plugins.legend) {
            dailyMacroChart.options.plugins.legend.labels.color = textColor;
            dailyMacroChart.update();
        }
    }

    if (!document.getElementById("statsTab").classList.contains("hidden")) refreshCharts();
}

if (document.getElementById("saveThemeBtn")) {
    document.getElementById("saveThemeBtn").onclick = function() {
        var theme = document.getElementById("appThemeSelect").value;
        localStorage.setItem("nutritrack_app_theme", theme);
        applyAppTheme(theme);

        var btn = document.getElementById("saveThemeBtn");
        btn.innerText = "✓ Tema Uygulandı!";
        setTimeout(function() { btn.innerText = "💾 Temayı Kaydet"; }, 1500);
        showNotification("🎨 Uygulama teması değiştirildi!");
    };
}

// ==================== BİLDİRİMLER ====================
var notifSettings = JSON.parse(localStorage.getItem("nutritrack_notif_settings") || '{"water":false, "meals":false}');

function initNotificationsUI() {
    document.getElementById("notifWater").checked = notifSettings.water;
    document.getElementById("notifMeals").checked = notifSettings.meals;
    if (window.Notification && Notification.permission === "granted") {
        var btn = document.getElementById("requestNotifBtn");
        if (btn) {
            btn.innerText = "✅ Bildirim İzni Verildi";
            btn.disabled = true;
        }
    }
}

if (document.getElementById("requestNotifBtn")) {
    document.getElementById("requestNotifBtn").onclick = function() {
        if (!window.Notification) { showNotification("❌ Tarayıcınız bildirimleri desteklemiyor."); return; }
        Notification.requestPermission().then(function(permission) {
            if (permission === "granted") {
                initNotificationsUI();
                sendLocalNotification("Harika! 🎉", "Bildirimler başarıyla açıldı. Hatırlatıcılarını ayarlayabilirsin.");
            } else { showNotification("⚠️ Bildirim izni reddedildi."); }
        });
    };
}

if (document.getElementById("saveNotifBtn")) {
    document.getElementById("saveNotifBtn").onclick = function() {
        notifSettings.water = document.getElementById("notifWater").checked;
        notifSettings.meals = document.getElementById("notifMeals").checked;
        localStorage.setItem("nutritrack_notif_settings", JSON.stringify(notifSettings));
        var btn = document.getElementById("saveNotifBtn");
        btn.innerText = "✓ Ayarlar Kaydedildi!";
        setTimeout(function() { btn.innerText = "💾 Ayarları Kaydet"; }, 1500);
        showNotification("🔔 Bildirim ayarları güncellendi!");
    };
}

function sendLocalNotification(title, body) {
    if (window.Notification && Notification.permission === "granted") {
        if ('serviceWorker' in navigator && navigator.serviceWorker.ready) {
            navigator.serviceWorker.ready.then(function(reg) { reg.showNotification(title, { body: body, icon: 'icon.png' }); }).catch(function() { new Notification(title, { body: body }); });
        } else { new Notification(title, { body: body }); }
    }
}

function checkReminders() {
    var now = new Date();
    var h = now.getHours();
    var m = now.getMinutes();
    var timeStr = (h < 10 ? "0" + h : h) + ":" + (m < 10 ? "0" + m : m);
    var todayStr = getToday();
    var lastNotified = JSON.parse(localStorage.getItem("nutritrack_last_notified") || '{}');

    if (notifSettings.meals) {
        var mealTimes = { "09:00": "Sabah", "13:00": "Öğle", "19:00": "Akşam" };
        if (mealTimes[timeStr] && lastNotified["meal_" + todayStr + "_" + timeStr] !== true) {
            sendLocalNotification("🍽️ Yemek Vakti!", mealTimes[timeStr] + " öğününü uygulamaya girmeyi unutma.");
            lastNotified["meal_" + todayStr + "_" + timeStr] = true;
            localStorage.setItem("nutritrack_last_notified", JSON.stringify(lastNotified));
        }
    }
    if (notifSettings.water) {
        if (h >= 8 && h <= 22 && m === 0 && h % 2 === 0 && lastNotified["water_" + todayStr + "_" + h] !== true) {
            sendLocalNotification("💧 Su İçme Vakti!", "Günde en az 2 litre su içmelisin. Bir bardak su iç ve sisteme kaydet!");
            lastNotified["water_" + todayStr + "_" + h] = true;
            localStorage.setItem("nutritrack_last_notified", JSON.stringify(lastNotified));
        }
    }
}
setInterval(checkReminders, 60000);

// Tarayıcı / Telefon Geri Tuşu Yakalama
window.addEventListener("popstate", function(event) {
    if (event.state && event.state.tab) {
        switchTab(event.state.tab, true);
    } else {
        var hash = window.location.hash ? window.location.hash.substring(1) : "home";
        switchTab(hash, true);
    }
});

// UYGULAMAYI BAŞLATMA
window.onload = function() {
    loadAllData();
    populateProfileForm();
    initTheme();
    updateUI();
    renderFavorites();
    renderRecipes();
    initWelcomeScreen();
    initNotificationsUI();

    var savedAppTheme = localStorage.getItem("nutritrack_app_theme") || "classic";
    if (document.getElementById("appThemeSelect")) {
        document.getElementById("appThemeSelect").value = savedAppTheme;
    }
    applyAppTheme(savedAppTheme);

    var initialTab = window.location.hash ? window.location.hash.substring(1) : "home";
    var validTabs = ["home", "profile", "daily", "activity", "goals", "reports", "mood", "history", "stats", "ai", "workout", "badges", "recipes", "habits", "info"];
    if (validTabs.indexOf(initialTab) === -1) initialTab = "home";

    switchTab(initialTab, true);
    history.replaceState({ tab: initialTab }, "", "#" + initialTab);
};

console.log("Uygulama başlatıldı. Veriler localStorage'a kaydediliyor.");