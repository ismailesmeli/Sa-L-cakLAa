// ==================== UYGULAMA ARAYÜZ (UI) ve MANTIK ====================
// ============================================================
// ANA SAYFA — YENİ FONKSİYONLAR (en üstte tanımlı)
// ============================================================

var homeGreetings = {
    night: { emoji: "🌙", text: "İyi geceler", sub: "Yarın yeni bir gün" },
    morning: { emoji: "☀️", text: "Günaydın!", sub: "Güne enerjik başla" },
    noon: { emoji: "🌤️", text: "İyi günler!", sub: "Öğle vakti geldi" },
    evening: { emoji: "🌆", text: "İyi akşamlar", sub: "Günü güzel kapat" }
};

var homeQuotes = [
    "Küçük adımlar, büyük sonuçlar doğurur. Bugün de hedefine bir adım daha yaklaş!",
    "Bugün dünden daha iyi ol. Sadece kendine rakipsin! 🏆",
    "Vücudun senin tapınağındır, ona iyi bak. 🥦",
    "Disiplin, ne istediğinle şimdi ne istediğin arasında seçim yapmaktır. 🎯",
    "Başarı, her gün tekrarlanan küçük çabaların toplamıdır. 🌟",
    "Mazeretler kalori yakmaz! Bugün elinden gelenin en iyisini yap. 🔥",
    "Sağlıklı beslenmek bir diyet değil, bir yaşam tarzıdır. 🥑",
    "Her yeni gün, yeni bir başlangıçtır. Hadi başlayalım! ✨"
];

function updateHomeGreeting() {
    var hour = new Date().getHours();
    var greeting;
    if (hour < 6) greeting = homeGreetings.night;
    else if (hour < 12) greeting = homeGreetings.morning;
    else if (hour < 18) greeting = homeGreetings.noon;
    else greeting = homeGreetings.evening;

    var emojiEl = document.getElementById("homeGreetingEmoji");
    var textEl = document.getElementById("homeGreetingText");
    var subEl = document.getElementById("homeGreetingSub");

    if (emojiEl) emojiEl.innerText = greeting.emoji;
    if (textEl) textEl.innerText = greeting.text;
    if (subEl) subEl.innerText = greeting.sub;
}

function updateHomeQuote() {
    var el = document.getElementById("homeQuoteText");
    if (!el) return;
    var today = new Date();
    var dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    var quote = homeQuotes[dayOfYear % homeQuotes.length];
    el.innerText = '"' + quote + '"';
}

function updateHomeScreen(total, entry, need) {
    // Kalori değerleri
    var calEl = document.getElementById("homeBigCal");
    if (calEl) calEl.innerText = total.calories;
    var targetEl = document.getElementById("homeBigCalTarget");
    if (targetEl) targetEl.innerText = "Hedef: " + need + " kcal";

    // Kalori halkası
    var circle = document.getElementById("homeCalCircle");
    if (circle) {
        var circumference = 2 * Math.PI * 88;
        var percent = need > 0 ? Math.min(1, total.calories / need) : 0;
        circle.style.strokeDasharray = (circumference * percent) + " " + circumference;
    }

    // Su
    var waterEl = document.getElementById("homeWaterBig");
    if (waterEl) waterEl.innerText = entry.water || 0;

    // Adım
    var stepEl = document.getElementById("homeStepsBig");
    if (stepEl) {
        var steps = entry.steps || 0;
        stepEl.innerText = steps >= 1000 ? (steps / 1000).toFixed(1) + "k" : steps;
    }

    // Egzersiz kalori
    var exEl = document.getElementById("homeExerciseBig");
    if (exEl) exEl.innerText = entry.exercise || 0;

    // Spor süresi
    var sportEl = document.getElementById("homeSportBig");
    if (sportEl) sportEl.innerText = entry.exerciseDuration || 0;
}

// ============================================================
// UYGULAMA ARAYÜZ (UI) ve MANTIK
// ============================================================

function showNotification(message) {
    var notif = document.createElement("div");
    notif.className = "notification";
    notif.innerHTML = message;
    document.body.appendChild(notif);
    setTimeout(function() {
        notif.remove();
    }, 3000);
}

// ==================== VERİ MIGRATION (Eski -> Yeni) ====================
function migrateEntries() {
    if (!dailyEntries) return;
    var migrated = false;
    for (var date in dailyEntries) {
        var entry = dailyEntries[date];
        if (!entry) continue;
        ["morning", "noon", "evening", "snack"].forEach(function(mealKey) {
            var meal = entry[mealKey];
            if (!meal) return;
            if (Array.isArray(meal.items)) return; // Zaten yeni format
            var items = [];
            if (meal.cal > 0 || meal.protein > 0 || meal.carbs > 0 || meal.fat > 0) {
                items.push({
                    name: "Eski Kayıt",
                    emoji: "🍽️",
                    cal: meal.cal || 0,
                    prot: meal.protein || 0,
                    carbs: meal.carbs || 0,
                    fat: meal.fat || 0
                });
            }
            entry[mealKey] = { items: items };
            migrated = true;
        });
    }
    if (migrated) console.log("✅ Eski veriler yeni formata çevrildi.");
}

// ==================== YARDIMCI FONKSİYONLAR ====================
function getMealTotal(meal) {
    var total = { cal: 0, prot: 0, carbs: 0, fat: 0 };
    if (!meal || !Array.isArray(meal.items)) return total;
    meal.items.forEach(function(item) {
        total.cal += Number(item.cal) || 0;
        total.prot += Number(item.prot) || 0;
        total.carbs += Number(item.carbs) || 0;
        total.fat += Number(item.fat) || 0;
    });
    return total;
}

// ==================== ANA updateUI ====================
function updateUI() {
    var entry = dailyEntries[currentDate];
    if (!entry) {
        entry = getEmptyMeals();
        dailyEntries[currentDate] = entry;
    }

    var cdEl = document.getElementById("currentDate");
    if (cdEl) cdEl.innerHTML = currentDate.replace(/-/g, "/");

    // Aktivite inputları
    var actSel = document.getElementById("activitySelect");
    if (actSel) actSel.value = entry.activity || 1.375;
    var exCal = document.getElementById("exerciseCal");
    if (exCal) exCal.value = entry.exercise || 0;
    var exDur = document.getElementById("exerciseDurationTotal");
    if (exDur) exDur.value = entry.exerciseDuration || "";
    var stepEl = document.getElementById("stepCount");
    if (stepEl) stepEl.value = entry.steps || "";

    // Su
    // Su
    var waterEl = document.getElementById("waterCount");
    if (waterEl) waterEl.innerText = entry.water || 0;
    var waterMlEl = document.getElementById("waterMl");
    if (waterMlEl) waterMlEl.innerText = (entry.water || 0) * 200;

    // Su progress bar (hedef: 8 bardak = 100%)
    var waterProgressEl = document.getElementById("waterProgressFill");
    if (waterProgressEl) {
        var waterPercent = Math.min(100, ((entry.water || 0) / 8) * 100);
        waterProgressEl.style.width = waterPercent + "%";
    }

    // Yemek listeleri
    renderMealItems("morning", entry);
    renderMealItems("noon", entry);
    renderMealItems("evening", entry);
    renderMealItems("snack", entry);

    // Toplam hesapla
    var total = getDailyTotal(entry);
    var need = getDailyNeeds(currentDate);
    var deficit = total.calories - need;

    // Makro hedefleri
    var targetProtein = userProfile.targetProtein || Math.round((userProfile.weight || 70) * 1.8);
    var remainingCalsForMacros = Math.max(0, need - (targetProtein * 4));
    var targetCarbs = userProfile.targetCarbs || Math.round((remainingCalsForMacros * 0.55) / 4);
    var targetFat = userProfile.targetFat || Math.round((remainingCalsForMacros * 0.45) / 9);

    // Makro özet değerleri
    var tProtEl = document.getElementById("totalProtein");
    if (tProtEl) tProtEl.innerText = total.protein.toFixed(1) + "g";
    var tCarbEl = document.getElementById("totalCarbs");
    if (tCarbEl) tCarbEl.innerText = total.carbs.toFixed(1) + "g";
    var tFatEl = document.getElementById("totalFat");
    if (tFatEl) tFatEl.innerText = total.fat.toFixed(1) + "g";

    // Progress barlar
    var proteinPercent = targetProtein > 0 ? (total.protein / targetProtein) * 100 : 0;
    var carbsPercent = targetCarbs > 0 ? (total.carbs / targetCarbs) * 100 : 0;
    var fatPercent = targetFat > 0 ? (total.fat / targetFat) * 100 : 0;

    var pFill = document.getElementById("proteinProgressFill");
    if (pFill) pFill.style.width = (proteinPercent > 100 ? 100 : proteinPercent) + "%";
    var cFill = document.getElementById("carbsProgressFill");
    if (cFill) cFill.style.width = (carbsPercent > 100 ? 100 : carbsPercent) + "%";
    var fFill = document.getElementById("fatProgressFill");
    if (fFill) fFill.style.width = (fatPercent > 100 ? 100 : fatPercent) + "%";

    // Hedef metinleri
    var pText = document.getElementById("proteinTargetText");
    if (pText) pText.innerText = "/ " + targetProtein.toFixed(0) + "g";
    var cText = document.getElementById("carbsTargetText");
    if (cText) cText.innerText = "/ " + targetCarbs.toFixed(0) + "g";
    var fText = document.getElementById("fatTargetText");
    if (fText) fText.innerText = "/ " + targetFat.toFixed(0) + "g";

    // Genel bakış kartı
    var ovCalEl = document.getElementById("overviewCalories");
    if (ovCalEl) ovCalEl.innerText = total.calories;
    var ovTargetEl = document.getElementById("overviewTarget");
    if (ovTargetEl) ovTargetEl.innerText = need;
    var ovBarEl = document.getElementById("overviewBar");
    if (ovBarEl) {
        var ovPercent = need > 0 ? Math.min(100, (total.calories / need) * 100) : 0;
        ovBarEl.style.width = ovPercent + "%";
    }
    var statusText = document.getElementById("overviewStatusText");
    if (statusText) {
        if (total.calories === 0) statusText.innerText = "Bugün henüz kayıt yok 💤";
        else if (deficit > 200) statusText.innerText = "Hedefin " + deficit + " kcal altındasın. Biraz daha yiyebilirsin! 🍽️";
        else if (deficit < -200) statusText.innerText = "Hedefini " + Math.abs(deficit) + " kcal aştın. Dengeyi koru! ⚖️";
        else statusText.innerText = "Harika! Hedefine çok yakınsın! 🎯";
    }

    // İhtiyaç ve denge
    var needDispEl = document.getElementById("dailyNeedDisplay");
    if (needDispEl) needDispEl.innerHTML = need + " kcal";
    var deficitEl = document.getElementById("deficitDisplay");
    if (deficitEl) {
        if (total.calories === 0) {
            deficitEl.innerHTML = "--";
            deficitEl.style.color = "";
        } else if (deficit > 0) {
            deficitEl.innerHTML = "+" + Math.min(deficit, 9999) + " kcal";
            deficitEl.style.color = "var(--danger)";
        } else {
            deficitEl.innerHTML = deficit + " kcal";
            deficitEl.style.color = "var(--success)";
        }
    }

    // Öğün hedefleri
    var morningTarget = Math.round(need * 0.25);
    var noonTarget = Math.round(need * 0.35);
    var eveningTarget = Math.round(need * 0.30);
    var snackTarget = Math.round(need * 0.10);

    var mtEl = document.getElementById("target-morning");
    if (mtEl) mtEl.innerText = "/ " + morningTarget + " kcal";
    var ntEl = document.getElementById("target-noon");
    if (ntEl) ntEl.innerText = "/ " + noonTarget + " kcal";
    var etEl = document.getElementById("target-evening");
    if (etEl) etEl.innerText = "/ " + eveningTarget + " kcal";
    var stEl = document.getElementById("target-snack");
    if (stEl) stEl.innerText = "/ " + snackTarget + " kcal";

    var morningCal = getMealTotal(entry.morning).cal;
    var noonCal = getMealTotal(entry.noon).cal;
    var eveningCal = getMealTotal(entry.evening).cal;
    var snackCal = getMealTotal(entry.snack).cal;

    var mpEl = document.getElementById("prog-morning");
    if (mpEl) mpEl.style.width = Math.min(100, (morningCal / morningTarget) * 100) + "%";
    var npEl = document.getElementById("prog-noon");
    if (npEl) npEl.style.width = Math.min(100, (noonCal / noonTarget) * 100) + "%";
    var epEl = document.getElementById("prog-evening");
    if (epEl) epEl.style.width = Math.min(100, (eveningCal / eveningTarget) * 100) + "%";
    var spEl = document.getElementById("prog-snack");
    if (spEl) spEl.style.width = Math.min(100, (snackCal / snackTarget) * 100) + "%";

    // Makro donut grafik
    if (window.Chart) {
        if (dailyMacroChart) dailyMacroChart.destroy();
        var macroCanvas = document.getElementById("dailyMacroChart");
        if (macroCanvas) {
            var macroCtx = macroCanvas.getContext("2d");
            var hasData = total.protein > 0 || total.carbs > 0 || total.fat > 0;
            dailyMacroChart = new Chart(macroCtx, {
                type: "doughnut",
                data: {
                    labels: ["Protein", "Karb", "Yağ"],
                    datasets: [{
                        data: hasData ? [total.protein, total.carbs, total.fat] : [1],
                        backgroundColor: hasData ? ["#10b981", "#f97316", "#a855f7"] : ["#e2e8f0"],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: "70%",
                    plugins: {
                        legend: {
                            position: "bottom",
                            labels: {
                                color: document.body.classList.contains("dark") ? "#94a3b8" : "#475569",
                                font: { size: 11 },
                                padding: 10
                            }
                        },
                        tooltip: { enabled: hasData }
                    }
                }
            });
        }
    }

    updateFeedback(total, need, targetProtein, targetCarbs, targetFat);

    // Ana sayfa özeti
    // ============ ANA SAYFA ÖZETİ (YENİ) ============
    updateHomeScreen(total, entry, need);

    // Vücut yağ oranı
    var fatPercentValEl = document.getElementById("fatPercentVal");
    if (fatPercentValEl) {
        var fp = bodyMeasurements[currentDate] ? bodyMeasurements[currentDate].fatPercentage : null;
        if (fp) fatPercentValEl.innerHTML = fp.toFixed(1) + " %";
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

// ==================== YEMEK LİSTESİ RENDER ====================
function renderMealItems(mealKey, entry) {
    var container = document.getElementById("items-" + mealKey);
    if (!container) return;
    var meal = entry[mealKey];
    var items = (meal && Array.isArray(meal.items)) ? meal.items : [];

    var html = "";
    for (var i = 0; i < items.length; i++) {
        var it = items[i];
        html += '<div class="meal-item">' +
            '<div class="meal-item-info">' +
            '<span class="meal-item-emoji">' + (it.emoji || "🍽️") + '</span>' +
            '<span class="meal-item-name">' + it.name + '</span>' +
            '<span class="meal-item-cal">' + Math.round(it.cal) + ' kcal</span>' +
            '</div>' +
            '<button class="meal-item-remove" onclick="removeMealItem(\'' + mealKey + '\', ' + i + ')">🗑️</button>' +
            '</div>';
    }
    container.innerHTML = html;

    var t = getMealTotal(meal);
    var totalEl = document.getElementById("total-" + mealKey);
    if (totalEl) {
        totalEl.innerHTML = "🔥 " + Math.round(t.cal) + " kcal · 🥩 " + t.prot.toFixed(1) + "g · 🍞 " + t.carbs.toFixed(1) + "g · 🥑 " + t.fat.toFixed(1) + "g";
    }
}

// ==================== ÖĞÜNE EKLE/ÇIKAR ====================
function addToMeal(mealKey, cal, prot, carbs, fat, foodName, emoji) {
    var entry = dailyEntries[currentDate];
    if (!entry) {
        entry = getEmptyMeals();
        dailyEntries[currentDate] = entry;
    }
    if (!entry[mealKey] || !Array.isArray(entry[mealKey].items)) {
        entry[mealKey] = { items: [] };
    }
    entry[mealKey].items.push({
        name: foodName || "Yemek",
        emoji: emoji || "🍽️",
        cal: Number(cal) || 0,
        prot: Number(prot) || 0,
        carbs: Number(carbs) || 0,
        fat: Number(fat) || 0
    });
    saveAllData();
    updateUI();
    showNotification("✅ " + (foodName || "Yemek") + " eklendi · " + Math.round(cal) + " kcal");
}

function removeMealItem(mealKey, index) {
    var entry = dailyEntries[currentDate];
    if (!entry || !entry[mealKey] || !Array.isArray(entry[mealKey].items)) return;
    entry[mealKey].items.splice(index, 1);
    saveAllData();
    updateUI();
    showNotification("🗑️ Yemek silindi");
}

function clearMeal(mealKey) {
    var entry = dailyEntries[currentDate];
    if (!entry) return;
    entry[mealKey] = { items: [] };
    saveAllData();
    updateUI();
    showNotification("🗑️ Öğün temizlendi");
}

// ==================== DİNAMİK GERİ BİLDİRİM ====================
function updateFeedback(total, need, targetProtein, targetCarbs, targetFat) {
    var el = document.getElementById("feedbackText");
    if (!el) return;
    if (total.calories === 0) {
        el.innerHTML = "Bugün henüz yemek eklemedin. <b>🔍 Yemek Ara</b> butonuyla hızlıca başlayabilirsin!";
        return;
    }
    var messages = [];
    var proteinRemaining = targetProtein - total.protein;
    if (proteinRemaining > 20) messages.push("🥩 Protein hedefine <b>" + Math.round(proteinRemaining) + "g</b> kaldı. Tavuk, yumurta veya yoğurt ekleyebilirsin.");
    else if (proteinRemaining < -20) messages.push("🥩 Protein hedefini <b>" + Math.round(Math.abs(proteinRemaining)) + "g</b> aştın. Dengeli git!");
    else messages.push("✅ Protein hedefine çok yakınsın, harika!");

    var calRemaining = need - total.calories;
    if (calRemaining > 400) messages.push("🍽️ Günlük kalori hedefine <b>" + calRemaining + " kcal</b> kaldı.");
    else if (calRemaining < -400) messages.push("⚠️ Kalori hedefini <b>" + Math.abs(calRemaining) + " kcal</b> aştın.");

    if (total.fat > targetFat * 1.3) messages.push("🥑 Yağ alımın hedefinin üzerinde.");
    if (total.carbs < targetCarbs * 0.5 && total.calories > need * 0.7) messages.push("🍞 Karbonhidrat alımın düşük.");

    var entry = dailyEntries[currentDate];
    var water = entry ? (entry.water || 0) : 0;
    if (water < 4) messages.push("💧 Su tüketimin düşük. Günde en az 8 bardak içmeye çalış!");

    if (messages.length === 0) messages.push("🌟 Harika gidiyorsun! Hedeflerine çok yakınsın.");
    el.innerHTML = messages.slice(0, 3).join("<br><br>");
}

// ==================== MODAL AÇ/KAPAT ====================
var currentMeal = "morning";
var currentListCat = "all";
var selectedPhotoFile = null;

function openModal(id) {
    var el = document.getElementById(id);
    if (el) el.classList.add("open");
}

function closeModal(id) {
    var el = document.getElementById(id);
    if (el) el.classList.remove("open");
    setTimeout(function() {
        if (id === "photoModal") {
            selectedPhotoFile = null;
            var pc = document.getElementById("photoPreviewContent");
            if (pc) pc.innerHTML = '<div class="photo-preview-icon">📸</div><div style="text-align:center; padding: 0 1rem;">Fotoğraf çek veya galeriden seç</div>';
            var pi = document.getElementById("photoInput");
            if (pi) pi.value = "";
            var ab = document.getElementById("analyzePhotoBtn");
            if (ab) ab.disabled = true;
            var pr = document.getElementById("photoResult");
            if (pr) pr.innerHTML = "";
        }
        if (id === "textModal") {
            var ti = document.getElementById("textInput");
            if (ti) ti.value = "";
            var tr = document.getElementById("textResult");
            if (tr) tr.innerHTML = "";
        }
        if (id === "manualModal") {
            var mn = document.getElementById("manualName");
            if (mn) mn.value = "";
            var mc = document.getElementById("manualCal");
            if (mc) mc.value = "";
            var mpr = document.getElementById("manualProt");
            if (mpr) mpr.value = "";
            var mcb = document.getElementById("manualCarbs");
            if (mcb) mcb.value = "";
            var mf = document.getElementById("manualFat");
            if (mf) mf.value = "";
            var md = document.getElementById("manualDetail");
            if (md) md.classList.remove("open");
            var dt = document.getElementById("detailToggle");
            if (dt) dt.classList.remove("open");
        }
    }, 300);
}

// ==================== MANUEL ====================
function openManual(mealKey) {
    currentMeal = mealKey;
    var titles = { morning: "☀️ Sabah", noon: "🌞 Öğle", evening: "🌙 Akşam", snack: "🍎 Ara Öğün" };
    var tt = document.getElementById("manualModalTitle");
    if (tt) tt.innerText = titles[mealKey] + " · Manuel Ekle";
    openModal("manualModal");
    setTimeout(function() {
        var el = document.getElementById("manualCal");
        if (el) el.focus();
    }, 400);
}

function toggleManualDetail() {
    var d = document.getElementById("manualDetail");
    var t = document.getElementById("detailToggle");
    if (d) d.classList.toggle("open");
    if (t) t.classList.toggle("open");
}

function setManualCal(amount) {
    var inp = document.getElementById("manualCal");
    if (!inp) return;
    var cur = parseFloat(inp.value) || 0;
    inp.value = cur + amount;
}

function confirmManual() {
    var nameEl = document.getElementById("manualName");
    var calEl = document.getElementById("manualCal");
    var protEl = document.getElementById("manualProt");
    var carbsEl = document.getElementById("manualCarbs");
    var fatEl = document.getElementById("manualFat");

    var name = (nameEl && nameEl.value.trim()) || "Manuel Giriş";
    var cal = parseFloat(calEl && calEl.value);
    var prot = parseFloat(protEl && protEl.value) || 0;
    var carbs = parseFloat(carbsEl && carbsEl.value) || 0;
    var fat = parseFloat(fatEl && fatEl.value) || 0;

    if (!cal || cal <= 0) {
        showNotification("⚠️ Kalori girmelisin");
        if (calEl) calEl.focus();
        return;
    }
    addToMeal(currentMeal, cal, prot, carbs, fat, name, "✏️");
    closeModal("manualModal");
}

// ==================== FOTOĞRAF ====================
function openPhoto(mealKey) {
    currentMeal = mealKey;
    var titles = { morning: "☀️ Sabah", noon: "🌞 Öğle", evening: "🌙 Akşam", snack: "🍎 Ara Öğün" };
    var tt = document.getElementById("photoModalTitle");
    if (tt) tt.innerText = titles[mealKey] + " · Fotoğrafla Ekle";
    openModal("photoModal");
}

function onPhotoSelected(e) {
    var file = e.target.files[0];
    if (!file) return;
    selectedPhotoFile = file;
    var reader = new FileReader();
    reader.onload = function(ev) {
        var pc = document.getElementById("photoPreviewContent");
        if (pc) pc.innerHTML = '<img src="' + ev.target.result + '" alt="preview">';
    };
    reader.readAsDataURL(file);
    var ab = document.getElementById("analyzePhotoBtn");
    if (ab) ab.disabled = false;
}

async function analyzePhoto() {
    if (!selectedPhotoFile) return;
    var resultDiv = document.getElementById("photoResult");
    if (!resultDiv) return;
    resultDiv.innerHTML = '<div class="ai-loading"><div class="ai-spinner"></div><div>🤖 Gemini analiz ediyor...</div></div>';
    var ab = document.getElementById("analyzePhotoBtn");
    if (ab) ab.disabled = true;

    var apiKey = localStorage.getItem("gemini_api_key") || "";
    if (!apiKey) {
        resultDiv.innerHTML = '<div style="padding:1rem; background:rgba(239,68,68,0.15); border:1px solid var(--danger); border-radius:1rem; color:#fca5a5; font-weight:700;">❌ API anahtarı yok. Yapay Zeka sekmesinden gir.</div>';
        if (ab) ab.disabled = false;
        return;
    }

    try {
        var base64 = await new Promise(function(res) {
            var r = new FileReader();
            r.onload = function() { res(r.result.split(',')[1]); };
            r.readAsDataURL(selectedPhotoFile);
        });
        var parts = [
            { text: "Sen bir diyetisyensin. Bu fotoğraftaki yemeği analiz et. SADECE şu JSON formatında cevap ver, ekstra metin yok:\n{\"food_name\": \"yemek adı\", \"calories\": 0, \"protein\": 0, \"fat\": 0, \"carbs\": 0}" },
            { inline_data: { mime_type: selectedPhotoFile.type, data: base64 } }
        ];
        var url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey;
        var response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: parts }],
                generationConfig: { response_mime_type: "application/json" }
            })
        });
        if (!response.ok) throw new Error("API hatası: " + response.status);
        var data = await response.json();
        var text = data.candidates[0].content.parts[0].text;
        var clean = text.replace(/```json/gi, "").replace(/```/g, "").trim();
        var ai = JSON.parse(clean);
        showAIResult("photoResult", ai, "photo");
    } catch (err) {
        resultDiv.innerHTML = '<div style="padding:1rem; background:rgba(239,68,68,0.15); border:1px solid var(--danger); border-radius:1rem; color:#fca5a5; font-weight:700;">❌ Hata: ' + err.message + '</div>';
        if (ab) ab.disabled = false;
    }
}

