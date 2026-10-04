// ==================== BESİN VERİTABANI ====================
// Her besin 100g veya 1 porsiyon üzerinden değerler içerir.
// cal: Kalori, prot: Protein(g), carbs: Karbonhidrat(g), fat: Yağ(g)
// birim: "100g" | "porsiyon" | "adet" | "dilim" | "bardak"

var besinVeritabani = [
    // ============ PROTEİN KAYNAKLARI ============
    { id: "tavuk_gogsu", isim: "Tavuk Göğsü", kategori: "protein", cal: 165, prot: 31, carbs: 0, fat: 3.6, birim: "100g", emoji: "🍗" },
    { id: "tavuk_but", isim: "Tavuk But", kategori: "protein", cal: 209, prot: 26, carbs: 0, fat: 11, birim: "100g", emoji: "🍗" },
    { id: "kirmizi_et", isim: "Dana Eti (Yağsız)", kategori: "protein", cal: 250, prot: 26, carbs: 0, fat: 15, birim: "100g", emoji: "🥩" },
    { id: "kuzu_eti", isim: "Kuzu Eti", kategori: "protein", cal: 294, prot: 25, carbs: 0, fat: 21, birim: "100g", emoji: "🥩" },
    { id: "somon", isim: "Somon", kategori: "protein", cal: 208, prot: 20, carbs: 0, fat: 13, birim: "100g", emoji: "🐟" },
    { id: "ton", isim: "Ton Balığı (Suda)", kategori: "protein", cal: 116, prot: 26, carbs: 0, fat: 1, birim: "100g", emoji: "🐟" },
    { id: "levrek", isim: "Levrek", kategori: "protein", cal: 97, prot: 20, carbs: 0, fat: 2, birim: "100g", emoji: "🐟" },
    { id: "yumurta", isim: "Yumurta", kategori: "protein", cal: 78, prot: 6.3, carbs: 0.6, fat: 5.3, birim: "adet", emoji: "🥚" },
    { id: "yumurta_ak", isim: "Yumurta Akı", kategori: "protein", cal: 17, prot: 3.6, carbs: 0.2, fat: 0.1, birim: "adet", emoji: "🥚" },
    { id: "hindi", isim: "Hindi Göğsü", kategori: "protein", cal: 135, prot: 30, carbs: 0, fat: 1, birim: "100g", emoji: "🦃" },
    { id: "kofte", isim: "Izgara Köfte", kategori: "protein", cal: 250, prot: 17, carbs: 5, fat: 18, birim: "100g", emoji: "🍖" },
    { id: "sucuk", isim: "Sucuk", kategori: "protein", cal: 452, prot: 20, carbs: 2, fat: 40, birim: "100g", emoji: "🌭" },
    { id: "sosis", isim: "Sosis", kategori: "protein", cal: 300, prot: 12, carbs: 2, fat: 27, birim: "adet", emoji: "🌭" },
    { id: "pastirma", isim: "Pastırma", kategori: "protein", cal: 250, prot: 30, carbs: 1, fat: 14, birim: "100g", emoji: "🥓" },

    // ============ SÜT ÜRÜNLERİ ============
    { id: "sut", isim: "Süt (Tam Yağlı)", kategori: "süt", cal: 61, prot: 3.2, carbs: 4.8, fat: 3.3, birim: "bardak", emoji: "🥛" },
    { id: "yogurt", isim: "Yoğurt (Tam Yağlı)", kategori: "süt", cal: 61, prot: 3.5, carbs: 4.7, fat: 3.3, birim: "100g", emoji: "🥣" },
    { id: "yogurt_yagsiz", isim: "Yoğurt (Yağsız)", kategori: "süt", cal: 36, prot: 3.5, carbs: 5, fat: 0.1, birim: "100g", emoji: "🥣" },
    { id: "ayran", isim: "Ayran", kategori: "süt", cal: 38, prot: 1.7, carbs: 3.3, fat: 1.9, birim: "bardak", emoji: "🥛" },
    { id: "peynir_beyaz", isim: "Beyaz Peynir", kategori: "süt", cal: 264, prot: 18, carbs: 1.5, fat: 21, birim: "100g", emoji: "🧀" },
    { id: "peynir_kasar", isim: "Kaşar Peyniri", kategori: "süt", cal: 350, prot: 25, carbs: 1, fat: 27, birim: "100g", emoji: "🧀" },
    { id: "labne", isim: "Labne", kategori: "süt", cal: 240, prot: 6, carbs: 4, fat: 22, birim: "100g", emoji: "🧀" },
    { id: "lor", isim: "Lor Peyniri", kategori: "süt", cal: 98, prot: 12, carbs: 3, fat: 4, birim: "100g", emoji: "🧀" },
    { id: "kefir", isim: "Kefir", kategori: "süt", cal: 41, prot: 3.3, carbs: 4.5, fat: 1, birim: "bardak", emoji: "🥛" },

    // ============ KARBONHİDRAT ============
    { id: "pilav", isim: "Pilav (Pişmiş)", kategori: "karb", cal: 130, prot: 2.7, carbs: 28, fat: 0.3, birim: "100g", emoji: "🍚" },
    { id: "bulgur", isim: "Bulgur Pilavı (Pişmiş)", kategori: "karb", cal: 83, prot: 3, carbs: 18.5, fat: 0.2, birim: "100g", emoji: "🍚" },
    { id: "makarna", isim: "Makarna (Pişmiş)", kategori: "karb", cal: 131, prot: 5, carbs: 25, fat: 1.1, birim: "100g", emoji: "🍝" },
    { id: "ekmek_beyaz", isim: "Beyaz Ekmek", kategori: "karb", cal: 80, prot: 2.5, carbs: 15, fat: 1, birim: "dilim", emoji: "🍞" },
    { id: "ekmek_tam", isim: "Tam Buğday Ekmek", kategori: "karb", cal: 70, prot: 3, carbs: 13, fat: 1, birim: "dilim", emoji: "🍞" },
    { id: "yulaf", isim: "Yulaf Ezmesi", kategori: "karb", cal: 389, prot: 17, carbs: 66, fat: 7, birim: "100g", emoji: "🥣" },
    { id: "patates", isim: "Patates (Haşlanmış)", kategori: "karb", cal: 87, prot: 2, carbs: 20, fat: 0.1, birim: "100g", emoji: "🥔" },
    { id: "patates_kizarmis", isim: "Patates Kızartması", kategori: "karb", cal: 312, prot: 3.4, carbs: 41, fat: 15, birim: "100g", emoji: "🍟" },
    { id: "tatli_patates", isim: "Tatlı Patates", kategori: "karb", cal: 86, prot: 1.6, carbs: 20, fat: 0.1, birim: "100g", emoji: "🍠" },
    { id: "kinoa", isim: "Kinoa (Pişmiş)", kategori: "karb", cal: 120, prot: 4.4, carbs: 21, fat: 1.9, birim: "100g", emoji: "🌾" },
    { id: "mercimek", isim: "Mercimek (Pişmiş)", kategori: "karb", cal: 116, prot: 9, carbs: 20, fat: 0.4, birim: "100g", emoji: "🥣" },
    { id: "nohut", isim: "Nohut (Pişmiş)", kategori: "karb", cal: 164, prot: 8.9, carbs: 27, fat: 2.6, birim: "100g", emoji: "🥣" },
    { id: "fasulye", isim: "Kuru Fasulye (Pişmiş)", kategori: "karb", cal: 127, prot: 8.7, carbs: 22, fat: 0.5, birim: "100g", emoji: "🥣" },

    // ============ SEBZE ============
    { id: "domates", isim: "Domates", kategori: "sebze", cal: 18, prot: 0.9, carbs: 3.9, fat: 0.2, birim: "adet", emoji: "🍅" },
    { id: "salatalik", isim: "Salatalık", kategori: "sebze", cal: 15, prot: 0.7, carbs: 3.6, fat: 0.1, birim: "adet", emoji: "🥒" },
    { id: "biber", isim: "Biber", kategori: "sebze", cal: 31, prot: 1, carbs: 6, fat: 0.3, birim: "adet", emoji: "🫑" },
    { id: "marul", isim: "Marul", kategori: "sebze", cal: 15, prot: 1.4, carbs: 2.9, fat: 0.2, birim: "100g", emoji: "🥬" },
    { id: "ispanak", isim: "Ispanak", kategori: "sebze", cal: 23, prot: 2.9, carbs: 3.6, fat: 0.4, birim: "100g", emoji: "🥬" },
    { id: "brokoli", isim: "Brokoli", kategori: "sebze", cal: 34, prot: 2.8, carbs: 7, fat: 0.4, birim: "100g", emoji: "🥦" },
    { id: "havuc", isim: "Havuç", kategori: "sebze", cal: 41, prot: 0.9, carbs: 10, fat: 0.2, birim: "adet", emoji: "🥕" },
    { id: "sogan", isim: "Soğan", kategori: "sebze", cal: 40, prot: 1.1, carbs: 9.3, fat: 0.1, birim: "adet", emoji: "🧅" },
    { id: "sarimsak", isim: "Sarımsak", kategori: "sebze", cal: 149, prot: 6.4, carbs: 33, fat: 0.5, birim: "100g", emoji: "🧄" },
    { id: "patlican", isim: "Patlıcan", kategori: "sebze", cal: 25, prot: 1, carbs: 6, fat: 0.2, birim: "adet", emoji: "🍆" },
    { id: "kabak", isim: "Kabak", kategori: "sebze", cal: 17, prot: 1.2, carbs: 3.1, fat: 0.3, birim: "adet", emoji: "🥒" },

    // ============ MEYVE ============
    { id: "elma", isim: "Elma", kategori: "meyve", cal: 52, prot: 0.3, carbs: 14, fat: 0.2, birim: "adet", emoji: "🍎" },
    { id: "muz", isim: "Muz", kategori: "meyve", cal: 89, prot: 1.1, carbs: 23, fat: 0.3, birim: "adet", emoji: "🍌" },
    { id: "portakal", isim: "Portakal", kategori: "meyve", cal: 47, prot: 0.9, carbs: 12, fat: 0.1, birim: "adet", emoji: "🍊" },
    { id: "cilek", isim: "Çilek", kategori: "meyve", cal: 32, prot: 0.7, carbs: 7.7, fat: 0.3, birim: "100g", emoji: "🍓" },
    { id: "uzum", isim: "Üzüm", kategori: "meyve", cal: 69, prot: 0.7, carbs: 18, fat: 0.2, birim: "100g", emoji: "🍇" },
    { id: "karpuz", isim: "Karpuz", kategori: "meyve", cal: 30, prot: 0.6, carbs: 7.6, fat: 0.2, birim: "100g", emoji: "🍉" },
    { id: "kavun", isim: "Kavun", kategori: "meyve", cal: 34, prot: 0.8, carbs: 8, fat: 0.2, birim: "100g", emoji: "🍈" },
    { id: "avokado", isim: "Avokado", kategori: "meyve", cal: 160, prot: 2, carbs: 9, fat: 15, birim: "adet", emoji: "🥑" },
    { id: "kiwi", isim: "Kivi", kategori: "meyve", cal: 61, prot: 1.1, carbs: 15, fat: 0.5, birim: "adet", emoji: "🥝" },
    { id: "armut", isim: "Armut", kategori: "meyve", cal: 57, prot: 0.4, carbs: 15, fat: 0.1, birim: "adet", emoji: "🍐" },
    { id: "seftali", isim: "Şeftali", kategori: "meyve", cal: 39, prot: 0.9, carbs: 9.5, fat: 0.3, birim: "adet", emoji: "🍑" },
    { id: "kayisi", isim: "Kayısı", kategori: "meyve", cal: 48, prot: 1.4, carbs: 11, fat: 0.4, birim: "adet", emoji: "🍑" },

    // ============ YAĞ & KURUYEMİŞ ============
    { id: "zeytin", isim: "Zeytin", kategori: "yağ", cal: 115, prot: 0.8, carbs: 6, fat: 11, birim: "adet", emoji: "🫒" },
    { id: "zeytinyagi", isim: "Zeytinyağı", kategori: "yağ", cal: 884, prot: 0, carbs: 0, fat: 100, birim: "yemek kaşığı", emoji: "🫒" },
    { id: "tereyagi", isim: "Tereyağı", kategori: "yağ", cal: 717, prot: 0.9, carbs: 0.1, fat: 81, birim: "yemek kaşığı", emoji: "🧈" },
    { id: "badem", isim: "Badem", kategori: "yağ", cal: 579, prot: 21, carbs: 22, fat: 50, birim: "100g", emoji: "🌰" },
    { id: "ceviz", isim: "Ceviz", kategori: "yağ", cal: 654, prot: 15, carbs: 14, fat: 65, birim: "100g", emoji: "🌰" },
    { id: "findik", isim: "Fındık", kategori: "yağ", cal: 628, prot: 15, carbs: 17, fat: 61, birim: "100g", emoji: "🌰" },
    { id: "fistik", isim: "Antep Fıstığı", kategori: "yağ", cal: 560, prot: 20, carbs: 28, fat: 45, birim: "100g", emoji: "🥜" },
    { id: "fistik_ezmesi", isim: "Fıstık Ezmesi", kategori: "yağ", cal: 588, prot: 25, carbs: 20, fat: 50, birim: "yemek kaşığı", emoji: "🥜" },

    // ============ İÇECEKLER ============
    { id: "su", isim: "Su", kategori: "içecek", cal: 0, prot: 0, carbs: 0, fat: 0, birim: "bardak", emoji: "💧" },
    { id: "cay", isim: "Çay (Şekersiz)", kategori: "içecek", cal: 1, prot: 0, carbs: 0.2, fat: 0, birim: "bardak", emoji: "🍵" },
    { id: "kahve", isim: "Kahve (Sade)", kategori: "içecek", cal: 2, prot: 0.3, carbs: 0, fat: 0, birim: "fincan", emoji: "☕" },
    { id: "latte", isim: "Latte", kategori: "içecek", cal: 120, prot: 6, carbs: 10, fat: 6, birim: "bardak", emoji: "☕" },
    { id: "kola", isim: "Kola", kategori: "içecek", cal: 139, prot: 0, carbs: 35, fat: 0, birim: "bardak", emoji: "🥤" },
    { id: "meyve_suyu", isim: "Meyve Suyu", kategori: "içecek", cal: 45, prot: 0.2, carbs: 11, fat: 0.1, birim: "bardak", emoji: "🧃" },
    { id: "protein_shake", isim: "Protein Shake", kategori: "içecek", cal: 120, prot: 24, carbs: 3, fat: 1.5, birim: "ölçek", emoji: "🥤" },

    // ============ ATIŞTIRMALIK & TATLI ============
    { id: "cikolata_sutlu", isim: "Sütlü Çikolata", kategori: "tatlı", cal: 535, prot: 7.6, carbs: 59, fat: 30, birim: "100g", emoji: "🍫" },
    { id: "cikolata_bitter", isim: "Bitter Çikolata (%70)", kategori: "tatlı", cal: 598, prot: 7.8, carbs: 46, fat: 43, birim: "100g", emoji: "🍫" },
    { id: "baklava", isim: "Baklava", kategori: "tatlı", cal: 428, prot: 6, carbs: 50, fat: 22, birim: "dilim", emoji: "🍯" },
    { id: "dondurma", isim: "Dondurma", kategori: "tatlı", cal: 207, prot: 3.5, carbs: 24, fat: 11, birim: "top", emoji: "🍦" },
    { id: "kek", isim: "Kek", kategori: "tatlı", cal: 350, prot: 5, carbs: 50, fat: 15, birim: "dilim", emoji: "🍰" },
    { id: "kurabiye", isim: "Kurabiye", kategori: "tatlı", cal: 450, prot: 6, carbs: 60, fat: 20, birim: "adet", emoji: "🍪" },
    { id: "cips", isim: "Patates Cipsi", kategori: "atıştırmalık", cal: 536, prot: 7, carbs: 53, fat: 34, birim: "100g", emoji: "🍟" },

    // ============ TÜRK YEMEKLERİ ============
    { id: "menemen", isim: "Menemen", kategori: "yemek", cal: 155, prot: 8, carbs: 6, fat: 11, birim: "porsiyon", emoji: "🍳" },
    { id: "omlet", isim: "Omlet (2 Yumurta)", kategori: "yemek", cal: 180, prot: 12, carbs: 2, fat: 14, birim: "porsiyon", emoji: "🍳" },
    { id: "mercimek_corbasi", isim: "Mercimek Çorbası", kategori: "yemek", cal: 90, prot: 5, carbs: 13, fat: 2, birim: "kase", emoji: "🥣" },
    { id: "ezogelin", isim: "Ezogelin Çorbası", kategori: "yemek", cal: 100, prot: 4, carbs: 15, fat: 2.5, birim: "kase", emoji: "🥣" },
    { id: "tavuk_sote", isim: "Tavuk Sote", kategori: "yemek", cal: 180, prot: 20, carbs: 5, fat: 9, birim: "porsiyon", emoji: "🍲" },
    { id: "karniyarik", isim: "Karnıyarık", kategori: "yemek", cal: 250, prot: 10, carbs: 15, fat: 16, birim: "porsiyon", emoji: "🍆" },
    { id: "dolma", isim: "Biber Dolması", kategori: "yemek", cal: 200, prot: 7, carbs: 25, fat: 8, birim: "adet", emoji: "🫑" },
    { id: "sarma", isim: "Yaprak Sarma", kategori: "yemek", cal: 180, prot: 4, carbs: 22, fat: 8, birim: "adet", emoji: "🥬" },
    { id: "pilav_tavuk", isim: "Pilav Üstü Tavuk", kategori: "yemek", cal: 350, prot: 22, carbs: 35, fat: 12, birim: "porsiyon", emoji: "🍛" },
    { id: "kuru_fasulye", isim: "Kuru Fasulye", kategori: "yemek", cal: 180, prot: 10, carbs: 25, fat: 3, birim: "porsiyon", emoji: "🍲" },
    { id: "ispanak_yemek", isim: "Ispanak Yemeği", kategori: "yemek", cal: 110, prot: 5, carbs: 8, fat: 6, birim: "porsiyon", emoji: "🥬" },
    { id: "musakka", isim: "Musakka", kategori: "yemek", cal: 230, prot: 11, carbs: 18, fat: 13, birim: "porsiyon", emoji: "🍆" },
    { id: "pilav_nohut", isim: "Nohutlu Pilav", kategori: "yemek", cal: 180, prot: 6, carbs: 30, fat: 4, birim: "porsiyon", emoji: "🍚" },
    { id: "tost", isim: "Kaşarlı Tost", kategori: "yemek", cal: 320, prot: 15, carbs: 30, fat: 16, birim: "adet", emoji: "🥪" },
    { id: "hamburger", isim: "Hamburger", kategori: "fastfood", cal: 540, prot: 25, carbs: 45, fat: 28, birim: "adet", emoji: "🍔" },
    { id: "pizza", isim: "Pizza (1 dilim)", kategori: "fastfood", cal: 285, prot: 12, carbs: 36, fat: 10, birim: "dilim", emoji: "🍕" },
    { id: "döner", isim: "Et Döner (Ekmek Arası)", kategori: "fastfood", cal: 500, prot: 30, carbs: 40, fat: 25, birim: "adet", emoji: "🌯" },
    { id: "lahmacun", isim: "Lahmacun", kategori: "fastfood", cal: 300, prot: 12, carbs: 40, fat: 10, birim: "adet", emoji: "🌯" },
    { id: "pide", isim: "Kıymalı Pide", kategori: "fastfood", cal: 450, prot: 20, carbs: 50, fat: 18, birim: "adet", emoji: "🫓" },

    // ============ KAHVALTILIK ============
    { id: "simit", isim: "Simit", kategori: "kahvaltı", cal: 300, prot: 8, carbs: 55, fat: 5, birim: "adet", emoji: "🥯" },
    { id: "poğaça", isim: "Poğaça", kategori: "kahvaltı", cal: 320, prot: 6, carbs: 35, fat: 17, birim: "adet", emoji: "🥐" },
    { id: "acma", isim: "Açma", kategori: "kahvaltı", cal: 350, prot: 6, carbs: 45, fat: 16, birim: "adet", emoji: "🥐" },
    { id: "bal", isim: "Bal", kategori: "kahvaltı", cal: 304, prot: 0.3, carbs: 82, fat: 0, birim: "yemek kaşığı", emoji: "🍯" },
    { id: "recel", isim: "Reçel", kategori: "kahvaltı", cal: 250, prot: 0.4, carbs: 65, fat: 0.1, birim: "yemek kaşığı", emoji: "🍓" },
    { id: "tahin", isim: "Tahin", kategori: "kahvaltı", cal: 595, prot: 17, carbs: 21, fat: 53, birim: "yemek kaşığı", emoji: "🍯" },
    { id: "pekmez", isim: "Pekmez", kategori: "kahvaltı", cal: 293, prot: 0.5, carbs: 73, fat: 0, birim: "yemek kaşığı", emoji: "🍯" },
];

