export interface User {
  id: string;
  username: string;
  phone_number: string;
  is_admin: boolean;
  created_at: string;
}

export interface PostingService {
  id: string;
  code: string;
  name: string;
  account: string;
  phone: string;
  price: number;
  status_type: 'secure' | 'less_secure';
  images: string[];
  additional_specs: string;
  status: 'pending' | 'approved';
  user_id?: string;
  created_at: string;
}

export interface SearchService {
  id: string;
  code: string;
  name: string;
  account: string;
  phone: string;
  price_min: number;
  price_max: number;
  specifications: string;
  status: 'pending' | 'approved';
  user_id?: string;
  created_at: string;
}

export interface Language {
  code: 'id' | 'en';
  name: string;
}

export interface Translations {
  [key: string]: {
    id: string;
    en: string;
  };
}

export const GAME_ACCOUNTS = [
  'All Accounts',
  'Free Fire',
  'Mobile Legend',
  'Efootball',
  'FC Mobile',
  'PUBG',
  'Roblox',
  'Genshin Impact',
  'Clash of Clans',
  'Other'
];