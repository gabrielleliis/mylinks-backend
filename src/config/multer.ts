import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'

// Configuração do Cloudinary (SUBSTITUA PELOS SEUS DADOS)
cloudinary.config({
  cloud_name: 'ddihcv1ow',
  api_key: '125656237596251',
  api_secret: 'Y13U5pw5RJBcdV6eBg28KVHaQF0'
})

// Configuração do Multer (Onde salvar)
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'mylinks-uploads', // Nome da pasta no Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg'], // Formatos aceitos
  } as any
})

export const upload = multer({ storage: storage })