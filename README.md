# MEDCARE - Ko‘p Tarmoqli Tibbiyot Markazi & Boshqaruv Platformasi

**MEDCARE** — bu zamonaviy xususiy tibbiyot markazi uchun mo‘ljallangan to‘liq funksional, xavfsiz va zamonaviy veb-platforma. Platforma bemorlar uchun qulay onlayn qabul, shifokorlar va xizmatlar katalogi, 128 qatlamli MSCT hamda avtomatlashtirilgan laboratoriya ma’lumotlari, shuningdek klinika xodimlari uchun to‘liq ma’muriy boshqaruv panelini (SaaS CRM) o‘z ichiga oladi.

---

## 📌 Asosiy Imkoniyatlar

### Bemorlar uchun ochiq veb-sayt (Public Website):
- **Bosh sahifa:** Yuqori darajadagi vizual dizayn, tezkor qabul shakli, yo‘nalishlar va ishonch ko‘rsatkichlari.
- **Shifokorlar katalogi:** Mutaxassisliklar bo‘yicha filtr, qabul narxlari, ish vaqti va batafsil shifokor profillari.
- **Tibbiy xizmatlar:** Jarrohlik, LOR, Oftalmologiya, Stomatologiya, Kardiologiya, Nevrologiya, UZI bo‘yicha batafsil narxlar va tayyorgarlik ko‘rsatmalari.
- **Maxsus yo‘nalishlar:**
  - **Laparoskopik Jarrohlik:** Kam invaziv operatsiyalar, afzalliklar va tayyorgarlik.
  - **LOR / ENT:** HD Videoendoskopik diagnostika, ponksiyasiz gaymoritni davolash.
  - **MSCT / KT:** 128 qatlamli tomografiya xizmatlari, past nurlanish dozasi va tibbiy ko‘rsatmalar.
  - **Laboratoriya:** 50 dan ortiq tahlillar, kodlar, namunalar turi va muddatlari.
- **Onlayn qabul (Appointment Booking):**
  - Shifokor va sana tanlanganda real vaqtda bo‘sh vaqt oraliqlari (time slots) generatsiyasi;
  - Band qilingan vaqtlarga ikkilamchi yozilishning oldini olish (anti double-booking);
  - Yangi arizalar holati: `YANGI` (klinika tasdiqlashi kutiladi);
  - Shaxsiy ma’lumotlarni himoya qilish bo‘yicha majburiy rozilik.
- **Aksiyalar va Bannerlar:** Faol mavsumiy chegirmalar va avtomatik tugash muddatlari.
- **Yangiliklar va Tibbiy maqolalar:** Foydali shifokor tavsiyalari va o‘qishlar hisoblagichi.
- **AI Tibbiy Maslahatchi (Gemini API):**
  - Klinika ma’lumotlari asosida xizmatlar va narxlarni tushuntirish;
  - Qat’iy xavfsizlik: hech qachon kasalliklarga o‘zboshimchalik bilan tashxis qo‘ymaydi va dori yozmaydi;
  - Shoshilinch holatlarda tez yordamga (103) yo‘naltirish.
- **Global Qidiruv (Ctrl+K):** Shifokorlar, xizmatlar, tahlillar va maqolalarni bir zumda topish.
- **Mobil qulaylik:** Mobil qurilmalarda pastki yopishqoq "Qabulga yozilish", qo‘ng‘iroq va Telegram tugmalari.

