export interface User {
  photo: string;
  isBlocked: any;
  id_user: number;
  city: string;
  email: string;
  last_name1: string;
  last_name2?: string | null;
  last_password_change_at: Date;
  local_date_time?: Date | null;
  name: string;
  password: string;
  password2?: string | null;
  phone: string;
  postal_code: string;
  profile_photo?: string | null;
  street: string;
  username: string;
}

export interface UserLogin {
  username: string;
  password: string;
}

export interface UserSession {
  username: string;
  token: string;
  roles: string[];
}