// ==================== METİN ====================
function openText(mealKey) {
    currentMeal = mealKey;
    var titles = { morning: "☀️ Sabah", noon: "🌞 Öğle", evening: "🌙 Akşam", snack: "🍎 Ara Öğün" };
    var tt = document.getElementById("textModalTitle");
    if (tt) tt.innerText = titles[mealKey] + " · Yazarak Ekle";
    openModal("textModal");
    setTimeout(function() {
        var el = document.getElementById("textInput");
        if (el) el.focus();
    }, 400);
}

function addHint(txt) {
    var inp = document.getElementById("textInput");
    if (!inp) return;
    if (inp.value) inp.value += ", " + txt;
    else inp.value = txt;
}

async function analyzeText() {
    var inp = document.getElementById("textInput");
    var text = inp ? inp.value.trim() : "";
    if (!text) return showNotification("⚠️ Bir şeyler yaz");

    var resultDiv = document.getElementById("textResult");
    if (!resultDiv) return;
    resultDiv.innerHTML = '<div class="ai-loading"><div class="ai-spinner"></div><div>🤖 Gemini hesaplıyor...</div></div>';
    var ab = document.getElementById("analyzeTextBtn");
    if (ab) ab.disabled = true;

    var apiKey = localStorage.getItem("gemini_api_key") || "";
    if (!apiKey) {
        resultDiv.innerHTML = '<div style="padding:1rem; background:rgba(239,68,68,0.15); border:1px solid var(--danger); border-radius:1rem; color:#fca5a5; font-weight:700;">❌ API anahtarı yok.</div>';
        if (ab) ab.disabled = false;
        return;
    }

    try {
        var prompt = "Sen bir diyetisyensin. Kullanıcının yazdığı yemekleri analiz et ve SADECE şu JSON formatında cevap ver, ekstra metin yok:\n{\"food_name\": \"kısa açıklama\", \"calories\": 0, \"protein\": 0, \"fat\": 0, \"carbs\": 0}\n\nKullanıcının yazdığı: " + text;
        var url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey;
        var response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { response_mime_type: "application/json" }
            })
        });
        if (!response.ok) throw new Error("API hatası: " + response.status);
        var data = await response.json();
        var text2 = data.candidates[0].content.parts[0].text;
        var clean = text2.replace(/```json/gi, "").replace(/```/g, "").trim();
        var ai = JSON.parse(clean);
        showAIResult("textResult", ai, "text");
    } catch (err) {
        resultDiv.innerHTML = '<div style="padding:1rem; background:rgba(239,68,68,0.15); border:1px solid var(--danger); border-radius:1rem; color:#fca5a5; font-weight:700;">❌ Hata: ' + err.message + '</div>';
        if (ab) ab.disabled = false;
    }
}

// ==================== AI SONUÇ ====================
function showAIResult(containerId, ai, source) {
    var container = document.getElementById(containerId);
    if (!container) return;
    var cal = Math.round(ai.calories || 0);
    var prot = ai.protein || 0;
    var carbs = ai.carbs || 0;
    var fat = ai.fat || 0;
    var foodName = ai.food_name || "Yemek";
    var safeName = foodName.replace(/'/g, "\\'").replace(/"/g, "&quot;");
    container.innerHTML =
        '<div class="ai-result">' +
        '<div class="ai-result-title">🤖 Yapay Zeka Sonucu</div>' +
        '<div class="ai-result-food">' + foodName + '</div>' +
        '<div class="ai-macro-grid">' +
        '<div class="ai-macro-box cal"><div class="ai-macro-val">' + cal + '</div><div class="ai-macro-lbl">kcal</div></div>' +
        '<div class="ai-macro-box p"><div class="ai-macro-val">' + prot + 'g</div><div class="ai-macro-lbl">Protein</div></div>' +
        '<div class="ai-macro-box c"><div class="ai-macro-val">' + carbs + 'g</div><div class="ai-macro-lbl">Karb</div></div>' +
        '<div class="ai-macro-box f"><div class="ai-macro-val">' + fat + 'g</div><div class="ai-macro-lbl">Yağ</div></div>' +
        '</div>' +
        '<button class="big-btn green" onclick="confirmAIAdd(' + cal + ', ' + prot + ', ' + carbs + ', ' + fat + ', \'' + safeName + '\', \'' + containerId + '\')">✅ Öğüne Ekle</button>' +
        '</div>';
    var ab = document.getElementById(source === "photo" ? "analyzePhotoBtn" : "analyzeTextBtn");
    if (ab) ab.disabled = false;
}

function confirmAIAdd(cal, prot, carbs, fat, name, containerId) {
    addToMeal(currentMeal, cal, prot, carbs, fat, name, "🤖");
    if (containerId === "photoResult") closeModal("photoModal");
    else closeModal("textModal");
}

// ==================== LİSTE ====================
function openList(mealKey) {
    currentMeal = mealKey;
    currentListCat = "all";
    var titles = { morning: "☀️ Sabah", noon: "🌞 Öğle", evening: "🌙 Akşam", snack: "🍎 Ara Öğün" };
    var tt = document.getElementById("listModalTitle");
    if (tt) tt.innerText = titles[mealKey] + " · Listeden Seç";
    var ls = document.getElementById("listSearch");
    if (ls) ls.value = "";
    renderListCats();
    renderFoodGrid("");
    openModal("listModal");
}

function renderListCats() {
    var bar = document.getElementById("listCats");
    if (!bar || !window.besinKategoriListesi) return;
    bar.innerHTML = besinKategoriListesi.map(function(c) {
        return '<button class="list-cat ' + (c.id === currentListCat ? 'active' : '') + '" onclick="selectListCat(\'' + c.id + '\')">' + c.emoji + ' ' + c.name + '</button>';
    }).join("");
}

function selectListCat(id) {
    currentListCat = id;
    var ls = document.getElementById("listSearch");
    if (ls) ls.value = "";
    renderListCats();
    renderFoodGrid("");
}

function renderFoodGrid(query) {
    var grid = document.getElementById("foodGrid");
    if (!grid || !window.besinVeritabani) return;
    var list;
    query = (query || "").trim().toLowerCase();

    if (query) {
        list = besinVeritabani.filter(function(b) { return b.isim.toLowerCase().includes(query); });
    } else if (currentListCat === "all") {
        list = besinVeritabani.slice(0, 40);
    } else if (currentListCat === "populer") {
        var pop = window.populerBesinIds || ["tavuk_gogsu", "yumurta", "pilav"];
        list = besinVeritabani.filter(function(b) { return pop.indexOf(b.id) !== -1; });
    } else {
        list = besinVeritabani.filter(function(b) { return b.cat === currentListCat; });
    }

    if (list.length === 0) {
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align:center; padding:2rem; color:var(--text-secondary);">🔍 Sonuç yok</div>';
        return;
    }
    grid.innerHTML = list.map(function(f) {
        return '<div class="food-tile" onclick="quickAdd(\'' + f.id + '\', this)">' +
            '<div class="food-tile-emoji">' + f.emoji + '</div>' +
            '<div class="food-tile-name">' + f.isim + '</div>' +
            '<div class="food-tile-cal">🔥 ' + f.cal + ' kcal</div>' +
            '<div class="food-tile-unit">' + f.birim + '</div>' +
            '</div>';
    }).join("");
}

function quickAdd(foodId, el) {
    if (!window.besinVeritabani) return;
    var f = besinVeritabani.find(function(x) { return x.id === foodId; });
    if (!f) return;
    addToMeal(currentMeal, f.cal, f.prot, f.carbs, f.fat, f.isim, f.emoji);
    el.classList.add("added");
    setTimeout(function() { el.classList.remove("added"); }, 1200);
}

// ==================== QUICK DATES ====================
function renderQuickDates() {
    var container = document.getElementById("quickDates");
    if (!container) return;
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

// ==================== RENDER HISTORY ====================
function renderHistory() {
    var container = document.getElementById("historyList");
    if (!container) return;
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

// ==================== RENDER REPORTS ====================
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
                weeklyCal += total.calories;
                weeklyCount++;
            }
            if (i < 30) {
                monthlyCal += total.calories;
                monthlyProt += total.protein;
                monthlyCount++;
            }
        }
    }
    var weeklyAvg = weeklyCount > 0 ? Math.round(weeklyCal / weeklyCount) : 0;
    var monthlyAvg = monthlyCount > 0 ? Math.round(monthlyCal / monthlyCount) : 0;
    var monthlyAvgProt = monthlyCount > 0 ? (monthlyProt / monthlyCount).toFixed(1) : 0;
    var wr = document.getElementById("weeklyReport");
    if (wr) wr.innerHTML = "<div class='stat-grid'><div class='stat-item'><div class='small-text'>Gün</div><div>" + weeklyCount + "</div></div><div class='stat-item'><div class='small-text'>Ort. Kalori</div><div>" + weeklyAvg + " kcal</div></div><div class='stat-item'><div class='small-text'>Toplam</div><div>" + weeklyCal + " kcal</div></div></div>";
    var mr = document.getElementById("monthlyReport");
    if (mr) mr.innerHTML = "<div class='stat-grid'><div class='stat-item'><div class='small-text'>Gün</div><div>" + monthlyCount + "</div></div><div class='stat-item'><div class='small-text'>Ort. Kalori</div><div>" + monthlyAvg + " kcal</div></div><div class='stat-item'><div class='small-text'>Ort. Protein</div><div>" + monthlyAvgProt + " g</div></div></div>";
}

// ==================== RENDER GOAL INFO ====================
function renderGoalInfo() {
    var container = document.getElementById("goalInfo");
    var remainingDiv = document.getElementById("remainingInfo");
    if (!container) return;
    if (userProfile.weight && userProfile.targetWeight) {
        var current = userProfile.weight;
        var target = userProfile.targetWeight;
        var diff = current - target;
        var percent = 0;
        if (diff > 0) { percent = (diff / current) * 100; if (percent > 100) percent = 100; }
        container.innerHTML = "<div class='stat-item'><div class='small-text'>Mevcut</div><div>" + current + " kg</div></div><div class='stat-item'><div class='small-text'>Hedef</div><div>" + target + " kg</div></div><div class='stat-item'><div class='small-text'>Fark</div><div>" + Math.abs(diff).toFixed(1) + " kg</div></div>";
        var wpf = document.getElementById("weightProgressFill");
        if (wpf) wpf.style.width = percent + "%";
        if (remainingDiv) remainingDiv.innerHTML = "<div class='stat-item'><div class='small-text'>Kalan</div><div>" + Math.abs(diff).toFixed(1) + " kg</div></div>";
    } else {
        container.innerHTML = "<div class='small-text'>Hedef kilonuzu girin</div>";
        if (remainingDiv) remainingDiv.innerHTML = "<div class='small-text'>Hedef belirleyin</div>";
    }
}

// ==================== RENDER MOOD HISTORY ====================
function renderMoodHistory() {
    var container = document.getElementById("moodHistory");
    if (!container) return;
    var dates = Object.keys(moodEntries).sort().reverse();
    if (dates.length === 0) {
        container.innerHTML = "<div class='small-text' style='text-align:center; padding:1rem;'>Henüz ruh hali kaydı yok.</div>";
        return;
    }
    var html = "";
    for (var i = 0; i < dates.length && i < 14; i++) {
        var entry = moodEntries[dates[i]];
        var moodColors = {
            sad: "rgba(59,130,246,0.15)",
            neutral: "rgba(148,163,184,0.15)",
            good: "rgba(16,185,129,0.15)",
            happy: "rgba(245,158,11,0.15)",
            excellent: "rgba(168,85,247,0.15)"
        };
        var bgColor = moodColors[entry.type] || "var(--bg)";

        var noteHtml = "";
        if (entry.note && entry.note.trim()) {
            noteHtml = '<div class="mood-history-note">📝 ' + entry.note.replace(/</g, "&lt;").replace(/>/g, "&gt;") + '</div>';
        }

        html += '<div class="daily-item" style="padding: 0.8rem 1rem; margin-bottom: 0.5rem; background: ' + bgColor + '; border:none; cursor:default;">' +
            '<div class="flex-between">' +
            '<span style="font-weight:700;">' + dates[i] + '</span>' +
            '<span style="font-size:1.6rem;">' + (entry.mood || "😐") + '</span>' +
            '</div>' +
            noteHtml +
            '</div>';
    }
    container.innerHTML = html;
}

// ==================== SUGGESTIONS ====================
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
    if (!suggestionEl) return;
    if (validDays.length < 5) {
        var kalan = 5 - validDays.length;
        suggestionEl.innerHTML = "💡 Kişiselleştirilmiş öneriler için <b>" + kalan + " gün</b> daha beslenme kaydı girmelisiniz.";
        return;
    }
    var avgCal = 0,
        avgProt = 0,
        avgWater = 0;
    for (var j = 0; j < validDays.length; j++) {
        var e = dailyEntries[validDays[j]];
        var t = getDailyTotal(e);
        avgCal += t.calories;
        avgProt += t.protein;
        avgWater += (e.water || 0);
    }
    avgCal /= 5;
    avgProt /= 5;
    avgWater /= 5;
    var targetNeed = getDailyNeeds(currentDate);
    var targetProt = userProfile.targetProtein || Math.round((userProfile.weight || 70) * 1.8);
    var suggestion = "Harika bir denge kurmuşsunuz, son 5 gün verileriniz çok iyi! 🌟";
    if (avgWater < 6) suggestion = "Son 5 günde ortalama " + avgWater.toFixed(1) + " bardak su içtiniz. Su tüketiminizi artırmalısınız! 💧";
    else if (avgProt < targetProt * 0.8) suggestion = "Son 5 günlük protein ortalamanız (" + avgProt.toFixed(0) + "g) hedefinizin altında. 🥩";
    else if (avgCal > targetNeed + 200) suggestion = "Son 5 günde hedefinizin ortalama " + Math.round(avgCal - targetNeed) + " kcal üzerinde aldınız. 🥗";
    else if (avgCal < targetNeed - 500 && avgCal > 0) suggestion = "Son 5 günde çok düşük kalori almışsınız. 🥜";
    suggestionEl.innerHTML = suggestion;
}

// ==================== RENDER BADGES ====================
function renderBadges() {
    var badges = [
        { id: "water", icon: "💧", title: "Su Şampiyonu", desc: "Bir günde en az 8 bardak su iç." },
        { id: "water_pro", icon: "🌊", title: "Su Kolik", desc: "Bir günde en az 12 bardak su iç." },
        { id: "steps", icon: "🚶", title: "Adım Ustası", desc: "Bir günde 10.000 adım at." },
        { id: "workout", icon: "💪", title: "İlk Antrenman", desc: "Sisteme ilk egzersizini kaydet." },
        { id: "cardio", icon: "🔥", title: "Kardiyo Canavarı", desc: "Bir günde egzersizle 500 kcal yak." },
        { id: "protein", icon: "🥩", title: "Protein Canavarı", desc: "Günlük protein hedefine tam ulaş." },
        { id: "target", icon: "🎯", title: "Tam İsabet", desc: "Kalori hedefine tam yaklaş." },
        { id: "early", icon: "🌅", title: "Erkenci Kuş", desc: "Sabah kahvaltısını kaydet." },
        { id: "streak", icon: "📅", title: "7 Günlük Seri", desc: "Son 7 gün üst üste veri gir." },
        { id: "streak_pro", icon: "⚡", title: "Demir İrade", desc: "Son 14 gün üst üste veri gir." }
    ];
    for (var b = 0; b < badges.length; b++) badges[b].unlocked = false;
    var dates = Object.keys(dailyEntries).sort().reverse();
    for (var i = 0; i < dates.length; i++) {
        var entry = dailyEntries[dates[i]];
        var total = getDailyTotal(entry);
        var need = getDailyNeeds(dates[i]);
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
            if (entry.morning && entry.morning.items && entry.morning.items.length > 0) badges[7].unlocked = true;
        }
    }
    var streakCount = 0;
    var todayObj = new Date();
    for (var k = 0; k < 14; k++) {
        var d = new Date();
        d.setDate(todayObj.getDate() - k);
        var iso = d.toISOString().slice(0, 10);
        var e2 = dailyEntries[iso];
        if (e2) {
            var t2 = getDailyTotal(e2);
            if (t2.calories > 0 || (e2.water && e2.water > 0) || (e2.steps && e2.steps > 0) || (e2.exerciseDuration && e2.exerciseDuration > 0)) streakCount++;
            else break;
        } else break;
    }
    if (streakCount >= 7) badges[8].unlocked = true;
    if (streakCount >= 14) badges[9].unlocked = true;
    var container = document.getElementById("badgesList");
    if (!container) return;
    container.innerHTML = "";
    for (var j = 0; j < badges.length; j++) {
        var bd = badges[j];
        var div = document.createElement("div");
        div.className = "badge-card " + (bd.unlocked ? "unlocked" : "locked");
        div.innerHTML = "<div class='badge-status'>" + (bd.unlocked ? "✨" : "🔒") + "</div><div class='badge-icon'>" + bd.icon + "</div><div class='badge-title'>" + bd.title + "</div><div class='badge-desc'>" + bd.desc + "</div>";
        container.appendChild(div);
    }
}

// ==================== SAVE (No-op artık) ====================
function saveCurrentFromInputs() {
    var entry = dailyEntries[currentDate];
    if (!entry) {
        entry = getEmptyMeals();
        dailyEntries[currentDate] = entry;
    }

    // Aktivite verilerini inputlardan al
    var actSel = document.getElementById("activitySelect");
    if (actSel) entry.activity = Number(actSel.value) || 1.375;

    var exCal = document.getElementById("exerciseCal");
    if (exCal) entry.exercise = Number(exCal.value) || 0;

    var exDur = document.getElementById("exerciseDurationTotal");
    if (exDur) entry.exerciseDuration = Number(exDur.value) || 0;

    var stepEl = document.getElementById("stepCount");
    if (stepEl) entry.steps = Number(stepEl.value) || 0;

    saveAllData();
    updateUI();

    var btn = document.getElementById("saveDailyBtn");
    if (btn) {
        var oldText = btn.innerText;
        btn.innerText = "✓ Kaydedildi!";
        setTimeout(function() { btn.innerText = oldText; }, 1500);
    }
    showNotification("✅ Veriler kaydedildi!");
}