### Administrator Paneli (Admin CRM):
- **Xavfsiz autentifikatsiya:** PBKDF2 kriptografik xeshlangan parollar va tokenlar bilan himoyalangan yo‘nalishlar.
- **Dashboard va Statistika:** Bugungi qabullar, yangi arizalar, oxirgi 7 kunlik dinamika grafigi, mutaxassisliklar kesimidagi taqsimot.
- **Qabullarni boshqarish:** Jadval va Kalendar ko‘rinishlari (Yangi, Tasdiqlangan, Yakunlangan, Bekor qilingan).
- **Bemorlar boshqaruvi:** Bemorlar aloqa tarixi va shaxsiy qaydlar.
- **Shifokorlar CRUD:** Yangi shifokor qo‘shish, tahrirlash, ish kunlari, narxlari va faollik holati.
- **Xizmatlar CRUD:** Narxlar, tayyorgarlik va toifalarni o‘zgartirish.
- **Laboratoriya & MSCT CRUD:** Tahlillar va KT turlarini boshqarish.
- **Aksiyalar va Reklama boshqaruvi:** Bannerlar joylashuvi (Hero, sahifalar, Pop-up modal).
- **Yangiliklar CRUD:** Maqolalar tahriri va nashri.
- **Murojaatlar qutisi:** Sayt kontakt formasi orqali tushgan xabarlarni o‘qish va arxivlash.
- **Klinika sozlamalari:** Klinika nomi, shiori, telefonlari, Telegram, manzili, ish vaqti va Google Maps havolalarini kodga kirmasdan o‘zgartirish.

---

## 🛠 Texnologiyalar Steki

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons, Motion.
- **Backend:** Node.js, Express, TSX, Google GenAI SDK (`@google/genai`).
- **Ma’lumotlar bazasi:** Persistent JSON Storage Abstraction (`/data/database.json`) — PostgreSQL yoki Cloud SQL bilan 1:1 almashtirishga mos abstraksiyalangan repozitoriy.
- **Xavfsizlik:** Node.js Crypto PBKDF2 + Salt, Session Bearer Tokens, himoyalangan server proxy marshrutlari.

---

## 🚀 Mahalliylashtirish va Ishga Tushirish (Local Setup)

### 1. Bog‘liqliklarni o‘rnatish:
```bash
npm install
```

### 2. Muhit o‘zgaruvchilarini sozlash (`.env`):
`.env.example` faylidan nusxa olib, `.env` faylini yarating:
```env
GEMINI_API_KEY="SIZNING_GEMINI_API_KALITINGIZ"
PORT=3000
ADMIN_EMAIL="admin@medcare.uz"
ADMIN_PASSWORD="MedCareDemo2025!"
SESSION_SECRET="medcare-secret-key-production-ready"
```

### 3. Dasturni ishga tushirish (Dev rejim):
```bash
npm run dev
```
Server `http://localhost:3000` manzilida ishga tushadi.

---

## 🔐 Administrator Kirish Rekvizitlari

Boshqaruv paneliga kirish uchun:
- **URL:** `/admin/login`
- **Email:** `admin@medcare.uz`
- **Parol:** `MedCareDemo2025!`

*(Kirish oynasida bir marta bosish bilan to‘ldiruvchi "Demo admin rekvizitlarini kiritish" tugmasi ham mavjud).*

---

## ⚙️ Klinika Ma’lumotlarini O‘zgartirish

Klinika nomi, telefon raqamlari, ish vaqti yoki xaritani o‘zgartirish uchun dastur kodini tahrirlash shart emas:
1. `/admin/login` orqali admin panelga kiring;
2. Chap menyudan **"Sozlamalar"** bo‘limini oching;
3. Kerakli ma’lumotlarni yangilang va **"O‘zgarishlarni saqlash"** tugmasini bosing;
4. Barcha o‘zgarishlar darhol butun ommaviy veb-saytda aks etadi.

---

## 🛡 Xavfsizlik va Tibbiy Ogohlantirish

- Bemorlarning shaxsiy telefon raqamlari hech qachon ochiq sahifalarda ko‘rsatilmaydi.
- AI yordamchisi qat’iy tibbiy xavfsizlik cheklovlariga ega bo‘lib, hech qachon mustaqil tashxis qo‘ymaydi yoki davolashni buyurmaydi.
- Saytdagi barcha ma’lumotlar axborot berish maqsadida joylashtirilgan. Yakuniy tashxis va davolash faqat shifokor ko‘rigidan so‘ng belgilanadi.
