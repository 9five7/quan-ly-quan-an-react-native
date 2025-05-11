import AsyncStorage from "@react-native-async-storage/async-storage";
import { DishStatus } from "src/constants/type";

export const normalizePath = (path: string) => {
    return path.startsWith('/') ? path.slice(1) : path
  }
  const API_URL = 'http://192.168.0.100:4000'; // KHÔNG dùng localhost nếu test trên thiết bị thật

export const getValidImageUrl = (url: string) =>
  url.replace("localhost", "192.168.0.100");
  export const getAccessTokenFromStorage = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      return token;
    } catch (error) {
      console.error('Failed to get access token:', error);
      return null;
    }
  };
  
  export const getRefreshTokenFromStorage = async () => {
    try {
      const token = await AsyncStorage.getItem('refreshToken');
      return token;
    } catch (error) {
      console.error('Failed to get refresh token:', error);
      return null;
    }
  };
  export const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
  }
  export const getVietnameseDishStatus = (status: (typeof DishStatus)[keyof typeof DishStatus]) => {
  switch (status) {
    case DishStatus.Available:
      return 'Có sẵn'
    case DishStatus.Unavailable:
      return 'Không có sẵn'
    default:
      return 'Ẩn'
  }
}