// ==================== EXPORT CSV ====================
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

// ==================== PROFIL ====================
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
        var bmrEl = document.getElementById("bmrVal");
        if (bmrEl) bmrEl.innerHTML = bmr + " kcal";
        var needEl = document.getElementById("needVal");
        if (needEl) needEl.innerHTML = Math.round(bmr * 1.375) + " kcal";
        var ptEl = document.getElementById("proteinTarget");
        if (ptEl) ptEl.innerHTML = Math.round((userProfile.weight || 0) * 1.8) + " g";
    }
    updateUI();
    var btn = document.getElementById("saveProfileBtn");
    if (btn) {
        btn.innerText = "✓ Kaydedildi!";
        setTimeout(function() { btn.innerText = "💾 Kaydet"; }, 1500);
    }
    localStorage.setItem("nutritrack_profile_completed", "true");
    setTimeout(function() {
        switchTab('home');
        showNotification("✅ Profil kaydedildi! 🎉");
    }, 1000);
}

// ==================== GOAL ====================
// ============================================================
// HEDEFLER SEKMESİ — YENİ SİSTEM
// ============================================================

var currentGoalType = "weight";
var goalChartRange = 30;
var goalProgressChartInstance = null;

// ============ HEDEF TÜRÜ SEÇİCİ ============
function selectGoalType(type) {
    currentGoalType = type;
    document.querySelectorAll(".goal-type-btn").forEach(function(btn) {
        btn.classList.toggle("active", btn.getAttribute("data-type") === type);
    });
    renderGoalFields();
}

function renderGoalFields() {
    var container = document.getElementById("goalFieldsContainer");
    if (!container) return;

    var html = "";

    if (currentGoalType === "weight") {
        html =
            '<div class="goal-field">' +
            '<label class="goal-field-label">🎯 Hedef Kilo (kg)</label>' +
            '<input type="number" id="goalTargetWeight" placeholder="Örn: 70" step="0.1" inputmode="decimal">' +
            '</div>' +
            '<div class="goal-field">' +
            '<label class="goal-field-label">📅 Hedef Tarih</label>' +
            '<input type="date" id="goalTargetDate">' +
            '</div>';
    } else if (currentGoalType === "muscle") {
        html =
            '<div class="goal-field">' +
            '<label class="goal-field-label">💪 Hedef Kilo (kg)</label>' +
            '<input type="number" id="goalTargetWeight" placeholder="Örn: 80" step="0.1" inputmode="decimal">' +
            '</div>' +
            '<div class="goal-field">' +
            '<label class="goal-field-label">📅 Hedef Tarih</label>' +
            '<input type="date" id="goalTargetDate">' +
            '</div>' +
            '<div class="goal-field">' +
            '<label class="goal-field-label">🥩 Günlük Protein Hedefi (g)</label>' +
            '<input type="number" id="goalTargetProteinMuscle" placeholder="Örn: 160" inputmode="numeric">' +
            '</div>';
    } else if (currentGoalType === "waist") {
        html =
            '<div class="goal-field">' +
            '<label class="goal-field-label">📏 Hedef Bel Çevresi (cm)</label>' +
            '<input type="number" id="goalTargetWaist" placeholder="Örn: 85" step="0.1" inputmode="decimal">' +
            '</div>' +
            '<div class="goal-field">' +
            '<label class="goal-field-label">📅 Hedef Tarih</label>' +
            '<input type="date" id="goalTargetDate">' +
            '</div>';
    } else if (currentGoalType === "fat") {
        html =
            '<div class="goal-field">' +
            '<label class="goal-field-label">🔥 Hedef Yağ Oranı (%)</label>' +
            '<input type="number" id="goalTargetFat" placeholder="Örn: 18" step="0.1" inputmode="decimal">' +
            '</div>' +
            '<div class="goal-field">' +
            '<label class="goal-field-label">📅 Hedef Tarih</label>' +
            '<input type="date" id="goalTargetDate">' +
            '</div>';
    }

    container.innerHTML = html;

    // Aktif hedef varsa inputları doldur
    if (userProfile.activeGoal && userProfile.activeGoal.type === currentGoalType) {
        var g = userProfile.activeGoal;
        if (g.targetWeight && document.getElementById("goalTargetWeight"))
            document.getElementById("goalTargetWeight").value = g.targetWeight;
        if (g.targetDate && document.getElementById("goalTargetDate"))
            document.getElementById("goalTargetDate").value = g.targetDate;
        if (g.targetProtein && document.getElementById("goalTargetProteinMuscle"))
            document.getElementById("goalTargetProteinMuscle").value = g.targetProtein;
        if (g.targetWaist && document.getElementById("goalTargetWaist"))
            document.getElementById("goalTargetWaist").value = g.targetWaist;
        if (g.targetFat && document.getElementById("goalTargetFat"))
            document.getElementById("goalTargetFat").value = g.targetFat;
    }
}

// ============ HEDEF KAYDET ============
function saveNewGoal() {
    // Eski hedef varsa geçmişe kaydet
    if (userProfile.activeGoal) {
        var oldGoal = userProfile.activeGoal;
        oldGoal.completedAt = getToday();
        oldGoal.status = "completed"; // veya "cancelled" — hesaplanabilir
        // Sonuç kontrolü
        if (oldGoal.type === "weight" && userProfile.weight && oldGoal.startWeight) {
            oldGoal.result = {
                startValue: oldGoal.startWeight,
                endValue: userProfile.weight,
                change: userProfile.weight - oldGoal.startWeight
            };
        } else if (oldGoal.type === "waist" && bodyMeasurements[getToday()]) {
            var bm = bodyMeasurements[getToday()];
            if (bm.waist) {
                oldGoal.result = {
                    startValue: oldGoal.startWaist,
                    endValue: bm.waist,
                    change: bm.waist - oldGoal.startWaist
                };
            }
        } else if (oldGoal.type === "fat" && bodyMeasurements[getToday()]) {
            var bm2 = bodyMeasurements[getToday()];
            if (bm2.fatPercentage) {
                oldGoal.result = {
                    startValue: oldGoal.startFat,
                    endValue: bm2.fatPercentage,
                    change: bm2.fatPercentage - oldGoal.startFat
                };
            }
        }
        if (!userProfile.goalHistory) userProfile.goalHistory = [];
        userProfile.goalHistory.unshift(oldGoal);
        if (userProfile.goalHistory.length > 20) userProfile.goalHistory.pop();
    }

    // Yeni hedef oluştur
    var newGoal = {
        type: currentGoalType,
        startedAt: getToday(),
        status: "active"
    };

    if (currentGoalType === "weight" || currentGoalType === "muscle") {
        var tw = Number(document.getElementById("goalTargetWeight").value);
        var td = document.getElementById("goalTargetDate").value;
        if (!tw) { showNotification("⚠️ Hedef kilo gerekli"); return; }
        newGoal.targetWeight = tw;
        newGoal.targetDate = td || null;
        newGoal.startWeight = userProfile.weight || 0;
        if (currentGoalType === "muscle") {
            var tp = Number(document.getElementById("goalTargetProteinMuscle").value);
            if (tp) newGoal.targetProtein = tp;
        }
    } else if (currentGoalType === "waist") {
        var twa = Number(document.getElementById("goalTargetWaist").value);
        var tda = document.getElementById("goalTargetDate").value;
        if (!twa) { showNotification("⚠️ Hedef bel çevresi gerekli"); return; }
        newGoal.targetWaist = twa;
        newGoal.targetDate = tda || null;
        var todayBm = bodyMeasurements[getToday()];
        newGoal.startWaist = (todayBm && todayBm.waist) ? todayBm.waist : null;
        if (!newGoal.startWaist) {
            showNotification("⚠️ Önce profil sekmesinden bugünün bel ölçümünü gir");
            return;
        }
    } else if (currentGoalType === "fat") {
        var tf = Number(document.getElementById("goalTargetFat").value);
        var tdf = document.getElementById("goalTargetDate").value;
        if (!tf) { showNotification("⚠️ Hedef yağ oranı gerekli"); return; }
        newGoal.targetFat = tf;
        newGoal.targetDate = tdf || null;
        var todayBm2 = bodyMeasurements[getToday()];
        newGoal.startFat = (todayBm2 && todayBm2.fatPercentage) ? todayBm2.fatPercentage : null;
        if (!newGoal.startFat) {
            showNotification("⚠️ Önce profil sekmesinden bugünün yağ oranını gir");
            return;
        }
    }

    userProfile.activeGoal = newGoal;
    saveAllData();
    showNotification("✅ Yeni hedef kaydedildi!");
    renderGoalAnalysis();
    renderGoalProgressChart();
    renderMilestones();
    renderPrediction();
    renderGoalHistory();
    renderGoalFields(); // cancelGoalBtn görünürlüğü için
    updateCancelButtonVisibility();
}

// ============ HEDEF İPTAL ============
function cancelGoal() {
    if (!userProfile.activeGoal) return;
    if (!confirm("Aktif hedefi iptal etmek istediğine emin misin?")) return;

    var cancelled = userProfile.activeGoal;
    cancelled.completedAt = getToday();
    cancelled.status = "cancelled";
    if (!userProfile.goalHistory) userProfile.goalHistory = [];
    userProfile.goalHistory.unshift(cancelled);
    if (userProfile.goalHistory.length > 20) userProfile.goalHistory.pop();

    userProfile.activeGoal = null;
    saveAllData();
    showNotification("🗑️ Hedef iptal edildi");
    renderGoalAnalysis();
    renderGoalProgressChart();
    renderMilestones();
    renderPrediction();
    renderGoalHistory();
    updateCancelButtonVisibility();
}

function updateCancelButtonVisibility() {
    var btn = document.getElementById("cancelGoalBtn");
    if (btn) btn.style.display = userProfile.activeGoal ? "block" : "none";
}

// ============ HEDEF ANALİZİ ============
function renderGoalAnalysis() {
    var card = document.getElementById("goalAnalysisCard");
    var content = document.getElementById("goalAnalysisContent");
    if (!card || !content) return;

    var g = userProfile.activeGoal;
    if (!g) { card.style.display = "none"; return; }

    card.style.display = "block";

    var html = "";

    // HEDEF TÜRÜ: KİLO / KAS
    if (g.type === "weight" || g.type === "muscle") {
        var current = userProfile.weight || 0;
        var target = g.targetWeight;
        var start = g.startWeight || current;
        var isMuscle = (g.type === "muscle");
        var diff = isMuscle ? (target - current) : (current - target);
        var totalDiff = isMuscle ? (target - start) : (start - target);
        var done = isMuscle ? (current - start) : (start - current);
        var percent = totalDiff > 0 ? Math.min(100, (done / totalDiff) * 100) : 0;

        html += '<div class="analysis-hero">' +
            '<div class="analysis-hero-value">' + Math.abs(diff).toFixed(1) + ' kg</div>' +
            '<div class="analysis-hero-label">' + (isMuscle ? "Alınacak" : "Verilecek") + ' kilo kaldı</div>' +
            '</div>';

        html += '<div class="analysis-progress">' +
            '<div class="analysis-progress-bar"><div class="analysis-progress-fill" style="width:' + percent + '%"></div></div>' +
            '<div class="analysis-progress-text"><span>' + percent.toFixed(0) + '% tamamlandı</span><span>' + Math.abs(done).toFixed(1) + ' / ' + Math.abs(totalDiff).toFixed(1) + ' kg</span></div>' +
            '</div>';

        html += '<div style="margin-top: 1rem;">' +
            '<div class="analysis-row"><span class="analysis-label">Başlangıç</span><span class="analysis-value">' + start.toFixed(1) + ' kg</span></div>' +
            '<div class="analysis-row"><span class="analysis-label">Şu An</span><span class="analysis-value highlight">' + current.toFixed(1) + ' kg</span></div>' +
            '<div class="analysis-row"><span class="analysis-label">Hedef</span><span class="analysis-value">' + target.toFixed(1) + ' kg</span></div>' +
            '</div>';

        // Tarih bazlı hesap
        if (g.targetDate) {
            html += calculateTimelineAnalysis(g, current);
        }
    }

    // HEDEF TÜRÜ: BEL
    else if (g.type === "waist") {
        var todayBm = bodyMeasurements[getToday()];
        var currentW = (todayBm && todayBm.waist) ? todayBm.waist : g.startWaist;
        var targetW = g.targetWaist;
        var startW = g.startWaist;
        var diffW = currentW - targetW;
        var totalDiffW = startW - targetW;
        var doneW = startW - currentW;
        var percentW = totalDiffW > 0 ? Math.min(100, (doneW / totalDiffW) * 100) : 0;

        html += '<div class="analysis-hero">' +
            '<div class="analysis-hero-value">' + diffW.toFixed(1) + ' cm</div>' +
            '<div class="analysis-hero-label">İncelmesi gereken</div>' +
            '</div>';

        html += '<div class="analysis-progress">' +
            '<div class="analysis-progress-bar"><div class="analysis-progress-fill" style="width:' + percentW + '%"></div></div>' +
            '<div class="analysis-progress-text"><span>' + percentW.toFixed(0) + '% tamamlandı</span><span>' + doneW.toFixed(1) + ' / ' + totalDiffW.toFixed(1) + ' cm</span></div>' +
            '</div>';

        html += '<div style="margin-top: 1rem;">' +
            '<div class="analysis-row"><span class="analysis-label">Başlangıç</span><span class="analysis-value">' + startW.toFixed(1) + ' cm</span></div>' +
            '<div class="analysis-row"><span class="analysis-label">Şu An</span><span class="analysis-value highlight">' + currentW.toFixed(1) + ' cm</span></div>' +
            '<div class="analysis-row"><span class="analysis-label">Hedef</span><span class="analysis-value">' + targetW.toFixed(1) + ' cm</span></div>' +
            '</div>';

        if (g.targetDate) {
            html += calculateTimelineAnalysis(g, currentW);
        }
    }

    // HEDEF TÜRÜ: YAĞ ORANI
    else if (g.type === "fat") {
        var todayBm3 = bodyMeasurements[getToday()];
        var currentF = (todayBm3 && todayBm3.fatPercentage) ? todayBm3.fatPercentage : g.startFat;
        var targetF = g.targetFat;
        var startF = g.startFat;
        var diffF = currentF - targetF;
        var totalDiffF = startF - targetF;
        var doneF = startF - currentF;
        var percentF = totalDiffF > 0 ? Math.min(100, (doneF / totalDiffF) * 100) : 0;

        html += '<div class="analysis-hero">' +
            '<div class="analysis-hero-value">' + diffF.toFixed(1) + ' %</div>' +
            '<div class="analysis-hero-label">Düşmesi gereken yağ oranı</div>' +
            '</div>';

        html += '<div class="analysis-progress">' +
            '<div class="analysis-progress-bar"><div class="analysis-progress-fill" style="width:' + percentF + '%"></div></div>' +
            '<div class="analysis-progress-text"><span>' + percentF.toFixed(0) + '% tamamlandı</span><span>' + doneF.toFixed(1) + ' / ' + totalDiffF.toFixed(1) + ' %</span></div>' +
            '</div>';

        html += '<div style="margin-top: 1rem;">' +
            '<div class="analysis-row"><span class="analysis-label">Başlangıç</span><span class="analysis-value">' + startF.toFixed(1) + ' %</span></div>' +
            '<div class="analysis-row"><span class="analysis-label">Şu An</span><span class="analysis-value highlight">' + currentF.toFixed(1) + ' %</span></div>' +
            '<div class="analysis-row"><span class="analysis-label">Hedef</span><span class="analysis-value">' + targetF.toFixed(1) + ' %</span></div>' +
            '</div>';

        if (g.targetDate) {
            html += calculateTimelineAnalysis(g, currentF);
        }
    }

    content.innerHTML = html;

    // Kutlama kontrolü
    checkGoalCelebration(g);
}

// ============ TARİH BAZLI ANALİZ ============
function calculateTimelineAnalysis(g, currentValue) {
    var today = new Date();
    var targetDate = new Date(g.targetDate);
    var diffDays = Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24));
    var diffWeeks = Math.ceil(diffDays / 7);

    if (diffDays <= 0) {
        return '<div class="analysis-row" style="margin-top:0.8rem;"><span class="analysis-label">Durum</span><span class="analysis-value danger">Tarih geçti!</span></div>';
    }

    var html = '<div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px dashed var(--border);">';

    html += '<div class="analysis-row"><span class="analysis-label">⏱️ Kalan Süre</span><span class="analysis-value">' + diffDays + ' gün (' + diffWeeks + ' hafta)</span></div>';

    // Kilo/bel/yağ için haftada kaç birim
    var unit = "";
    var perWeek = 0;
    var perDay = 0;

    if (g.type === "weight" || g.type === "muscle") {
        var isMuscle = g.type === "muscle";
        var remaining = isMuscle ? (g.targetWeight - currentValue) : (currentValue - g.targetWeight);
        perWeek = remaining / diffWeeks;
        perDay = remaining / diffDays;
        unit = "kg";
    } else if (g.type === "waist") {
        var remainingW = currentValue - g.targetWaist;
        perWeek = remainingW / diffWeeks;
        perDay = remainingW / diffDays;
        unit = "cm";
    } else if (g.type === "fat") {
        var remainingF = currentValue - g.targetFat;
        perWeek = remainingF / diffWeeks;
        perDay = remainingF / diffDays;
        unit = "%";
    }

    html += '<div class="analysis-row"><span class="analysis-label">📉 Haftada</span><span class="analysis-value highlight">' + perWeek.toFixed(2) + ' ' + unit + '</span></div>';

    // Kalori açık (sadece kilo/muscle/fat için)
    if (g.type === "weight" || g.type === "muscle" || g.type === "fat") {
        var calPerWeek = 0;
        if (g.type === "weight" || g.type === "muscle") {
            calPerWeek = perWeek * 7700; // 1 kg = 7700 kcal
        } else if (g.type === "fat") {
            // Yağ oranından tahmini kalori
            var weight = userProfile.weight || 70;
            var fatKgDiff = (perDay / 100) * weight;
            calPerWeek = fatKgDiff * 7700 * 7;
        }
        var calPerDay = calPerWeek / 7;
        if (g.type === "muscle") calPerDay = -calPerDay; // kas için kalori fazlası

        var calLabel = g.type === "muscle" ? "Günde +" : "Günde ";
        var calColorClass = g.type === "muscle" ? "success" : "warning";
        html += '<div class="analysis-row"><span class="analysis-label">🔥 Kalori Açığı</span><span class="analysis-value ' + calColorClass + '">' + calLabel + Math.abs(Math.round(calPerDay)) + ' kcal</span></div>';
    }

    html += '</div>';
    return html;
}

// ============ İLERLEME GRAFİĞİ ============
function renderGoalProgressChart() {
    var card = document.getElementById("goalProgressCard");
    var g = userProfile.activeGoal;

    if (!card || !g) {
        if (card) card.style.display = "none";
        return;
    }

    card.style.display = "block";

    var canvas = document.getElementById("goalProgressChart");
    if (!canvas) return;

    if (goalProgressChartInstance) goalProgressChartInstance.destroy();

    // Veri topla
    var data = [];
    var labels = [];
    var measurementDates = Object.keys(bodyMeasurements).sort();
    var today = new Date();

    measurementDates.forEach(function(d) {
        var diffDays = (today - new Date(d)) / (1000 * 60 * 60 * 24);
        if (goalChartRange !== 999 && diffDays > goalChartRange) return;

        var bm = bodyMeasurements[d];
        var val = null;
        if (g.type === "weight" || g.type === "muscle") val = bm.weight;
        else if (g.type === "waist") val = bm.waist;
        else if (g.type === "fat") val = bm.fatPercentage;

        if (val !== null && val !== undefined) {
            data.push(val);
            labels.push(d.slice(5));
        }
    });

    if (data.length === 0) {
        var content = document.getElementById("goalProgressStats");
        if (content) content.innerHTML = '<div class="goal-history-empty">Bu aralıkta veri yok 📭</div>';
        return;
    }

    // Hedef çizgisi için dataset
    var targetVal = null;
    if (g.type === "weight" || g.type === "muscle") targetVal = g.targetWeight;
    else if (g.type === "waist") targetVal = g.targetWaist;
    else if (g.type === "fat") targetVal = g.targetFat;

    var targetLineData = labels.map(function() { return targetVal; });

    var themeColors = getThemeColors();
    var chartBackgroundColorPlugin = {
        id: 'customCanvasBackgroundColor',
        beforeDraw: (chart) => {
            const { ctx } = chart;
            ctx.save();
            ctx.globalCompositeOperation = 'destination-over';
            ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--surface').trim() || '#ffffff';
            ctx.fillRect(0, 0, chart.width, chart.height);
            ctx.restore();
        }
    };

    goalProgressChartInstance = new Chart(canvas.getContext("2d"), {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                    label: "Gerçek",
                    data: data,
                    borderColor: themeColors.primary,
                    backgroundColor: themeColors.primary + "1A",
                    fill: true,
                    tension: 0.3,
                    pointRadius: 5,
                    pointBackgroundColor: themeColors.primary,
                    pointBorderColor: "#fff",
                    pointBorderWidth: 2
                },
                {
                    label: "Hedef",
                    data: targetLineData,
                    borderColor: themeColors.danger,
                    borderDash: [6, 6],
                    pointRadius: 0,
                    tension: 0
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                zoom: {
                    pan: { enabled: true, mode: 'x' },
                    zoom: { wheel: { enabled: true }, pinch: { enabled: true }, mode: 'x' }
                },
                legend: {
                    position: "bottom",
                    labels: { color: themeColors.text, font: { size: 11 }, padding: 10 }
                }
            },
            scales: {
                x: { grid: { color: themeColors.border }, ticks: { color: themeColors.text } },
                y: { grid: { color: themeColors.border }, ticks: { color: themeColors.text } }
            }
        },
        plugins: [chartBackgroundColorPlugin]
    });

    // İstatistikler
    var statsEl = document.getElementById("goalProgressStats");
    if (statsEl && data.length > 0) {
        var first = data[0];
        var last = data[data.length - 1];
        var change = last - first;
        var icon = change < 0 ? "📉" : "📈";
        var colorClass = change < 0 ? "success" : "danger";
        if (g.type === "muscle") {
            icon = change > 0 ? "📈" : "📉";
            colorClass = change > 0 ? "success" : "danger";
        }

        var remaining = 0;
        if (g.type === "weight") remaining = last - g.targetWeight;
        else if (g.type === "muscle") remaining = g.targetWeight - last;
        else if (g.type === "waist") remaining = last - g.targetWaist;
        else if (g.type === "fat") remaining = last - g.targetFat;

        var unit = (g.type === "fat") ? "%" : (g.type === "waist" ? "cm" : "kg");

        statsEl.innerHTML =
            '<div class="goal-stat-box">' +
            '<div class="goal-stat-value ' + colorClass + '">' + icon + ' ' + Math.abs(change).toFixed(1) + ' ' + unit + '</div>' +
            '<div class="goal-stat-label">Değişim</div>' +
            '</div>' +
            '<div class="goal-stat-box">' +
            '<div class="goal-stat-value">' + last.toFixed(1) + ' ' + unit + '</div>' +
            '<div class="goal-stat-label">Şu An</div>' +
            '</div>' +
            '<div class="goal-stat-box">' +
            '<div class="goal-stat-value warning">' + Math.abs(remaining).toFixed(1) + ' ' + unit + '</div>' +
            '<div class="goal-stat-label">Kalan</div>' +
            '</div>';
    }
}

