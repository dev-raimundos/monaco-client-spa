

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user_id: string;
  name: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  department: string;
  occupation: string;
  company: string;
  active: boolean;
  services: string[];
}
