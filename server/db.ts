import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import type {
  Doctor,
  MedicalService,
  LaboratoryTest,
  MSCTService,
  Promotion,
  Advertisement,
  NewsArticle,
  Patient,
  Appointment,
  ContactMessage,
  ClinicSettings,
  AdminUser,
  DashboardStats,
  AppointmentStatus,
} from '../src/types/index.ts';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

export interface DatabaseSchema {
  settings: ClinicSettings;
  adminUsers: (AdminUser & { passwordHash: string; salt: string })[];
  doctors: Doctor[];
  services: MedicalService[];
  laboratory: LaboratoryTest[];
  msct: MSCTService[];
  promotions: Promotion[];
  advertisements: Advertisement[];
  news: NewsArticle[];
  patients: Patient[];
  appointments: Appointment[];
  contactMessages: ContactMessage[];
}

export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const currentSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, currentSalt, 1000, 64, 'sha512').toString('hex');
  return { hash, salt: currentSalt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const calculated = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return calculated === hash;
}

const defaultSettings: ClinicSettings = {
  name: 'MEDCARE',
  tagline: 'Zamonaviy tibbiyot. Ishonchli xizmat.',
  logo: '/logo.svg',
  phone: '+998 71 200 88 00',
  phoneSecondary: '+998 90 123 45 67',
  telegram: '@medcare_uz',
  whatsapp: '+998712008800',
  email: 'info@medcare.uz',
  address: "Toshkent shahri, Yunusobod tumani, Amir Temur shox ko'chasi, 107-B",
  workingHoursWeekday: 'Dush - Shan: 08:00 - 20:00',
  workingHoursWeekend: 'Yakshanba: 09:00 - 15:00 (Navbatchi shifokor)',
  emergencyInfo: "Shoshilinch tibbiy yordam uchun 24/7 qabul bo'limi: +998 71 200 88 03 yoki 103",
  googleMapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2995.836025178651!2d69.2818!3d41.3325!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDE5JzU3LjAiTiA2OcKwMTYnNTQuNSJF!5e0!3m2!1sen!2suz!4v1620000000000!5m2!1sen!2suz',
  googleMapsDirectionsUrl: 'https://maps.google.com/?q=41.3325,69.2818',
  instagram: 'https://instagram.com/medcare_uz',
  facebook: 'https://facebook.com/medcare.uz',
  telegramChannel: 'https://t.me/medcare_clinic',
  footerText: "MEDCARE xususiy tibbiyot markazi — xalqaro standartlarga mos diagnostika, zamonaviy jarrohlik va yuqori malakali shifokorlar jamoasi.",
  medicalDisclaimer: "Saytdagi ma’lumotlar umumiy tanishtirish maqsadida taqdim etilgan. Tibbiy tashxis va davolash bo‘yicha yakuniy qarorni faqat malakali tibbiyot mutaxassisi ko'rigidan so'ng beriladi.",
  allowOnlineBooking: true,
  popupAdEnabled: true,
};

const initialDoctors: Doctor[] = [
  {
    id: 'doc-1',
    name: 'Dr. Aliyev Anvar Rustamovich',
    slug: 'dr-aliyev-anvar',
    photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600',
    specialty: 'Bosh jarroh, laparoskopist',
    specialtyKey: 'surgery',
    experienceYears: 16,
    qualification: 'Tibbiyot fanlari nomzodi, Oliy toifali jarroh',
    education: "Toshkent Tibbiyot Akademiyasi (bakalavr va magistratura), Janubiy Koreya Asan Medical Center stajirovkasi",
    biography: "16 yildan ortiq jarrohlik amaliyotiga ega. Kam invaziv laparoskopik operatsiyalar, qorin bo'shlig'i a'zolari jarrohligi va churra plastikasi bo'yicha yetakchi mutaxassis.",
    services: ["Laparoskopik xoletsistektomiya", "Churra plastikasi (gernioplastika)", "Appendektomiya", "Birlamchi jarrohlik konsultatsiyasi"],
    consultationPrice: 200000,
    workingDays: ['Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma'],
    workingHours: '09:00 - 15:00',
    phone: '+998 71 200 88 01',
    telegram: '@dr_aliyev_surgeon',
    rating: 4.9,
    reviewsCount: 142,
    active: true,
  },
  {
    id: 'doc-2',
    name: 'Dr. Karimova Dilnoza Sanjarovna',
    slug: 'dr-karimova-dilnoza',
    photo: 'https://images.unsplash.com/photo-1594824813504-747209707297?auto=format&fit=crop&q=80&w=600',
    specialty: 'Otolaringolog (LOR shifokori)',
    specialtyKey: 'ent',
    experienceYears: 11,
    qualification: 'Oliy toifali LOR mutaxassis, bolalar va kattalar otolaringologi',
    education: "Samarqand Davlat Tibbiyot Instituti, Moskva shahar LOR ilmiy-amaliy markazi ordinaturasi",
    biography: "Quloq, tomoq va burun kasalliklarini videoendoskopik tekshirish va zamonaviy dori-darmon hamda kichik invaziv usullar yordamida davolash bo'yicha tajribali mutaxassis.",
    services: ["Videoendoskopik LOR ko'rigi", "Gaymoritni punksiyasiz yuvish", "Adenoidlarni tekshirish", "Eshitish qobiliyatini baholash (audiometriya)"],
    consultationPrice: 180000,
    workingDays: ['Dushanba', 'Chorshanba', 'Payshanba', 'Shanba'],
    workingHours: '09:00 - 17:00',
    phone: '+998 71 200 88 02',
    telegram: '@dr_dilnoza_lor',
    rating: 4.95,
    reviewsCount: 188,
    active: true,
  },
  {
    id: 'doc-3',
    name: 'Dr. Usmanov Bobur Jamolovich',
    slug: 'dr-usmanov-bobur',
    photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=600',
    specialty: 'Radiolog, MSCT / KT bo‘limi boshlig‘i',
    specialtyKey: 'msct',
    experienceYears: 14,
    qualification: 'Radiologiya bo‘yicha xalqaro sertifikat sohibi (ESR aʼzosi)',
    education: "Toshkent Pediatriya Tibbiyot Instituti, Turkiya Acıbadem klinikasida KT va MRT diagnostika malaka oshiruvi",
    biography: "128 qatlamli zamonaviy MSCT apparatida bosh miya, o'pka, qorin a'zolari va tomirlarning yuqori aniqlikdagi 3D tahlili bo'yicha ko'p yillik amaliy tajribaga ega.",
    services: ["Bosh miya MSCT", "Ko'krak qafasi MSCT", "Qorin bo'shlig'i a'zolari MSCT", "MSCT angiografiya"],
    consultationPrice: 220000,
    workingDays: ['Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'],
    workingHours: '08:30 - 16:30',
    phone: '+998 71 200 88 04',
    telegram: '@dr_bobur_msct',
    rating: 4.92,
    reviewsCount: 110,
    active: true,
  },
  {
    id: 'doc-4',
    name: 'Dr. Rahimova Shahnoza Baxtiyorovna',
    slug: 'dr-rahimova-shahnoza',
    photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=600',
    specialty: 'Klinik laborator diagnostika mudiri',
    specialtyKey: 'laboratory',
    experienceYears: 13,
    qualification: 'Oliy toifali vrach-laborant, biokimyogar',
    education: "O'zbekiston Milliy Universiteti biokimyo fakulteti, Toshkent Vrachlar Malakasini Oshirish Instituti",
    biography: "Laboratoriyaning sifat nazorati (ISO 15189), to'liq avtomatlashtirilgan tahlilatorlar va nozik gormonal/immunologik tahlillar bo'yicha mas'ul ekspert.",
    services: ["Laboratoriya natijalari bo'yicha konsultatsiya", "Check-up paketlarini tahlil qilish", "Gormonlar va vitaminlar paneli"],
    consultationPrice: 150000,
    workingDays: ['Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma'],
    workingHours: '08:00 - 16:00',
    phone: '+998 71 200 88 05',
    telegram: '@dr_shahnoza_lab',
    rating: 4.88,
    reviewsCount: 94,
    active: true,
  },
  {
    id: 'doc-5',
    name: 'Dr. Soliyev Jamshid Faxriddinovich',
    slug: 'dr-soliyev-jamshid',
    photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=600',
    specialty: 'Oftalmolog-jarroh',
    specialtyKey: 'ophthalmology',
    experienceYears: 10,
    qualification: 'Oliy toifali ko‘z shifokori, mikroxirurg',
    education: "Toshkent Tibbiyot Akademiyasi, Fyodorov nomidagi ko'z mikroxirurgiyasi markazi (Rossiya)",
    biography: "Ko'rish o'tkirligini kompyuter tekshiruvi, katarakta diagnostikasi, ko'z ichki bosimini o'lchash va ko'z tubi kasalliklarini davolash bo'yicha yetuk mutaxassis.",
    services: ["Kompyuterli ko'z tekshiruvi", "Ko'z tubi ko'rigi (oftalmoskopiya)", "Glaukoma skriningi", "Ko'zoynak va linza tanlash"],
    consultationPrice: 170000,
    workingDays: ['Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'],
    workingHours: '09:00 - 16:00',
    phone: '+998 71 200 88 06',
    telegram: '@dr_jamshid_eye',
    rating: 4.85,
    reviewsCount: 79,
    active: true,
  },
  {
    id: 'doc-6',
    name: 'Dr. Toshmatova Ziyoda Otabekovna',
    slug: 'dr-toshmatova-ziyoda',
    photo: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&q=80&w=600',
    specialty: 'Stomatolog-terapevt, ortoped',
    specialtyKey: 'dentistry',
    experienceYears: 8,
    qualification: 'Zamonaviy estetik stomatologiya mutaxassisi',
    education: "Toshkent Davlat Stomatologiya Instituti, Germaniya stomatologik master-klasslari bitiruvchisi",
    biography: "Og'riqsiz tish davolash, mikroskop ostida kanallarni tozalash, tishlarni professional tozalash va estetik restavratsiya.",
    services: ["Tish kariesini og'riqsiz davolash", "Tishlarni ultratovushli tozalash (Air-Flow)", "Badiiy tish restavratsiyasi", "Ildiz kanallarini davolash"],
    consultationPrice: 150000,
    workingDays: ['Dushanba', 'Seshanba', 'Payshanba', 'Juma', 'Shanba'],
    workingHours: '10:00 - 18:00',
    phone: '+998 71 200 88 07',
    telegram: '@dr_ziyoda_dental',
    rating: 4.96,
    reviewsCount: 165,
    active: true,
  }
];

