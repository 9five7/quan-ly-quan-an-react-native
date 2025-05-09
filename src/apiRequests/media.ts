
import { UploadImageResType } from 'src/schemaValidations/media.schema'
import http from 'src/services/http'

const mediaApiRequest = {
  uploadImage: (body: FormData) => http.post<UploadImageResType>('/media/upload', body)
}

export default mediaApiRequest
