

import { LoginBodyType, LoginResType } from 'src/schemaValidations/auth.schema';
import http from 'src/services/http';

const authApiRequest = {
  login: (body: LoginBodyType) => http.post<LoginResType>('/auth/login', body)
};

export default authApiRequest;