const initialServices: MedicalService[] = [
  {
    id: 'srv-1',
    name: "Laparoskopik xoletsistektomiya",
    slug: 'laparoskopik-xoletsistektomiya',
    category: 'surgery',
    categoryNameUz: 'Jarrohlik',
    description: "O't qopidagi toshlarni kichik kesmalar orqali xavfsiz va og'riqsiz laparoskopik olib tashlash.",
    fullDetails: "Zamonaviy Karl Storz uskunasida amalga oshiriladi. Reabilitatsiya davri atigi 2-3 kun davom etadi.",
    price: 4500000,
    durationMinutes: 60,
    preparationInstructions: "Operatsiyadan oldin umumiy tahlillar va EKG topshirish, operatsiya kuni och qoringa kelish talab etiladi.",
    image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=600',
    active: true,
    popular: true,
  },
  {
    id: 'srv-2',
    name: "Churra plastikasi (Gernioplastika to'r bilan)",
    slug: 'gernioplastika',
    category: 'surgery',
    categoryNameUz: 'Jarrohlik',
    description: "Churra nuqsonini zamonaviy polipropilen to'r implantati yordamida qaytalanmaydigan mustahkamlash.",
    fullDetails: "Qorin oldi devori, chov va kindik churralari uchun samarali usul.",
    price: 3800000,
    durationMinutes: 50,
    preparationInstructions: "Jarroh ko'rigi, ultratovush tekshiruvi va standart laboratoriya tahlillari.",
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=600',
    active: true,
    popular: true,
  },
  {
    id: 'srv-3',
    name: "Laparoskopik appendektomiya",
    slug: 'laparoskopik-appendektomiya',
    category: 'surgery',
    categoryNameUz: 'Jarrohlik',
    description: "Ko'richak o'simtasini kesmasiz, laparoskop yordamida tezkor olib tashlash.",
    price: 3500000,
    durationMinutes: 45,
    preparationInstructions: "Shoshilinch yoki rejaviy ko'rik asosida jarroh tayyorgarligi.",
    active: true,
  },
  {
    id: 'srv-4',
    name: "Jarroh birlamchi konsultatsiyasi",
    slug: 'jarroh-konsultatsiyasi',
    category: 'surgery',
    categoryNameUz: 'Jarrohlik',
    description: "Bosh jarroh ko'rigi, shikoyatlarni o'rganish, individual davolash yoki operatsiya rejasini tuzish.",
    price: 200000,
    durationMinutes: 30,
    preparationInstructions: "Oldingi tibbiy xulosalar va tahlil varaqalari bo'lsa o'zingiz bilan oling.",
    active: true,
    popular: true,
  },
  {
    id: 'srv-5',
    name: "Videoendoskopik LOR ko'rigi",
    slug: 'videoendoskopik-lor-tekshiruvi',
    category: 'ent',
    categoryNameUz: 'LOR / ENT',
    description: "Burun bo'shlig'i, tomoq va quloqni HD videokamera orqali monitor ekranida batafsil ko'rish.",
    fullDetails: "Quloq pardasi holati, burun to'sig'i egriligi, shilliq qavat shishi va poliplarni aniq ko'rish imkoni.",
    price: 180000,
    durationMinutes: 25,
    preparationInstructions: "Ko'rikdan 1 soat oldin burunga tomir toraytiruvchi tomchilar tomizmang.",
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=600',
    active: true,
    popular: true,
  },
  {
    id: 'srv-6',
    name: "Gaymoritni kuku usulida apparatli yuvish",
    slug: 'gaymorit-kuku-yuvish',
    category: 'ent',
    categoryNameUz: 'LOR / ENT',
    description: "Burun yondosh bo'shliqlarini antiseptik eritmalar bilan og'riqsiz tozalash.",
    price: 120000,
    durationMinutes: 20,
    preparationInstructions: "Maxsus tayyorgarlik talab etilmaydi.",
    active: true,
  },
  {
    id: 'srv-7',
    name: "Quloq oltingugurt tiqinini yuvish",
    slug: 'quloq-tiqini-yuvish',
    category: 'ent',
    categoryNameUz: 'LOR / ENT',
    description: "Eshitish yo'lini iliq steril eritma yoki vakuum aspirator orqali tozalash.",
    price: 90000,
    durationMinutes: 15,
    preparationInstructions: "Quloqqa o'zboshimchalik bilan paxta yoki boshqa buyum tiqmang.",
    active: true,
  },
  {
    id: 'srv-8',
    name: "Kompyuterli ko'z tekshiruvi (Avtorefraktometriya)",
    slug: 'avtorefraktometriya-oftalmologiya',
    category: 'ophthalmology',
    categoryNameUz: 'Oftalmologiya',
    description: "Miopiya, gipermetropiya va astigmatizmni raqamli uskunada soniyalar ichida o'lchash.",
    price: 130000,
    durationMinutes: 20,
    preparationInstructions: "Kontakt linza taqqan bo'lsangiz tekshiruvdan 2 soat oldin yechish tavsiya etiladi.",
    image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=600',
    active: true,
    popular: true,
  },
  {
    id: 'srv-9',
    name: "Ko'z tubi ko'rigi (Oftalmoskopiya)",
    slug: 'oftalmoskopiya',
    category: 'ophthalmology',
    categoryNameUz: 'Oftalmologiya',
    description: "To'r parda, ko'rish nervi diski va qon tomirlar holatini chuqur baholash.",
    price: 150000,
    durationMinutes: 25,
    preparationInstructions: "Ko'z qorachig'i kengaytirilishi mumkin, shuning uchun mashina boshqarish tavsiya etilmaydi.",
    active: true,
  },
  {
    id: 'srv-10',
    name: "Tishlarni ultratovushli tozalash (Air-Flow)",
    slug: 'air-flow-tozalash',
    category: 'dentistry',
    categoryNameUz: 'Stomatologiya',
    description: "Tish toshlari va qoraygan qatlamlarni og'riqsiz ketkazish va emalni jilolash.",
    price: 350000,
    durationMinutes: 45,
    preparationInstructions: "Muolajadan so'ng 2 soat davomida bo'yovchi ichimliklar (choy, qahva) ichilmaydi.",
    image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=600',
    active: true,
    popular: true,
  },
  {
    id: 'srv-11',
    name: "Nurli plomba bilan tish kariesini davolash",
    slug: 'nurli-plomba-karies',
    category: 'dentistry',
    categoryNameUz: 'Stomatologiya',
    description: "Germaniya foto-kompozit materiali yordamida tish anatomiyasini to'liq tiklash.",
    price: 250000,
    durationMinutes: 40,
    preparationInstructions: "Maxsus tayyorgarlik talab etilmaydi.",
    active: true,
  },
  {
    id: 'srv-12',
    name: "Elektrokardiogramma (EKG) shifokor xulosasi bilan",
    slug: 'ekg-tashxisi',
    category: 'cardiology',
    categoryNameUz: 'Kardiologiya',
    description: "Yurak ritmi va ishemik o'zgarishlarni 12 kanalli zamonaviy apparatda tekshirish.",
    price: 100000,
    durationMinutes: 15,
    preparationInstructions: "Tekshiruv oldidan 30 daqiqa tinch o'tirish va kofe ichmaslik tavsiya etiladi.",
    active: true,
    popular: true,
  },
  {
    id: 'srv-13',
    name: "Kardiolog konsultatsiyasi va davolash rejasi",
    slug: 'kardiolog-konsultatsiyasi',
    category: 'cardiology',
    categoryNameUz: 'Kardiologiya',
    description: "Qon bosimi, stenokardiya va yurak yetishmovchiligida shaxsiy davolash sxemasi.",
    price: 180000,
    durationMinutes: 30,
    preparationInstructions: "Avvalgi EKG yoki ExoKG xulosalari.",
    active: true,
  },
  {
    id: 'srv-14',
    name: "Nevrolog ko'rigi va reflekslar diagnostikasi",
    slug: 'nevrolog-tekshiruvi',
    category: 'neurology',
    categoryNameUz: 'Nevrologiya',
    description: "Bosh og'rig'i, uyqu buzilishi, bel-umurtqa og'riqlari va asab tizimi faoliyatini tekshirish.",
    price: 180000,
    durationMinutes: 30,
    preparationInstructions: "Shikoyatlar va alomatlar tarixini tayyorlash.",
    active: true,
  },
  {
    id: 'srv-15',
    name: "Qorin bo'shlig'i a'zolari ultratovush tekshiruvi (UZI)",
    slug: 'qorin-boshligi-uzi',
    category: 'other',
    categoryNameUz: 'Diagnostika (UZI)',
    description: "Jigar, o't qopi, oshqozon osti bezi va taloq holatini 4D datchikda aniqlash.",
    price: 160000,
    durationMinutes: 20,
    preparationInstructions: "Tekshiruvdan kamida 6 soat oldin ovqat yemaslik (och qoringa).",
    active: true,
    popular: true,
  },
  {
    id: 'srv-16',
    name: "Qalqonsimon bez UZI tekshiruvi",
    slug: 'qalqonsimon-bez-uzi',
    category: 'other',
    categoryNameUz: 'Diagnostika (UZI)',
    description: "Bez o'lchamlari, tugunlar va qon oqimi holatini doppler rejimida o'rganish.",
    price: 130000,
    durationMinutes: 15,
    preparationInstructions: "Maxsus tayyorgarlik talab etilmaydi.",
    active: true,
  },
  {
    id: 'srv-17',
    name: "Terapevt umumiy profilaktik ko'rigi",
    slug: 'terapevt-konsultatsiyasi',
    category: 'other',
    categoryNameUz: 'Terapiya',
    description: "Salomatlik umumiy holatini baholash, birlamchi tekshiruvlar tayinlash.",
    price: 150000,
    durationMinutes: 30,
    preparationInstructions: "Barcha tibbiy hujjatlar va dori ro'yxati.",
    active: true,
  },
  {
    id: 'srv-18',
    name: "Bo'g'imlar intraartikulyar blokadasi",
    slug: 'bogimlar-blokadasi',
    category: 'surgery',
    categoryNameUz: 'Jarrohlik',
    description: "Tizza yoki yelka bo'g'imlaridagi kuchli og'riqni dori vositalari yordamida tezda bartaraf etish.",
    price: 300000,
    durationMinutes: 20,
    preparationInstructions: "Rentgen yoki MSCT tasviri mavjud bo'lishi lozim.",
    active: true,
  },
  {
    id: 'srv-19',
    name: "Tish oqartirish (Laser Bleaching)",
    slug: 'tish-oqartirish',
    category: 'dentistry',
    categoryNameUz: 'Stomatologiya',
    description: "Tish rangini 4-6 tonga xavfsiz oqartirish zamonaviy lazer texnologiyasida.",
    price: 1200000,
    durationMinutes: 60,
    preparationInstructions: "Dastlab professional tish tozalash o'tkazilishi shart.",
    active: true,
  },
  {
    id: 'srv-20',
    name: "Surunkali tonzillitni apparatli davolash (Tonzillor)",
    slug: 'tonzillor-davolash',
    category: 'ent',
    categoryNameUz: 'LOR / ENT',
    description: "Murtak bezlarini ultratovush va dori vositalari bilan chuqur yuvish kursi.",
    price: 140000,
    durationMinutes: 20,
    preparationInstructions: "Muolajadan 1 soat oldin ovqat yemaslik.",
    active: true,
  }
];

