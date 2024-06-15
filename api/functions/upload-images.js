import multer from 'multer'
import fs from 'fs'
import util from 'util'
import path from 'path'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, './public/temporal-images/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    return cb(null, uniqueSuffix + path.extname(file.originalname))
  }
})

export const unlinkFile = util.promisify(fs.unlink)

function checkFileType (file, cb) {
  const filetypes = /jpeg|png|jpg/
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = filetypes.test(file.mimetype)

  if (!mimetype && !extname) {
    return cb(null, 'Porfavor ingresa un formato de imagen valido como jpg, jpeg, o png')
  }

  return cb(null, true)
}

export const uploadsImages = multer({
  storage,
  limits: { fileSize: 10000000 },
  fileFilter: function (req, file, cb) {
    return checkFileType(file, cb)
  }
}).any()

export const uploadImage = multer({
  storage,
  limits: { fileSize: 10000000 },
  fileFilter: function (req, file, cb) {
    return checkFileType(file, cb)
  }
})