// Kategori renkleri ve etiketleri
var besinKategorileri = {
    protein: { isim: "Protein", renk: "#ef4444", emoji: "🍗" },
    süt: { isim: "Süt Ürünleri", renk: "#3b82f6", emoji: "🥛" },
    karb: { isim: "Karbonhidrat", renk: "#f97316", emoji: "🍚" },
    sebze: { isim: "Sebze", renk: "#22c55e", emoji: "🥬" },
    meyve: { isim: "Meyve", renk: "#ec4899", emoji: "🍎" },
    yağ: { isim: "Yağ & Kuruyemiş", renk: "#a855f7", emoji: "🥑" },
    içecek: { isim: "İçecek", renk: "#06b6d4", emoji: "☕" },
    tatlı: { isim: "Tatlı", renk: "#f43f5e", emoji: "🍫" },
    atıştırmalık: { isim: "Atıştırmalık", renk: "#eab308", emoji: "🍟" },
    yemek: { isim: "Ana Yemek", renk: "#8b5cf6", emoji: "🍲" },
    fastfood: { isim: "Fast Food", renk: "#dc2626", emoji: "🍔" },
    kahvaltı: { isim: "Kahvaltılık", renk: "#d97706", emoji: "🥐" }
};

// Besin arama fonksiyonu
function besinAra(query) {
    if (!query || query.length < 1) return [];
    var q = query.toLowerCase().trim();
    return besinVeritabani.filter(function(b) {
        return b.isim.toLowerCase().includes(q) || (b.kategori && b.kategori.toLowerCase().includes(q));
    }).slice(0, 20);
}

