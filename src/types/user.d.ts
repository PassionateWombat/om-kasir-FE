export interface UserResponse {
  id: number;
  name: string;
  email: string;
  email_verified_at: string;
  premium_until: string;
  banned_at: string;
  ban_reason: string;
  profile_image: string;
  created_at: string;
  updated_at: string;
  roles: RoleResponse[];
}

export interface RoleResponse {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
}
