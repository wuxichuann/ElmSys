// src/api/user.ts
import apiClient from './config'; // 假设您已经配置了 apiClient，并包含了 JWT token

import { UserProfile, UpdateUserProfileDto, ChangePasswordDto } from '../types/user';

/**
 * @function getUserProfileApi
 * @description 获取当前登录用户的个人资料。
 * @returns {Promise<UserProfile>} 用户个人资料对象。
 */
export const getUserProfileApi = async (): Promise<UserProfile> => {
  const response = await apiClient.get('/users/profile');
  return response.data;
};

/**
 * @function updateUserProfileApi
 * @description 更新当前登录用户的个人资料。
 * @param {UpdateUserProfileDto} data - 更新数据。
 * @returns {Promise<UserProfile>} 更新后的用户个人资料对象。
 */
export const updateUserProfileApi = async (data: UpdateUserProfileDto): Promise<UserProfile> => {
  const response = await apiClient.patch('/users/profile', data);
  return response.data.user; // 后端返回 { message, user }
};

/**
 * @function changePasswordApi
 * @description 修改当前登录用户的密码。
 * @param {ChangePasswordDto} data - 包含旧密码和新密码的数据。
 * @returns {Promise<void>}
 */
export const changePasswordApi = async (data: ChangePasswordDto): Promise<void> => {
  await apiClient.patch('/users/change-password', data);
};