const initialLaboratory: LaboratoryTest[] = [
  {
    id: 'lab-1',
    code: 'LAB-101',
    name: "Umumiy qon tahlili (24 parametr + ECHT)",
    category: 'Umumiy tahlillar',
    description: "Gemoglobin, leykotsitlar, eritrotsitlar, trombotsitlar va eritrotsitlarning cho'kish tezligini avtomat analizatorda aniqlash.",
    price: 65000,
    resultDurationDays: 1,
    resultDurationText: "1 ish kuni (soat 16:00 gacha)",
    sampleType: "Venoz yoki kapillyar qon",
    preparation: "Ertalab och qoringa qon topshirish tavsiya etiladi. Qon topshirishdan oldin 1 stakan gazsiz suv ichish mumkin.",
    active: true,
    popular: true,
  },
  {
    id: 'lab-2',
    code: 'LAB-102',
    name: "Umumiy siydik tahlili (fizik-kimyoviy + mikroskopiya)",
    category: 'Umumiy tahlillar',
    description: "Oqsillar, glyukoza, leykotsitlar, bakteriyalar va buyrak faoliyatini baholash uchun kengaytirilgan tahlil.",
    price: 45000,
    resultDurationDays: 1,
    resultDurationText: "1 ish kuni",
    sampleType: "Ertalabki o'rta porsiya siydik",
    preparation: "Ertalabki gigiyenik yuvinishdan so'ng steril konteynerga to'planadi.",
    active: true,
    popular: true,
  },
  {
    id: 'lab-3',
    code: 'LAB-201',
    name: "Biokimyoviy qon tahlili (Standart panel: 8 parametr)",
    category: 'Biokimyo',
    description: "ALT, AST, umumiy bilirubin, mochevina, kreatinin, umumiy oqsil, glyukoza, xolesterin.",
    price: 190000,
    resultDurationDays: 1,
    resultDurationText: "1 ish kuni",
    sampleType: "Venoz qon",
    preparation: "Kamida 8-12 soatlik ochlikdan so'ng qon topshiriladi. Spirtli ichimliklar 24 soat oldin man etiladi.",
    active: true,
    popular: true,
  },
  {
    id: 'lab-4',
    code: 'LAB-202',
    name: "Qondagi glyukoza miqdori (Qand miqdori)",
    category: 'Biokimyo',
    description: "Qandli diabetni erta aniqlash va nazorat qilish uchun och qoringa glyukoza darajasi.",
    price: 35000,
    resultDurationDays: 1,
    resultDurationText: "2-3 soat ichida",
    sampleType: "Venoz qon",
    preparation: "Qat'iy och qoringa (suv ichish mumkin).",
    active: true,
  },
  {
    id: 'lab-5',
    code: 'LAB-203',
    name: "Glikirlangan gemoglobin (HbA1c)",
    category: 'Biokimyo',
    description: "Oxirgi 3 oydagi o'rtacha qand miqdorini aniq aks ettiruvchi oltin standart ko'rsatkich.",
    price: 110000,
    resultDurationDays: 1,
    resultDurationText: "1 ish kuni",
    sampleType: "Venoz qon",
    preparation: "Maxsus parhez talab qilinmaydi, ertalab topshirish maqbul.",
    active: true,
    popular: true,
  },
  {
    id: 'lab-6',
    code: 'LAB-204',
    name: "Lipidlar spektri (Xolesterin, LPVP, LPNP, Triglitseridlar)",
    category: 'Biokimyo',
    description: "Yurak-qon tomir tizimi ateroskleroz xavfini baholash uchun to'liq lipid paneli.",
    price: 140000,
    resultDurationDays: 1,
    resultDurationText: "1 ish kuni",
    sampleType: "Venoz qon",
    preparation: "12 soat ochlik, kechki ovqatda yog'li taomlar iste'mol qilmaslik.",
    active: true,
  },
  {
    id: 'lab-7',
    code: 'LAB-301',
    name: "TSH (Tireotrop gormon)",
    category: 'Gormonlar',
    description: "Qalqonsimon bez faoliyatini boshqaruvchi asosiy gipofiz gormoni.",
    price: 85000,
    resultDurationDays: 1,
    resultDurationText: "1 ish kuni",
    sampleType: "Venoz qon",
    preparation: "Ertalab soat 10:00 gacha, jismoniy va hissiy tinch holatda topshiriladi.",
    active: true,
    popular: true,
  },
  {
    id: 'lab-8',
    code: 'LAB-302',
    name: "Erkin T4 (Tiroksin erkin)",
    category: 'Gormonlar',
    description: "Qalqonsimon bezning asosiy biologik faol gormonlaridan biri.",
    price: 85000,
    resultDurationDays: 1,
    resultDurationText: "1 ish kuni",
    sampleType: "Venoz qon",
    preparation: "Och qoringa ertalab topshiriladi.",
    active: true,
  },
  {
    id: 'lab-9',
    code: 'LAB-401',
    name: "Koagulogramma (Qon ivish tizimi tahlili)",
    category: 'Umumiy tahlillar',
    description: "Protrombin vaqti, MNO, PTI, Fibrinogen, APTTV. Operatsiyadan oldingi muhim ko'rsatkich.",
    price: 150000,
    resultDurationDays: 1,
    resultDurationText: "1 ish kuni",
    sampleType: "Venoz qon",
    preparation: "Och qoringa topshirish shart.",
    active: true,
  },
  {
    id: 'lab-10',
    code: 'LAB-501',
    name: "Vitamin D (25-OH Vitamin D umumiy)",
    category: 'Vitaminlar',
    description: "Suyaklar mustahkamligi, immunitet va gormonal muvozanat uchun zarur D vitamini darajasi.",
    price: 180000,
    resultDurationDays: 1,
    resultDurationText: "1-2 ish kuni",
    sampleType: "Venoz qon",
    preparation: "Och qoringa topshirish, tahlildan 3 kun oldin vitamin dori vositasini to'xtatish maqsadga muvofiq.",
    active: true,
    popular: true,
  },
  {
    id: 'lab-11',
    code: 'LAB-502',
    name: "Ferritin (Temir zaxirasi)",
    category: 'Vitaminlar',
    description: "Yashirin temir tanqisligi anemiyasini aniqlash bo'yicha eng aniq laboratoriya ko'rsatkichi.",
    price: 95000,
    resultDurationDays: 1,
    resultDurationText: "1 ish kuni",
    sampleType: "Venoz qon",
    preparation: "Ertalab och qoringa.",
    active: true,
    popular: true,
  },
  {
    id: 'lab-12',
    code: 'LAB-601',
    name: "Gepatit B (HBsAg ekspress va IFA)",
    category: 'Infeksiya testlari',
    description: "Virusli gepatit B yuzaki antigenini aniqlash.",
    price: 75000,
    resultDurationDays: 1,
    resultDurationText: "1 ish kuni",
    sampleType: "Venoz qon",
    preparation: "Och qoringa topshirish tavsiya qilinadi.",
    active: true,
  },
  {
    id: 'lab-13',
    code: 'LAB-602',
    name: "Gepatit C (Anti-HCV antitanalar)",
    category: 'Infeksiya testlari',
    description: "Gepatit C virusiga nisbatan hosil bo'lgan antitanalarni tekshirish.",
    price: 75000,
    resultDurationDays: 1,
    resultDurationText: "1 ish kuni",
    sampleType: "Venoz qon",
    preparation: "Och qoringa topshirish.",
    active: true,
  },
  {
    id: 'lab-14',
    code: 'LAB-701',
    name: "C-reaktiv oqsil (SRO yuqori sezuvchanlik)",
    category: 'Immunologiya',
    description: "Organizmda o'tkir yallig'lanish va bakterial jarayonlarni erta ko'rsatuvchi oqsil.",
    price: 60000,
    resultDurationDays: 1,
    resultDurationText: "1 ish kuni",
    sampleType: "Venoz qon",
    preparation: "Standart och qoringa.",
    active: true,
  },
  {
    id: 'lab-15',
    code: 'LAB-702',
    name: "Umumiy IgE (Allergiya indikatori)",
    category: 'Immunologiya',
    description: "Allergik reaksiyalar va atopik kasalliklar moyilligini baholash.",
    price: 90000,
    resultDurationDays: 1,
    resultDurationText: "1-2 ish kuni",
    sampleType: "Venoz qon",
    preparation: "Tahlildan oldin spirtli ichimliklar va tamakidan tiyilish.",
    active: true,
  }
];

