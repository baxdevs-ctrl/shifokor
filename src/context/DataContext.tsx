import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  ClinicSettings,
  Doctor,
  MedicalService,
  LaboratoryTest,
  MSCTService,
  Promotion,
  Advertisement,
  NewsArticle,
} from '../types/index.ts';

interface DataContextType {
  settings: ClinicSettings | null;
  doctors: Doctor[];
  services: MedicalService[];
  laboratory: LaboratoryTest[];
  msct: MSCTService[];
  promotions: Promotion[];
  advertisements: Advertisement[];
  news: NewsArticle[];
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  updateSettingsState: (newSettings: ClinicSettings) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<ClinicSettings | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [services, setServices] = useState<MedicalService[]>([]);
  const [laboratory, setLaboratory] = useState<LaboratoryTest[]>([]);
  const [msct, setMsct] = useState<MSCTService[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        settingsRes,
        doctorsRes,
        servicesRes,
        labRes,
        msctRes,
        promosRes,
        adsRes,
        newsRes,
      ] = await Promise.all([
        fetch('/api/settings'),
        fetch('/api/doctors?all=true'),
        fetch('/api/services?all=true'),
        fetch('/api/laboratory?all=true'),
        fetch('/api/msct?all=true'),
        fetch('/api/promotions?all=true'),
        fetch('/api/advertisements?all=true'),
        fetch('/api/news?all=true'),
      ]);

      if (settingsRes.ok) setSettings(await settingsRes.json());
      if (doctorsRes.ok) setDoctors(await doctorsRes.json());
      if (servicesRes.ok) setServices(await servicesRes.json());
      if (labRes.ok) setLaboratory(await labRes.json());
      if (msctRes.ok) setMsct(await msctRes.json());
      if (promosRes.ok) setPromotions(await promosRes.json());
      if (adsRes.ok) setAdvertisements(await adsRes.json());
      if (newsRes.ok) setNews(await newsRes.json());
    } catch (err: any) {
      console.error('Error fetching clinic data:', err);
      setError(err.message || 'Maʼlumotlarni yuklashda xatolik');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateSettingsState = (newSettings: ClinicSettings) => {
    setSettings(newSettings);
  };

  return (
    <DataContext.Provider
      value={{
        settings,
        doctors,
        services,
        laboratory,
        msct,
        promotions,
        advertisements,
        news,
        loading,
        error,
        refreshData: fetchData,
        updateSettingsState,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
