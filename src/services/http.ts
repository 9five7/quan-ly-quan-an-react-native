// src/services/http.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LoginResType } from "src/schemaValidations/auth.schema";
import { normalizePath } from "src/utils/utils";

const ENTITY_ERROR_STATUS = 422;
const AUTHENTICATION_ERROR_STATUS = 401;

export class HttpError extends Error {
  status: number;
  payload: { message: string; [key: string]: any };

  constructor({
    status,
    payload,
    message = "HTTP Error",
  }: {
    status: number;
    payload: any;
    message?: string;
  }) {
    super(message);
    this.status = status;
    this.payload = payload;
  }
}

export class EntityError extends HttpError {
  constructor({
    status,
    payload,
  }: {
    status: typeof ENTITY_ERROR_STATUS;
    payload: any;
  }) {
    super({ status, payload, message: "Entity Error" });
    this.status = status;
    this.payload = payload;
  }
}

let clientLogoutRequest: null | Promise<any> = null;

const request = async <Response>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  options?: RequestInit & { baseUrl?: string; onUnauthorized?: () => void }
) => {
  let body: FormData | string | undefined = undefined;
  if (options?.body instanceof FormData) {
    body = options.body;
  } else if (options?.body) {
    body = JSON.stringify(options.body);
  }

  const headers: { [key: string]: string } =
    body instanceof FormData ? {} : { "Content-Type": "application/json" };

  const accessToken = await AsyncStorage.getItem("accessToken");
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const baseUrl = options?.baseUrl ?? "https://api-bigboy.duthanhduoc.com";
  const fullUrl = `${baseUrl}/${normalizePath(url)}`;

  const res = await fetch(fullUrl, {
    ...options,
    headers,
    body,
    method,
  });

  const payload: Response = await res.json();

  const data = { status: res.status, payload };

  if (!res.ok) {
    if (res.status === ENTITY_ERROR_STATUS) {
      throw new EntityError({ status: 422, payload });
    } else if (res.status === AUTHENTICATION_ERROR_STATUS) {
      await AsyncStorage.multiRemove(["accessToken", "refreshToken"]);
      options?.onUnauthorized?.();
    } else {
      throw new HttpError(data);
    }
  }

  if (normalizePath(url) === "api/auth/login") {
    const { accessToken, refreshToken } = (payload as LoginResType).data;
    await AsyncStorage.setItem("accessToken", accessToken);
    await AsyncStorage.setItem("refreshToken", refreshToken);
  } else if (normalizePath(url) === "api/auth/logout") {
    await AsyncStorage.multiRemove(["accessToken", "refreshToken"]);
  }

  return data;
};

const http = {
  get<Response>(
    url: string,
    options?: Omit<RequestInit, "body"> & { onUnauthorized?: () => void }
  ) {
    return request<Response>("GET", url, options);
  },
  post<Response>(
    url: string,
    body: any,
    options?: Omit<RequestInit, "body"> & { onUnauthorized?: () => void }
  ) {
    return request<Response>("POST", url, { ...options, body });
  },
  put<Response>(
    url: string,
    body: any,
    options?: Omit<RequestInit, "body"> & { onUnauthorized?: () => void }
  ) {
    return request<Response>("PUT", url, { ...options, body });
  },
  delete<Response>(
    url: string,
    options?: Omit<RequestInit, "body"> & { onUnauthorized?: () => void }
  ) {
    return request<Response>("DELETE", url, options);
  },
};

export default http;