const initialMSCT: MSCTService[] = [
  {
    id: 'msct-1',
    name: "Bosh miya MSCT tekshiruvi",
    slug: 'bosh-miya-msct',
    category: 'Nevrologik MSCT',
    description: "Bosh suyagi, miya to'qimalari, qon quyilishlar, insult belgilari va o'smalarni yuqori aniqlikdagi 128 qatlamli kesmalarda ko'rish.",
    price: 450000,
    durationMinutes: 15,
    preparation: "Bosh sohasidagi barcha metall buyumlar (sirg'a, to'g'nog'ich, ko'zoynak) yechiladi. Kontrastsiz holatda maxsus ochlik shart emas.",
    contrastAvailable: true,
    contrastDetails: "Zarurat bo'lsa kontrast vosita qo'llaniladi (kreatinin tahlili talab etiladi, qo'shimcha to'lov).",
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=600',
    active: true,
    popular: true,
  },
  {
    id: 'msct-2',
    name: "Ko‘krak qafasi MSCT tekshiruvi (O'pka va ko'ks oralig'i)",
    slug: 'kokrak-qafasi-msct',
    category: 'Torakal MSCT',
    description: "O'pka to'qimasi, bronxlar, pnevmoniya, fibroziya, tugunchalar va ko'ks oralig'i a'zolarini 0.5 mm gacha bo'lgan qatlamda skanerlash.",
    price: 500000,
    durationMinutes: 15,
    preparation: "Erkin qulay kiyimda kelish. Nafasni qisqa muddatga ushlab turish bo'yicha ko'rsatma beriladi.",
    contrastAvailable: true,
    contrastDetails: "Tomir patologiyalari va o'smalarni farqlashda kontrast kiritiladi.",
    image: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=600',
    active: true,
    popular: true,
  },
  {
    id: 'msct-3',
    name: "Qorin bo‘shlig‘i va retroperitoneal soha MSCT",
    slug: 'qorin-boshligi-msct',
    category: 'Abdominal MSCT',
    description: "Jigar, oshqozon osti bezi, taloq, buyraklar va buyrak usti bezlarining 3D vizualizatsiyasi.",
    price: 550000,
    durationMinutes: 25,
    preparation: "Tekshiruvdan 4-6 soat oldin ovqatlanmaslik. Ichaklarni maxsus tayyorlash talab etilishi mumkin.",
    contrastAvailable: true,
    contrastDetails: "Qorin a'zolari diagnostikasida ko'pincha vena ichiga kontrast yuboriladi.",
    active: true,
    popular: true,
  },
  {
    id: 'msct-4',
    name: "Umurtqa pog‘onasi MSCT (Bo'yin, ko'krak yoki bel sohasi)",
    slug: 'umurtqa-pogona-msct',
    category: 'Ortopedik MSCT',
    description: "Umurtqa suyaklari, churralar, travmalar va suyak zichligi patologiyalarini batafsil tahlil qilish.",
    price: 480000,
    durationMinutes: 20,
    preparation: "Tegishli sohadagi metall bezaklarni yechish.",
    contrastAvailable: false,
    contrastDetails: "Ko'pincha kontrastsiz o'tkaziladi.",
    active: true,
  },
  {
    id: 'msct-5',
    name: "Burun yondosh bo'shliqlari MSCT (Gaymor bo'shliqlari)",
    slug: 'burun-boshliqlari-msct',
    category: 'LOR MSCT',
    description: "Gaymorit, etmoidit, poliplar va burun to'sig'i anatomik defektlarini aniq belgilash.",
    price: 420000,
    durationMinutes: 10,
    preparation: "Metall buyumlarni olib qo'yish kifoya.",
    contrastAvailable: false,
    contrastDetails: "Oddiy rejimda o'tkaziladi.",
    active: true,
    popular: true,
  },
  {
    id: 'msct-6',
    name: "Kichik chanoq a'zolari MSCT",
    slug: 'kichik-chanoq-msct',
    category: 'Abdominal MSCT',
    description: "Quviq, prostata, bachadon va tuxumdonlar, shuningdek chanoq suyaklari tuzilishi.",
    price: 520000,
    durationMinutes: 20,
    preparation: "Siydik pufagi o'rtacha to'ldirilgan bo'lishi maqsadga muvofiq.",
    contrastAvailable: true,
    contrastDetails: "Kontrast vosita shifokor ko'rsatmasiga binoan qo'llanadi.",
    active: true,
  },
  {
    id: 'msct-7',
    name: "Bosh miya va bo'yin tomirlari MSCT angiografiyasi",
    slug: 'msct-angiografiya',
    category: 'Vaskulyar MSCT',
    description: "Anevrizmalar, tomir torayishi (stenoz) va qon aylanish buzilishlarini kontrastli 3D modellashtirish.",
    price: 900000,
    durationMinutes: 30,
    preparation: "Oxirgi 10 kun ichidagi qon kreatinin tahlili, 4 soatlik ochlik.",
    contrastAvailable: true,
    contrastDetails: "Vena ichiga kontrast vositasi kiritilishi majburiy.",
    active: true,
  },
  {
    id: 'msct-8',
    name: "Yirik bo'g'imlar MSCT tekshiruvi (Tizza yoki son bo'g'imi)",
    slug: 'bogimlar-msct',
    category: 'Ortopedik MSCT',
    description: "Sinishlar, osteoxondroz, artroz va bo'g'im yuzalarining mikrotravmalari tahlili.",
    price: 450000,
    durationMinutes: 15,
    preparation: "Maxsus tayyorgarlik talab etilmaydi.",
    contrastAvailable: false,
    contrastDetails: "Ko'pincha kontrastsiz amalga oshiriladi.",
    active: true,
  }
];

const initialPromotions: Promotion[] = [
  {
    id: 'promo-1',
    title: "MSCT tekshiruviga 20% maxsus chegirma",
    slug: 'msct-20-chegirma',
    subtitle: "Zamonaviy 128 qatlamli tomografda xavfsiz va aniq tekshiruv",
    description: "Bosh miya, o'pka yoki umurtqa pog'onasi MSCT diagnostikasidan 20% chegirma bilan o'ting. Natijalar va shifokor-radiolog xulosasi 2 soat ichida beriladi.",
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800',
    discountPercent: 20,
    startDate: '2026-09-01',
    endDate: '2026-10-31',
    ctaText: "Qabulga yozilish",
    ctaLink: "/booking?service=msct-1",
    active: true,
    badge: "Ommabop taklif",
  },
  {
    id: 'promo-2',
    title: "Laboratoriya Check-up: 30+ turdagi tahlillar to'plami",
    slug: 'laboratoriya-check-up',
    subtitle: "Organizmni to'liq baholash uchun kengaytirilgan profilaktika",
    description: "Umumiy qon, jigar va buyrak sinamalari, qondagi qand, lipid profili va qalqonsimon bez gormonlari birgalikda 30% tejash imkoniyati bilan.",
    image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=800',
    discountPercent: 30,
    startDate: '2026-09-15',
    endDate: '2026-11-15',
    ctaText: "Check-upga yozilish",
    ctaLink: "/booking?type=lab",
    active: true,
    badge: "Kengaytirilgan paket",
  },
  {
    id: 'promo-3',
    title: "Bosh jarroh ko'rigi — Rejalashtirilgan operatsiyalarga 15% chegirma",
    slug: 'jarrohlik-konsultatsiyasi-chegirma',
    subtitle: "Laparoskopik operatsiyalar bo'yicha yetakchi jarroh qabuli",
    description: "O't qopi toshlari yoki churra operatsiyasini rejalashtirayotgan bemorlar uchun birlamchi konsultatsiya va operatsiya to'loviga 15% chegirma.",
    image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=800',
    discountPercent: 15,
    startDate: '2026-09-10',
    endDate: '2026-10-25',
    ctaText: "Jarrohga yozilish",
    ctaLink: "/booking?doctor=doc-1",
    active: true,
    badge: "Cheklangan vaqt",
  },
  {
    id: 'promo-4',
    title: "Kompleks LOR tekshiruvi: Videoendoskopiya + Konsultatsiya",
    slug: 'lor-kompleks-tekshiruvi',
    subtitle: "Bolalar va kattalar uchun kuzgi nafas yo'llari tekshiruvi",
    description: "Surunkali gaymorit, tonzillit va adenoidlarni aniq videokamera nazorati ostida tekshiring va shifokor maslahatini oling.",
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800',
    discountPercent: 25,
    startDate: '2026-09-20',
    endDate: '2026-11-05',
    ctaText: "LORga yozilish",
    ctaLink: "/booking?doctor=doc-2",
    active: true,
    badge: "Kuzgi aksiya",
  },
  {
    id: 'promo-5',
    title: "Tishlarni professional gigiyenik tozalash: 2 tadan ortiq odamga 25% chegirma",
    slug: 'stomatologiya-oila-aksiyasi',
    subtitle: "Oila a'zolaringiz bilan birgalikda sog'lom tabassumga ega bo'ling",
    description: "Ultratovushli Air-Flow tozalash va minerallashtiruvchi flüor lak qoplami birga taqdim etiladi.",
    image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=800',
    discountPercent: 25,
    startDate: '2026-09-01',
    endDate: '2026-12-31',
    ctaText: "Stomatologga yozilish",
    ctaLink: "/booking?doctor=doc-6",
    active: true,
  }
];

const initialAdvertisements: Advertisement[] = [
  {
    id: 'ad-1',
    title: "Yangi 128 qatlamli MSCT diagnostikasi ishga tushdi!",
    subtitle: "Bemorlar uchun minimal nurlanish va maksimal aniqlikdagi tasvirlar.",
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=1200',
    buttonText: "MSCT haqida batafsil",
    buttonUrl: "/msct",
    placement: 'home_hero',
    startDate: '2026-09-01',
    endDate: '2026-12-31',
    active: true,
    priority: 1,
  },
  {
    id: 'ad-2',
    title: "Organizm salomatligi uchun Kengaytirilgan Check-Up",
    subtitle: "Bir kunda barcha asosiy a'zolar holatini tekshirib oling.",
    image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=1200',
    buttonText: "Check-up paketlarini ko'rish",
    buttonUrl: "/laboratory",
    placement: 'home_banner',
    startDate: '2026-09-01',
    endDate: '2026-11-30',
    active: true,
    priority: 2,
  },
  {
    id: 'ad-3',
    title: "Laparoskopik kam invaziv jarrohlik — tezroq sog'ayish",
    subtitle: "Kichik kesmalar orqali asoratsiz operatsiyalar va 2 kunda uyga qaytish imkoniyati.",
    image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=800',
    buttonText: "Jarrohlik bo'limi",
    buttonUrl: "/surgery",
    placement: 'services_page',
    startDate: '2026-09-01',
    endDate: '2026-12-31',
    active: true,
    priority: 3,
  },
  {
    id: 'ad-4',
    title: "MSCT natijalari 2 soatda tayyor!",
    subtitle: "CD disk va plyonkada 3D rekonstruksiyalar taqdim etiladi.",
    image: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=800',
    buttonText: "MSCT qabuliga yozilish",
    buttonUrl: "/booking?service=msct-1",
    placement: 'msct_page',
    startDate: '2026-09-01',
    endDate: '2026-12-31',
    active: true,
    priority: 1,
  },
  {
    id: 'ad-5',
    title: "Laboratoriya natijalarini Telegram orqali olish",
    subtitle: "Klinikaga qayta kelish shart emas — barcha tahlil natijalari bot orqali yuboriladi.",
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800',
    buttonText: "Laboratoriya xizmatlari",
    buttonUrl: "/laboratory",
    placement: 'laboratory_page',
    startDate: '2026-09-01',
    endDate: '2026-12-31',
    active: true,
    priority: 2,
  },
  {
    id: 'ad-6',
    title: "Kuzgi salomatlik tekshiruvi: 20% gacha tejab qoling!",
    subtitle: "MEDCARE klinikasida barcha tekshiruvlar va mutaxassis ko'rigi uchun onlayn qabul ochiq.",
    image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=800',
    buttonText: "Qabulga yozilish",
    buttonUrl: "/booking",
    placement: 'popup',
    startDate: '2026-09-01',
    endDate: '2026-10-31',
    active: true,
    priority: 1,
  }
];

