import express, { Request, Response, Application } from 'express';
import cors from 'cors';
import path from 'path';

interface RegistrationData {
  email: string;
  name: string;
  document: string;
  birthDate: string;
  contact: string;
  password: string;
}

const app: Application = express();
const port: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(cors());
app.use(express.json());

const staticPath: string = path.join(__dirname, '../dist');
app.use(express.static(staticPath));

app.get('/registration', (req: Request, res: Response): void => {
    if(req.path.startsWith('/')) {
      res.sendFile(path.join(staticPath, 'index.html'));
    }
});

app.post('/registration', (req: Request<{}, {}, RegistrationData>, res: Response): void => {
  const { email, name, document, birthDate, contact } = req.body;

  const requiredFields: (keyof RegistrationData)[] = ['email', 'name', 'document', 'birthDate', 'contact', 'password'];
  const missingFields: string[] = requiredFields.filter(field => !req.body[field]);

  if (missingFields.length > 0) {
    res.status(400).json({ error: `Campos obrigatórios faltando: ${missingFields.join(', ')}` });
    return;
  }

  console.log('Registro recebido:', { email, name, document, birthDate, contact });
  
  res.status(200).json({ message: 'Registro recebido com sucesso.' });
});

app.use((req: Request, res: Response): void => {
  if(!req.path.startsWith('/registration') && res.status(404)) {
    res.sendFile(path.join(staticPath, 'index.html'));
  }
});

app.listen(port, (): void => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