function changeGoalChartRange(days, btn) {
    goalChartRange = days;
    document.querySelectorAll(".time-btn").forEach(function(b) { b.classList.remove("active"); });
    if (btn) btn.classList.add("active");
    renderGoalProgressChart();
}

// ============ KİLOMETRE TAŞLARI ============
function renderMilestones() {
    var card = document.getElementById("milestonesCard");
    var list = document.getElementById("milestonesList");
    if (!card || !list) return;

    var g = userProfile.activeGoal;
    if (!g) { card.style.display = "none"; return; }

    card.style.display = "block";

    var milestones = [];

    if (g.type === "weight" || g.type === "muscle") {
        var isMuscle = g.type === "muscle";
        var start = g.startWeight || 0;
        var target = g.targetWeight;
        var total = Math.abs(target - start);

        // Yüzde bazlı
        milestones.push({ id: "p25", icon: "🎯", title: "%25 Tamamlandı", desc: (total * 0.25).toFixed(1) + " kg " + (isMuscle ? "aldın" : "verdin"), threshold: 25 });
        milestones.push({ id: "p50", icon: "🔥", title: "%50 Tamamlandı", desc: "Yarı yoldasın!", threshold: 50 });
        milestones.push({ id: "p75", icon: "⚡", title: "%75 Tamamlandı", desc: "Son düzlük!", threshold: 75 });
        milestones.push({ id: "p100", icon: "🏆", title: "Hedefe Ulaşıldı!", desc: "Tebrikler!", threshold: 100 });

        // Kilo bazlı (1, 3, 5 kg)
        if (total >= 1) milestones.splice(1, 0, { id: "k1", icon: "💪", title: "İlk Kilo", desc: (isMuscle ? "+1 kg" : "-1 kg") + " tamamlandı", threshold: (1 / total) * 100 });
        if (total >= 3) milestones.splice(3, 0, { id: "k3", icon: "🥉", title: "3 kg Barajı", desc: "Büyük adım!", threshold: (3 / total) * 100 });
        if (total >= 5) milestones.splice(5, 0, { id: "k5", icon: "🥈", title: "5 kg Barajı", desc: "Muhteşem!", threshold: (5 / total) * 100 });
        if (total >= 10) milestones.splice(7, 0, { id: "k10", icon: "🥇", title: "10 kg Barajı", desc: "Efsane!", threshold: (10 / total) * 100 });
    } else if (g.type === "waist") {
        var startW = g.startWaist;
        var targetW = g.targetWaist;
        var totalW = Math.abs(startW - targetW);
        milestones.push({ id: "p25", icon: "🎯", title: "%25 Tamamlandı", desc: (totalW * 0.25).toFixed(1) + " cm inceldin", threshold: 25 });
        milestones.push({ id: "p50", icon: "🔥", title: "%50 Tamamlandı", desc: "Yarı yoldasın!", threshold: 50 });
        milestones.push({ id: "p75", icon: "⚡", title: "%75 Tamamlandı", desc: "Son düzlük!", threshold: 75 });
        milestones.push({ id: "p100", icon: "🏆", title: "Hedefe Ulaşıldı!", desc: "Tebrikler!", threshold: 100 });
    } else if (g.type === "fat") {
        var startF = g.startFat;
        var targetF = g.targetFat;
        var totalF = Math.abs(startF - targetF);
        milestones.push({ id: "p25", icon: "🎯", title: "%25 Tamamlandı", desc: (totalF * 0.25).toFixed(1) + "% düştü", threshold: 25 });
        milestones.push({ id: "p50", icon: "🔥", title: "%50 Tamamlandı", desc: "Yarı yoldasın!", threshold: 50 });
        milestones.push({ id: "p75", icon: "⚡", title: "%75 Tamamlandı", desc: "Son düzlük!", threshold: 75 });
        milestones.push({ id: "p100", icon: "🏆", title: "Hedefe Ulaşıldı!", desc: "Tebrikler!", threshold: 100 });
    }

    // Şu anki ilerleme yüzdesi
    var currentPercent = getGoalCurrentPercent(g);

    var html = "";
    milestones.forEach(function(m) {
        var unlocked = currentPercent >= m.threshold;
        html += '<div class="milestone-item ' + (unlocked ? "unlocked" : "locked") + '">' +
            '<div class="milestone-icon">' + (unlocked ? "✅" : "🔒") + '</div>' +
            '<div class="milestone-content">' +
            '<div class="milestone-title">' + m.icon + ' ' + m.title + '</div>' +
            '<div class="milestone-desc">' + m.desc + '</div>' +
            '</div>' +
            '</div>';
    });

    list.innerHTML = html;
}

function getGoalCurrentPercent(g) {
    if (!g) return 0;

    if (g.type === "weight" || g.type === "muscle") {
        var isMuscle = g.type === "muscle";
        var start = g.startWeight || 0;
        var current = userProfile.weight || 0;
        var target = g.targetWeight;
        var total = Math.abs(target - start);
        var done = isMuscle ? (current - start) : (start - current);
        return total > 0 ? Math.min(100, (done / total) * 100) : 0;
    } else if (g.type === "waist") {
        var todayBm = bodyMeasurements[getToday()];
        var currentW = (todayBm && todayBm.waist) ? todayBm.waist : g.startWaist;
        var totalW = Math.abs(g.startWaist - g.targetWaist);
        var doneW = g.startWaist - currentW;
        return totalW > 0 ? Math.min(100, (doneW / totalW) * 100) : 0;
    } else if (g.type === "fat") {
        var todayBm2 = bodyMeasurements[getToday()];
        var currentF = (todayBm2 && todayBm2.fatPercentage) ? todayBm2.fatPercentage : g.startFat;
        var totalF = Math.abs(g.startFat - g.targetFat);
        var doneF = g.startFat - currentF;
        return totalF > 0 ? Math.min(100, (doneF / totalF) * 100) : 0;
    }
    return 0;
}

// ============ TAHMİN & ÖNERİ ============
function renderPrediction() {
    var card = document.getElementById("predictionCard");
    var content = document.getElementById("predictionContent");
    if (!card || !content) return;

    var g = userProfile.activeGoal;
    if (!g) { card.style.display = "none"; return; }

    card.style.display = "block";

    // Son 30 günlük verilerden trend hesapla
    var dates = Object.keys(bodyMeasurements).sort();
    var recentData = [];
    var today = new Date();
    dates.forEach(function(d) {
        var diffDays = (today - new Date(d)) / (1000 * 60 * 60 * 24);
        if (diffDays > 30) return;
        var bm = bodyMeasurements[d];
        var val = null;
        if (g.type === "weight" || g.type === "muscle") val = bm.weight;
        else if (g.type === "waist") val = bm.waist;
        else if (g.type === "fat") val = bm.fatPercentage;
        if (val !== null) recentData.push({ date: d, val: val });
    });

    if (recentData.length < 2) {
        content.innerHTML = '<div class="goal-history-empty">Tahmin için en az 2 ölçüm gerekli 📊</div>';
        return;
    }

    var first = recentData[0];
    var last = recentData[recentData.length - 1];
    var dayDiff = (new Date(last.date) - new Date(first.date)) / (1000 * 60 * 60 * 24);
    if (dayDiff === 0) dayDiff = 1;

    var dailyChange = (last.val - first.val) / dayDiff;
    var targetVal = null;
    if (g.type === "weight" || g.type === "muscle") targetVal = g.targetWeight;
    else if (g.type === "waist") targetVal = g.targetWaist;
    else if (g.type === "fat") targetVal = g.targetFat;

    var remaining = Math.abs(targetVal - last.val);
    var unit = (g.type === "fat") ? "%" : (g.type === "waist" ? "cm" : "kg");

    // Tahmini varış tarihi
    var daysToTarget = 0;
    if (dailyChange !== 0) {
        daysToTarget = Math.round(remaining / Math.abs(dailyChange));
    }

    var html = "";

    if (daysToTarget > 0 && isFinite(daysToTarget) && daysToTarget < 1000) {
        var targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + daysToTarget);
        var options = { day: 'numeric', month: 'long', year: 'numeric' };
        var dateStr = targetDate.toLocaleDateString('tr-TR', options);

        html += '<div class="prediction-hero">' +
            '<div class="prediction-date">📅 ' + dateStr + '</div>' +
            '<div class="prediction-label">Tahmini varış tarihi (mevcut hızla)</div>' +
            '</div>';
    } else {
        html += '<div class="prediction-hero">' +
            '<div class="prediction-date">Veri yetersiz</div>' +
            '<div class="prediction-label">Trend için daha fazla veri gerekli</div>' +
            '</div>';
    }

    html += '<div class="prediction-row"><span class="prediction-row-label">📉 Günlük değişim</span><span class="prediction-row-value">' + dailyChange.toFixed(3) + ' ' + unit + '/gün</span></div>';
    html += '<div class="prediction-row"><span class="prediction-row-label">📊 Haftalık değişim</span><span class="prediction-row-value">' + (dailyChange * 7).toFixed(2) + ' ' + unit + '/hafta</span></div>';
    html += '<div class="prediction-row"><span class="prediction-row-label">🎯 Hedefe kalan</span><span class="prediction-row-value">' + remaining.toFixed(1) + ' ' + unit + '</span></div>';

    // Öneri
    var tip = "";
    var currentRate = Math.abs(dailyChange * 7); // haftalık

    // Hedef tarih varsa karşılaştır
    if (g.targetDate) {
        var targetDateObj = new Date(g.targetDate);
        var daysLeft = Math.ceil((targetDateObj - today) / (1000 * 60 * 60 * 24));
        var weeksLeft = daysLeft / 7;
        var requiredWeeklyRate = remaining / weeksLeft;

        if (currentRate >= requiredWeeklyRate * 0.95) {
            tip = "🌟 <b>Harika gidiyorsun!</b> Mevcut hızınla hedefine tam zamanında ulaşacaksın. Böyle devam!";
        } else if (currentRate >= requiredWeeklyRate * 0.7) {
            tip = "💪 <b>Yakınsın!</b> Hedefe zamanında ulaşmak için haftada <b>" + requiredWeeklyRate.toFixed(2) + " " + unit + "</b> vermen lazım, şu an " + currentRate.toFixed(2) + ". Biraz daha dikkat!";
        } else {
            tip = "⚠️ <b>Biraz daha çaba lazım.</b> Hedefe ulaşmak için haftada <b>" + requiredWeeklyRate.toFixed(2) + " " + unit + "</b> vermen gerekiyor. Şu an " + currentRate.toFixed(2) + ". Kalori açığını artırmayı dene!";
        }
    } else {
        tip = "💡 Hedef tarihi belirlersen, mevcut hızınla ne zaman hedefine ulaşacağını söyleyebilirim!";
    }

    html += '<div class="prediction-tip">' + tip + '</div>';

    content.innerHTML = html;
}

// ============ GEÇMİŞ HEDEFLER ============
function renderGoalHistory() {
    var container = document.getElementById("goalHistory");
    if (!container) return;

    var history = userProfile.goalHistory || [];

    if (history.length === 0) {
        container.innerHTML = '<div class="goal-history-empty">📭 Henüz geçmiş hedef yok.<br><span style="font-size:0.75rem;">Tamamladığın veya iptal ettiğin hedefler burada görünecek.</span></div>';
        return;
    }

    var typeNames = {
        weight: { name: "Kilo Ver", emoji: "⚖️" },
        muscle: { name: "Kas Kazan", emoji: "💪" },
        waist: { name: "Bel İncelt", emoji: "📏" },
        fat: { name: "Yağ Oranı Düşür", emoji: "🔥" }
    };

    var html = "";
    history.forEach(function(g) {
        var info = typeNames[g.type] || { name: "Hedef", emoji: "🎯" };
        var status = g.status === "completed" ? "Tamamlandı" : "İptal Edildi";
        var statusClass = g.status === "completed" ? "completed" : "cancelled";

        var resultText = "";
        if (g.result) {
            var unit = (g.type === "fat") ? "%" : (g.type === "waist" ? "cm" : "kg");
            var change = g.result.change;
            var sign = change > 0 ? "+" : "";
            resultText = "Başlangıç: " + g.result.startValue.toFixed(1) + " " + unit +
                " → Bitiş: " + g.result.endValue.toFixed(1) + " " + unit +
                " (" + sign + change.toFixed(1) + " " + unit + ")";
        } else if (g.startWeight && g.targetWeight) {
            resultText = "Hedef: " + g.startWeight.toFixed(1) + " → " + g.targetWeight.toFixed(1) + " kg";
        } else {
            resultText = "Sonuç kaydedilmedi";
        }

        html += '<div class="goal-history-item ' + statusClass + '">' +
            '<div class="goal-history-header">' +
            '<div class="goal-history-type">' + info.emoji + ' ' + info.name + '</div>' +
            '<span class="goal-history-status ' + statusClass + '">' + status + '</span>' +
            '</div>' +
            '<div class="goal-history-dates">📅 ' + g.startedAt + ' → ' + (g.completedAt || "?") + '</div>' +
            '<div class="goal-history-result">' + resultText + '</div>' +
            '</div>';
    });

    container.innerHTML = html;
}

// ============ KUTLAMA KONTROL ============
function checkGoalCelebration(g) {
    if (!g || g.status !== "active") return;
    if (g.celebrated) return; // daha önce kutlanmışsa atla

    var percent = getGoalCurrentPercent(g);

    if (percent >= 100) {
        // Hedefe ulaşıldı!
        g.status = "completed";
        g.completedAt = getToday();
        g.celebrated = true;

        // Sonucu kaydet
        if (g.type === "weight" || g.type === "muscle") {
            g.result = { startValue: g.startWeight, endValue: userProfile.weight, change: userProfile.weight - g.startWeight };
        } else if (g.type === "waist") {
            var todayBm = bodyMeasurements[getToday()];
            if (todayBm && todayBm.waist) g.result = { startValue: g.startWaist, endValue: todayBm.waist, change: todayBm.waist - g.startWaist };
        } else if (g.type === "fat") {
            var todayBm2 = bodyMeasurements[getToday()];
            if (todayBm2 && todayBm2.fatPercentage) g.result = { startValue: g.startFat, endValue: todayBm2.fatPercentage, change: todayBm2.fatPercentage - g.startFat };
        }

        // Geçmişe kaydet
        if (!userProfile.goalHistory) userProfile.goalHistory = [];
        userProfile.goalHistory.unshift(g);
        if (userProfile.goalHistory.length > 20) userProfile.goalHistory.pop();

        userProfile.activeGoal = null;
        saveAllData();

        // Kutlama göster
        showCelebration(g);

        // Ekranı yenile
        setTimeout(function() {
            renderGoalAnalysis();
            renderGoalProgressChart();
            renderMilestones();
            renderPrediction();
            renderGoalHistory();
            updateCancelButtonVisibility();
        }, 500);
    }
}

// ============ KUTLAMA EKRANI ============
function showCelebration(g) {
    var overlay = document.getElementById("celebrationOverlay");
    var statsEl = document.getElementById("celebrationStats");
    if (!overlay || !statsEl) return;

    var typeNames = {
        weight: "Kilo Verme",
        muscle: "Kas Kazanma",
        waist: "Bel İnceltme",
        fat: "Yağ Oranı Düşürme"
    };

    var html = "";
    if (g.result) {
        var unit = (g.type === "fat") ? "%" : (g.type === "waist" ? "cm" : "kg");
        html += '<div class="celebration-stat-row"><span class="celebration-stat-label">Hedef</span><span class="celebration-stat-value">' + typeNames[g.type] + '</span></div>';
        html += '<div class="celebration-stat-row"><span class="celebration-stat-label">Başlangıç</span><span class="celebration-stat-value">' + g.result.startValue.toFixed(1) + ' ' + unit + '</span></div>';
        html += '<div class="celebration-stat-row"><span class="celebration-stat-label">Bitiş</span><span class="celebration-stat-value">' + g.result.endValue.toFixed(1) + ' ' + unit + '</span></div>';
        html += '<div class="celebration-stat-row"><span class="celebration-stat-label">Toplam Değişim</span><span class="celebration-stat-value">' + Math.abs(g.result.change).toFixed(1) + ' ' + unit + ' 🎉</span></div>';
    }

    statsEl.innerHTML = html;
    overlay.classList.add("show");

    // Konfeti başlat
    startConfetti();

    // Ses çal
    playCelebrationSound();
}

function closeCelebration() {
    var overlay = document.getElementById("celebrationOverlay");
    if (overlay) overlay.classList.remove("show");
    var confetti = document.getElementById("confettiContainer");
    if (confetti) confetti.innerHTML = "";
}

// ============ KONFETİ ============
function startConfetti() {
    var container = document.getElementById("confettiContainer");
    if (!container) return;

    container.innerHTML = "";

    var colors = ["#ec4899", "#a855f7", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#06b6d4"];
    var total = 80;

    for (var i = 0; i < total; i++) {
        var piece = document.createElement("div");
        piece.className = "confetti-piece";
        piece.style.left = Math.random() * 100 + "%";
        piece.style.background = colors[Math.floor(Math.random() * colors.length)];
        piece.style.animationDuration = (2 + Math.random() * 2) + "s";
        piece.style.animationDelay = (Math.random() * 0.5) + "s";
        piece.style.width = (6 + Math.random() * 8) + "px";
        piece.style.height = (6 + Math.random() * 8) + "px";
        piece.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
        container.appendChild(piece);
    }

    setTimeout(function() {
        container.innerHTML = "";
    }, 5000);
}

function playCelebrationSound() {
    try {
        var AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        var ctx = new AudioContext();
        // Basit bir melodi
        var notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
        notes.forEach(function(freq, i) {
            var osc = ctx.createOscillator();
            var gain = ctx.createGain();
            osc.type = "triangle";
            osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.15);
            gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.15);
            gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + i * 0.15 + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.15 + 0.25);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime + i * 0.15);
            osc.stop(ctx.currentTime + i * 0.15 + 0.3);
        });
    } catch (e) { console.log("Kutlama sesi çalınamadı", e); }
}

// ============ MAKRO HEDEFLERİ ============
function saveMacroTargets() {
    var tp = Number(document.getElementById("targetProteinInput").value) || 0;
    var tc = Number(document.getElementById("targetCarbsInput").value) || 0;
    var tf = Number(document.getElementById("targetFatInput").value) || 0;

    userProfile.targetProtein = tp > 0 ? tp : null;
    userProfile.targetCarbs = tc > 0 ? tc : null;
    userProfile.targetFat = tf > 0 ? tf : null;

    saveAllData();
    updateUI();
    showNotification("✅ Makro hedefleri kaydedildi!");
}

// ============ INIT ============
function initGoalsTab() {
    // Hedef türü seçici
    document.querySelectorAll(".goal-type-btn").forEach(function(btn) {
        btn.addEventListener("click", function() {
            selectGoalType(this.getAttribute("data-type"));
        });
    });

    // Kaydet butonu
    var saveBtn = document.getElementById("saveGoalBtn");
    if (saveBtn) saveBtn.addEventListener("click", saveNewGoal);

    // İptal butonu
    var cancelBtn = document.getElementById("cancelGoalBtn");
    if (cancelBtn) cancelBtn.addEventListener("click", cancelGoal);

    // Makro kaydet
    var macroBtn = document.getElementById("saveMacrosBtn");
    if (macroBtn) macroBtn.addEventListener("click", saveMacroTargets);

    // Makro inputlarını doldur
    if (document.getElementById("targetProteinInput")) {
        document.getElementById("targetProteinInput").value = userProfile.targetProtein || "";
        document.getElementById("targetCarbsInput").value = userProfile.targetCarbs || "";
        document.getElementById("targetFatInput").value = userProfile.targetFat || "";
    }

    // Aktif hedef türü
    if (userProfile.activeGoal) {
        currentGoalType = userProfile.activeGoal.type;
    }

    // İlk render
    selectGoalType(currentGoalType);
    renderGoalAnalysis();
    renderGoalProgressChart();
    renderMilestones();
    renderPrediction();
    renderGoalHistory();
    updateCancelButtonVisibility();
}