const initialNews: NewsArticle[] = [
  {
    id: 'news-1',
    title: "MEDCARE klinikasida Germaniyaning eng so'nggi 128 qatlamli MSCT tomografi o'rnatildi",
    slug: 'yangi-msct-tomografi-ornatildi',
    coverImage: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800',
    summary: "Markazimizda o'rnatilgan yangi avlod MSCT apparati nafaqat tekshiruv vaqtini qisqartiradi, balki bemorga nurlanish dozasini 60% gacha kamaytiradi.",
    content: "MEDCARE tibbiyot markazi o'zining diagnostika bo'limini zamonaviy 128 qatlamli kompyuter tomografi bilan boyitdi. Ushbu apparat orqali bosh miya qon tomirlari, yurak arteriyalari, ko'krak qafasi va qorin bo'shlig'i a'zolarini 0.5 millimetrgacha bo'lgan qalinlikda o'rganish mumkin. Tajribali radiologlarimiz har bir tekshiruv bo'yicha batafsil xulosa va 3D modellashtirishni taqdim etadilar.",
    category: "Diagnostika yangiliklari",
    author: "MEDCARE matbuot xizmati",
    publishedAt: "2026-09-18",
    seoTitle: "MEDCARE yangi 128 qatlamli MSCT apparati ishga tushdi",
    seoDescription: "Toshkentda zamonaviy MSCT tekshiruvi: yangi 128 qatlamli tomograf, xavfsiz nurlanish dozasi va tezkor xulosa.",
    active: true,
    views: 342,
  },
  {
    id: 'news-2',
    title: "Laparoskopik jarrohlikning an'anaviy operatsiyalardan qanday afzalliklari bor?",
    slug: 'laparoskopik-jarrohlik-afzalliklari',
    coverImage: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=800',
    summary: "Bosh jarroh Dr. Aliyev Anvar kam invaziv aralashuvlarning tez tiklanish davri va kosmetik natijalari haqida so'zlab beradi.",
    content: "An'anaviy ochiq operatsiyalarda katta kesmalar talab qilinib, bemorlar haftalab kasalxonada yotishga majbur bo'lardi. Laparoskopiya esa atigi 5-10 millimetrli teshiklar orqali mikro-kameralar yordamida o'tkaziladi. Bu operatsiyadan keyingi og'riqni sezilarli kamaytiradi, qon yo'qotishni minimallashtiradi va bemor 2 kundan so'ng normal hayotiga qaytishiga imkon beradi.",
    category: "Mutaxassis tavsiyasi",
    author: "Dr. Aliyev Anvar",
    publishedAt: "2026-09-12",
    seoTitle: "Laparoskopik jarrohlik afzalliklari - MEDCARE",
    seoDescription: "Kam invaziv jarrohlik nima, o't pufagi va churra operatsiyalari qanday o'tadi? Mutaxassis maqolasi.",
    active: true,
    views: 512,
  },
  {
    id: 'news-3',
    title: "Kuz-qish mavsumida LOR a'zolarini shamollashdan asrash sirlari",
    slug: 'kuz-mavsumida-lor-kasalliklarining-oldini-olish',
    coverImage: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800',
    summary: "Surunkali rinit va gaymorit qo'zg'almasligi uchun qanday profilaktika choralarini ko'rish zarur?",
    content: "Mavsumiy harorat o'zgarishi paytida immunitet pasayishi va virusli infeksiyalar ko'payadi. Dr. Dilnoza Karimova burun shilliq qavatini muntazam namlantirish, xona havosini toza saqlash va o'zboshimchalik bilan antibiotik yoki tomir toraytiruvchi tomchilar ishlatmaslikni tavsiya qiladi. Kasallikning dastlabki alomatlarida mutaxassisga murojaat qilish asoratlarning oldini oladi.",
    category: "Salomatlik maslahatlari",
    author: "Dr. Karimova Dilnoza",
    publishedAt: "2026-09-08",
    seoTitle: "Kuzda LOR kasalliklarini oldini olish bo'yicha shifokor maslahatlari",
    seoDescription: "Gaymorit, tonzillit va burun bitishiga qarshi profilaktika usullari.",
    active: true,
    views: 428,
  },
  {
    id: 'news-4',
    title: "Laboratoriya tahlillarini to'g'ri topshirish qoidalari: Natija aniqligi nimalarga bog'liq?",
    slug: 'laboratoriya-tahlillarini-togri-topshirish',
    coverImage: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=800',
    summary: "Och qoringa qon topshirish nima uchun muhim va qanday omillar tahlil natijalarini o'zgartirishi mumkin?",
    content: "Laboratoriya ko'rsatkichlarining haqqoniyligi nafaqat apparat sifatiga, balki bemorning tahlilga tayyorgarligiga ham bog'liq. Jigar fermentlari va qand tahlilidan oldin qahva yoki shirin choy ichish, jismoniy zo'riqish yoki kechki og'ir ovqatlanish ko'rsatkichlarni soxtalashtirishi mumkin. Laboratoriya mudiri Shahnoza Rahimova to'g'ri tayyorgarlik bo'yicha asosiy tavsiyalarni tushuntirib beradi.",
    category: "Laboratoriya",
    author: "Dr. Rahimova Shahnoza",
    publishedAt: "2026-09-03",
    seoTitle: "Qon tahlillariga tayyorgarlik qoidalari - MEDCARE laboratoriyasi",
    seoDescription: "Umumiy va biokimyoviy qon tahlillariga to'g'ri tayyorlanish tartibi.",
    active: true,
    views: 298,
  },
  {
    id: 'news-5',
    title: "Ko'rish qobiliyatini saqlash: Kompyuter oldida ishlovchilar uchun 20-20-20 qoidasi",
    slug: 'kompyuter-oldida-korishni-saqlash',
    coverImage: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=800',
    summary: "Ko'z quruqligi sindromi va ko'rish charchoqlarini kamaytirishning oddiy va samarali mashqlari.",
    content: "Zamonaviy hayotda ko'p vaqtimiz ekranlar qarshisida o'tadi. Oftalmolog Jamshid Soliyev har 20 daqiqada 20 soniya davomida 20 fut (taxminan 6 metr) uzoqlikdagi jismga qarash ko'z mushaklarini bo'shashtirishini ta'kidlaydi. Shuningdek, ko'z yosh pardasini tiklash uchun sun'iy yosh tomchilaridan foydalanish va yiliga kamida 1 marta ko'z tubini tekshirtirish zarur.",
    category: "Oftalmologiya",
    author: "Dr. Soliyev Jamshid",
    publishedAt: "2026-08-28",
    seoTitle: "Kompyuter oldida ko'zni asrash qoidalari - Oftalmolog maslahati",
    seoDescription: "Ekran oldida ishlaganda ko'z charchoqlari va quruqlikdan himoyalanish.",
    active: true,
    views: 375,
  },
  {
    id: 'news-6',
    title: "Klinikamizda onlayn qabul tizimi va bemorlar uchun shaxsiy qulayliklar yangilandi",
    slug: 'onlayn-qabul-tizimi-yangilandi',
    coverImage: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=800',
    summary: "Endi MEDCARE bemorlari istalgan vaqtda sayt orqali qulay vaqtni tanlab navbatsiz qabulga yozilishlari mumkin.",
    content: "Bemorlarimiz vaqtini qadrlagan holda yangilangan veb-platformamizni taqdim etamiz. Saytimiz orqali shifokorlarning ish jadvalini ko'rish, kerakli vaqt oralig'ini band qilish, narxlar bilan tanishish va AI yordamchi orqali barcha savollarga soniyalar ichida javob olish mumkin.",
    category: "Klinika hayoti",
    author: "MEDCARE ma'muriyati",
    publishedAt: "2026-08-20",
    seoTitle: "MEDCARE onlayn qabul tizimi ishga tushdi",
    seoDescription: "Navbatsiz, qulay va tezkor shifokor qabuliga onlayn yozilish.",
    active: true,
    views: 620,
  }
];

