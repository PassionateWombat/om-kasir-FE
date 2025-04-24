import { JwtPayload } from "jwt-decode";

export interface TokenData {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface TokenClaims extends JwtPayload {
  userId: string;
  scope: string;
  email: string;
  //   imageUrl: string;
}

export interface LoginResponse {
  status: number;
  message: string;
  data: TokenData;
}