// Kategoriye göre besinleri getir
function kategoriliBesinler(kategori) {
    return besinVeritabani.filter(function(b) {
        return b.kategori === kategori;
    });
}
// ==================== KATEGORİ EŞLEŞTİRME (cat alanı) ====================
// Deneme dosyasındaki kategori ID'leri ile mevcut besinleri eşleştir
// Eski 'kategori' alanına göre 'cat' ID'si ekleniyor

var kategoriMapping = {
    "protein": "protein",
    "süt": "sut",
    "karb": "karb",
    "sebze": "sebze",
    "meyve": "meyve",
    "yağ": "yag",
    "içecek": "icecek",
    "tatlı": "tatli",
    "atıştırmalık": "atistirmalik",
    "yemek": "yemek",
    "fastfood": "fastfood",
    "kahvaltı": "kahvalti"
};

// Her besine 'cat' alanı ekle
besinVeritabani.forEach(function(b) {
    b.cat = kategoriMapping[b.kategori] || "yemek";
    // Ayrıca arama kolaylığı için 'unit' alanı besinler.js'de 'birim' olarak geçiyor,
    // deneme dosyasındaki kod 'unit' bekliyor, o yüzden alias oluşturuyoruz:
    if (!b.unit) b.unit = b.birim;
});

// ==================== POPÜLER KATEGORİSİ ====================
// Deneme dosyasındaki "populer" filtresi için liste
var populerBesinIds = [
    "tavuk_gogsu", "yumurta", "pilav", "ekmek_tam", "yogurt",
    "muz", "elma", "sut", "peynir_beyaz", "somon", "avokado",
    "badem", "makarna", "patates", "kahve"
];

// ==================== KATEGORİLER (deneme dosyası formatında) ====================
var besinKategoriListesi = [
    { id: "all", name: "Tümü", emoji: "🍽️" },
    { id: "populer", name: "Popüler", emoji: "⭐" },
    { id: "protein", name: "Protein", emoji: "🍗" },
    { id: "karb", name: "Karb", emoji: "🍚" },
    { id: "sut", name: "Süt", emoji: "🥛" },
    { id: "meyve", name: "Meyve", emoji: "🍎" },
    { id: "sebze", name: "Sebze", emoji: "🥬" },
    { id: "yag", name: "Yağ", emoji: "🥑" },
    { id: "icecek", name: "İçecek", emoji: "☕" },
    { id: "tatli", name: "Tatlı", emoji: "🍫" },
    { id: "kahvalti", name: "Kahvaltı", emoji: "🥐" },
    { id: "fastfood", name: "Fast Food", emoji: "🍔" },
    { id: "atistirmalik", name: "Atıştırmalık", emoji: "🍟" },
    { id: "yemek", name: "Yemek", emoji: "🍲" }
];

console.log("✅ Besin veritabanı yüklendi: " + besinVeritabani.length + " besin, " + besinKategoriListesi.length + " kategori");