// ==================== MOOD ====================
function saveMood(mood, moodType) {
    moodEntries[currentDate] = { mood: mood, type: moodType };
    saveAllData();
    renderMoodHistory();
    var motivasyonSozleri = {
        sad: "Bugün kötü hissetmek normal. Yarın yepyeni bir gün. 💙",
        neutral: "Sakin ve dengeli bir gün. 🧘",
        good: "Harika! Bu güzel enerjini taçlandır. 🌿",
        happy: "Gülümsemen parlıyor! ⭐",
        excellent: "İnanılmaz bir enerji! 🔥"
    };
    var soz = motivasyonSozleri[moodType] || "Bugün güzel bir gün! 💪";
    var card = document.getElementById("motivationCard");
    if (!card) return;
    card.innerHTML = "<div style='font-size:3rem; margin-bottom:0.5rem;'>" + mood + "</div><div style='font-size:1.1rem; font-weight:600; line-height:1.5;'>" + soz + "</div>";
    card.style.display = "block";
    card.style.animation = "none";
    setTimeout(function() { card.style.animation = "fadeSlideUp 0.4s forwards"; }, 10);
    setTimeout(function() { card.style.display = "none"; }, 6000);
    showNotification("😊 Ruh hali kaydedildi!");
}

// ==================== ACCORDION ====================
function toggleAccordion(el) {
    el.classList.toggle("open");
    var content = el.nextElementSibling;
    if (content.classList.contains("show")) content.classList.remove("show");
    else content.classList.add("show");
}

// ==================== SWITCH TAB ====================
function switchTab(tab, skipHistory) {
    var profileCompleted = localStorage.getItem("nutritrack_profile_completed");
    if (profileCompleted !== "true" && tab !== "profile" && tab !== "home") {
        var hasProfile = userProfile.weight && userProfile.height && userProfile.age;
        if (!hasProfile) {
            showNotification("⚠️ Lütfen önce profil bilgilerini doldurun!");
            return;
        }
    }
    var tabs = ["home", "profile", "daily", "activity", "goals", "reports", "mood", "history", "stats", "ai", "workout", "badges", "recipes", "habits", "info"];
    for (var i = 0; i < tabs.length; i++) {
        var el = document.getElementById(tabs[i] + "Tab");
        if (el) el.classList.add("hidden");
    }
    var active = document.getElementById(tab + "Tab");
    if (active) active.classList.remove("hidden");
    var homeBtn = document.getElementById("homeBtn");
    if (homeBtn) homeBtn.style.display = (tab === "home") ? "none" : "flex";

    if (tab === "stats") refreshCharts();
    if (tab === "history") renderHistory();
    if (tab === "reports") initReportsTab();
    if (tab === "badges") renderBadges();
    if (tab === "goals") {
        initGoalsTab();
    }
    if (tab === "daily") updateUI();
    if (tab === "activity") updateUI();
    if (tab === "recipes") {
        initRecipesTab();
        renderRecipes();
    }
    if (tab === "habits" && typeof renderHabits === "function") {
        var hdd = document.getElementById("habitsDateDisplay");
        if (hdd) hdd.innerText = currentDate.replace(/-/g, "/");
        renderHabits();
    }
    if (tab === "profile") {
        if (typeof populateMeasurementsForm === "function") populateMeasurementsForm();
        if (typeof renderMeasurementsHistory === "function") renderMeasurementsHistory();
    }
    if (!skipHistory) history.pushState({ tab: tab }, "", "#" + tab);
    var floatingBtn = document.getElementById("floatingMenuBtn");
    if (floatingBtn) floatingBtn.setAttribute("data-active-tab", tab);
    localStorage.setItem("lastActiveTab", tab);
    // Sekme değişince sayfayı en üste kaydır
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==================== THEME ====================
function initTheme() {
    var dark = localStorage.getItem("dark") === "true";
    if (dark) document.body.classList.add("dark");
    var tt = document.getElementById("themeToggle");
    if (tt) {
        tt.innerText = dark ? "☀️ Açık Mod" : "🌙 Karanlık Mod";
        tt.onclick = function() {
            document.body.classList.toggle("dark");
            var isDark = document.body.classList.contains("dark");
            localStorage.setItem("dark", isDark);
            this.innerText = isDark ? "☀️ Açık Mod" : "🌙 Karanlık Mod";
            if (window.Chart) {
                Chart.defaults.color = isDark ? "#94a3b8" : "#475569";
                Chart.defaults.borderColor = isDark ? "#334155" : "#e2e8f0";
                if (dailyMacroChart && dailyMacroChart.options.plugins.legend) {
                    dailyMacroChart.options.plugins.legend.labels.color = isDark ? "#94a3b8" : "#475569";
                    dailyMacroChart.update();
                }
            }
            var statsTab = document.getElementById("statsTab");
            if (statsTab && !statsTab.classList.contains("hidden")) refreshCharts();
        };
    }
    if (window.Chart) {
        Chart.defaults.color = dark ? "#94a3b8" : "#475569";
        Chart.defaults.borderColor = dark ? "#334155" : "#e2e8f0";
    }
}

function applyAppTheme(theme) {
    document.body.classList.remove("theme-sport", "theme-nature", "theme-luxury", "theme-fun");
    if (theme && theme !== "classic") document.body.classList.add("theme-" + theme);
    if (window.Chart) {
        var isDarkTheme = theme === "sport" || theme === "luxury" || (theme === "classic" && document.body.classList.contains("dark"));
        var textColor = isDarkTheme ? "#94a3b8" : "#475569";
        Chart.defaults.color = textColor;
        Chart.defaults.borderColor = isDarkTheme ? "#334155" : "#e2e8f0";
        if (dailyMacroChart && dailyMacroChart.options.plugins.legend) {
            dailyMacroChart.options.plugins.legend.labels.color = textColor;
            dailyMacroChart.update();
        }
    }
    var statsTab = document.getElementById("statsTab");
    if (statsTab && !statsTab.classList.contains("hidden")) refreshCharts();
}

// ==================== PROFILE FORM ====================
function populateProfileForm() {
    if (userProfile.avatar) {
        var pa = document.getElementById("profileAvatar");
        if (pa) pa.src = userProfile.avatar;
    }
    var w = document.getElementById("weight");
    if (w) w.value = userProfile.weight !== null ? userProfile.weight : "";
    var h = document.getElementById("height");
    if (h) h.value = userProfile.height !== null ? userProfile.height : "";
    var a = document.getElementById("age");
    if (a) a.value = userProfile.age !== null ? userProfile.age : "";
    var g = document.getElementById("gender");
    if (g) g.value = userProfile.gender;
    var tw = document.getElementById("targetWeight");
    if (tw) tw.value = userProfile.targetWeight !== null ? userProfile.targetWeight : "";
    var td = document.getElementById("targetDate");
    if (td) td.value = userProfile.targetDate !== null ? userProfile.targetDate : "";
    var tp = document.getElementById("targetProteinInput");
    if (tp) tp.value = userProfile.targetProtein !== null ? userProfile.targetProtein : "";
    var tc = document.getElementById("targetCarbsInput");
    if (tc) tc.value = userProfile.targetCarbs !== null ? userProfile.targetCarbs : "";
    var tf = document.getElementById("targetFatInput");
    if (tf) tf.value = userProfile.targetFat !== null ? userProfile.targetFat : "";
}

// ==================== FAVORITES (Eski uyumluluk) ====================
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
    if (box) box.style.display = (box.style.display === "none") ? "flex" : "none";
}

function renderFavorites() {
    var container = document.getElementById("favoritesList");
    if (!container) return;
    container.innerHTML = "";
    if (favoriteMeals.length === 0) {
        container.innerHTML = "<div class='small-text'>Henüz favori yemeğiniz yok.</div>";
        return;
    }
    for (var i = 0; i < favoriteMeals.length; i++) {
        var fav = favoriteMeals[i];
        var div = document.createElement("div");
        div.className = "daily-item";
        var safeN = (fav.name || "").replace(/'/g, "\\'");
        div.innerHTML = "<div class='flex-between'><div><div style='font-weight:bold;'>" + fav.name + "</div>" +
            "<div class='small-text'>🔥 " + fav.cal + " kcal | 🥩 " + fav.prot + "g | 🍞 " + fav.carbs + "g | 🥑 " + fav.fat + "g</div></div>" +
            "<div><button class='small' onclick='toggleFavAdd(" + i + ")'>Ekle</button> <button class='small secondary' onclick='removeFavorite(" + i + ")'>🗑️</button></div></div>" +
            "<div id='favAddBox_" + i + "' style='display:none; margin-top: 0.5rem; gap: 0.2rem; flex-wrap: wrap;'>" +
            "<button onclick='addToMeal(\"morning\", " + fav.cal + ", " + fav.prot + ", " + fav.carbs + ", " + fav.fat + ", \"" + safeN + "\", \"⭐\")' style='flex: 1; background: var(--orange); font-size: 0.7rem; padding: 0.4rem;'>Sabah</button>" +
            "<button onclick='addToMeal(\"noon\", " + fav.cal + ", " + fav.prot + ", " + fav.carbs + ", " + fav.fat + ", \"" + safeN + "\", \"⭐\")' style='flex: 1; background: var(--success); font-size: 0.7rem; padding: 0.4rem;'>Öğle</button>" +
            "<button onclick='addToMeal(\"evening\", " + fav.cal + ", " + fav.prot + ", " + fav.carbs + ", " + fav.fat + ", \"" + safeN + "\", \"⭐\")' style='flex: 1; background: var(--primary); font-size: 0.7rem; padding: 0.4rem;'>Akşam</button>" +
            "<button onclick='addToMeal(\"snack\", " + fav.cal + ", " + fav.prot + ", " + fav.carbs + ", " + fav.fat + ", \"" + safeN + "\", \"⭐\")' style='flex: 1; background: var(--purple); font-size: 0.7rem; padding: 0.4rem;'>Ara</button></div>";
        container.appendChild(div);
    }
}

// ==================== WORKOUT ====================
function updateWorkoutUI() {
    var parts = currentDate.split("-");
    var dObj = new Date(parts[0], parts[1] - 1, parts[2]);
    var currentDayNum = dObj.getDay();
    var todayDisplay = document.getElementById("todayWorkoutDisplay");
    if (todayDisplay) {
        var txt = workoutProgram[currentDayNum];
        todayDisplay.innerText = txt ? txt : "Bugün için dinlenme veya program eklenmemiş.";
    }
    var wds = document.getElementById("workoutDaySelect");
    if (wds) {
        wds.value = currentDayNum;
        var wt = document.getElementById("workoutText");
        if (wt) wt.value = workoutProgram[currentDayNum] || "";
    }
}

// ==================== WELCOME SCREEN ====================
function initWelcomeScreen() {
    var d = new Date();
    var options = { weekday: 'long', month: 'long', day: 'numeric' };
    var wd = document.getElementById("welcomeDate");
    if (wd) wd.innerText = d.toLocaleDateString('tr-TR', options);
    var motivationalQuotes = [
        "Bugün hedeflerine bir adım daha yaklaşmak için harika bir gün! 💪",
        "Küçük adımlar, büyük sonuçlar doğurur. 🏃‍♂️",
        "Vücudun senin tapınağındır, ona iyi bak. 🥦",
        "Disiplin, ne istediğinle şimdi ne istediğin arasında seçim yapmaktır. 🎯",
        "Mazeretler kalori yakmaz! 🔥",
        "Başarı, her gün tekrarlanan küçük çabaların toplamıdır. 🌟",
        "Bugün dünden daha iyi ol. 🏆",
        "Sağlıklı beslenmek bir diyet değil, bir yaşam tarzıdır. 🥑",
        "Her yeni gün, yeni bir başlangıçtır. ✨"
    ];
    var wq = document.getElementById("welcomeQuote");
    if (wq) wq.innerText = "\"" + motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)] + "\"";
    var entry = dailyEntries[getToday()];
    var hasData = entry && (getDailyTotal(entry).calories > 0 || (entry.water && entry.water > 0) || (entry.steps && entry.steps > 0) || (entry.exerciseDuration && entry.exerciseDuration > 0));
    var btn = document.getElementById("welcomeBtn");
    if (btn) {
        btn.innerText = hasData ? "🚀 Güne Devam Et" : "✨ Güne Başla";
        btn.onclick = function() {
            var screen = document.getElementById("welcomeScreen");
            screen.style.opacity = "0";
            setTimeout(function() { screen.style.display = "none"; }, 500);
        };
    }
}

// ==================== MEASUREMENTS ====================
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
        var fpEl = document.getElementById("fatPercentVal");
        if (fpEl) fpEl.innerHTML = finalFat.toFixed(1) + " %";
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

// ==================== RECIPES ====================
function saveRecipe() {
    var name = document.getElementById("recipeName").value.trim();
    var details = document.getElementById("recipeDetails").value.trim();
    var cal = Number(document.getElementById("recipeCal").value) || 0;
    var prot = Number(document.getElementById("recipeProt").value) || 0;
    var carbs = Number(document.getElementById("recipeCarbs").value) || 0;
    var fat = Number(document.getElementById("recipeFat").value) || 0;
    if (!name) { showNotification("❌ Lütfen tarifin adını girin."); return; }
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
    if (!detailsDiv) return;
    detailsDiv.style.display = (detailsDiv.style.display === "none") ? "block" : "none";
}

function renderRecipes() {
    var container = document.getElementById("recipesList");
    if (!container) return;
    container.innerHTML = "";
    if (myRecipes.length === 0) {
        container.innerHTML = "<div class='small-text'>Henüz kayıtlı tarifiniz bulunmuyor.</div>";
        return;
    }
    for (var i = 0; i < myRecipes.length; i++) {
        var r = myRecipes[i];
        var div = document.createElement("div");
        div.className = "daily-item";
        var safeDetails = (r.details || "").replace(/\n/g, "<br>");
        div.innerHTML = "<div class='flex-between' style='cursor:pointer;' onclick='toggleRecipeDetails(" + i + ")'><div><div style='font-weight:bold; font-size:1.05rem; color:var(--primary); margin-bottom: 0.2rem;'>" + r.name + "</div><div class='small-text'>🔥 " + r.cal + " kcal | 🥩 " + r.prot + "g | 🍞 " + r.carbs + "g | 🥑 " + r.fat + "g</div></div><div style='font-size:1rem; color:var(--text-secondary);'>▼</div></div><div id='recipeDetails_" + i + "' style='display:none; margin-top:0.8rem; padding-top:0.8rem; border-top:1px solid var(--border);'><div class='small-text' style='color:var(--text); margin-bottom:0.8rem; line-height: 1.4;'>" + safeDetails + "</div><button class='small secondary' onclick='event.stopPropagation(); deleteRecipe(" + i + ")' style='width:100%; border-color:var(--danger); color:var(--danger);'>🗑️ Tarifi Sil</button></div>";
        container.appendChild(div);
    }
}

// ==================== HABITS ====================
function addNewHabit() {
    var input = document.getElementById("newHabitInput");
    var val = input.value.trim();
    if (!val) return;
    if (customHabits.indexOf(val) !== -1) { showNotification("⚠️ Bu alışkanlık zaten var."); return; }
    customHabits.push(val);
    localStorage.setItem("nutritrack_habits", JSON.stringify(customHabits));
    input.value = "";
    renderHabits();
    showNotification("✅ Yeni alışkanlık eklendi!");
}

function deleteHabit(index) {
    if (confirm("Bu alışkanlığı silmek istediğinize emin misiniz?")) {
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
        playWaterSound();
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
        div.innerHTML = "<div style='display:flex; align-items:center; gap:0.8rem; cursor:pointer; flex:1;' onclick='toggleHabit(\"" + safeH + "\")'><div style='width:24px; height:24px; border-radius:50%; border:2px solid " + (isDone ? "var(--success)" : "var(--border)") + "; background:" + (isDone ? "var(--success)" : "transparent") + "; display:flex; align-items:center; justify-content:center; color:white; font-size:0.8rem;'>" + (isDone ? "✓" : "") + "</div><span style='font-size:1.05rem; font-weight:600; text-decoration:" + (isDone ? "line-through" : "none") + "; color:" + (isDone ? "var(--text-secondary)" : "var(--text)") + "'>" + h + "</span></div><button class='small secondary' onclick='deleteHabit(" + i + ")' style='border:none; background:transparent; padding:0.2rem; box-shadow:none;'>🗑️</button>";
        container.appendChild(div);
    }
}

