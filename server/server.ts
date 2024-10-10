import express, { Request, Response, Application } from 'express'
import compression from 'compression'
import cors from 'cors'
import path from 'path'

interface RegistrationData {
  EMAIL: string
  NAME: string
  DOCUMENT: string
  BIRTH: string
  PHONE: string
  PASSWORD: string
}

const app: Application = express()
const port: number = process.env.PORT ? parseInt(process.env.PORT) : 3000

app.use(cors())
app.use(compression())
app.use(express.json())

const staticPath: string = path.join(__dirname, '../dist')
app.use(express.static(staticPath))

app.get('/registration', (req: Request, res: Response): void => {
    if(req.path.startsWith('/')) {
      res.sendFile(path.join(staticPath, 'index.html'))
    }
})

app.post('/registration', (req: Request<{}, {}, RegistrationData>, res: Response): void => {
  const { EMAIL, NAME, DOCUMENT, BIRTH, PHONE, PASSWORD } = req.body

  const requiredFields: (keyof RegistrationData)[] = ['EMAIL', 'NAME', 'DOCUMENT', 'BIRTH', 'PHONE', 'PASSWORD']
  const missingFields: string[] = requiredFields.filter(field => !req.body[field])

  if (missingFields.length > 0) {
    res.status(400).json({ error: `Campos obrigatórios faltando: ${missingFields.join(', ')}` })
    return
  }

  console.log('Registro recebido:', { EMAIL, NAME, DOCUMENT, BIRTH, PHONE })
  
  setTimeout(() => {
    res.status(200).json({ message: 'Cadastro recebido com sucesso!' })
  }, 2000)
})
app.use((req: Request, res: Response): void => {
  if(!req.path.startsWith('/registration') && res.status(404)) {
    res.sendFile(path.join(staticPath, 'index.html'))
  }
})

app.listen(port, (): void => {
  console.log(`Servidor rodando em http://localhost:${port}`)
})
