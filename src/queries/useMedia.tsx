
import { useMutation } from '@tanstack/react-query'
import mediaApiRequest from 'src/apiRequests/media'

export const useUploadImageMutation = () => {
  return useMutation({
    mutationFn: mediaApiRequest.uploadImage
  })
}
