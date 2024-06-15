import express from 'express'
import imageRouter from './api/routes/image.js'
import cors from 'cors'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(cors())

app.use('/', imageRouter)
app.listen(8080, () => {
  console.log('server is running on port 8080')
})
