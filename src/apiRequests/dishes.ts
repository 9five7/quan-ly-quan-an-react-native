import { CreateDishBodyType, DishListResType, DishResType, UpdateDishBodyType } from "src/schemaValidations/dish.schema"
import http from "src/services/http"

const dishesApiRequest = {
  list: () => http.get<DishListResType>('/dishes'),
  getDish: (id: number) => http.get<DishResType>(`/dishes/${id}`),
  add: (body: CreateDishBodyType) => http.post<DishResType>('/dishes', body),
  updateDish: (id: number, body: UpdateDishBodyType) => http.put<DishResType>(`/dishes/${id}`, body),
  deleteDish:(id: number) => http.delete<DishResType>(`/dishes/${id}`),
}
export default dishesApiRequest
