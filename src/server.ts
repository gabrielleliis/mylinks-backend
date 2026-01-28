// Importamos o express e também os TIPOS (Request e Response)
import express, { Request, Response } from 'express';

const app = express();
const port = 3333;

// Agora dizemos: req é do tipo Request, res é do tipo Response
app.get('/', (req: Request, res: Response) => {
  res.json({ mensagem: 'Olá! A API do MyLinks está rodando! 🚀' });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});