// ==================== KRONOMETRE ====================
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
    var disp = document.getElementById("stopwatchDisplay");
    if (disp) disp.style.color = "var(--primary)";
    var btn = document.getElementById("startStopwatchBtn");
    if (!btn) return;
    if (isSwRunning) {
        clearInterval(swInterval);
        isSwRunning = false;
        btn.innerHTML = "▶ Başlat";
        btn.style.background = "var(--success)";
    } else {
        swStartTime = Date.now() - swElapsedTime;
        swInterval = setInterval(function() {
            swElapsedTime = Date.now() - swStartTime;
            if (disp) disp.innerHTML = formatSwTime(swElapsedTime);
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
    if (display) {
        display.innerHTML = "00:00.00";
        display.style.color = "var(--primary)";
    }
    var btn = document.getElementById("startStopwatchBtn");
    if (btn) {
        btn.innerHTML = "▶ Başlat";
        btn.style.background = "var(--success)";
    }
}

function startRestTimer(seconds) {
    resetStopwatch();
    var endTime = Date.now() + seconds * 1000;
    var display = document.getElementById("stopwatchDisplay");
    if (display) display.style.color = "var(--orange)";
    restInterval = setInterval(function() {
        var remaining = Math.max(0, endTime - Date.now());
        var totalSeconds = Math.ceil(remaining / 1000);
        var m = Math.floor(totalSeconds / 60);
        var s = totalSeconds % 60;
        if (display) display.innerHTML = "⏳ " + (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
        if (remaining <= 0) {
            clearInterval(restInterval);
            if (display) {
                display.innerHTML = "00:00.00";
                display.style.color = "var(--primary)";
            }
            playWaterSound();
            showNotification("🔔 Dinlenme süresi bitti!");
            sendLocalNotification("🔔 Dinlenme Bitti!", "Sete geri dönme vakti geldi!");
        }
    }, 100);
}

// ==================== SU SESİ ====================
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

// ==================== BİLDİRİMLER ====================
var notifSettings = JSON.parse(localStorage.getItem("nutritrack_notif_settings") || '{"water":false, "meals":false}');

function initNotificationsUI() {
    var nw = document.getElementById("notifWater");
    if (nw) nw.checked = notifSettings.water;
    var nm = document.getElementById("notifMeals");
    if (nm) nm.checked = notifSettings.meals;
    if (window.Notification && Notification.permission === "granted") {
        var btn = document.getElementById("requestNotifBtn");
        if (btn) {
            btn.innerText = "✅ Bildirim İzni Verildi";
            btn.disabled = true;
        }
    }
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
            sendLocalNotification("💧 Su İçme Vakti!", "Günde en az 2 litre su içmelisin!");
            lastNotified["water_" + todayStr + "_" + h] = true;
            localStorage.setItem("nutritrack_last_notified", JSON.stringify(lastNotified));
        }
    }
}
setInterval(checkReminders, 60000);

// ==================== EVENT LISTENER'LAR ====================
document.getElementById("saveProfileBtn").onclick = saveProfileFromForm;
document.getElementById("saveDailyBtn").onclick = saveCurrentFromInputs;
if (document.getElementById("exportBtn")) document.getElementById("exportBtn").onclick = exportToCSV;

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

var moodBtns = document.querySelectorAll(".mood-btn");
for (var mbi = 0; mbi < moodBtns.length; mbi++) {
    moodBtns[mbi].onclick = function() { saveMood(this.getAttribute("data-mood"), this.getAttribute("data-mood-type")); };
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
if (document.getElementById("saveMeasurementsBtn")) document.getElementById("saveMeasurementsBtn").onclick = saveMeasurements;

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

if (document.getElementById("saveThemeBtn")) {
    document.getElementById("saveThemeBtn").onclick = function() {
        var theme = document.getElementById("appThemeSelect").value;
        localStorage.setItem("nutritrack_app_theme", theme);
        applyAppTheme(theme);
        var btn = document.getElementById("saveThemeBtn");
        btn.innerText = "✓ Tema Uygulandı!";
        setTimeout(function() { btn.innerText = "💾 Temayı Kaydet"; }, 1500);
        showNotification("🎨 Tema değiştirildi!");
    };
}

if (document.getElementById("requestNotifBtn")) {
    document.getElementById("requestNotifBtn").onclick = function() {
        if (!window.Notification) { showNotification("❌ Bildirimler desteklenmiyor."); return; }
        Notification.requestPermission().then(function(permission) {
            if (permission === "granted") {
                initNotificationsUI();
                sendLocalNotification("Harika! 🎉", "Bildirimler açıldı.");
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
        btn.innerText = "✓ Kaydedildi!";
        setTimeout(function() { btn.innerText = "💾 Ayarları Kaydet"; }, 1500);
        showNotification("🔔 Bildirim ayarları güncellendi!");
    };
}

// ==================== POPSTATE ====================
window.addEventListener("popstate", function(event) {
    if (event.state && event.state.tab) switchTab(event.state.tab, true);
    else {
        var hash = window.location.hash ? window.location.hash.substring(1) : "home";
        switchTab(hash, true);
    }
});

// ==================== WINDOW.ONLOAD ====================
window.onload = function() {
    loadAllData();
    migrateEntries();
    updateApiStatusUI();

    var hasProfile = userProfile.weight && userProfile.height && userProfile.age;
    var initialTab = "home";
    if (!hasProfile) {
        initialTab = 'profile';
        setTimeout(function() { showNotification("👋 Hoş geldin! Lütfen önce profil bilgilerini doldur."); }, 500);
    } else {
        var lastTab = localStorage.getItem("lastActiveTab");
        var validTabs = ["home", "profile", "daily", "activity", "goals", "reports", "mood", "history", "stats", "ai", "workout", "badges", "recipes", "habits", "info"];
        if (lastTab && validTabs.indexOf(lastTab) !== -1) initialTab = lastTab;
        else initialTab = window.location.hash ? window.location.hash.substring(1) : "home";
    }

    populateProfileForm();
    initTheme();
    // Hedefler sekmesi başlangıç
    setTimeout(function() { updateCancelButtonVisibility(); }, 100);
    updateUI();
    renderFavorites();
    renderRecipes();
    initWelcomeScreen();
    initNotificationsUI();

    var savedAppTheme = localStorage.getItem("nutritrack_app_theme") || "classic";
    if (document.getElementById("appThemeSelect")) document.getElementById("appThemeSelect").value = savedAppTheme;
    applyAppTheme(savedAppTheme);

    switchTab(initialTab, true);
    history.replaceState({ tab: initialTab }, "", "#" + initialTab);
};
// ============================================================
// SAĞLICAKLA AI — PANEL FONKSİYONLARI
// ============================================================

// ============ PROMPT ŞABLONLARI ============
var aiPromptlar = {
    daily_summary: {
        emoji: "📊",
        title: "Günlük Özet",
        prompt: "Bugünkü kalori, protein, karbonhidrat, yağ ve su durumumu kısaca özetle. 3-4 cümle, motive edici bir dille."
    },
    what_to_eat: {
        emoji: "🍽️",
        title: "Yemek Önerisi",
        prompt: "Kalan kalori ve protein hedefime göre bana pratik bir yemek önerisi ver. Malzeme ve tahmini kalorisi ile."
    },
    exercise: {
        emoji: "💪",
        title: "Egzersiz Önerisi",
        prompt: "Bugünkü aktivite verilerime bakarak egzersiz yapmalı mıyım, dinlenmeli miyim? Kısa bir öneri ver."
    },
    weekly: {
        emoji: "📈",
        title: "Haftalık Trend",
        prompt: "Son 7 günlük verilerime bakarak kısa bir haftalık değerlendirme yap. İyi giden ve gelişmesi gereken noktaları belirt."
    },
    recipe: {
        emoji: "🥗",
        title: "Tarif Önerisi",
        prompt: "Bana yüksek proteinli, pratik bir tarif önerir misin? Malzemeler ve kalorisi ile birlikte."
    },
    motivation: {
        emoji: "💡",
        title: "Motivasyon",
        prompt: "Bugün biraz motivasyonum düştü. Bana kısa ve etkili bir motivasyon mesajı yazar mısın?"
    }
};

// ============ API DURUMU ============
function getGeminiApiKey() {
    return localStorage.getItem("gemini_api_key") || "";
}

function updateApiStatusUI() {
    var key = getGeminiApiKey();
    var card = document.getElementById("apiSettingsCard");
    var statusRow = document.getElementById("apiStatusRow");
    var statusIcon = document.getElementById("apiStatusIcon");
    var statusText = document.getElementById("apiStatusText");
    var inputEl = document.getElementById("geminiApiKeyInput");
    var deleteBtn = document.getElementById("deleteApiKeyBtn");
    var aiWarning = document.getElementById("aiApiWarning");

    if (key) {
        // API VAR
        if (card) {
            card.classList.remove("status-missing");
            card.classList.add("status-ok");
        }
        if (statusRow) statusRow.classList.add("ok");
        if (statusRow) statusRow.classList.remove("missing");
        if (statusIcon) statusIcon.innerText = "✅";
        if (statusText) statusText.innerText = "API anahtarı kayıtlı — AI aktif";
        if (inputEl) inputEl.value = "";
        if (inputEl) inputEl.placeholder = "•••••••••••••••• (kayıtlı)";
        if (deleteBtn) deleteBtn.style.display = "block";
        if (aiWarning) aiWarning.style.display = "none";
    } else {
        // API YOK
        if (card) {
            card.classList.remove("status-ok");
            card.classList.add("status-missing");
        }
        if (statusRow) statusRow.classList.add("missing");
        if (statusRow) statusRow.classList.remove("ok");
        if (statusIcon) statusIcon.innerText = "⚠️";
        if (statusText) statusText.innerText = "API anahtarı girilmemiş";
        if (inputEl) inputEl.value = "";
        if (inputEl) inputEl.placeholder = "Gemini API Key";
        if (deleteBtn) deleteBtn.style.display = "none";
        if (aiWarning) aiWarning.style.display = "flex";
    }
}

function saveGeminiApiKey() {
    var inputEl = document.getElementById("geminiApiKeyInput");
    if (!inputEl) return;
    var val = inputEl.value.trim();
    if (!val) {
        showNotification("⚠️ Lütfen API anahtarını gir");
        return;
    }
    localStorage.setItem("gemini_api_key", val);
    updateApiStatusUI();
    showNotification("✅ API anahtarı kaydedildi! AI artık aktif.");
}

function deleteGeminiApiKey() {
    if (!confirm("API anahtarını silmek istediğine emin misin? AI özellikleri devre dışı kalır.")) return;
    localStorage.removeItem("gemini_api_key");
    updateApiStatusUI();
    showNotification("🗑️ API anahtarı silindi");
}

// ============ AI SORU SORMA ============
async function askCard(key) {
    var key_api = getGeminiApiKey();
    if (!key_api) {
        showNotification("⚠️ Önce profil sekmesinden API anahtarını gir");
        setTimeout(function() { switchTab("profile"); }, 800);
        return;
    }
    var p = aiPromptlar[key];
    if (!p) return;

    showAiResult(p.emoji, p.title);

    var area = document.getElementById("aiResultArea");
    if (area) {
        setTimeout(function() {
            area.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 150);
    }

    await callGemini(p.prompt);
}

async function askFree() {
    var key_api = getGeminiApiKey();
    if (!key_api) {
        showNotification("⚠️ Önce profil sekmesinden API anahtarını gir");
        setTimeout(function() { switchTab("profile"); }, 800);
        return;
    }

    var input = document.getElementById("aiFreeAskInput");
    var text = input ? input.value.trim() : "";
    if (!text) {
        showNotification("⚠️ Bir soru yaz");
        return;
    }

    showAiResult("💬", "Cevap");
    input.value = "";

    var area = document.getElementById("aiResultArea");
    if (area) {
        setTimeout(function() {
            area.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 150);
    }

    await callGemini(text);
}

// ============ SONUÇ ALANI ============
function showAiResult(emoji, title) {
    var emojiEl = document.getElementById("aiResultEmoji");
    var titleEl = document.getElementById("aiResultTitle");
    var contentEl = document.getElementById("aiResultContent");
    var area = document.getElementById("aiResultArea");

    if (emojiEl) emojiEl.innerText = emoji;
    if (titleEl) titleEl.innerText = title;
    if (contentEl) {
        contentEl.innerHTML = '<div class="ai-result-loading"><div class="ai-loading-spinner"></div><div class="ai-loading-text">AI düşünüyor...</div></div>';
    }
    if (area) area.classList.add("show");
}

function closeAiResult() {
    var area = document.getElementById("aiResultArea");
    if (area) area.classList.remove("show");
}

// ============ GEMINI ÇAĞRISI ============
async function callGemini(userPrompt) {
    var apiKey = getGeminiApiKey();
    if (!apiKey) return;

    var btn = document.getElementById("aiFreeAskBtn");
    if (btn) btn.disabled = true;

    try {
        var context = buildAiContext();
        var fullPrompt = context + "\n\nKullanıcı sorusu: " + userPrompt;

        var url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey;
        var response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: fullPrompt }] }],
                generationConfig: { temperature: 0.85, maxOutputTokens: 500 }
            })
        });

        var contentEl = document.getElementById("aiResultContent");
        if (!contentEl) return;

        if (!response.ok) {
            contentEl.innerHTML = '<div style="color:#fca5a5; padding:1rem; background:rgba(239,68,68,0.1); border-radius:0.8rem; font-weight:700;">❌ API hatası: ' + response.status + '<br><span style="font-size:0.8rem; opacity:0.8;">API anahtarını kontrol et veya daha sonra tekrar dene.</span></div>';
            return;
        }

        var data = await response.json();
        var aiText = data.candidates[0].content.parts[0].text;

        contentEl.innerHTML = formatAiText(aiText);
    } catch (err) {
        var cEl = document.getElementById("aiResultContent");
        if (cEl) cEl.innerHTML = '<div style="color:#fca5a5; padding:1rem; background:rgba(239,68,68,0.1); border-radius:0.8rem; font-weight:700;">❌ Hata: ' + err.message + '</div>';
    } finally {
        if (btn) btn.disabled = false;
    }
}

function formatAiText(text) {
    return text
        .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>")
        .replace(/\n/g, "<br>");
}

// ============ GERÇEK VERİLERDEN CONTEXT ============
function buildAiContext() {
    var entry = dailyEntries[currentDate] || {};
    var total = getDailyTotal(entry);
    var need = getDailyNeeds(currentDate);

    var targetProtein = userProfile.targetProtein || Math.round((userProfile.weight || 70) * 1.8);
    var remainingCalsForMacros = Math.max(0, need - (targetProtein * 4));
    var targetCarbs = userProfile.targetCarbs || Math.round((remainingCalsForMacros * 0.55) / 4);
    var targetFat = userProfile.targetFat || Math.round((remainingCalsForMacros * 0.45) / 9);

    // Son 7 günün ortalamaları
    var dates = Object.keys(dailyEntries).sort().reverse().slice(0, 7);
    var sumCal = 0,
        sumProt = 0,
        sumWater = 0,
        validDays = 0,
        exerciseDays = 0;
    dates.forEach(function(d) {
        var e = dailyEntries[d];
        if (!e) return;
        var t = getDailyTotal(e);
        if (t.calories > 0) {
            sumCal += t.calories;
            sumProt += t.protein;
            sumWater += (e.water || 0);
            if ((e.exercise || 0) > 0 || (e.exerciseDuration || 0) > 0) exerciseDays++;
            validDays++;
        }
    });
    var avgCal = validDays > 0 ? Math.round(sumCal / validDays) : 0;
    var avgProt = validDays > 0 ? Math.round(sumProt / validDays) : 0;
    var avgWater = validDays > 0 ? (sumWater / validDays).toFixed(1) : 0;

    // Seri hesabı
    var streak = 0;
    var today = new Date();
    for (var i = 0; i < 30; i++) {
        var d = new Date();
        d.setDate(today.getDate() - i);
        var iso = d.toISOString().slice(0, 10);
        var e = dailyEntries[iso];
        if (e) {
            var t = getDailyTotal(e);
            if (t.calories > 0 || (e.water || 0) > 0 || (e.steps || 0) > 0 || (e.exerciseDuration || 0) > 0) {
                streak++;
            } else break;
        } else break;
    }

    // Bugünkü yemekler
    function mealItemsText(mealKey) {
        var meal = entry[mealKey];
        if (!meal || !Array.isArray(meal.items) || meal.items.length === 0) return "yok";
        return meal.items.map(function(it) { return it.name; }).join(", ");
    }

    // Öğün toplamları
    var mTotal = getMealTotal(entry.morning);
    var nTotal = getMealTotal(entry.noon);
    var eTotal = getMealTotal(entry.evening);
    var sTotal = getMealTotal(entry.snack);

    // Ruh hali
    var mood = moodEntries[currentDate];
    var moodText = mood ? (mood.mood + " (" + mood.type + ")") : "kayıtlı değil";

    // Hedefler
    var targetInfo = "";
    if (userProfile.targetWeight) {
        var diff = (userProfile.weight || 0) - userProfile.targetWeight;
        targetInfo = "\n- Hedef kilo: " + userProfile.targetWeight + " kg (fark: " + Math.abs(diff).toFixed(1) + " kg)";
    }

    // Adım bonusu bilgisi
    var stepBonus = Math.round(((entry.steps || 0) / 1000) * 40);

    return "Sen SağlıcakLA adlı bir sağlık uygulamasının AI asistanısın. " +
        "Kullanıcıya beslenme, egzersiz, kilo yönetimi ve motivasyon konusunda yardımcı oluyorsun. " +
        "Cevapların Türkçe, kısa (max 3-4 cümle), samimi ve motive edici olmalı. " +
        "Emoji kullanabilirsin. Gerektiğinde sorular sorabilirsin. Tıbbi tavsiye verme, sadece genel öneri sun.\n\n" +
        "=== KULLANICI BİLGİLERİ ===\n" +
        "- Kilo: " + (userProfile.weight || "?") + " kg, Boy: " + (userProfile.height || "?") + " cm, Yaş: " + (userProfile.age || "?") +
        targetInfo + "\n\n" +
        "=== BUGÜN (" + currentDate + ") ===\n" +
        "- Kalori: " + total.calories + " / " + need + " kcal (kalan: " + (need - total.calories) + ")\n" +
        "- Protein: " + total.protein.toFixed(0) + " / " + targetProtein + " g\n" +
        "- Karbonhidrat: " + total.carbs.toFixed(0) + " / " + targetCarbs + " g\n" +
        "- Yağ: " + total.fat.toFixed(0) + " / " + targetFat + " g\n" +
        "- Su: " + (entry.water || 0) + " / 8 bardak\n" +
        "- Adım: " + (entry.steps || 0) + " (yaklaşık +" + stepBonus + " kcal bonus)\n" +
        "- Egzersiz: " + (entry.exerciseDuration || 0) + " dk, " + (entry.exercise || 0) + " kcal\n" +
        "- Ruh hali: " + moodText + "\n\n" +
        "=== BUGÜN YENEN YEMEKLER ===\n" +
        "- Sabah (" + mTotal.cal + " kcal): " + mealItemsText("morning") + "\n" +
        "- Öğle (" + nTotal.cal + " kcal): " + mealItemsText("noon") + "\n" +
        "- Akşam (" + eTotal.cal + " kcal): " + mealItemsText("evening") + "\n" +
        "- Ara (" + sTotal.cal + " kcal): " + mealItemsText("snack") + "\n\n" +
        "=== SON 7 GÜN ===\n" +
        "- Ort. kalori: " + avgCal + " kcal\n" +
        "- Ort. protein: " + avgProt + " g\n" +
        "- Ort. su: " + avgWater + " bardak\n" +
        "- Antrenman günü: " + exerciseDays + " gün\n" +
        "- Seri: " + streak + " gün üst üste kayıt\n\n" +
        "Bu verilere göre kişiselleştirilmiş, gerçekçi ve motive edici cevap ver.";
}
// ============================================================
// TARİFLER SEKMESİ — YENİ SİSTEM
// ============================================================

var currentRecipeFilter = "all";
var currentRecipeSearch = "";
var currentRecipeForMeal = null;
var currentRecipeMealType = "morning";

// ============ RENDER TARİFLER ============
function renderRecipes() {
    var container = document.getElementById("recipesList");
    if (!container) return;

    // Filtrele
    var filtered = myRecipes.filter(function(r) {
        // Kategori filtresi
        if (currentRecipeFilter !== "all") {
            var cat = r.category || "diğer";
            if (cat !== currentRecipeFilter) return false;
        }
        // Arama
        if (currentRecipeSearch) {
            var q = currentRecipeSearch.toLowerCase();
            var nameMatch = (r.name || "").toLowerCase().includes(q);
            var detailsMatch = (r.details || "").toLowerCase().includes(q);
            if (!nameMatch && !detailsMatch) return false;
        }
        return true;
    });

    if (myRecipes.length === 0) {
        container.innerHTML =
            '<div class="recipe-empty">' +
            '<span class="recipe-empty-emoji">📖</span>' +
            '<div class="recipe-empty-title">Henüz tarifin yok</div>' +
            '<div class="recipe-empty-sub">Yukarıdan ilk tarifini ekle veya AI\'ya sor!</div>' +
            '</div>';
        return;
    }

    if (filtered.length === 0) {
        container.innerHTML =
            '<div class="recipe-empty">' +
            '<span class="recipe-empty-emoji">🔍</span>' +
            '<div class="recipe-empty-title">Sonuç bulunamadı</div>' +
            '<div class="recipe-empty-sub">Farklı bir arama veya kategori dene</div>' +
            '</div>';
        return;
    }

    var html = "";
    filtered.forEach(function(r) {
        var originalIndex = myRecipes.indexOf(r);
        var portions = r.portions || 1;
        var perPortionCal = Math.round((r.cal || 0) / portions);
        var perPortionProt = ((r.prot || 0) / portions).toFixed(1);
        var perPortionCarbs = ((r.carbs || 0) / portions).toFixed(1);
        var perPortionFat = ((r.fat || 0) / portions).toFixed(1);

        var catEmoji = {
            "kahvaltı": "☀️",
            "öğle": "🌞",
            "akşam": "🌙",
            "ara": "🍎",
            "tatlı": "🍫",
            "atıştırmalık": "🥨"
        }[r.category] || "🍽️";

        var safeName = (r.name || "").replace(/'/g, "\\'").replace(/"/g, "&quot;");
        var safeDetails = (r.details || "").replace(/\n/g, "<br>");

        html += '<div class="recipe-item">' +
            '<div class="recipe-item-header">' +
            '<div class="recipe-item-name">' + catEmoji + ' ' + r.name + '</div>' +
            '</div>' +
            '<div class="recipe-item-macros">' +
            '<span>🔥 ' + perPortionCal + ' kcal</span>' +
            '<span>🥩 ' + perPortionProt + 'g</span>' +
            '<span>🍞 ' + perPortionCarbs + 'g</span>' +
            '<span>🥑 ' + perPortionFat + 'g</span>' +
            '</div>' +
            '<div class="recipe-item-portion-info">' +
            '📊 Toplam ' + portions + ' porsiyon (1 porsiyon için değerler gösteriliyor)' +
            '</div>' +
            '<button class="recipe-details-toggle" onclick="toggleRecipeDetails(' + originalIndex + ', this)">' +
            '<span>📖</span> Tarif Detaylarını Göster' +
            '</button>' +
            '<div class="recipe-item-details" id="recipeDetails_' + originalIndex + '">' +
            (safeDetails || '<i style="opacity:0.6;">Detay girilmemiş</i>') +
            '</div>' +
            '<div class="recipe-item-actions">' +
            '<button class="add-to-meal" onclick="openAddRecipeToMeal(' + originalIndex + ')">🍽️ Öğüne Ekle</button>' +
            '<button class="edit-btn" onclick="editRecipe(' + originalIndex + ')">✏️</button>' +
            '<button class="delete-btn" onclick="deleteRecipe(' + originalIndex + ')">🗑️</button>' +
            '</div>' +
            '</div>';
    });

    container.innerHTML = html;
}

// ============ ARAMA & FİLTRE ============
function filterRecipes(query) {
    currentRecipeSearch = query || "";
    renderRecipes();
}

function filterRecipeByCategory(cat, btn) {
    currentRecipeFilter = cat;
    document.querySelectorAll(".recipe-filter-chip").forEach(function(c) {
        c.classList.remove("active");
    });
    if (btn) btn.classList.add("active");
    renderRecipes();
}

// ============ DETAY TOGGLE ============
function toggleRecipeDetails(index, btn) {
    var el = document.getElementById("recipeDetails_" + index);
    if (!el) return;
    el.classList.toggle("open");
    if (el.classList.contains("open")) {
        btn.innerHTML = '<span>📖</span> Tarif Detaylarını Gizle';
    } else {
        btn.innerHTML = '<span>📖</span> Tarif Detaylarını Göster';
    }
}

// ============ MANUEL TARİF KAYDET ============
function saveRecipe() {
    var name = document.getElementById("recipeName").value.trim();
    var details = document.getElementById("recipeDetails").value.trim();
    var cal = Number(document.getElementById("recipeCal").value) || 0;
    var prot = Number(document.getElementById("recipeProt").value) || 0;
    var carbs = Number(document.getElementById("recipeCarbs").value) || 0;
    var fat = Number(document.getElementById("recipeFat").value) || 0;
    var portions = Number(document.getElementById("recipePortions").value) || 1;

    if (!name) {
        showNotification("❌ Lütfen tarif adını gir");
        return;
    }
    if (portions < 0.5) portions = 1;

    myRecipes.push({
        name: name,
        details: details,
        cal: cal,
        prot: prot,
        carbs: carbs,
        fat: fat,
        portions: portions,
        category: "diğer",
        createdAt: getToday()
    });

    localStorage.setItem("nutritrack_recipes", JSON.stringify(myRecipes));

    // Formu temizle
    document.getElementById("recipeName").value = "";
    document.getElementById("recipeDetails").value = "";
    document.getElementById("recipeCal").value = "";
    document.getElementById("recipeProt").value = "";
    document.getElementById("recipeCarbs").value = "";
    document.getElementById("recipeFat").value = "";
    document.getElementById("recipePortions").value = "1";

    renderRecipes();
    showNotification("✅ Tarif kaydedildi!");

    var btn = document.getElementById("saveRecipeBtn");
    if (btn) {
        var oldText = btn.innerText;
        btn.innerText = "✓ Kaydedildi!";
        setTimeout(function() { btn.innerText = oldText; }, 1500);
    }
}

