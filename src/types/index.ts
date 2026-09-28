export type Language = 'uz' | 'ru' | 'en';

export type ServiceCategory = 
  | 'surgery'
  | 'ent'
  | 'msct'
  | 'laboratory'
  | 'ophthalmology'
  | 'dentistry'
  | 'cardiology'
  | 'neurology'
  | 'other';

export type LabCategory = 
  | 'Umumiy tahlillar'
  | 'Biokimyo'
  | 'Gormonlar'
  | 'Immunologiya'
  | 'Vitaminlar'
  | 'Infeksiya testlari'
  | 'Boshqa';

export type AppointmentStatus = 'NEW' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

export type AdPlacement = 
  | 'home_hero'
  | 'home_banner'
  | 'services_page'
  | 'msct_page'
  | 'laboratory_page'
  | 'sidebar'
  | 'popup';

export interface Doctor {
  id: string;
  name: string;
  slug: string;
  photo: string;
  specialty: string;
  specialtyKey: ServiceCategory;
  experienceYears: number;
  qualification: string;
  education: string;
  biography: string;
  services: string[];
  consultationPrice: number;
  workingDays: string[];
  workingHours: string;
  phone: string;
  telegram: string;
  rating: number;
  reviewsCount: number;
  active: boolean;
}

export interface MedicalService {
  id: string;
  name: string;
  slug: string;
  category: ServiceCategory;
  categoryNameUz: string;
  description: string;
  fullDetails?: string;
  price: number;
  durationMinutes: number;
  preparationInstructions: string;
  image?: string;
  active: boolean;
  popular?: boolean;
}

export interface LaboratoryTest {
  id: string;
  code: string;
  name: string;
  category: LabCategory;
  description: string;
  price: number;
  resultDurationDays: number;
  resultDurationText: string;
  sampleType: string;
  preparation: string;
  active: boolean;
  popular?: boolean;
}

export interface MSCTService {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  price: number;
  durationMinutes: number;
  preparation: string;
  contrastAvailable: boolean;
  contrastDetails: string;
  image?: string;
  active: boolean;
  popular?: boolean;
}

export interface Promotion {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  description: string;
  image: string;
  discountPercent: number;
  startDate: string;
  endDate: string;
  ctaText: string;
  ctaLink: string;
  active: boolean;
  badge?: string;
}

export interface Advertisement {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  buttonText: string;
  buttonUrl: string;
  placement: AdPlacement;
  startDate: string;
  endDate: string;
  active: boolean;
  priority: number;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  coverImage: string;
  summary: string;
  content: string;
  category: string;
  author: string;
  publishedAt: string;
  seoTitle: string;
  seoDescription: string;
  active: boolean;
  views: number;
}

export interface Patient {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  notes?: string;
  appointmentsCount: number;
  createdAt: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  phone: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  serviceId?: string;
  serviceName?: string;
  date: string;
  time: string;
  comment?: string;
  status: AppointmentStatus;
  createdAt: string;
  notes?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  email?: string;
  message: string;
  status: 'NEW' | 'READ' | 'ARCHIVED';
  createdAt: string;
}

export interface ClinicSettings {
  name: string;
  tagline: string;
  logo: string;
  phone: string;
  phoneSecondary: string;
  telegram: string;
  whatsapp: string;
  email: string;
  address: string;
  workingHoursWeekday: string;
  workingHoursWeekend: string;
  emergencyInfo: string;
  googleMapsEmbedUrl: string;
  googleMapsDirectionsUrl: string;
  instagram: string;
  facebook: string;
  telegramChannel: string;
  footerText: string;
  medicalDisclaimer: string;
  allowOnlineBooking: boolean;
  popupAdEnabled: boolean;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'superadmin' | 'admin' | 'doctor';
  token?: string;
}

export interface DashboardStats {
  todayAppointmentsCount: number;
  newAppointmentRequests: number;
  totalAppointmentsCount: number;
  activeDoctorsCount: number;
  activeServicesCount: number;
  activePromotionsCount: number;
  totalPatientsCount: number;
  unreadContactMessages: number;
  appointmentsByStatus: Record<AppointmentStatus, number>;
  appointmentsBySpecialty: { specialty: string; count: number }[];
  appointmentsByDate: { date: string; count: number }[];
}
