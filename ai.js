// ==================== GEMINI API ENTEGRASYONU ====================

// Şifrelenmiş (Base64) API anahtarlarını çözen fonksiyon
function decodeSecret(encodedStr) {
    try {
        return atob(encodedStr);
    } catch (e) {
        return "";
    }
}

// Gemini API anahtarı
var geminiApiKey = localStorage.getItem("gemini_api_key") || "";
if (document.getElementById("geminiApiKeyInput")) {
    document.getElementById("geminiApiKeyInput").value = geminiApiKey;
}

document.getElementById("aiImageInput").onchange = function(event) {
    var file = event.target.files[0];
    if (file) {
        var reader = new FileReader();
        reader.onload = function(e) {
            var result = e.target.result;
            document.getElementById("aiImagePreview").src = result;
            document.getElementById("aiImagePreview").style.display = "block";
        };
        reader.readAsDataURL(file);
    } else {
        document.getElementById("aiImagePreview").style.display = "none";
    }
};

document.getElementById("askAIBtn").onclick = async function() {
    if (!geminiApiKey) {
        showNotification("❌ Lütfen önce API Ayarları bölümünden Gemini API anahtarınızı kaydedin!");
        return;
    }

    var promptText = document.getElementById("aiPromptInput").value.trim();
    var fileInput = document.getElementById("aiImageInput");
    var file = fileInput.files[0];

    if (!promptText && !file) {
        showNotification("❌ Lütfen yemeği yazın veya görsel yükleyin.");
        return;
    }

    var resultDiv = document.getElementById("aiResult");
    resultDiv.style.display = "block";
    resultDiv.innerHTML = "⏳ Gemini analiz ediyor, lütfen bekleyin...";
    this.disabled = true;
    this.innerText = "Analiz Ediliyor...";

    try {
        var parts = [];
        var systemInstruction = "Sen bir diyetisyensin. Kullanıcının verdiği metni veya fotoğrafı analiz edip sadece şu formatta geçerli bir JSON döndür. Asla ekstra metin veya markdown ekleme:\n" +
            "{\"calories\": 0, \"protein\": 0.0, \"fat\": 0.0, \"carbs\": 0.0, \"food_name\": \"Tahmini Yemek Adı\"}";

        var userMessage = promptText || "Bu görseldeki yemeğin besin değerleri nelerdir?";
        parts.push({ text: systemInstruction + "\n\nKullanıcı: " + userMessage });

        if (file) {
            var base64Data = await new Promise((resolve) => {
                var reader = new FileReader();
                reader.onload = () => resolve(reader.result.split(',')[1]);
                reader.readAsDataURL(file);
            });
            parts.push({
                inline_data: { mime_type: file.type, data: base64Data }
            });
        }

        var requestBody = {
            contents: [{ parts: parts }],
            generationConfig: { response_mime_type: "application/json" }
        };

        var url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + geminiApiKey;

        var response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) throw new Error("API isteği başarısız oldu (Hata: " + response.status + ").");

        var data = await response.json();
        var responseText = data.candidates[0].content.parts[0].text;
        var cleanText = responseText.replace(/```json/gi, "").replace(/```/g, "").trim();

        var aiData = JSON.parse(cleanText);
        var aiCal = aiData.calories || 0;
        var aiProt = aiData.protein || 0;

        var html = "<strong>🤖 Gemini Sonucu:</strong><br><br>";
        html += "🍽️ <b>Bulunan:</b> " + (aiData.food_name || "Bilinmiyor") + "<br>";
        html += "🔥 <b>Kalori:</b> " + aiCal + " kcal<br>";
        html += "🥩 <b>Protein:</b> " + aiProt + " g<br>";
        html += "🥑 <b>Yağ:</b> " + (aiData.fat || 0) + " g<br>";
        html += "🍞 <b>Karbonhidrat:</b> " + (aiData.carbs || 0) + " g<br><br>";

        if (aiCal > 0 || aiProt > 0) {
            var safeName = (aiData.food_name || "Bilinmiyor").replace(/"/g, "&quot;").replace(/'/g, "\\'");
            html += "<div style='margin-top: 1rem; display: flex; flex-direction: column; gap: 0.5rem;'>";
            html += "<div class='small-text' style='font-weight: bold;'>Hangi öğüne eklensin?</div>";
            html += "<div style='display: flex; gap: 0.5rem; flex-wrap: wrap;'>";
            html += "<button onclick='addAiToMeal(\"morning\", " + Math.round(aiCal) + ", " + aiProt + ", " + (aiData.carbs || 0) + ", " + (aiData.fat || 0) + ")' style='flex: 1; background: var(--orange); font-size: 0.8rem; padding: 0.5rem;'>☀️ Sabah</button>";
            html += "<button onclick='addAiToMeal(\"noon\", " + Math.round(aiCal) + ", " + aiProt + ", " + (aiData.carbs || 0) + ", " + (aiData.fat || 0) + ")' style='flex: 1; background: var(--success); font-size: 0.8rem; padding: 0.5rem;'>🌞 Öğle</button>";
            html += "<button onclick='addAiToMeal(\"evening\", " + Math.round(aiCal) + ", " + aiProt + ", " + (aiData.carbs || 0) + ", " + (aiData.fat || 0) + ")' style='flex: 1; background: var(--primary); font-size: 0.8rem; padding: 0.5rem;'>🌙 Akşam</button>";
            html += "<button onclick='addAiToMeal(\"snack\", " + Math.round(aiCal) + ", " + aiProt + ", " + (aiData.carbs || 0) + ", " + (aiData.fat || 0) + ")' style='flex: 1; background: var(--purple); font-size: 0.8rem; padding: 0.5rem;'>🍎 Ara Öğün</button>";
            html += "</div></div>";
            html += "<button onclick='addFavorite(\"" + safeName + "\", " + Math.round(aiCal) + ", " + aiProt + ", " + (aiData.carbs || 0) + ", " + (aiData.fat || 0) + ")' class='secondary' style='margin-top: 0.5rem; width: 100%;'>⭐ Favorilere Ekle</button>";
        }

        resultDiv.innerHTML = html;
    } catch (error) {
        resultDiv.innerHTML = "❌ Hata oluştu: " + error.message;
    } finally {
        this.disabled = false;
        this.innerText = "Analiz Et";
    }
};

if (document.getElementById("saveGeminiApiBtn")) {
    document.getElementById("saveGeminiApiBtn").onclick = function() {
        var key = document.getElementById("geminiApiKeyInput").value.trim();
        if (key) {
            localStorage.setItem("gemini_api_key", key);
            geminiApiKey = key;
            showNotification("✅ Gemini API anahtarı kaydedildi!");
        } else {
            showNotification("❌ Lütfen bir anahtar girin.");
        }
    };
}