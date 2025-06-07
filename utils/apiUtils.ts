import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * Standardized method for making GET requests
 * @param url The URL to request
 * @param params Query parameters
 * @param config Additional axios config
 * @returns Promise with the response data
 */
export async function apiGet<T>(
  url: string,
  params?: any,
  config?: AxiosRequestConfig
): Promise<T> {
  try {
    const response: AxiosResponse<T> = await axios({
      method: 'get',
      url,
      params,
      ...config,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

/**
 * Standardized method for making POST requests
 * @param url The URL to request
 * @param data The data to send
 * @param config Additional axios config
 * @returns Promise with the response data
 */
export async function apiPost<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
  try {
    const response: AxiosResponse<T> = await axios({
      method: 'post',
      url,
      data,
      ...config,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

/**
 * Standardized method for making PUT requests
 * @param url The URL to request
 * @param data The data to send
 * @param config Additional axios config
 * @returns Promise with the response data
 */
export async function apiPut<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
  try {
    const response: AxiosResponse<T> = await axios({
      method: 'put',
      url,
      data,
      ...config,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

/**
 * Standardized method for making DELETE requests
 * @param url The URL to request
 * @param params Query parameters
 * @param config Additional axios config
 * @returns Promise with the response data
 */
export async function apiDelete<T>(
  url: string,
  params?: any,
  config?: AxiosRequestConfig
): Promise<T> {
  try {
    const response: AxiosResponse<T> = await axios({
      method: 'delete',
      url,
      params,
      ...config,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}
