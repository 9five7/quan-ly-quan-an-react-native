
import { useQuery } from '@tanstack/react-query'
import indicatorApiRequest from 'src/apiRequests/indicator'
import { DashboardIndicatorQueryParamsType } from 'src/schemaValidations/indicator.schema'

export const useIndicatorQuery = (queryParams: DashboardIndicatorQueryParamsType) => {
  return useQuery({
    queryFn: () => indicatorApiRequest.getIndicator(queryParams),
    queryKey: ['indicator-dashboard', queryParams],
  })
}