// ============ TARİF DÜZENLE ============
function editRecipe(index) {
    var r = myRecipes[index];
    if (!r) return;

    var newName = prompt("Tarif Adı:", r.name || "");
    if (newName === null) return;
    newName = newName.trim();
    if (!newName) { showNotification("⚠️ İsim boş olamaz"); return; }

    var newDetails = prompt("Malzemeler ve Hazırlanışı:", r.details || "");
    if (newDetails === null) return;

    var newCal = prompt("Toplam Kalori (kcal):", r.cal || 0);
    if (newCal === null) return;
    var newProt = prompt("Toplam Protein (g):", r.prot || 0);
    if (newProt === null) return;
    var newCarbs = prompt("Toplam Karbonhidrat (g):", r.carbs || 0);
    if (newCarbs === null) return;
    var newFat = prompt("Toplam Yağ (g):", r.fat || 0);
    if (newFat === null) return;
    var newPortions = prompt("Kaç Porsiyon?", r.portions || 1);
    if (newPortions === null) return;

    r.name = newName;
    r.details = newDetails;
    r.cal = Number(newCal) || 0;
    r.prot = Number(newProt) || 0;
    r.carbs = Number(newCarbs) || 0;
    r.fat = Number(newFat) || 0;
    r.portions = Number(newPortions) || 1;
    r.updatedAt = getToday();

    localStorage.setItem("nutritrack_recipes", JSON.stringify(myRecipes));
    renderRecipes();
    showNotification("✅ Tarif güncellendi!");
}

// ============ TARİF SİL ============
function deleteRecipe(index) {
    if (!confirm("Bu tarifi silmek istediğine emin misin?")) return;
    myRecipes.splice(index, 1);
    localStorage.setItem("nutritrack_recipes", JSON.stringify(myRecipes));
    renderRecipes();
    showNotification("🗑️ Tarif silindi");
}

// ============ AI İLE TARİF OLUŞTUR ============
async function askAIForRecipe() {
    var apiKey = getGeminiApiKey();
    if (!apiKey) {
        showNotification("⚠️ Önce profil sekmesinden API anahtarını gir");
        setTimeout(function() { switchTab("profile"); }, 800);
        return;
    }

    var mealType = document.getElementById("aiRecipeMeal").value;
    var goal = document.getElementById("aiRecipeGoal").value;
    var ingredients = document.getElementById("aiRecipeIngredients").value.trim();

    var resultDiv = document.getElementById("aiRecipeResult");
    if (!resultDiv) return;

    resultDiv.innerHTML = '<div class="ai-loading"><div class="ai-spinner"></div><div>🤖 AI tarif hazırlıyor...</div></div>';

    var btn = document.getElementById("askRecipeAIBtn");
    if (btn) btn.disabled = true;

    try {
        var prompt =
            "Sen bir diyetisyensin. Kullanıcı için " + mealType + " türünde, " + goal + " hedefli bir tarif öner. " +
            (ingredients ? "Kullanıcı şu malzemeleri tercih ediyor: " + ingredients + ". " : "") +
            "Tarif Türk mutfağına uygun, pratik ve lezzetli olsun. " +
            "SADECE şu JSON formatında cevap ver, ekstra metin veya markdown YOK:\n" +
            "{\n" +
            "  \"name\": \"Tarif adı\",\n" +
            "  \"category\": \"" + (mealType === "kahvaltı" ? "kahvaltı" : mealType === "öğle" ? "öğle" : mealType === "akşam" ? "akşam" : mealType === "ara öğün" ? "ara" : mealType === "tatlı" ? "tatlı" : "atıştırmalık") + "\",\n" +
            "  \"portions\": 2,\n" +
            "  \"calories\": 400,\n" +
            "  \"protein\": 30,\n" +
            "  \"carbs\": 40,\n" +
            "  \"fat\": 12,\n" +
            "  \"ingredients\": \"- 200g tavuk göğsü\\n- 1 yemek kaşığı zeytinyağı\\n...\",\n" +
            "  \"steps\": \"1. Tavuğu doğra\\n2. ...\"\n" +
            "}\n\n" +
            "Sadece JSON döndür. Kalori ve makrolar TOPLAM tarif için (tüm porsiyonlar için) olmalı.";

        var url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey;
        var response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    response_mime_type: "application/json",
                    temperature: 0.9,
                    maxOutputTokens: 1000
                }
            })
        });

        if (!response.ok) throw new Error("API hatası: " + response.status);

        var data = await response.json();
        var text = data.candidates[0].content.parts[0].text;
        var clean = text.replace(/```json/gi, "").replace(/```/g, "").trim();
        var recipe = JSON.parse(clean);

        renderAIRecipeResult(recipe);
    } catch (err) {
        resultDiv.innerHTML = '<div style="padding:1rem; background:rgba(239,68,68,0.1); border:1px solid var(--danger); border-radius:1rem; color:var(--danger); font-weight:700;">❌ Hata: ' + err.message + '</div>';
    } finally {
        if (btn) btn.disabled = false;
    }
}

function renderAIRecipeResult(recipe) {
    var resultDiv = document.getElementById("aiRecipeResult");
    if (!resultDiv) return;

    var portions = recipe.portions || 1;
    var perCal = Math.round((recipe.calories || 0) / portions);
    var perProt = ((recipe.protein || 0) / portions).toFixed(1);
    var perCarbs = ((recipe.carbs || 0) / portions).toFixed(1);
    var perFat = ((recipe.fat || 0) / portions).toFixed(1);

    var fullDetails = "";
    if (recipe.ingredients) fullDetails += "<b>📝 Malzemeler:</b>\n" + recipe.ingredients + "\n\n";
    if (recipe.steps) fullDetails += "<b>👨‍🍳 Hazırlanışı:</b>\n" + recipe.steps;

    var safeName = (recipe.name || "Tarif").replace(/'/g, "\\'").replace(/"/g, "&quot;");
    var safeDetails = fullDetails.replace(/'/g, "\\'").replace(/"/g, "&quot;").replace(/\n/g, "\\n");
    var safeCat = recipe.category || "diğer";

    resultDiv.innerHTML =
        '<div class="ai-recipe-result">' +
        '<div class="ai-recipe-title">✨ ' + recipe.name + '</div>' +
        '<div class="ai-recipe-macros">' +
        '<div class="ai-recipe-macro"><div class="ai-recipe-macro-val">' + perCal + '</div><div class="ai-recipe-macro-lbl">kcal</div></div>' +
        '<div class="ai-recipe-macro"><div class="ai-recipe-macro-val p">' + perProt + 'g</div><div class="ai-recipe-macro-lbl">Protein</div></div>' +
        '<div class="ai-recipe-macro"><div class="ai-recipe-macro-val c">' + perCarbs + 'g</div><div class="ai-recipe-macro-lbl">Karb</div></div>' +
        '<div class="ai-recipe-macro"><div class="ai-recipe-macro-val f">' + perFat + 'g</div><div class="ai-recipe-macro-lbl">Yağ</div></div>' +
        '</div>' +
        '<div class="small-text" style="text-align:center; margin-bottom:0.6rem;">1 porsiyon için değerler · Toplam ' + portions + ' porsiyon</div>' +
        '<div class="ai-recipe-details">' + fullDetails + '</div>' +
        '<div style="display:flex; gap:0.5rem;">' +
        '<button class="big-btn green" onclick="saveAIRecipe(\'' + safeName + '\', ' + (recipe.calories || 0) + ', ' + (recipe.protein || 0) + ', ' + (recipe.carbs || 0) + ', ' + (recipe.fat || 0) + ', ' + portions + ', \'' + safeCat + '\', \'' + safeDetails + '\')" style="flex:1;">💾 Kaydet</button>' +
        '<button class="secondary" onclick="document.getElementById(\'aiRecipeResult\').innerHTML=\'\'" style="flex:0 0 auto; padding: 1rem;">🗑️</button>' +
        '</div>' +
        '</div>';
}

function saveAIRecipe(name, cal, prot, carbs, fat, portions, category, details) {
    myRecipes.push({
        name: name,
        details: details,
        cal: cal,
        prot: prot,
        carbs: carbs,
        fat: fat,
        portions: portions,
        category: category,
        createdAt: getToday(),
        source: "ai"
    });

    localStorage.setItem("nutritrack_recipes", JSON.stringify(myRecipes));
    renderRecipes();
    showNotification("✅ AI tarifi kaydedildi!");

    var resultDiv = document.getElementById("aiRecipeResult");
    if (resultDiv) resultDiv.innerHTML = '<div style="text-align:center; padding:1.5rem; color:var(--success); font-weight:800;">✅ Tarif kaydedildi!</div>';

    // Filtreyi "all" yap ki gözüksün
    currentRecipeFilter = "all";
    currentRecipeSearch = "";
    var searchEl = document.getElementById("recipeSearch");
    if (searchEl) searchEl.value = "";
    document.querySelectorAll(".recipe-filter-chip").forEach(function(c) {
        c.classList.toggle("active", c.getAttribute("data-filter") === "all");
    });
}

// ============ TARİFTEN ÖĞÜNE EKLE ============
function openAddRecipeToMeal(index) {
    var r = myRecipes[index];
    if (!r) return;

    currentRecipeForMeal = index;
    currentRecipeMealType = "morning";

    var portions = r.portions || 1;
    var perCal = Math.round((r.cal || 0) / portions);
    var perProt = ((r.prot || 0) / portions).toFixed(1);
    var perCarbs = ((r.carbs || 0) / portions).toFixed(1);
    var perFat = ((r.fat || 0) / portions).toFixed(1);

    var infoEl = document.getElementById("recipeToMealInfo");
    if (infoEl) {
        infoEl.innerHTML =
            '<div class="recipe-to-meal-info-name">' + r.name + '</div>' +
            '<div class="recipe-to-meal-info-macros">' +
            '<span>🔥 ' + perCal + ' kcal</span>' +
            '<span>🥩 ' + perProt + 'g</span>' +
            '<span>🍞 ' + perCarbs + 'g</span>' +
            '<span>🥑 ' + perFat + 'g</span>' +
            '</div>' +
            '<div class="small-text" style="margin-top:0.5rem;">1 porsiyon için değerler</div>';
    }

    // Öğün seçici reset
    document.querySelectorAll(".meal-selector-btn").forEach(function(b) {
        b.classList.toggle("active", b.getAttribute("data-meal") === "morning");
    });

    // Porsiyon reset
    var portionInput = document.getElementById("recipePortionAmount");
    if (portionInput) portionInput.value = 1;

    updateRecipeMealPreview();

    openModal("addRecipeToMealModal");
}

function selectRecipeMealType(meal, btn) {
    currentRecipeMealType = meal;
    document.querySelectorAll(".meal-selector-btn").forEach(function(b) {
        b.classList.remove("active");
    });
    if (btn) btn.classList.add("active");
    updateRecipeMealPreview();
}

function setRecipePortion(delta) {
    var input = document.getElementById("recipePortionAmount");
    if (!input) return;
    var cur = parseFloat(input.value) || 1;
    var next = cur + delta;
    if (next < 0.5) next = 0.5;
    if (next > 10) next = 10;
    input.value = next;
    updateRecipeMealPreview();
}

function updateRecipeMealPreview() {
    if (currentRecipeForMeal === null) return;
    var r = myRecipes[currentRecipeForMeal];
    if (!r) return;

    var portions = r.portions || 1;
    var amount = parseFloat(document.getElementById("recipePortionAmount").value) || 1;

    var perCal = (r.cal || 0) / portions;
    var perProt = (r.prot || 0) / portions;
    var perCarbs = (r.carbs || 0) / portions;
    var perFat = (r.fat || 0) / portions;

    var totalCal = Math.round(perCal * amount);
    var totalProt = (perProt * amount).toFixed(1);
    var totalCarbs = (perCarbs * amount).toFixed(1);
    var totalFat = (perFat * amount).toFixed(1);

    var previewEl = document.getElementById("recipeMealPreview");
    if (previewEl) {
        previewEl.innerHTML =
            '<div class="recipe-meal-preview-cal">' + totalCal + ' <small>kcal</small></div>' +
            '<div class="recipe-meal-preview-macros">' +
            '<span class="p">🥩 ' + totalProt + 'g</span>' +
            '<span class="c">🍞 ' + totalCarbs + 'g</span>' +
            '<span class="f">🥑 ' + totalFat + 'g</span>' +
            '</div>';
    }
}

function confirmAddRecipeToMeal() {
    if (currentRecipeForMeal === null) return;
    var r = myRecipes[currentRecipeForMeal];
    if (!r) return;

    var portions = r.portions || 1;
    var amount = parseFloat(document.getElementById("recipePortionAmount").value) || 1;

    var cal = Math.round(((r.cal || 0) / portions) * amount);
    var prot = ((r.prot || 0) / portions) * amount;
    var carbs = ((r.carbs || 0) / portions) * amount;
    var fat = ((r.fat || 0) / portions) * amount;

    var portionText = amount === 1 ? "" : " (" + amount + " porsiyon)";
    addToMeal(currentRecipeMealType, cal, prot, carbs, fat, r.name + portionText, "🍽️");

    closeModal("addRecipeToMealModal");
    currentRecipeForMeal = null;

    // Kullanıcıyı Beslenme sekmesine götür (opsiyonel)
    setTimeout(function() {
        if (confirm("Tarif öğüne eklendi! Beslenme sekmesine gitmek ister misin?")) {
            switchTab("daily");
        }
    }, 300);
}

// ============ INIT ============
function initRecipesTab() {
    var saveBtn = document.getElementById("saveRecipeBtn");
    if (saveBtn) saveBtn.addEventListener("click", saveRecipe);
}
// ============================================================
// RAPORLAR SEKMESİ — YENİ SİSTEM
// ============================================================

var currentReportPeriod = "this_week";
var reportCharts = { calorie: null, waterStep: null, sport: null };

// ============ DÖNEM DEĞİŞTİR ============
function changeReportPeriod(period, btn) {
    currentReportPeriod = period;

    document.querySelectorAll(".report-period-btn").forEach(function(b) {
        b.classList.remove("active");
    });
    if (btn) btn.classList.add("active");

    // Özel tarih aralığı göster/gizle
    var customRange = document.getElementById("customDateRange");
    if (customRange) {
        customRange.style.display = period === "custom" ? "grid" : "none";
    }

    // Custom için tarihleri doldur
    if (period === "custom") {
        var startInput = document.getElementById("reportStartDate");
        var endInput = document.getElementById("reportEndDate");
        if (startInput && !startInput.value) {
            var d = new Date();
            d.setDate(d.getDate() - 7);
            startInput.value = d.toISOString().slice(0, 10);
        }
        if (endInput && !endInput.value) {
            endInput.value = getToday();
        }
    }

    renderReport();
}

// ============ TARİH ARALIĞI HESAPLA ============
function getReportDateRange(period) {
    var today = new Date();
    var start, end;

    if (period === "this_week") {
        // Bu hafta (Pazartesi'den bugüne)
        var dayOfWeek = today.getDay(); // 0=Pazar, 1=Pazartesi...
        var diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        start = new Date(today);
        start.setDate(today.getDate() - diffToMonday);
        end = new Date(today);
    } else if (period === "last_week") {
        var dayOfWeek2 = today.getDay();
        var diffToMonday2 = dayOfWeek2 === 0 ? 6 : dayOfWeek2 - 1;
        end = new Date(today);
        end.setDate(today.getDate() - diffToMonday2 - 1);
        start = new Date(end);
        start.setDate(end.getDate() - 6);
    } else if (period === "last_2_weeks") {
        end = new Date(today);
        start = new Date(today);
        start.setDate(today.getDate() - 13);
    } else if (period === "this_month") {
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date(today);
    } else if (period === "last_month") {
        var firstThisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date(firstThisMonth);
        end.setDate(end.getDate() - 1);
        start = new Date(end.getFullYear(), end.getMonth(), 1);
    } else if (period === "custom") {
        var s = document.getElementById("reportStartDate").value;
        var e = document.getElementById("reportEndDate").value;
        if (s && e) {
            start = new Date(s);
            end = new Date(e);
        } else {
            end = new Date(today);
            start = new Date(today);
            start.setDate(today.getDate() - 7);
        }
    } else {
        end = new Date(today);
        start = new Date(today);
        start.setDate(today.getDate() - 6);
    }

    return { start: start, end: end };
}

// ============ ANA RENDER ============
function renderReport() {
    var range = getReportDateRange(currentReportPeriod);
    var startISO = range.start.toISOString().slice(0, 10);
    var endISO = range.end.toISOString().slice(0, 10);

    // Dönem bilgisi
    var infoEl = document.getElementById("reportPeriodInfo");
    if (infoEl) {
        var dayCount = Math.round((range.end - range.start) / (1000 * 60 * 60 * 24)) + 1;
        infoEl.innerHTML = '📅 <b>' + formatDateTR(range.start) + '</b> → <b>' + formatDateTR(range.end) + '</b> · ' + dayCount + ' gün';
    }

    // Tarihleri topla
    var dates = Object.keys(dailyEntries).filter(function(d) {
        return d >= startISO && d <= endISO;
    }).sort();

    var reportData = {
        dates: dates,
        totalCal: 0,
        totalProt: 0,
        totalCarbs: 0,
        totalFat: 0,
        totalWater: 0,
        totalSteps: 0,
        totalSport: 0,
        totalExercise: 0,
        daysWithData: 0,
        daysWithSport: 0,
        dailyCal: [],
        dailyWater: [],
        dailySteps: [],
        dailySport: []
    };

    dates.forEach(function(d) {
        var entry = dailyEntries[d];
        if (!entry) return;
        var t = getDailyTotal(entry);
        if (t.calories > 0 || (entry.water || 0) > 0 || (entry.steps || 0) > 0 || (entry.exerciseDuration || 0) > 0) {
            reportData.totalCal += t.calories;
            reportData.totalProt += t.protein;
            reportData.totalCarbs += t.carbs;
            reportData.totalFat += t.fat;
            reportData.totalWater += (entry.water || 0);
            reportData.totalSteps += (entry.steps || 0);
            reportData.totalSport += (entry.exerciseDuration || 0);
            reportData.totalExercise += (entry.exercise || 0);
            reportData.daysWithData++;
            if ((entry.exerciseDuration || 0) > 0 || (entry.exercise || 0) > 0) reportData.daysWithSport++;
        }
        reportData.dailyCal.push(t.calories);
        reportData.dailyWater.push((entry.water || 0) * 200);
        reportData.dailySteps.push(entry.steps || 0);
        reportData.dailySport.push(entry.exerciseDuration || 0);
    });

    renderReportSummary(reportData);
    renderReportCompliance(reportData, range);
    renderReportCharts(reportData, dates);
    renderBestWorstDays(reportData, dates);
    renderTopFoods(dates);
}

// ============ TARİH FORMATLA ============
function formatDateTR(date) {
    var d = date.getDate();
    var m = date.getMonth() + 1;
    return (d < 10 ? "0" + d : d) + "." + (m < 10 ? "0" + m : m);
}

// ============ ÖZET ============
function renderReportSummary(data) {
    var content = document.getElementById("reportSummaryContent");
    if (!content) return;

    if (data.daysWithData === 0) {
        content.innerHTML = '<div class="best-worst-empty">Bu dönemde kayıt yok 📭</div>';
        return;
    }

    var avgCal = Math.round(data.totalCal / data.daysWithData);
    var avgProt = Math.round(data.totalProt / data.daysWithData);
    var avgWater = (data.totalWater / data.daysWithData).toFixed(1);
    var avgSteps = Math.round(data.totalSteps / data.daysWithData);
    var avgSport = Math.round(data.totalSport / data.daysWithData);

    // Önceki dönem karşılaştırma (aynı uzunlukta, hemen öncesi)
    var range = getReportDateRange(currentReportPeriod);
    var daySpan = Math.round((range.end - range.start) / (1000 * 60 * 60 * 24)) + 1;
    var prevEnd = new Date(range.start);
    prevEnd.setDate(prevEnd.getDate() - 1);
    var prevStart = new Date(prevEnd);
    prevStart.setDate(prevStart.getDate() - daySpan + 1);
    var prevStartISO = prevStart.toISOString().slice(0, 10);
    var prevEndISO = prevEnd.toISOString().slice(0, 10);

    var prevTotalCal = 0,
        prevDays = 0;
    Object.keys(dailyEntries).forEach(function(d) {
        if (d >= prevStartISO && d <= prevEndISO) {
            var t = getDailyTotal(dailyEntries[d]);
            if (t.calories > 0) {
                prevTotalCal += t.calories;
                prevDays++;
            }
        }
    });
    var prevAvgCal = prevDays > 0 ? Math.round(prevTotalCal / prevDays) : 0;

    var html = '<div class="report-summary-grid">';

    // Kalori
    html += '<div class="report-summary-item" style="--item-color: var(--orange);">' +
        '<div class="report-summary-icon">🔥</div>' +
        '<div class="report-summary-value">' + avgCal + '<small>kcal</small></div>' +
        '<div class="report-summary-label">Ort. Kalori</div>';
    if (prevAvgCal > 0) {
        var diffCal = avgCal - prevAvgCal;
        var clsCal = Math.abs(diffCal) < 50 ? "neutral" : (diffCal > 0 ? "up" : "down");
        var signCal = diffCal > 0 ? "+" : "";
        html += '<div class="report-summary-change ' + clsCal + '">' + signCal + diffCal + ' kcal</div>';
    }
    html += '</div>';

    // Protein
    html += '<div class="report-summary-item" style="--item-color: var(--success);">' +
        '<div class="report-summary-icon">🥩</div>' +
        '<div class="report-summary-value">' + avgProt + '<small>g</small></div>' +
        '<div class="report-summary-label">Ort. Protein</div>' +
        '</div>';

    // Su
    html += '<div class="report-summary-item" style="--item-color: var(--primary);">' +
        '<div class="report-summary-icon">💧</div>' +
        '<div class="report-summary-value">' + avgWater + '<small>brd</small></div>' +
        '<div class="report-summary-label">Ort. Su</div>' +
        '</div>';

    // Adım
    html += '<div class="report-summary-item" style="--item-color: var(--success);">' +
        '<div class="report-summary-icon">🚶</div>' +
        '<div class="report-summary-value">' + avgSteps.toLocaleString('tr-TR') + '</div>' +
        '<div class="report-summary-label">Ort. Adım</div>' +
        '</div>';

    html += '</div>';

    // Alt satır bilgi
    html += '<div style="margin-top: 0.8rem; padding: 0.7rem; background: var(--bg); border-radius: 0.8rem; text-align: center; font-size: 0.78rem; font-weight: 700; color: var(--text-secondary);">' +
        '📊 Toplam <b style="color:var(--text);">' + data.totalCal + ' kcal</b> · ' +
        '<b style="color:var(--text);">' + data.daysWithData + '</b> gün kayıt · ' +
        '<b style="color:var(--text);">' + data.daysWithSport + '</b> spor günü' +
        '</div>';

    content.innerHTML = html;
}

