import { getUser, deleteUser, uploadImageController, testUploadImge } from '../controller/image.js'
import { Router } from 'express'
import { uploadImage } from '../functions/upload-images.js'
/* import multer from 'multer' */

/* const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, './public/images')
  },
  filename: function (req, file, cb) {
    return cb(null, Date.now() + '-' + file.originalname)
  }
})

const upload = multer({ storage }) */

const router = Router()
router.get('/', getUser)
router.post('/upload/multi', uploadImageController)
router.post('/upload', uploadImage.single('image'), testUploadImge)
router.delete('/delete', deleteUser)

export default router
