
import {
  CreateOrdersBodyType,
  CreateOrdersResType,
  GetOrderDetailResType,
  GetOrdersQueryParamsType,
  GetOrdersResType,
  PayGuestOrdersBodyType,
  PayGuestOrdersResType,
  UpdateOrderBodyType,
  UpdateOrderResType
} from 'src/schemaValidations/order.schema'

import queryString from 'query-string'
import http from 'src/services/http'
const orderApiRequest = {
  createOrders: (body: CreateOrdersBodyType) => http.post<CreateOrdersResType>('/orders', body),
  getOrderList: (queryParams: GetOrdersQueryParamsType) =>
    http.get<GetOrdersResType>(
      '/orders?' +
        queryString.stringify({
          fromDate: queryParams.fromDate?.toISOString(),
          toDate: queryParams.toDate?.toISOString()
        })
    ),
  updateOrder: (orderId: number, body: UpdateOrderBodyType) => http.put<UpdateOrderResType>(`/orders/${orderId}`, body),
  getOrderDetail: (orderId: number) => http.get<GetOrderDetailResType>(`/orders/${orderId}`),
  pay:(body:PayGuestOrdersBodyType)=>http.post<PayGuestOrdersResType>('/orders/pay',body)
}
export default orderApiRequest