// ============ HEDEFE UYUM ============
function renderReportCompliance(data, range) {
    var content = document.getElementById("reportComplianceContent");
    if (!content) return;

    if (data.daysWithData === 0) {
        content.innerHTML = '<div class="best-worst-empty">Bu dönemde veri yok 📭</div>';
        return;
    }

    // Her gün için hedefe uyum yüzdesi hesapla
    var totalCompliance = 0;
    var goodDays = 0; // Hedefe %85-115 arası
    var countDays = 0;

    data.dates.forEach(function(d) {
        var entry = dailyEntries[d];
        if (!entry) return;
        var total = getDailyTotal(entry);
        if (total.calories === 0) return;
        var need = getDailyNeeds(d);
        var compliance = (total.calories / need) * 100;
        totalCompliance += Math.min(compliance, 150); // Max %150 say
        countDays++;
        if (compliance >= 85 && compliance <= 115) goodDays++;
    });

    var avgCompliance = countDays > 0 ? Math.round(totalCompliance / countDays) : 0;
    if (avgCompliance > 100) avgCompliance = 100; // Cap 100

    // SVG circle
    var radius = 55;
    var circumference = 2 * Math.PI * radius;
    var dashArray = (avgCompliance / 100) * circumference;

    var color = avgCompliance >= 85 ? "var(--success)" : avgCompliance >= 60 ? "var(--orange)" : "var(--danger)";

    var message = "";
    if (avgCompliance >= 90) {
        message = "🌟 <b>Mükemmel!</b> Hedefe çok yakın beslendin. Böyle devam!";
    } else if (avgCompliance >= 70) {
        message = "💪 <b>İyi gidiyorsun!</b> Biraz daha dikkatle hedefe tam ulaşabilirsin.";
    } else if (avgCompliance >= 50) {
        message = "⚠️ <b>Ortalama.</b> Kalori hedefine daha çok dikkat etmelisin.";
    } else {
        message = "🎯 <b>Hedefinden uzaksın.</b> Beslenme alışkanlıklarını gözden geçir.";
    }

    content.innerHTML =
        '<div class="report-compliance-layout">' +
        '<div class="compliance-circle">' +
        '<svg viewBox="0 0 130 130">' +
        '<circle class="compliance-circle-bg" cx="65" cy="65" r="' + radius + '"></circle>' +
        '<circle class="compliance-circle-fill" cx="65" cy="65" r="' + radius + '" ' +
        'stroke="' + color + '" ' +
        'stroke-dasharray="' + dashArray + ' ' + circumference + '"></circle>' +
        '</svg>' +
        '<div class="compliance-circle-text">' +
        '<div class="compliance-circle-value" style="color:' + color + ';">' + avgCompliance + '%</div>' +
        '<div class="compliance-circle-label">Uyum</div>' +
        '</div>' +
        '</div>' +
        '<div class="compliance-details">' +
        '<div class="compliance-message">' + message + '</div>' +
        '<div class="compliance-stats">' +
        '<div class="compliance-stat-row">' +
        '<span class="compliance-stat-label">✅ Başarılı gün</span>' +
        '<span class="compliance-stat-value">' + goodDays + ' / ' + countDays + '</span>' +
        '</div>' +
        '<div class="compliance-stat-row">' +
        '<span class="compliance-stat-label">📊 Toplam gün</span>' +
        '<span class="compliance-stat-value">' + countDays + '</span>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>';
}

// ============ RAPOR GRAFİKLERİ ============
function renderReportCharts(data, dates) {
    if (!window.Chart) return;

    var themeColors = getThemeColors();
    var labels = dates.map(function(d) { return d.slice(5); });

    // Ortak options
    function getChartOptions() {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: "bottom",
                    labels: { color: themeColors.text, font: { size: 10 }, padding: 8 }
                }
            },
            scales: {
                x: { grid: { color: themeColors.border }, ticks: { color: themeColors.text, font: { size: 10 } } },
                y: { grid: { color: themeColors.border }, ticks: { color: themeColors.text, font: { size: 10 } } }
            }
        };
    }

    var bgPlugin = {
        id: 'reportBg_' + Math.random(),
        beforeDraw: function(chart) {
            var ctx = chart.ctx;
            ctx.save();
            ctx.globalCompositeOperation = 'destination-over';
            ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--surface').trim() || '#ffffff';
            ctx.fillRect(0, 0, chart.width, chart.height);
            ctx.restore();
        }
    };

    // 1. Kalori & Makro
    if (reportCharts.calorie) reportCharts.calorie.destroy();
    var calCanvas = document.getElementById("reportCalorieChart");
    if (calCanvas) {
        var calCtx = calCanvas.getContext("2d");
        calCtx.clearRect(0, 0, calCanvas.width, calCanvas.height);
        reportCharts.calorie = new Chart(calCtx, {
            type: "line",
            data: {
                labels: labels,
                datasets: [{
                        label: "Kalori",
                        data: data.dailyCal,
                        borderColor: themeColors.primary,
                        backgroundColor: themeColors.primary + "1A",
                        fill: true,
                        tension: 0.3,
                        yAxisID: 'y'
                    },
                    {
                        label: "Protein (g)",
                        data: dates.map(function(d) { return getDailyTotal(dailyEntries[d]).protein; }),
                        borderColor: themeColors.success,
                        tension: 0.3,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: Object.assign({}, getChartOptions(), {
                scales: {
                    x: { grid: { color: themeColors.border }, ticks: { color: themeColors.text, font: { size: 10 } } },
                    y: { position: 'left', grid: { color: themeColors.border }, ticks: { color: themeColors.text, font: { size: 10 } } },
                    y1: { position: 'right', grid: { drawOnChartArea: false }, ticks: { color: themeColors.text, font: { size: 10 } } }
                }
            }),
            plugins: [bgPlugin]
        });
    }

    // 2. Su & Adım
    if (reportCharts.waterStep) reportCharts.waterStep.destroy();
    var wsCanvas = document.getElementById("reportWaterStepChart");
    if (wsCanvas) {
        var wsCtx = wsCanvas.getContext("2d");
        wsCtx.clearRect(0, 0, wsCanvas.width, wsCanvas.height);
        reportCharts.waterStep = new Chart(wsCtx, {
            type: "bar",
            data: {
                labels: labels,
                datasets: [{
                        label: "Su (ml)",
                        data: data.dailyWater,
                        backgroundColor: themeColors.primary + "CC",
                        borderRadius: 4,
                        yAxisID: 'y'
                    },
                    {
                        label: "Adım",
                        data: data.dailySteps,
                        backgroundColor: themeColors.success + "CC",
                        borderRadius: 4,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: Object.assign({}, getChartOptions(), {
                scales: {
                    x: { grid: { color: themeColors.border }, ticks: { color: themeColors.text, font: { size: 10 } } },
                    y: { position: 'left', grid: { color: themeColors.border }, ticks: { color: themeColors.text, font: { size: 10 } } },
                    y1: { position: 'right', grid: { drawOnChartArea: false }, ticks: { color: themeColors.text, font: { size: 10 } } }
                }
            }),
            plugins: [bgPlugin]
        });
    }

    // 3. Spor
    if (reportCharts.sport) reportCharts.sport.destroy();
    var sCanvas = document.getElementById("reportSportChart");
    if (sCanvas) {
        var sCtx = sCanvas.getContext("2d");
        sCtx.clearRect(0, 0, sCanvas.width, sCanvas.height);
        reportCharts.sport = new Chart(sCtx, {
            type: "bar",
            data: {
                labels: labels,
                datasets: [{
                    label: "Spor Süresi (dk)",
                    data: data.dailySport,
                    backgroundColor: themeColors.purple + "CC",
                    borderRadius: 4
                }]
            },
            options: getChartOptions(),
            plugins: [bgPlugin]
        });
    }
}

// ============ EN İYİ / EN KÖTÜ GÜNLER ============
function renderBestWorstDays(data, dates) {
    var content = document.getElementById("reportBestWorstContent");
    if (!content) return;

    if (data.daysWithData === 0) {
        content.innerHTML = '<div class="best-worst-empty">Bu dönemde yeterli veri yok 📭</div>';
        return;
    }

    var dayScores = [];
    dates.forEach(function(d) {
        var entry = dailyEntries[d];
        if (!entry) return;
        var total = getDailyTotal(entry);
        if (total.calories === 0) return;
        var need = getDailyNeeds(d);
        var compliance = (total.calories / need) * 100;
        // Hedefe ne kadar yakınsa o kadar iyi (100 = mükemmel)
        var score = Math.abs(100 - compliance);
        dayScores.push({ date: d, score: score, cal: total.calories, need: need, compliance: compliance });
    });

    if (dayScores.length === 0) {
        content.innerHTML = '<div class="best-worst-empty">Bu dönemde kayıt yok 📭</div>';
        return;
    }

    dayScores.sort(function(a, b) { return a.score - b.score; });
    var best = dayScores[0];
    var worst = dayScores[dayScores.length - 1];

    var html = '<div class="best-worst-grid">';

    // En iyi
    html += '<div class="best-worst-item best">' +
        '<div class="best-worst-emoji">🏆</div>' +
        '<div class="best-worst-date">' + best.date.slice(5) + '</div>' +
        '<div class="best-worst-detail">' + best.cal + ' kcal<br>Hedef: ' + best.need + ' kcal<br><b>' + Math.round(best.compliance) + '% uyum</b></div>' +
        '</div>';

    // En kötü
    if (dayScores.length > 1) {
        html += '<div class="best-worst-item worst">' +
            '<div class="best-worst-emoji">😅</div>' +
            '<div class="best-worst-date">' + worst.date.slice(5) + '</div>' +
            '<div class="best-worst-detail">' + worst.cal + ' kcal<br>Hedef: ' + worst.need + ' kcal<br><b>' + Math.round(worst.compliance) + '% uyum</b></div>' +
            '</div>';
    }

    html += '</div>';
    content.innerHTML = html;
}

// ============ EN ÇOK YENENLER ============
function renderTopFoods(dates) {
    var content = document.getElementById("reportTopFoodsContent");
    if (!content) return;

    var foodCount = {};

    dates.forEach(function(d) {
        var entry = dailyEntries[d];
        if (!entry) return;
        ["morning", "noon", "evening", "snack"].forEach(function(mealKey) {
            var meal = entry[mealKey];
            if (!meal || !Array.isArray(meal.items)) return;
            meal.items.forEach(function(item) {
                var name = (item.name || "").trim();
                if (!name) return;
                if (!foodCount[name]) {
                    foodCount[name] = { name: name, emoji: item.emoji || "🍽️", count: 0, totalCal: 0 };
                }
                foodCount[name].count++;
                foodCount[name].totalCal += (item.cal || 0);
            });
        });
    });

    var sorted = Object.values(foodCount).sort(function(a, b) { return b.count - a.count; }).slice(0, 5);

    if (sorted.length === 0) {
        content.innerHTML = '<div class="top-foods-empty">Bu dönemde yemek kaydı yok 🍽️</div>';
        return;
    }

    var html = '<div class="top-foods-list">';
    sorted.forEach(function(f, i) {
        html += '<div class="top-food-item">' +
            '<div class="top-food-rank">' + (i + 1) + '</div>' +
            '<div class="top-food-emoji">' + f.emoji + '</div>' +
            '<div class="top-food-info">' +
            '<div class="top-food-name">' + f.name + '</div>' +
            '<div class="top-food-count">' + f.count + ' kez yendi</div>' +
            '</div>' +
            '<div class="top-food-cal">' + Math.round(f.totalCal) + ' kcal</div>' +
            '</div>';
    });
    html += '</div>';
    content.innerHTML = html;
}

// ============ PDF EXPORT ============
function exportReportToPDF() {
    showNotification("📄 PDF için yazdırma penceresi açılıyor...");
    setTimeout(function() {
        window.print();
    }, 500);
}

// ============ PAYLAŞ ============
function shareReport() {
    var range = getReportDateRange(currentReportPeriod);
    var startISO = range.start.toISOString().slice(0, 10);
    var endISO = range.end.toISOString().slice(0, 10);

    var totalCal = 0,
        totalProt = 0,
        totalWater = 0,
        daysWithData = 0;
    Object.keys(dailyEntries).forEach(function(d) {
        if (d >= startISO && d <= endISO) {
            var t = getDailyTotal(dailyEntries[d]);
            if (t.calories > 0) {
                totalCal += t.calories;
                totalProt += t.protein;
                totalWater += (dailyEntries[d].water || 0);
                daysWithData++;
            }
        }
    });

    var avgCal = daysWithData > 0 ? Math.round(totalCal / daysWithData) : 0;
    var avgProt = daysWithData > 0 ? Math.round(totalProt / daysWithData) : 0;
    var avgWater = daysWithData > 0 ? (totalWater / daysWithData).toFixed(1) : 0;

    var text = "📊 SağlıcakLA Raporum\n" +
        "📅 " + formatDateTR(range.start) + " → " + formatDateTR(range.end) + "\n\n" +
        "🔥 Ort. Kalori: " + avgCal + " kcal\n" +
        "🥩 Ort. Protein: " + avgProt + " g\n" +
        "💧 Ort. Su: " + avgWater + " bardak\n" +
        "📊 Kayıtlı gün: " + daysWithData + "\n\n" +
        "Sen de SağlıcakLA ile sağlıklı yaşa! 💪";

    if (navigator.share) {
        navigator.share({ title: "SağlıcakLA Raporum", text: text }).catch(function() {});
    } else {
        navigator.clipboard.writeText(text);
        showNotification("📋 Rapor panoya kopyalandı!");
    }
}

// ============ INIT ============
function initReportsTab() {
    var requestBtn = document.getElementById("requestNotifBtn");
    var saveBtn = document.getElementById("saveNotifBtn");

    // Bu butonlar artık profile'da ama event listener'lar zaten tanımlı (aşağıya bakılacak)
    renderReport();
}
console.log("Uygulama başlatıldı.");

// ==================== 3D MENÜ (CIRCULAR CAROUSEL) ====================
const menuSecenekleri = [
    { id: "home", baslik: "Ana Sayfa", aciklama: "Tüm araçlara genel bakış", icon: "🏠" },
    { id: "daily", baslik: "Beslenme", aciklama: "Günlük kalori ve öğün takibi", icon: "🍽️" },
    { id: "activity", baslik: "Su & Aktivite", aciklama: "Su tüketimi ve egzersiz kaydı", icon: "💧" },
    { id: "workout", baslik: "Programım", aciklama: "Antrenman ve kronometre", icon: "💪" },
    { id: "ai", baslik: "Yapay Zeka", aciklama: "Kameradan kalori hesapla", icon: "🤖" },
    { id: "stats", baslik: "Grafikler", aciklama: "Gelişimini grafiklerle gör", icon: "📈" },
    { id: "profile", baslik: "Profil", aciklama: "Kişisel hedefler ve ölçüler", icon: "👤" },
    { id: "habits", baslik: "Alışkanlıklar", aciklama: "Günlük görevlerini işaretle", icon: "✅" },
    { id: "goals", baslik: "Hedefler", aciklama: "Kilo ve makro hedefleri", icon: "🎯" },
    { id: "recipes", baslik: "Tariflerim", aciklama: "Kendi tariflerini kaydet", icon: "📖" },
    { id: "reports", baslik: "Raporlar", aciklama: "Haftalık ve aylık özetler", icon: "📊" },
    { id: "mood", baslik: "Ruh Hali", aciklama: "Bugün nasıl hissediyorsun?", icon: "😊" },
    { id: "history", baslik: "Geçmiş", aciklama: "Geçmiş günlerin kayıtları", icon: "📜" },
    { id: "badges", baslik: "Başarılar", aciklama: "Kazandığın rozetler", icon: "🏆" },
    { id: "info", baslik: "Rehber", aciklama: "Bilgi kütüphanesi ve ipuçları", icon: "📚" }
];

let aktifIndex = 0;
const toplamSecenek = menuSecenekleri.length;
const GORUNUR_KART = 7;
const YATAY_YARICAP = window.innerWidth < 500 ? 150 : 220;
const DIKEY_YARICAP = 100;

function karuseliBaslat() {
    const track = document.getElementById('carousel-track');
    if (!track) return;
    track.innerHTML = '';
    menuSecenekleri.forEach((item, i) => {
        const el = document.createElement('div');
        el.id = `kart-${i}`;
        el.className = 'carousel-item';
        el.onclick = () => {
            if (i === aktifIndex) {
                document.getElementById('sikMenuOverlay').classList.remove('aktif');
                switchTab(item.id);
            } else {
                goToCard(i);
            }
        };
        el.innerHTML = `<span class="icon">${item.icon}</span><h3>${item.baslik}</h3><p>${item.aciklama}</p>`;
        track.appendChild(el);
    });
    pozisyonlariGuncelle();
}

function pozisyonlariGuncelle() {
    const cn = document.getElementById('center-number');
    const ct = document.getElementById('center-total');
    if (cn) cn.innerText = String(aktifIndex + 1).padStart(2, '0');
    if (ct) ct.innerText = 'of ' + String(toplamSecenek).padStart(2, '0');
    menuSecenekleri.forEach((item, i) => {
        let offset = i - aktifIndex;
        const half = Math.floor(GORUNUR_KART / 2);
        if (offset > half) offset = offset - toplamSecenek;
        if (offset < -half) offset = offset + toplamSecenek;
        const el = document.getElementById(`kart-${i}`);
        if (!el) return;
        if (Math.abs(offset) > half * 2) {
            el.style.opacity = 0;
            el.style.pointerEvents = 'none';
            return;
        }
        el.style.pointerEvents = 'auto';
        const aci = (offset / GORUNUR_KART) * Math.PI;
        const x = Math.sin(aci) * YATAY_YARICAP;
        const y = -Math.cos(aci) * DIKEY_YARICAP;
        const uzaklik = Math.abs(offset);
        const maxUzaklik = half + 1;
        const scale = Math.max(0, 1 - (uzaklik / maxUzaklik) * 0.3);
        const opacity = Math.max(0.3, 1 - (uzaklik / maxUzaklik) * 0.7);
        const zIndex = GORUNUR_KART - uzaklik;
        el.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${scale})`;
        el.style.opacity = opacity;
        el.style.zIndex = zIndex;
        if (i === aktifIndex) el.classList.add('aktif-kart');
        else el.classList.remove('aktif-kart');
    });
}

function goToCard(index) {
    aktifIndex = ((index % toplamSecenek) + toplamSecenek) % toplamSecenek;
    pozisyonlariGuncelle();
}

function nextCard() { goToCard(aktifIndex + 1); }

function prevCard() { goToCard(aktifIndex - 1); }
// ==================== AKTİVİTE INPUT AUTO-UPDATE ====================
// Aktivite inputları değişince otomatik kaydet ve güncelle
["activitySelect", "exerciseCal", "exerciseDurationTotal", "stepCount"].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
        el.addEventListener("change", function() {
            saveCurrentFromInputs();
        });
        // Yazarken 500ms sonra güncelle (debounce)
        var timeout;
        el.addEventListener("input", function() {
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                saveCurrentFromInputs();
            }, 800);
        });
    }
});
// ==================== AI API EVENT LISTENER'LARI ====================
document.addEventListener("DOMContentLoaded", function() {
    var saveBtn = document.getElementById("saveGeminiApiBtn");
    if (saveBtn) saveBtn.addEventListener("click", saveGeminiApiKey);

    var delBtn = document.getElementById("deleteApiKeyBtn");
    if (delBtn) delBtn.addEventListener("click", deleteGeminiApiKey);

    var inputEl = document.getElementById("geminiApiKeyInput");
    if (inputEl) {
        inputEl.addEventListener("keydown", function(e) {
            if (e.key === "Enter") {
                e.preventDefault();
                saveGeminiApiKey();
            }
        });
    }

    // Free ask textarea - Enter = sor
    var freeInput = document.getElementById("aiFreeAskInput");
    if (freeInput) {
        freeInput.addEventListener("keydown", function(e) {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                askFree();
            }
        });
    }

    // İlk yüklemede API durumunu kontrol et
    updateApiStatusUI();
});

document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('sikMenuOverlay');
    const openBtn = document.getElementById('floatingMenuBtn');
    const closeBtn = document.getElementById('closeMenuBtn');
    if (openBtn) {
        openBtn.addEventListener('click', () => {
            overlay.classList.add('aktif');
            karuseliBaslat();
        });
    }
    if (closeBtn) {
        closeBtn.addEventListener('click', () => overlay.classList.remove('aktif'));
    }

    document.addEventListener('keydown', (e) => {
        if (!overlay.classList.contains('aktif')) return;
        if (e.key === "ArrowLeft") prevCard();
        if (e.key === "ArrowRight") nextCard();
        if (e.key === "Escape") overlay.classList.remove('aktif');
    });

    let touchStartX = 0,
        touchStartY = 0,
        touchEndX = 0,
        touchEndY = 0;
    const SWIPE_ESIK = 50;
    const DIKEY_ESIK = 80;
    const carouselTrack = document.getElementById('carousel-track');
    if (carouselTrack) {
        carouselTrack.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });
        carouselTrack.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            const yatayFark = touchEndX - touchStartX;
            const dikeyFark = touchEndY - touchStartY;
            if (Math.abs(dikeyFark) > DIKEY_ESIK) return;
            if (Math.abs(yatayFark) > SWIPE_ESIK) {
                if (yatayFark < 0) nextCard();
                else prevCard();
            }
        }, { passive: true });
    }

});
