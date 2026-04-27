// ==================== VERİ YÖNETİMİ ====================
var userProfile = {
    avatar: null,
    weight: null,
    height: null,
    age: null,
    gender: "male",
    targetWeight: null,
    targetDate: null,
    targetProtein: null,
    targetCarbs: null,
    targetFat: null
};
var dailyEntries = {};
var moodEntries = {};
var currentDate = new Date().toISOString().slice(0, 10);
var favoriteMeals = JSON.parse(localStorage.getItem("nutritrack_favorites") || "[]");
var workoutProgram = JSON.parse(localStorage.getItem("nutritrack_workout") || '{"0":"","1":"","2":"","3":"","4":"","5":"","6":""}');
var bodyMeasurements = {};
var myRecipes = JSON.parse(localStorage.getItem("nutritrack_recipes") || "[]");
var customHabits = JSON.parse(localStorage.getItem("nutritrack_habits") || "[]");

function getToday() {
    var d = new Date();
    return d.toISOString().slice(0, 10);
}

function saveAllData() {
    localStorage.setItem("nutritrack_profile", JSON.stringify(userProfile));
    localStorage.setItem("nutritrack_entries", JSON.stringify(dailyEntries));
    localStorage.setItem("nutritrack_mood", JSON.stringify(moodEntries));
    localStorage.setItem("nutritrack_measurements", JSON.stringify(bodyMeasurements));

    // Debug için
    console.log("Veriler kaydedildi:", {
        profile: userProfile,
        entries: dailyEntries
    });
}

function loadAllData() {
    var savedProfile = localStorage.getItem("nutritrack_profile");
    if (savedProfile) {
        userProfile = JSON.parse(savedProfile);
    }

    var savedEntries = localStorage.getItem("nutritrack_entries");
    if (savedEntries) {
        dailyEntries = JSON.parse(savedEntries);
    }

    var savedMood = localStorage.getItem("nutritrack_mood");
    if (savedMood) {
        moodEntries = JSON.parse(savedMood);
    }

    var savedMeasurements = localStorage.getItem("nutritrack_measurements");
    if (savedMeasurements) {
        bodyMeasurements = JSON.parse(savedMeasurements);
    }

    // Bugün ve gelecek günleri kontrol et
    var today = getToday();
    for (var i = 0; i <= 14; i++) {
        var d = new Date();
        d.setDate(d.getDate() + i);
        var iso = d.toISOString().slice(0, 10);
        if (!dailyEntries[iso]) {
            dailyEntries[iso] = {
                morning: { cal: 0, protein: 0, carbs: 0, fat: 0 },
                noon: { cal: 0, protein: 0, carbs: 0, fat: 0 },
                evening: { cal: 0, protein: 0, carbs: 0, fat: 0 },
                snack: { cal: 0, protein: 0, carbs: 0, fat: 0 },
                activity: 1.375,
                exercise: 0,
                exerciseDuration: 0,
                steps: 0,
                habits: {}
            };
        }
    }
    saveAllData();
}

function getEmptyMeals() {
    return {
        morning: { cal: 0, protein: 0, carbs: 0, fat: 0 },
        noon: { cal: 0, protein: 0, carbs: 0, fat: 0 },
        evening: { cal: 0, protein: 0, carbs: 0, fat: 0 },
        snack: { cal: 0, protein: 0, carbs: 0, fat: 0 },
        activity: 1.375,
        exercise: 0,
        exerciseDuration: 0,
        steps: 0,
        habits: {}
    };
}

function calculateBMR() {
    var w = userProfile.weight;
    var h = userProfile.height;
    var a = userProfile.age;
    var g = userProfile.gender;
    if (!w || !h || !a) return null;
    var bmr = 10 * w + 6.25 * h - 5 * a;
    if (g === "male") {
        return Math.round(bmr + 5);
    } else {
        return Math.round(bmr - 161);
    }
}

function getDailyNeeds(date) {
    var bmr = calculateBMR();
    if (!bmr) return 2000;
    var entry = dailyEntries[date];
    if (!entry) return Math.round(bmr * 1.375);
    var activity = entry.activity || 1.375;
    var exercise = entry.exercise || 0;
    return Math.round(bmr * activity) + exercise;
}

function getDailyTotal(entry) {
    if (!entry) return { calories: 0, protein: 0, carbs: 0, fat: 0 };
    var totalCal = 0;
    var totalProt = 0;
    var totalCarbs = 0;
    var totalFat = 0;
    if (entry.morning) {
        totalCal += (Number(entry.morning.cal) || 0);
        totalProt += (Number(entry.morning.protein) || 0);
        totalCarbs += (Number(entry.morning.carbs) || 0);
        totalFat += (Number(entry.morning.fat) || 0);
    }
    if (entry.noon) {
        totalCal += (Number(entry.noon.cal) || 0);
        totalProt += (Number(entry.noon.protein) || 0);
        totalCarbs += (Number(entry.noon.carbs) || 0);
        totalFat += (Number(entry.noon.fat) || 0);
    }
    if (entry.evening) {
        totalCal += (Number(entry.evening.cal) || 0);
        totalProt += (Number(entry.evening.protein) || 0);
        totalCarbs += (Number(entry.evening.carbs) || 0);
        totalFat += (Number(entry.evening.fat) || 0);
    }
    if (entry.snack) {
        totalCal += (Number(entry.snack.cal) || 0);
        totalProt += (Number(entry.snack.protein) || 0);
        totalCarbs += (Number(entry.snack.carbs) || 0);
        totalFat += (Number(entry.snack.fat) || 0);
    }
    return {
        calories: totalCal,
        protein: totalProt,
        carbs: totalCarbs,
        fat: totalFat
    };
}

function calculateBodyFat(gender, height, neck, waist, hip) {
    if (!height || !neck || !waist) return null;

    var fatPercentage = 0;
    if (gender === 'male') {
        if (waist <= neck) return null;
        // US Navy Method for Men
        fatPercentage = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450;
    } else { // female
        if (!hip || (waist + hip) <= neck) return null;
        // US Navy Method for Women
        fatPercentage = 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.22100 * Math.log10(height)) - 450;
    }

    if (fatPercentage > 0 && fatPercentage < 100) return fatPercentage;
    return null;
}