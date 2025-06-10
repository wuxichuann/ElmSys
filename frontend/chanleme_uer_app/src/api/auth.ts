import api from './config';
import { LoginDto, RegisterDto, User } from '../types/auth';

export const login = async (data: LoginDto): Promise<{ user: User; token: string }> => {
  const response = await api.post('/auth/login', data);
  return response.data;
};

export const register = async (data: RegisterDto): Promise<{ user: User; token: string }> => {
  const response = await api.post('/auth/register', data);
  return response.data;
};