const initialPatients: Patient[] = [
  {
    id: 'pat-1',
    fullName: "Karimov Jasur Alisherovich",
    phone: "+998 90 111 22 33",
    email: "jasur.karimov@gmail.com",
    dateOfBirth: "1988-04-12",
    gender: "male",
    notes: "O't pufagida tosh aniqlangan, operatsiyaga tayyorgarlik.",
    appointmentsCount: 2,
    createdAt: "2026-08-15T10:00:00.000Z",
  },
  {
    id: 'pat-2',
    fullName: "Nazarova Malika Shavkatovna",
    phone: "+998 93 456 78 90",
    email: "malika.nazarova@mail.ru",
    dateOfBirth: "1994-09-25",
    gender: "female",
    notes: "Surunkali gaymorit, videoendoskopiya o'tkazilgan.",
    appointmentsCount: 3,
    createdAt: "2026-08-20T14:30:00.000Z",
  },
  {
    id: 'pat-3',
    fullName: "Xoliqov Temur Rustam o'g'li",
    phone: "+998 97 765 43 21",
    dateOfBirth: "1982-11-03",
    gender: "male",
    notes: "Bel umurtqasi churrasi bo'yicha MSCT qilingan.",
    appointmentsCount: 1,
    createdAt: "2026-09-01T09:15:00.000Z",
  },
  {
    id: 'pat-4',
    fullName: "Sultonova Nilufar Olimovna",
    phone: "+998 99 888 77 66",
    email: "nilufar.sultonova@yandex.com",
    dateOfBirth: "1991-03-18",
    gender: "female",
    notes: "Laboratoriya check-up va qalqonsimon bez ko'rigi.",
    appointmentsCount: 2,
    createdAt: "2026-09-05T11:45:00.000Z",
  },
  {
    id: 'pat-5',
    fullName: "Ahmedov Sardor Baxtiyorovich",
    phone: "+998 90 234 56 78",
    dateOfBirth: "1975-07-30",
    gender: "male",
    notes: "Ko'krak qafasi MSCT profilaktikasi.",
    appointmentsCount: 1,
    createdAt: "2026-09-10T16:00:00.000Z",
  },
  {
    id: 'pat-6',
    fullName: "Mirzayeva Umida Farhodovna",
    phone: "+998 91 333 44 55",
    dateOfBirth: "2000-02-14",
    gender: "female",
    notes: "Oftalmologiya tekshiruvi va linza tanlash.",
    appointmentsCount: 1,
    createdAt: "2026-09-14T10:30:00.000Z",
  },
  {
    id: 'pat-7',
    fullName: "Qodirov Bekzod Erkinovich",
    phone: "+998 94 555 66 77",
    dateOfBirth: "1989-12-05",
    gender: "male",
    notes: "Stomatologiya tish tozalash va nurli plomba.",
    appointmentsCount: 2,
    createdAt: "2026-09-18T13:20:00.000Z",
  },
  {
    id: 'pat-8',
    fullName: "Ismoilova Zarina Davronovna",
    phone: "+998 93 121 21 21",
    dateOfBirth: "1996-06-22",
    gender: "female",
    notes: "Qon tahlillari va gormonlar paneli.",
    appointmentsCount: 1,
    createdAt: "2026-09-22T08:40:00.000Z",
  },
  {
    id: 'pat-9',
    fullName: "Yusupov Farrux Tolibovich",
    phone: "+998 90 999 00 11",
    dateOfBirth: "1970-10-10",
    gender: "male",
    notes: "Churra plastikasi konsultatsiyasi.",
    appointmentsCount: 1,
    createdAt: "2026-09-24T15:10:00.000Z",
  },
  {
    id: 'pat-10',
    fullName: "Rasulova Madina Akmalovna",
    phone: "+998 95 444 33 22",
    dateOfBirth: "1998-08-08",
    gender: "female",
    notes: "LOR ko'rigi va eshitish tekshiruvi.",
    appointmentsCount: 1,
    createdAt: "2026-09-26T12:00:00.000Z",
  }
];

const initialAppointments: Appointment[] = [
  {
    id: 'apt-101',
    patientId: 'pat-1',
    patientName: "Karimov Jasur Alisherovich",
    phone: "+998 90 111 22 33",
    doctorId: 'doc-1',
    doctorName: 'Dr. Aliyev Anvar Rustamovich',
    specialty: 'Bosh jarroh, laparoskopist',
    serviceId: 'srv-1',
    serviceName: "Laparoskopik xoletsistektomiya",
    date: '2026-09-28',
    time: '10:00',
    comment: "Operatsiyadan oldingi yakuniy konsultatsiya va tahlillarni ko'rib chiqish",
    status: 'CONFIRMED',
    createdAt: '2026-09-25T09:30:00.000Z',
  },
  {
    id: 'apt-102',
    patientId: 'pat-2',
    patientName: "Nazarova Malika Shavkatovna",
    phone: "+998 93 456 78 90",
    doctorId: 'doc-2',
    doctorName: 'Dr. Karimova Dilnoza Sanjarovna',
    specialty: 'Otolaringolog (LOR shifokori)',
    serviceId: 'srv-5',
    serviceName: "Videoendoskopik LOR ko'rigi",
    date: '2026-09-28',
    time: '11:30',
    comment: "Burun bitishi va tomoqda qichishish shikoyati",
    status: 'NEW',
    createdAt: '2026-09-27T18:20:00.000Z',
  },
  {
    id: 'apt-103',
    patientId: 'pat-3',
    patientName: "Xoliqov Temur Rustam o'g'li",
    phone: "+998 97 765 43 21",
    doctorId: 'doc-3',
    doctorName: 'Dr. Usmanov Bobur Jamolovich',
    specialty: 'Radiolog, MSCT / KT bo‘limi boshlig‘i',
    serviceId: 'msct-4',
    serviceName: "Umurtqa pog‘onasi MSCT",
    date: '2026-09-28',
    time: '14:00',
    comment: "Bel sohasida o'tkir og'riqlar",
    status: 'CONFIRMED',
    createdAt: '2026-09-26T14:15:00.000Z',
  },
  {
    id: 'apt-104',
    patientId: 'pat-4',
    patientName: "Sultonova Nilufar Olimovna",
    phone: "+998 99 888 77 66",
    doctorId: 'doc-4',
    doctorName: 'Dr. Rahimova Shahnoza Baxtiyorovna',
    specialty: 'Klinik laborator diagnostika mudiri',
    serviceId: 'lab-3',
    serviceName: "Biokimyoviy qon tahlili",
    date: '2026-09-29',
    time: '09:00',
    comment: "Check-up natijalarini izohlash",
    status: 'CONFIRMED',
    createdAt: '2026-09-27T08:00:00.000Z',
  },
  {
    id: 'apt-105',
    patientId: 'pat-5',
    patientName: "Ahmedov Sardor Baxtiyorovich",
    phone: "+998 90 234 56 78",
    doctorId: 'doc-3',
    doctorName: 'Dr. Usmanov Bobur Jamolovich',
    specialty: 'Radiolog, MSCT / KT bo‘limi boshlig‘i',
    serviceId: 'msct-2',
    serviceName: "Ko‘krak qafasi MSCT tekshiruvi",
    date: '2026-09-29',
    time: '10:30',
    comment: "COVIDdan keyingi profilaktik tekshiruv",
    status: 'NEW',
    createdAt: '2026-09-27T21:10:00.000Z',
  },
  {
    id: 'apt-106',
    patientId: 'pat-6',
    patientName: "Mirzayeva Umida Farhodovna",
    phone: "+998 91 333 44 55",
    doctorId: 'doc-5',
    doctorName: 'Dr. Soliyev Jamshid Faxriddinovich',
    specialty: 'Oftalmolog-jarroh',
    serviceId: 'srv-8',
    serviceName: "Kompyuterli ko'z tekshiruvi",
    date: '2026-09-29',
    time: '13:00',
    comment: "Ko'z xiralashishi va bosh og'rig'i",
    status: 'CONFIRMED',
    createdAt: '2026-09-26T16:45:00.000Z',
  },
  {
    id: 'apt-107',
    patientId: 'pat-7',
    patientName: "Qodirov Bekzod Erkinovich",
    phone: "+998 94 555 66 77",
    doctorId: 'doc-6',
    doctorName: 'Dr. Toshmatova Ziyoda Otabekovna',
    specialty: 'Stomatolog-terapevt, ortoped',
    serviceId: 'srv-10',
    serviceName: "Tishlarni ultratovushli tozalash (Air-Flow)",
    date: '2026-09-30',
    time: '11:00',
    comment: "Rejali gigiyenik tozalash",
    status: 'CONFIRMED',
    createdAt: '2026-09-27T12:00:00.000Z',
  },
  {
    id: 'apt-108',
    patientId: 'pat-8',
    patientName: "Ismoilova Zarina Davronovna",
    phone: "+998 93 121 21 21",
    doctorId: 'doc-2',
    doctorName: 'Dr. Karimova Dilnoza Sanjarovna',
    specialty: 'Otolaringolog (LOR shifokori)',
    serviceId: 'srv-6',
    serviceName: "Gaymoritni kuku usulida apparatli yuvish",
    date: '2026-09-26',
    time: '15:00',
    comment: "Muolaja kursi yakunlandi",
    status: 'COMPLETED',
    createdAt: '2026-09-24T10:00:00.000Z',
  },
  {
    id: 'apt-109',
    patientId: 'pat-9',
    patientName: "Yusupov Farrux Tolibovich",
    phone: "+998 90 999 00 11",
    doctorId: 'doc-1',
    doctorName: 'Dr. Aliyev Anvar Rustamovich',
    specialty: 'Bosh jarroh, laparoskopist',
    serviceId: 'srv-4',
    serviceName: "Jarroh birlamchi konsultatsiyasi",
    date: '2026-09-27',
    time: '12:00',
    comment: "Vaqtni o'zgartirishni so'ragan edi",
    status: 'CANCELLED',
    createdAt: '2026-09-25T11:00:00.000Z',
  },
  {
    id: 'apt-110',
    patientId: 'pat-10',
    patientName: "Rasulova Madina Akmalovna",
    phone: "+998 95 444 33 22",
    doctorId: 'doc-6',
    doctorName: 'Dr. Toshmatova Ziyoda Otabekovna',
    specialty: 'Stomatolog-terapevt, ortoped',
    serviceId: 'srv-11',
    serviceName: "Nurli plomba bilan tish kariesini davolash",
    date: '2026-09-30',
    time: '16:00',
    comment: "Yuqori o'ng oziq tishda og'riq",
    status: 'NEW',
    createdAt: '2026-09-27T22:00:00.000Z',
  }
];

