import api from './config';
import { Restaurant, RestaurantDetail, SearchRestaurantDto } from '../types/restaurant';

// 为了示例方便，这里的返回值类型稍微泛化，实际项目中可以更精确
export const getRestaurants = async (params?: SearchRestaurantDto): Promise<any> => {
  const response = await api.get('/restaurants', { params });
  return response.data;
};

export const getRestaurantDetails = async (id: number): Promise<RestaurantDetail> => {
  const response = await api.get(`/restaurants/${id}`);
  return response.data;
};