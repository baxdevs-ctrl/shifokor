import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { db, verifyPassword } from './server/db.ts';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// In-memory token storage for active admin sessions
const activeSessions = new Map<string, { userId: string; email: string; expiresAt: number }>();

function createSession(userId: string, email: string): string {
  const token = crypto.randomBytes(32).toString('hex');
  // 7 days expiration
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
  activeSessions.set(token, { userId, email, expiresAt });
  return token;
}

function verifyToken(token?: string) {
  if (!token) return null;
  const session = activeSessions.get(token);
  if (!session) return null;
  if (Date.now() > session.expiresAt) {
    activeSessions.delete(token);
    return null;
  }
  return session;
}

// Authentication middleware
function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : undefined;
  const session = verifyToken(token);

  if (!session) {
    res.status(401).json({ error: 'Ruxsat berilmagan. Iltimos, qayta tizimga kiring.' });
    return;
  }

  (req as any).user = session;
  next();
}

// -------------------------------------------------------------
// PUBLIC API ENDPOINTS
// -------------------------------------------------------------

// Settings
app.get('/api/settings', (req: Request, res: Response) => {
  try {
    const settings = db.getSettings();
    res.json(settings);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Doctors
app.get('/api/doctors', (req: Request, res: Response) => {
  try {
    const activeOnly = req.query.all !== 'true';
    const doctors = db.getDoctors(activeOnly);
    res.json(doctors);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/doctors/:id', (req: Request, res: Response) => {
  try {
    const doctor = db.getDoctorById(req.params.id);
    if (!doctor) {
      res.status(404).json({ error: 'Shifokor topilmadi' });
      return;
    }
    res.json(doctor);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Services
app.get('/api/services', (req: Request, res: Response) => {
  try {
    const category = req.query.category as string | undefined;
    const activeOnly = req.query.all !== 'true';
    const services = db.getServices(activeOnly, category);
    res.json(services);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/services/:id', (req: Request, res: Response) => {
  try {
    const service = db.getServiceById(req.params.id);
    if (!service) {
      res.status(404).json({ error: 'Xizmat topilmadi' });
      return;
    }
    res.json(service);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Laboratory
app.get('/api/laboratory', (req: Request, res: Response) => {
  try {
    const category = req.query.category as string | undefined;
    const activeOnly = req.query.all !== 'true';
    const tests = db.getLaboratoryTests(activeOnly, category);
    res.json(tests);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/laboratory/:id', (req: Request, res: Response) => {
  try {
    const test = db.getLaboratoryTestById(req.params.id);
    if (!test) {
      res.status(404).json({ error: 'Laboratoriya tahlili topilmadi' });
      return;
    }
    res.json(test);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// MSCT
app.get('/api/msct', (req: Request, res: Response) => {
  try {
    const activeOnly = req.query.all !== 'true';
    const msct = db.getMSCTServices(activeOnly);
    res.json(msct);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/msct/:id', (req: Request, res: Response) => {
  try {
    const service = db.getMSCTServiceById(req.params.id);
    if (!service) {
      res.status(404).json({ error: 'MSCT xizmati topilmadi' });
      return;
    }
    res.json(service);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Promotions
app.get('/api/promotions', (req: Request, res: Response) => {
  try {
    const activeOnly = req.query.all !== 'true';
    const promotions = db.getPromotions(activeOnly);
    res.json(promotions);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/promotions/:id', (req: Request, res: Response) => {
  try {
    const promotion = db.getPromotionById(req.params.id);
    if (!promotion) {
      res.status(404).json({ error: 'Aksiya topilmadi' });
      return;
    }
    res.json(promotion);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Advertisements
app.get('/api/advertisements', (req: Request, res: Response) => {
  try {
    const placement = req.query.placement as string | undefined;
    const activeOnly = req.query.all !== 'true';
    const ads = db.getAdvertisements(placement, activeOnly);
    res.json(ads);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// News
app.get('/api/news', (req: Request, res: Response) => {
  try {
    const activeOnly = req.query.all !== 'true';
    const news = db.getNews(activeOnly);
    res.json(news);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/news/:id', (req: Request, res: Response) => {
  try {
    const article = db.getNewsById(req.params.id);
    if (!article) {
      res.status(404).json({ error: 'Maqola topilmadi' });
      return;
    }
    db.incrementNewsViews(article.id);
    res.json(article);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Appointment Available Slots
app.get('/api/appointments/slots', (req: Request, res: Response) => {
  try {
    const doctorId = req.query.doctorId as string;
    const date = req.query.date as string;

    if (!doctorId || !date) {
      res.status(400).json({ error: 'doctorId va date parametrlari talab qilinadi' });
      return;
    }

    const slots = db.getAvailableSlots(doctorId, date);
    res.json({ slots });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Public Appointment Booking
app.post('/api/appointments', (req: Request, res: Response) => {
  try {
    const { fullName, phone, doctorId, serviceId, date, time, comment, consent } = req.body;

    if (!consent) {
      res.status(400).json({ error: "Shaxsiy ma'lumotlarni qayta ishlashga rozilik bildirilishi shart." });
      return;
    }

    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
      res.status(400).json({ error: 'Iltimos, to‘liq ismingizni kiriting.' });
      return;
    }

    if (!phone || typeof phone !== 'string' || phone.trim().length < 7) {
      res.status(400).json({ error: 'Iltimos, to‘g‘ri telefon raqamingizni kiriting.' });
      return;
    }

    if (!doctorId || !date || !time) {
      res.status(400).json({ error: 'Shifokor, sana va vaqt tanlanishi shart.' });
      return;
    }

    const appointment = db.createAppointment({
      fullName: fullName.trim(),
      phone: phone.trim(),
      doctorId,
      serviceId,
      date,
      time,
      comment: comment?.trim(),
    });

    res.status(201).json({
      success: true,
      message: "Arizangiz qabul qilindi! Tez orada klinika xodimi siz bilan bog‘lanadi.",
      appointment,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Public Contact Form
app.post('/api/contact', (req: Request, res: Response) => {
  try {
    const { name, phone, email, message, consent } = req.body;

    if (!consent) {
      res.status(400).json({ error: "Shaxsiy ma'lumotlarni qayta ishlashga rozilik bildirilishi shart." });
      return;
    }

    if (!name || name.trim().length < 2) {
      res.status(400).json({ error: 'Ismingizni kiriting.' });
      return;
    }

    if (!phone || phone.trim().length < 7) {
      res.status(400).json({ error: 'Telefon raqamingizni kiriting.' });
      return;
    }

    if (!message || message.trim().length < 5) {
      res.status(400).json({ error: 'Xabarni to‘liqroq yozing.' });
      return;
    }

    const saved = db.createContactMessage({
      name: name.trim(),
      phone: phone.trim(),
      email: email?.trim(),
      message: message.trim(),
    });

    res.status(201).json({
      success: true,
      message: "Xabaringiz qabul qilindi. Tez orada siz bilan bog'lanamiz.",
      data: saved,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Global Search
app.get('/api/search', (req: Request, res: Response) => {
  try {
    const q = (req.query.q as string) || '';
    const results = db.globalSearch(q);
    res.json(results);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// AI Medical Assistant endpoint
app.post('/api/ai/chat', async (req: Request, res: Response) => {
  try {
    const { message, history } = req.body;
    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Xabar matni kiritilmagan' });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const settings = db.getSettings();
    const doctors = db.getDoctors(true);
    const services = db.getServices(true);
    const labTests = db.getLaboratoryTests(true);
    const msctServices = db.getMSCTServices(true);

    const clinicContext = `
Siz "MEDCARE" xususiy ko'p tarmoqli tibbiyot markazining rasmiy AI maslahatchisisiz.
Klinika ma'lumotlari:
- Nomi: ${settings.name}
- Shiori: ${settings.tagline}
- Manzili: ${settings.address}
- Ish vaqti: ${settings.workingHoursWeekday}, ${settings.workingHoursWeekend}
- Telefon: ${settings.phone} (${settings.emergencyInfo})
- Telegram: ${settings.telegram}

Klinikadagi shifokorlar:
${doctors.map((d) => `- ${d.name} (${d.specialty}), Tajribasi: ${d.experienceYears} yil, Qabul narxi: ${d.consultationPrice.toLocaleString()} so'm, Ish kunlari: ${d.workingDays.join(', ')} (${d.workingHours})`).join('\n')}

Asosiy xizmatlar:
${services.slice(0, 10).map((s) => `- ${s.name} (${s.categoryNameUz}): ${s.price.toLocaleString()} so'm`).join('\n')}

MSCT xizmatlari (128 qatlamli zamonaviy tomograf):
${msctServices.map((m) => `- ${m.name}: ${m.price.toLocaleString()} so'm (${m.durationMinutes} daqiqa)`).join('\n')}

Laboratoriya tahlillari:
${labTests.slice(0, 8).map((l) => `- ${l.name} (${l.code}): ${l.price.toLocaleString()} so'm, Muddati: ${l.resultDurationText}`).join('\n')}

QAT'IY TIBBIY XAVFSIZLIK QOIDALARI:
1. Siz HЕCH QACHON kasalliklarga tashxis qo'ymaysiz va davolash rejasini yoki dori vositalari/dozalarini tavsiya qilmaysiz!
2. Agar bemor tashxis, alomatlar sababi yoki dori so'rasa, quyidagi aniq ibora bilan javob bering:
"Men tibbiy tashxis qo‘yish yoki davolash bo‘yicha individual tavsiya bera olmayman. Iltimos, klinikadagi tegishli mutaxassis bilan maslahatlashib ko‘ring."
3. Shoshilinch yoki hayot uchun xavfli alomatlar bo'lsa darhol:
"Shoshilinch holatda mahalliy tez yordam xizmatiga murojaat qiling (103) yoki qabul bo'limimizga qo'ng'iroq qiling: ${settings.phone}" deb eslating.
4. Foydalanuvchiga klinikadagi shifokorlarni topishda, qabul narxlari va vaqtlarini bilishda, tekshiruvlarga umumiy tayyorgarlik ko'rishda va onlayn qabulga yozilishda do'stona va professional yordam bering.
5. Har bir javobingiz oxirida eslatma qo'shing:
"Eslatma: AI yordamchi tibbiy tashxis yoki davolash o‘rnini bosmaydi."
6. Javoblaringizni o'zbek tilida (lotin yozuvida), aniq, samimiy va chiroyli formatda bering.
`;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });

        const promptText = `${clinicContext}\n\nFoydalanuvchi savoli: ${message}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: promptText,
        });

        const reply = response.text || 'Kechirasiz, javob olishda xatolik yuz berdi.';
        res.json({ reply });
        return;
      } catch (geminiError: any) {
        console.error('Gemini API call failed, falling back to local assistant engine:', geminiError.message);
      }
    }

    // Intelligent local fallback matching clinic keywords and enforcing full safety
    const lower = message.toLowerCase();
    let reply = '';

    if (lower.includes('ogri') || lower.includes('kasal') || lower.includes('dori') || lower.includes('davola') || lower.includes('tashxis') || lower.includes('retsept')) {
      reply = `Assalomu alaykum! Men tibbiy tashxis qo‘yish yoki davolash bo‘yicha individual tavsiya bera olmayman. Iltimos, klinikadagi tegishli mutaxassis bilan maslahatlashib ko‘ring.\n\nSizga kerakli shifokorimiz ko'rigiga onlayn yozilishni tavsiya qilaman. Masalan, bosh jarroh Dr. Aliyev Anvar yoki LOR shifokori Dr. Karimova Dilnoza qabuliga "Qabulga yozilish" bo'limi orqali tezda navbat olishingiz mumkin.\n\nEslatma: AI yordamchi tibbiy tashxis yoki davolash o‘rnini bosmaydi.`;
    } else if (lower.includes('msct') || lower.includes('kt') || lower.includes('tomograf')) {
      reply = `MEDCARE klinikasida zamonaviy 128 qatlamli MSCT tomografi o'rnatilgan. Bosh miya MSCT (450 000 so'm), ko'krak qafasi o'pka MSCT (500 000 so'm) va qorin bo'shlig'i MSCT mavjud. Hozirda MSCT tekshiruvlariga 20% maxsus chegirma aksiyasi amalda! Qabulga saytimiz orqali yoki ${settings.phone} orqali yozilishingiz mumkin.\n\nEslatma: AI yordamchi tibbiy tashxis yoki davolash o‘rnini bosmaydi.`;
    } else if (lower.includes('lor') || lower.includes('quloq') || lower.includes('burun') || lower.includes('tomoq') || lower.includes('gaymorit')) {
      reply = `Klinikamizda oliy toifali LOR mutaxassisi Dr. Karimova Dilnoza Sanjarovna qabul qiladi. Videoendoskopik ko'rik narxi 180 000 so'm. Ish kunlari: Dushanba, Chorshanba, Payshanba, Shanba (09:00 - 17:00). Qabulga yozilish uchun "Shifokorlar" bo'limidan qulay vaqtni tanlashingiz mumkin.\n\nEslatma: AI yordamchi tibbiy tashxis yoki davolash o‘rnini bosmaydi.`;
    } else if (lower.includes('jarroh') || lower.includes('operatsiya') || lower.includes('churra') || lower.includes('tosh')) {
      reply = `Bosh jarrohimiz Dr. Aliyev Anvar Rustamovich — laparoskopik va kam invaziv jarrohlik bo'yicha 16 yillik tajribaga ega. Birlamchi konsultatsiya narxi 200 000 so'm. Ish vaqti: Dush-Juma 09:00 - 15:00. Qabulga yozilish uchun onlayn buyurtma qoldirishingiz mumkin.\n\nEslatma: AI yordamchi tibbiy tashxis yoki davolash o‘rnini bosmaydi.`;
    } else if (lower.includes('tahlil') || lower.includes('laboratoriya') || lower.includes('qon') || lower.includes('check')) {
      reply = `MEDCARE laboratoriyasida 50 dan ortiq tahlillar avtomatlashtirilgan analizatorlarda amalga oshiriladi. Umumiy qon tahlili — 65 000 so'm, Biokimyoviy tahlil — 190 000 so'm, Glikirlangan gemoglobin — 110 000 so'm. Shuningdek 30+ parametrli profilaktik Check-up to'plami ham mavjud. Aksariyat natijalar 1 ish kunida Telegram orqali ham yuboriladi.\n\nEslatma: AI yordamchi tibbiy tashxis yoki davolash o‘rnini bosmaydi.`;
    } else if (lower.includes('narx') || lower.includes('qancha') || lower.includes('narxi')) {
      reply = `Klinikamiz narxlari: Shifokorlar konsultatsiyasi 150 000 - 220 000 so'm; Umumiy qon tahlili 65 000 so'm; MSCT diagnostika 420 000 so'mdan boshlanadi; Tish tozalash (Air-Flow) 350 000 so'm. To'liq narxlar ro'yxatini "Xizmatlar", "MSCT" va "Laboratoriya" sahifalarida ko'rishingiz mumkin.\n\nEslatma: AI yordamchi tibbiy tashxis yoki davolash o‘rnini bosmaydi.`;
    } else if (lower.includes('manzil') || lower.includes('qayerda') || lower.includes('telefon') || lower.includes('vaqt')) {
      reply = `MEDCARE klinikasi manzili: ${settings.address}.\nIsh vaqti: ${settings.workingHoursWeekday}, ${settings.workingHoursWeekend}.\nTelefon: ${settings.phone}.\nTelegram: ${settings.telegram}.\nBizga qo'ng'iroq qiling yoki onlayn qabulga yoziling!\n\nEslatma: AI yordamchi tibbiy tashxis yoki davolash o‘rnini bosmaydi.`;
    } else {
      reply = `Assalomu alaykum! Men MEDCARE klinikasining AI yordamchisiman. Sizga klinikadagi shifokorlarni topish, MSCT va laboratoriya xizmatlari narxlari, ish vaqtlari hamda onlayn qabulga yozilish bo'yicha ma'lumot bera olaman. Sizga qanday yordam bera olaman?\n\nEslatma: AI yordamchi tibbiy tashxis yoki davolash o‘rnini bosmaydi.`;
    }

    res.json({ reply });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// ADMIN AUTHENTICATION
// -------------------------------------------------------------

app.post('/api/admin/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Email va parol kiritilishi shart' });
      return;
    }

    const admin = db.getAdminByEmail(email);
    if (!admin) {
      res.status(401).json({ error: "Email yoki parol noto'g'ri" });
      return;
    }

    const isMatch = verifyPassword(password, admin.passwordHash, admin.salt);
    if (!isMatch) {
      res.status(401).json({ error: "Email yoki parol noto'g'ri" });
      return;
    }

    const token = createSession(admin.id, admin.email);

    res.json({
      token,
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/me', requireAdmin, (req: Request, res: Response) => {
  const sessionUser = (req as any).user;
  const admin = db.getAdminById(sessionUser.userId);
  if (!admin) {
    res.status(401).json({ error: 'Foydalanuvchi topilmadi' });
    return;
  }
  res.json({
    id: admin.id,
    email: admin.email,
    name: admin.name,
    role: admin.role,
  });
});

app.post('/api/admin/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : undefined;
  if (token) {
    activeSessions.delete(token);
  }
  res.json({ success: true });
});

// -------------------------------------------------------------
// ADMIN PROTECTED CRUD ROUTES
// -------------------------------------------------------------

// Dashboard Stats
app.get('/api/admin/stats', requireAdmin, (req: Request, res: Response) => {
  try {
    const stats = db.getDashboardStats();
    res.json(stats);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Settings Update
app.put('/api/admin/settings', requireAdmin, (req: Request, res: Response) => {
  try {
    const updated = db.updateSettings(req.body);
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Doctors CRUD
app.post('/api/admin/doctors', requireAdmin, (req: Request, res: Response) => {
  try {
    const created = db.createDoctor(req.body);
    res.status(201).json(created);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/admin/doctors/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const updated = db.updateDoctor(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ error: 'Shifokor topilmadi' });
      return;
    }
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/admin/doctors/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const ok = db.deleteDoctor(req.params.id);
    if (!ok) {
      res.status(404).json({ error: 'Shifokor topilmadi' });
      return;
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Services CRUD
app.post('/api/admin/services', requireAdmin, (req: Request, res: Response) => {
  try {
    const created = db.createService(req.body);
    res.status(201).json(created);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/admin/services/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const updated = db.updateService(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ error: 'Xizmat topilmadi' });
      return;
    }
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/admin/services/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const ok = db.deleteService(req.params.id);
    if (!ok) {
      res.status(404).json({ error: 'Xizmat topilmadi' });
      return;
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Laboratory CRUD
app.post('/api/admin/laboratory', requireAdmin, (req: Request, res: Response) => {
  try {
    const created = db.createLaboratoryTest(req.body);
    res.status(201).json(created);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/admin/laboratory/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const updated = db.updateLaboratoryTest(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ error: 'Tahlil topilmadi' });
      return;
    }
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/admin/laboratory/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const ok = db.deleteLaboratoryTest(req.params.id);
    if (!ok) {
      res.status(404).json({ error: 'Tahlil topilmadi' });
      return;
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// MSCT CRUD
app.post('/api/admin/msct', requireAdmin, (req: Request, res: Response) => {
  try {
    const created = db.createMSCTService(req.body);
    res.status(201).json(created);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/admin/msct/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const updated = db.updateMSCTService(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ error: 'MSCT xizmati topilmadi' });
      return;
    }
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/admin/msct/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const ok = db.deleteMSCTService(req.params.id);
    if (!ok) {
      res.status(404).json({ error: 'MSCT xizmati topilmadi' });
      return;
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Promotions CRUD
app.post('/api/admin/promotions', requireAdmin, (req: Request, res: Response) => {
  try {
    const created = db.createPromotion(req.body);
    res.status(201).json(created);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/admin/promotions/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const updated = db.updatePromotion(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ error: 'Aksiya topilmadi' });
      return;
    }
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/admin/promotions/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const ok = db.deletePromotion(req.params.id);
    if (!ok) {
      res.status(404).json({ error: 'Aksiya topilmadi' });
      return;
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Advertisements CRUD
app.post('/api/admin/advertisements', requireAdmin, (req: Request, res: Response) => {
  try {
    const created = db.createAdvertisement(req.body);
    res.status(201).json(created);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/admin/advertisements/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const updated = db.updateAdvertisement(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ error: 'Reklama topilmadi' });
      return;
    }
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/admin/advertisements/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const ok = db.deleteAdvertisement(req.params.id);
    if (!ok) {
      res.status(404).json({ error: 'Reklama topilmadi' });
      return;
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// News CRUD
app.post('/api/admin/news', requireAdmin, (req: Request, res: Response) => {
  try {
    const created = db.createNews(req.body);
    res.status(201).json(created);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/admin/news/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const updated = db.updateNews(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ error: 'Maqola topilmadi' });
      return;
    }
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/admin/news/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const ok = db.deleteNews(req.params.id);
    if (!ok) {
      res.status(404).json({ error: 'Maqola topilmadi' });
      return;
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Appointments Management
app.get('/api/admin/appointments', requireAdmin, (req: Request, res: Response) => {
  try {
    const doctorId = req.query.doctorId as string | undefined;
    const date = req.query.date as string | undefined;
    const status = req.query.status as any;

    const list = db.getAppointments({ doctorId, date, status });
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/appointments/:id/status', requireAdmin, (req: Request, res: Response) => {
  try {
    const { status, notes } = req.body;
    const updated = db.updateAppointmentStatus(req.params.id, status, notes);
    if (!updated) {
      res.status(404).json({ error: 'Qabul topilmadi' });
      return;
    }
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/admin/appointments/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const updated = db.updateAppointment(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ error: 'Qabul topilmadi' });
      return;
    }
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/admin/appointments/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const ok = db.deleteAppointment(req.params.id);
    if (!ok) {
      res.status(404).json({ error: 'Qabul topilmadi' });
      return;
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Patients Management
app.get('/api/admin/patients', requireAdmin, (req: Request, res: Response) => {
  try {
    const list = db.getPatients();
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/patients', requireAdmin, (req: Request, res: Response) => {
  try {
    const { fullName, phone } = req.body;
    if (!fullName || !phone) {
      res.status(400).json({ error: "Ism va telefon raqam talab qilinadi" });
      return;
    }
    const pat = db.findOrCreatePatient(fullName, phone);
    res.status(201).json(pat);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/admin/patients/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const updated = db.updatePatient(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ error: 'Bemor topilmadi' });
      return;
    }
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/admin/patients/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const ok = db.deletePatient(req.params.id);
    if (!ok) {
      res.status(404).json({ error: 'Bemor topilmadi' });
      return;
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Contact Messages Management
app.get('/api/admin/contacts', requireAdmin, (req: Request, res: Response) => {
  try {
    const list = db.getContactMessages();
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/contacts/:id/status', requireAdmin, (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const updated = db.updateContactMessageStatus(req.params.id, status);
    if (!updated) {
      res.status(404).json({ error: 'Xabar topilmadi' });
      return;
    }
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/admin/contacts/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const ok = db.deleteContactMessage(req.params.id);
    if (!ok) {
      res.status(404).json({ error: 'Xabar topilmadi' });
      return;
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// VITE MIDDLEWARE & STATIC ASSET SERVING
// -------------------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: 3000,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`MEDCARE Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
