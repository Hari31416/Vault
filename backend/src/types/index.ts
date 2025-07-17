import { Request } from "express";
import { IUser } from "../models/User";

export interface AuthRequest extends Request {
  user?: IUser;
}

export interface JWTPayload {
  id: string;
  username: string;
  email: string;
  role: string;
}
