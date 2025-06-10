// src/api/restaurant.ts
import apiClient from './config'; // 假设您已经配置了 apiClient，并包含了 JWT token

import { SearchRestaurantDto } from '../types/restaurant'; // 导入餐厅搜索 DTO 类型
import { RestaurantDetail, RestaurantListItem } from '../types/restaurant'; // 导入餐厅详情和列表项类型

/**
 * @function getAllRestaurantsApi
 * @description 获取所有营业中的餐厅列表。
 * @returns {Promise<RestaurantListItem[]>} 餐厅列表数组。
 */
export const getAllRestaurantsApi = async (): Promise<RestaurantListItem[]> => {
  const response = await apiClient.get('/restaurants');
  return response.data;
};

/**
 * @function getRestaurantDetailsApi
 * @description 根据餐厅ID获取单个餐厅的详细信息及其可售菜单。
 * @param {number} restaurantId - 餐厅的唯一ID。
 * @returns {Promise<RestaurantDetail>} 餐厅详情对象。
 */
export const getRestaurantDetailsApi = async (restaurantId: number): Promise<RestaurantDetail> => {
  const response = await apiClient.get(`/restaurants/${restaurantId}`);
  return response.data;
};

/**
 * @function searchRestaurantsApi
 * @description 根据多种条件动态搜索餐厅列表，并支持分页。
 * @param {SearchRestaurantDto} queryParams - 包含搜索关键词、菜品分类、分页等信息的查询对象。
 * @returns {Promise<{data: RestaurantListItem[], total: number, page: number, pageSize: number}>}
 * 返回包含餐厅列表、总记录数和分页信息的对象。
 */
export const searchRestaurantsApi = async (queryParams: SearchRestaurantDto): Promise<{data: RestaurantListItem[], total: number, page: number, pageSize: number}> => {
  const response = await apiClient.get('/restaurants', { params: queryParams });
  return response.data;
};
