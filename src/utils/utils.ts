import AsyncStorage from "@react-native-async-storage/async-storage";

export const normalizePath = (path: string) => {
    return path.startsWith('/') ? path.slice(1) : path
  }
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