const initialContactMessages: ContactMessage[] = [
  {
    id: 'msg-1',
    name: "Shokirov Alimardon",
    phone: "+998 90 333 22 11",
    email: "alimardon@gmail.com",
    message: "Assalomu alaykum. Shanba kuni MSCT tekshiruvi uchun navbat bormi va oldindan qanday tayyorlanish kerak?",
    status: 'NEW',
    createdAt: "2026-09-27T17:30:00.000Z",
  },
  {
    id: 'msg-2',
    name: "Usmonova Gulnoza",
    phone: "+998 97 123 45 67",
    email: "gulnoza.u@mail.ru",
    message: "Bolalar uchun LOR ko'rigi necha yoshdan boshlab qabul qilinadi? Endoskopik tekshiruv og'riqlimi?",
    status: 'READ',
    createdAt: "2026-09-26T11:20:00.000Z",
  },
  {
    id: 'msg-3',
    name: "Bozorov Erkin",
    phone: "+998 93 888 99 00",
    message: "Operatsiyadan keyin statsionar xona sharoitlari va ovqatlanish haqida ma'lumot bersangiz.",
    status: 'ARCHIVED',
    createdAt: "2026-09-25T14:10:00.000Z",
  }
];

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DatabaseSchema {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      } catch (err) {
        console.error('Failed to parse database file, re-initializing seed data', err);
      }
    }

    // Initialize with seed data
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@medcare.uz';
    const adminPassword = process.env.ADMIN_PASSWORD || 'MedCareDemo2025!';
    const { hash, salt } = hashPassword(adminPassword);

    const initialData: DatabaseSchema = {
      settings: defaultSettings,
      adminUsers: [
        {
          id: 'admin-1',
          email: adminEmail,
          name: 'MEDCARE Bosh Administratori',
          role: 'superadmin',
          passwordHash: hash,
          salt: salt,
        },
      ],
      doctors: initialDoctors,
      services: initialServices,
      laboratory: initialLaboratory,
      msct: initialMSCT,
      promotions: initialPromotions,
      advertisements: initialAdvertisements,
      news: initialNews,
      patients: initialPatients,
      appointments: initialAppointments,
      contactMessages: initialContactMessages,
    };

    this.saveData(initialData);
    return initialData;
  }

  private saveData(data: DatabaseSchema): void {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
    this.data = data;
  }

  private persist(): void {
    this.saveData(this.data);
  }

  // Settings
  public getSettings(): ClinicSettings {
    return { ...this.data.settings };
  }

  public updateSettings(settings: Partial<ClinicSettings>): ClinicSettings {
    this.data.settings = { ...this.data.settings, ...settings };
    this.persist();
    return this.data.settings;
  }

  // Admin Auth
  public getAdminByEmail(email: string) {
    return this.data.adminUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public getAdminById(id: string) {
    return this.data.adminUsers.find((u) => u.id === id);
  }

  // Doctors
  public getDoctors(activeOnly = false): Doctor[] {
    if (activeOnly) {
      return this.data.doctors.filter((d) => d.active);
    }
    return [...this.data.doctors];
  }

  public getDoctorById(id: string): Doctor | undefined {
    return this.data.doctors.find((d) => d.id === id || d.slug === id);
  }

  public createDoctor(doctor: Omit<Doctor, 'id'>): Doctor {
    const newDoc: Doctor = {
      ...doctor,
      id: `doc-${Date.now()}`,
    };
    this.data.doctors.push(newDoc);
    this.persist();
    return newDoc;
  }

  public updateDoctor(id: string, updates: Partial<Doctor>): Doctor | null {
    const idx = this.data.doctors.findIndex((d) => d.id === id);
    if (idx === -1) return null;
    this.data.doctors[idx] = { ...this.data.doctors[idx], ...updates };
    this.persist();
    return this.data.doctors[idx];
  }

  public deleteDoctor(id: string): boolean {
    const lenBefore = this.data.doctors.length;
    this.data.doctors = this.data.doctors.filter((d) => d.id !== id);
    if (this.data.doctors.length !== lenBefore) {
      this.persist();
      return true;
    }
    return false;
  }

  // Services
  public getServices(activeOnly = false, category?: string): MedicalService[] {
    let list = this.data.services;
    if (activeOnly) list = list.filter((s) => s.active);
    if (category) list = list.filter((s) => s.category === category);
    return [...list];
  }

  public getServiceById(id: string): MedicalService | undefined {
    return this.data.services.find((s) => s.id === id || s.slug === id);
  }

  public createService(service: Omit<MedicalService, 'id'>): MedicalService {
    const newService: MedicalService = {
      ...service,
      id: `srv-${Date.now()}`,
    };
    this.data.services.push(newService);
    this.persist();
    return newService;
  }

  public updateService(id: string, updates: Partial<MedicalService>): MedicalService | null {
    const idx = this.data.services.findIndex((s) => s.id === id);
    if (idx === -1) return null;
    this.data.services[idx] = { ...this.data.services[idx], ...updates };
    this.persist();
    return this.data.services[idx];
  }

  public deleteService(id: string): boolean {
    const lenBefore = this.data.services.length;
    this.data.services = this.data.services.filter((s) => s.id !== id);
    if (this.data.services.length !== lenBefore) {
      this.persist();
      return true;
    }
    return false;
  }

  // Laboratory
  public getLaboratoryTests(activeOnly = false, category?: string): LaboratoryTest[] {
    let list = this.data.laboratory;
    if (activeOnly) list = list.filter((l) => l.active);
    if (category) list = list.filter((l) => l.category === category);
    return [...list];
  }

  public getLaboratoryTestById(id: string): LaboratoryTest | undefined {
    return this.data.laboratory.find((l) => l.id === id || l.code === id);
  }

  public createLaboratoryTest(test: Omit<LaboratoryTest, 'id'>): LaboratoryTest {
    const newTest: LaboratoryTest = {
      ...test,
      id: `lab-${Date.now()}`,
    };
    this.data.laboratory.push(newTest);
    this.persist();
    return newTest;
  }

  public updateLaboratoryTest(id: string, updates: Partial<LaboratoryTest>): LaboratoryTest | null {
    const idx = this.data.laboratory.findIndex((l) => l.id === id);
    if (idx === -1) return null;
    this.data.laboratory[idx] = { ...this.data.laboratory[idx], ...updates };
    this.persist();
    return this.data.laboratory[idx];
  }

  public deleteLaboratoryTest(id: string): boolean {
    const lenBefore = this.data.laboratory.length;
    this.data.laboratory = this.data.laboratory.filter((l) => l.id !== id);
    if (this.data.laboratory.length !== lenBefore) {
      this.persist();
      return true;
    }
    return false;
  }

  // MSCT
  public getMSCTServices(activeOnly = false): MSCTService[] {
    if (activeOnly) return this.data.msct.filter((m) => m.active);
    return [...this.data.msct];
  }

  public getMSCTServiceById(id: string): MSCTService | undefined {
    return this.data.msct.find((m) => m.id === id || m.slug === id);
  }

  public createMSCTService(service: Omit<MSCTService, 'id'>): MSCTService {
    const newService: MSCTService = {
      ...service,
      id: `msct-${Date.now()}`,
    };
    this.data.msct.push(newService);
    this.persist();
    return newService;
  }

  public updateMSCTService(id: string, updates: Partial<MSCTService>): MSCTService | null {
    const idx = this.data.msct.findIndex((m) => m.id === id);
    if (idx === -1) return null;
    this.data.msct[idx] = { ...this.data.msct[idx], ...updates };
    this.persist();
    return this.data.msct[idx];
  }

  public deleteMSCTService(id: string): boolean {
    const lenBefore = this.data.msct.length;
    this.data.msct = this.data.msct.filter((m) => m.id !== id);
    if (this.data.msct.length !== lenBefore) {
      this.persist();
      return true;
    }
    return false;
  }

  // Promotions
  public getPromotions(activeOnly = false): Promotion[] {
    const nowStr = new Date().toISOString().split('T')[0];
    if (activeOnly) {
      return this.data.promotions.filter(
        (p) => p.active && p.startDate <= nowStr && p.endDate >= nowStr
      );
    }
    return [...this.data.promotions];
  }

  public getPromotionById(id: string): Promotion | undefined {
    return this.data.promotions.find((p) => p.id === id || p.slug === id);
  }

  public createPromotion(promo: Omit<Promotion, 'id'>): Promotion {
    const newPromo: Promotion = {
      ...promo,
      id: `promo-${Date.now()}`,
    };
    this.data.promotions.push(newPromo);
    this.persist();
    return newPromo;
  }

  public updatePromotion(id: string, updates: Partial<Promotion>): Promotion | null {
    const idx = this.data.promotions.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    this.data.promotions[idx] = { ...this.data.promotions[idx], ...updates };
    this.persist();
    return this.data.promotions[idx];
  }

  public deletePromotion(id: string): boolean {
    const lenBefore = this.data.promotions.length;
    this.data.promotions = this.data.promotions.filter((p) => p.id !== id);
    if (this.data.promotions.length !== lenBefore) {
      this.persist();
      return true;
    }
    return false;
  }

  // Advertisements
  public getAdvertisements(placement?: string, activeOnly = false): Advertisement[] {
    const nowStr = new Date().toISOString().split('T')[0];
    let list = this.data.advertisements;
    if (activeOnly) {
      list = list.filter((a) => a.active && a.startDate <= nowStr && a.endDate >= nowStr);
    }
    if (placement) {
      list = list.filter((a) => a.placement === placement);
    }
    return list.sort((a, b) => a.priority - b.priority);
  }

  public createAdvertisement(ad: Omit<Advertisement, 'id'>): Advertisement {
    const newAd: Advertisement = {
      ...ad,
      id: `ad-${Date.now()}`,
    };
    this.data.advertisements.push(newAd);
    this.persist();
    return newAd;
  }

  public updateAdvertisement(id: string, updates: Partial<Advertisement>): Advertisement | null {
    const idx = this.data.advertisements.findIndex((a) => a.id === id);
    if (idx === -1) return null;
    this.data.advertisements[idx] = { ...this.data.advertisements[idx], ...updates };
    this.persist();
    return this.data.advertisements[idx];
  }

  public deleteAdvertisement(id: string): boolean {
    const lenBefore = this.data.advertisements.length;
    this.data.advertisements = this.data.advertisements.filter((a) => a.id !== id);
    if (this.data.advertisements.length !== lenBefore) {
      this.persist();
      return true;
    }
    return false;
  }

  // News
  public getNews(activeOnly = false): NewsArticle[] {
    let list = this.data.news;
    if (activeOnly) list = list.filter((n) => n.active);
    return [...list].sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }

  public getNewsById(id: string): NewsArticle | undefined {
    return this.data.news.find((n) => n.id === id || n.slug === id);
  }

  public createNews(article: Omit<NewsArticle, 'id' | 'views'>): NewsArticle {
    const newArticle: NewsArticle = {
      ...article,
      id: `news-${Date.now()}`,
      views: 0,
    };
    this.data.news.unshift(newArticle);
    this.persist();
    return newArticle;
  }

  public updateNews(id: string, updates: Partial<NewsArticle>): NewsArticle | null {
    const idx = this.data.news.findIndex((n) => n.id === id);
    if (idx === -1) return null;
    this.data.news[idx] = { ...this.data.news[idx], ...updates };
    this.persist();
    return this.data.news[idx];
  }

  public incrementNewsViews(id: string): void {
    const article = this.data.news.find((n) => n.id === id || n.slug === id);
    if (article) {
      article.views = (article.views || 0) + 1;
      this.persist();
    }
  }

  public deleteNews(id: string): boolean {
    const lenBefore = this.data.news.length;
    this.data.news = this.data.news.filter((n) => n.id !== id);
    if (this.data.news.length !== lenBefore) {
      this.persist();
      return true;
    }
    return false;
  }

  // Patients
  public getPatients(): Patient[] {
    return [...this.data.patients].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public getPatientById(id: string): Patient | undefined {
    return this.data.patients.find((p) => p.id === id);
  }

  public findOrCreatePatient(fullName: string, phone: string): Patient {
    const cleanPhone = phone.replace(/\s+/g, '');
    let existing = this.data.patients.find(
      (p) => p.phone.replace(/\s+/g, '') === cleanPhone
    );
    if (existing) {
      existing.appointmentsCount = (existing.appointmentsCount || 0) + 1;
      this.persist();
      return existing;
    }
    const newPat: Patient = {
      id: `pat-${Date.now()}`,
      fullName,
      phone,
      appointmentsCount: 1,
      createdAt: new Date().toISOString(),
    };
    this.data.patients.unshift(newPat);
    this.persist();
    return newPat;
  }

  public updatePatient(id: string, updates: Partial<Patient>): Patient | null {
    const idx = this.data.patients.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    this.data.patients[idx] = { ...this.data.patients[idx], ...updates };
    this.persist();
    return this.data.patients[idx];
  }

  public deletePatient(id: string): boolean {
    const lenBefore = this.data.patients.length;
    this.data.patients = this.data.patients.filter((p) => p.id !== id);
    if (this.data.patients.length !== lenBefore) {
      this.persist();
      return true;
    }
    return false;
  }

  // Appointments
  public getAppointments(filter?: {
    doctorId?: string;
    date?: string;
    status?: AppointmentStatus;
  }): Appointment[] {
    let list = this.data.appointments;
    if (filter?.doctorId) list = list.filter((a) => a.doctorId === filter.doctorId);
    if (filter?.date) list = list.filter((a) => a.date === filter.date);
    if (filter?.status) list = list.filter((a) => a.status === filter.status);
    return [...list].sort(
      (a, b) => new Date(`${b.date}T${b.time}`).getTime() - new Date(`${a.date}T${a.time}`).getTime()
    );
  }

  public getAppointmentById(id: string): Appointment | undefined {
    return this.data.appointments.find((a) => a.id === id);
  }

  public isSlotAvailable(doctorId: string, date: string, time: string, excludeId?: string): boolean {
    const conflict = this.data.appointments.find(
      (a) =>
        a.doctorId === doctorId &&
        a.date === date &&
        a.time === time &&
        a.status !== 'CANCELLED' &&
        a.id !== excludeId
    );
    return !conflict;
  }

  public getAvailableSlots(doctorId: string, date: string): string[] {
    const doctor = this.getDoctorById(doctorId);
    if (!doctor) return [];

    // All standard clinic slots from 09:00 to 18:00 (every 30 mins)
    const allSlots = [
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
      '16:00', '16:30', '17:00', '17:30'
    ];

    const bookedSlots = this.data.appointments
      .filter((a) => a.doctorId === doctorId && a.date === date && a.status !== 'CANCELLED')
      .map((a) => a.time);

    return allSlots.filter((slot) => !bookedSlots.includes(slot));
  }

  public createAppointment(data: {
    fullName: string;
    phone: string;
    doctorId: string;
    serviceId?: string;
    date: string;
    time: string;
    comment?: string;
  }): Appointment {
    // Validate slot availability
    if (!this.isSlotAvailable(data.doctorId, data.date, data.time)) {
      throw new Error("Kechirasiz, tanlangan sana va vaqt boshqa bemor tomonidan band qilingan.");
    }

    const doctor = this.getDoctorById(data.doctorId);
    if (!doctor) throw new Error("Shifokor topilmadi.");

    let serviceName = undefined;
    if (data.serviceId) {
      const srv = this.getServiceById(data.serviceId) || this.getMSCTServiceById(data.serviceId);
      if (srv) serviceName = srv.name;
    }

    const patient = this.findOrCreatePatient(data.fullName, data.phone);

    const newApt: Appointment = {
      id: `apt-${Date.now()}`,
      patientId: patient.id,
      patientName: patient.fullName,
      phone: patient.phone,
      doctorId: doctor.id,
      doctorName: doctor.name,
      specialty: doctor.specialty,
      serviceId: data.serviceId,
      serviceName: serviceName,
      date: data.date,
      time: data.time,
      comment: data.comment,
      status: 'NEW',
      createdAt: new Date().toISOString(),
    };

    this.data.appointments.unshift(newApt);
    this.persist();
    return newApt;
  }

  public updateAppointmentStatus(id: string, status: AppointmentStatus, notes?: string): Appointment | null {
    const apt = this.data.appointments.find((a) => a.id === id);
    if (!apt) return null;
    apt.status = status;
    if (notes !== undefined) apt.notes = notes;
    this.persist();
    return apt;
  }

  public updateAppointment(id: string, updates: Partial<Appointment>): Appointment | null {
    const idx = this.data.appointments.findIndex((a) => a.id === id);
    if (idx === -1) return null;
    this.data.appointments[idx] = { ...this.data.appointments[idx], ...updates };
    this.persist();
    return this.data.appointments[idx];
  }

  public deleteAppointment(id: string): boolean {
    const lenBefore = this.data.appointments.length;
    this.data.appointments = this.data.appointments.filter((a) => a.id !== id);
    if (this.data.appointments.length !== lenBefore) {
      this.persist();
      return true;
    }
    return false;
  }

  // Contact Messages
  public getContactMessages(): ContactMessage[] {
    return [...this.data.contactMessages].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public createContactMessage(msg: Omit<ContactMessage, 'id' | 'status' | 'createdAt'>): ContactMessage {
    const newMsg: ContactMessage = {
      ...msg,
      id: `msg-${Date.now()}`,
      status: 'NEW',
      createdAt: new Date().toISOString(),
    };
    this.data.contactMessages.unshift(newMsg);
    this.persist();
    return newMsg;
  }

  public updateContactMessageStatus(id: string, status: 'NEW' | 'READ' | 'ARCHIVED'): ContactMessage | null {
    const msg = this.data.contactMessages.find((m) => m.id === id);
    if (!msg) return null;
    msg.status = status;
    this.persist();
    return msg;
  }

  public deleteContactMessage(id: string): boolean {
    const lenBefore = this.data.contactMessages.length;
    this.data.contactMessages = this.data.contactMessages.filter((m) => m.id !== id);
    if (this.data.contactMessages.length !== lenBefore) {
      this.persist();
      return true;
    }
    return false;
  }

  // Dashboard Analytics
  public getDashboardStats(): DashboardStats {
    const todayStr = new Date().toISOString().split('T')[0];

    const todayAppointments = this.data.appointments.filter((a) => a.date === todayStr);
    const newRequests = this.data.appointments.filter((a) => a.status === 'NEW');
    const unreadMessages = this.data.contactMessages.filter((m) => m.status === 'NEW');

    const statusesCount: Record<AppointmentStatus, number> = {
      NEW: 0,
      CONFIRMED: 0,
      COMPLETED: 0,
      CANCELLED: 0,
    };

    this.data.appointments.forEach((a) => {
      if (statusesCount[a.status] !== undefined) {
        statusesCount[a.status]++;
      }
    });

    const specialtyMap: Record<string, number> = {};
    this.data.appointments.forEach((a) => {
      const spec = a.specialty.split(',')[0].trim();
      specialtyMap[spec] = (specialtyMap[spec] || 0) + 1;
    });

    const appointmentsBySpecialty = Object.entries(specialtyMap).map(([specialty, count]) => ({
      specialty,
      count,
    }));

    // Group by date for last 7 dates
    const dateMap: Record<string, number> = {};
    this.data.appointments.forEach((a) => {
      dateMap[a.date] = (dateMap[a.date] || 0) + 1;
    });

    const appointmentsByDate = Object.entries(dateMap)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-7)
      .map(([date, count]) => ({ date, count }));

    return {
      todayAppointmentsCount: todayAppointments.length,
      newAppointmentRequests: newRequests.length,
      totalAppointmentsCount: this.data.appointments.length,
      activeDoctorsCount: this.data.doctors.filter((d) => d.active).length,
      activeServicesCount: this.data.services.filter((s) => s.active).length,
      activePromotionsCount: this.data.promotions.filter((p) => p.active).length,
      totalPatientsCount: this.data.patients.length,
      unreadContactMessages: unreadMessages.length,
      appointmentsByStatus: statusesCount,
      appointmentsBySpecialty,
      appointmentsByDate,
    };
  }

  // Global Search across doctors, services, lab, msct, promotions, news
  public globalSearch(query: string) {
    const q = query.toLowerCase().trim();
    if (!q) return { doctors: [], services: [], laboratory: [], msct: [], promotions: [], news: [] };

    const doctors = this.data.doctors
      .filter((d) => d.active && (d.name.toLowerCase().includes(q) || d.specialty.toLowerCase().includes(q)))
      .slice(0, 5);

    const services = this.data.services
      .filter((s) => s.active && (s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || s.categoryNameUz.toLowerCase().includes(q)))
      .slice(0, 5);

    const laboratory = this.data.laboratory
      .filter((l) => l.active && (l.name.toLowerCase().includes(q) || l.code.toLowerCase().includes(q) || l.category.toLowerCase().includes(q)))
      .slice(0, 5);

    const msct = this.data.msct
      .filter((m) => m.active && (m.name.toLowerCase().includes(q) || m.description.toLowerCase().includes(q) || m.category.toLowerCase().includes(q)))
      .slice(0, 5);

    const promotions = this.data.promotions
      .filter((p) => p.active && (p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)))
      .slice(0, 3);

    const news = this.data.news
      .filter((n) => n.active && (n.title.toLowerCase().includes(q) || n.summary.toLowerCase().includes(q)))
      .slice(0, 3);

    return { doctors, services, laboratory, msct, promotions, news };
  }
}

export const db = new Database();
