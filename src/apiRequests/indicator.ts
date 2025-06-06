

import queryString from 'query-string'
import { DashboardIndicatorQueryParamsType, DashboardIndicatorResType } from 'src/schemaValidations/indicator.schema'
import http from 'src/services/http'

const indicatorApiRequest = {
  getIndicator: (queryParams: DashboardIndicatorQueryParamsType) =>
    http.get<DashboardIndicatorResType>(
      '/indicators/dashboard?' +
        queryString.stringify({
          fromDate: queryParams.fromDate?.toISOString(),
          toDate: queryParams.toDate?.toISOString()
        })
    )
}
export default indicatorApiRequest
