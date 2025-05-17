
import { useMutation, useQuery } from '@tanstack/react-query'
import orderApiRequest from 'src/apiRequests/order'
import { GetOrdersQueryParamsType, PayGuestOrdersBodyType, UpdateOrderBodyType } from 'src/schemaValidations/order.schema'

export const useGetOrderListQuery = (queryParams: GetOrdersQueryParamsType) => {
  return useQuery({
    queryFn: () => orderApiRequest.getOrderList(queryParams),
    queryKey: ['orders', queryParams]
  })
}
export const useUpdateOrderMutation = () => {
  return useMutation({
    mutationFn: ({
      orderId,
      ...body
    }: UpdateOrderBodyType & {
      orderId: number
    }) => orderApiRequest.updateOrder(orderId, body)
  })
}
export const useGetOrderDetailQuery = ({ id, enabled }: { id: number; enabled: boolean }) => {
  return useQuery({
    queryFn: () => orderApiRequest.getOrderDetail(id),
    queryKey: ['orders', id],
    enabled
  })
}
export const usePayGuestOrderMutation = () => {
  return useMutation({
    mutationFn: (body: PayGuestOrdersBodyType) => orderApiRequest.pay(body)
  })
}
export const useCreateOrderMutation = () => {
  return useMutation({
    mutationFn: orderApiRequest.createOrders
  })
}
