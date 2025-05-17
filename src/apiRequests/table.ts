
import {
  CreateTableBodyType,
  TableListResType,
  TableResType,
  UpdateTableBodyType
} from 'src/schemaValidations/table.schema'
import http from 'src/services/http'

const tableApiRequest = {
  list: () => http.get<TableListResType>('/tables'),
  add: (body: CreateTableBodyType) => http.post<TableResType>('/tables', body),
  getTable: (id: number) => http.get<TableResType>(`/tables/${id}`),
  updateTable: (id: number, body: UpdateTableBodyType) => http.put<TableResType>(`/tables/${id}`, body),
  deleteTable: (id: number) => http.delete<TableResType>(`/tables/${id}`)
}
export default tableApiRequest
