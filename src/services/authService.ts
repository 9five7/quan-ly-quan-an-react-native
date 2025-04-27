import AsyncStorage from '@react-native-async-storage/async-storage';
import authApiRequest from 'src/apiRequests/auth';
import { LoginBodyType } from 'src/schemaValidations/auth.schema';

export const loginService = async (body: LoginBodyType) => {
  const { payload } = await authApiRequest.login(body);
  const { accessToken, refreshToken } = payload.data;

  await AsyncStorage.setItem('accessToken', accessToken);
  await AsyncStorage.setItem('refreshToken', refreshToken);

  return payload;
};

export const logoutService = async () => {
  await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
};
