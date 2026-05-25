// Salesman Profile Service — localStorage mock backend

export interface SalesmanProfile {
  id: string;
  name: string;
  email: string;
  mobile: string;
  region: string;
  company: string;
  territory: string;
  experience: string;
  registered_at: string;
}

const SALESMAN_KEY = 'current_salesman_profile';

// Safe writer to avoid quota issues
const safeSetItem = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    console.warn('localStorage quota exceeded when saving salesman profile.');
  }
};

export const salesmanService = {
  /** Call this when the salesman submits their profile/registration form */
  saveSalesmanProfile: (data: Partial<SalesmanProfile>): SalesmanProfile => {
    const profile: SalesmanProfile = {
      id: data.id || Date.now().toString().slice(-6),
      name: data.name || '',
      email: data.email || '',
      mobile: data.mobile || '',
      region: data.region || '',
      company: data.company || '',
      territory: data.territory || '',
      experience: data.experience || '',
      registered_at: data.registered_at || new Date().toISOString(),
    };
    safeSetItem(SALESMAN_KEY, JSON.stringify(profile));
    return profile;
  },

  /** Read the currently-logged-in salesman profile from localStorage */
  getSalesmanProfile: (): SalesmanProfile | null => {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(SALESMAN_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as SalesmanProfile;
    } catch {
      return null;
    }
  },

  /** Clear the profile on logout */
  clearSalesmanProfile: () => {
    localStorage.removeItem(SALESMAN_KEY);
  },
};
