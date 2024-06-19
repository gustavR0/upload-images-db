import { response } from 'express'
import fs from 'fs'
import fs2 from 'fs/promises'; 
import util from 'util'
import sharp from 'sharp'
import Image from '../model/image.js'
import { uploadsImages } from '../functions/upload-images.js'

const unlinkFile = util.promisify(fs.unlink)

export const getUser = async (req, res) => {
  try {
    const user = await Image.findAll()
    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ error })
  }
}

export const uploadImageController = async (req, res = response) => {
  try {
    uploadsImages(req, res, async (err) => {
      if (!err && req.files.length === 0) {
        return res.status(400).json({ err, msg: 'Please select an image to upload' })
      }
      // console.log(err?.code) // return LIMIT_FILE_SIZE
      if (err?.code) {
        const statusMessage = (err === 'Please upload images only' ? err : 'Photo exceeds limit of 1MB')
        return res.status(400).json({ err: statusMessage, msg: statusMessage })
      }
      const image = req.files ? req.files[0].filename : null
      const { name, gender } = req.body

      if (!req.files) {
        return res.status(400).send('no file uploaded')
      }

      const maxWidth = 400
      const maxHeight = 250

      await sharp(`${req.files[0].path}`).resize(maxWidth, maxHeight, {
        fit: 'inside',
        withoutEnlargement: true
      })
        .jpeg({ quality: 80, progressive: true }) // Progressive JPEGs
        .webp({ quality: 80 }) // Convert to WebP format
        .toFile(`./images/compress-${image}`, (err, info) => {
          if (err) {
            console.error(`Error processing ${image}: ${err}`)
          } else {
            console.log(`Advanced compression applied to ${image}`)
            unlinkFile('./public/temporal-images/' + image)
          }
        })

      const user = await Image.create({ name, gender, image })
      return res.status(201).json({ user, message: 'data upload successfully' })
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error, message: 'internal server error ' })
  }
}

export const testUploadImge = async (req, res) => {
  try {
    const image = req.file ? req.file.filename : null
    const { name, gender } = req.body
    
    if (!req.file) {
      return res.status(400).send('no file uploaded')
    }
    //Permite que no se mantenga cache y para el caso de windows se pueda borrar la imagen
    sharp.cache({ files : 0 })
    
    const maxWidth = 800
    const maxHeight = 600

    await sharp(req.file.path).resize(maxWidth, maxHeight, {
      fit: 'inside',
      withoutEnlargement: true
    })
      .jpeg({ quality: 80, progressive: true }) // Progressive JPEGs
      .webp({ quality: 80 }) // Convert to WebP format
      .toFile(`./public/images/${image}`)

    const user = await Image.create({ name, gender, image })
    await fs2.unlink(req.file.path);
    return res.status(201).json({ user, message: 'data upload successfully' })
  } catch  (error) {
    console.log(error)
    return res.status(500).json({ error, message: 'internal server error ' })
  }

}

const deleteImage = async (image) => {
  unlinkFile(image)
}

export const deleteUser = async (req, res) => {
  try {
    const { image, name } = req.body

    if (image === '') {
      return res.status(400).json({ error: true, message: 'data upload successfully' })
    }

    const user = await Image.findOne({ where: { name } })

    if (user.image !== undefined) {
      unlinkFile('./public/temporal-images/' + user.image)
      unlinkFile('./public/images/' + user.image)
    }
    await user.destroy()
    return res.status(201).json({ user, message: 'data upload successfully' })
  } catch (error) {
    return res.status(500).json({ error, message: 'internal server error ' })
  }
}
