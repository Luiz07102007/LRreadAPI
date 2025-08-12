
import express from 'express';
import fetch from 'node-fetch'; 
import cors from 'cors';

const app = express();
const PORT = 3001;
const API_KEY = 'AIzaSyD2s6xeITgYU34zcRzk6kvcpdxCA97Twyw';

app.use(cors());
app.use(express.json({ limit: '10mb' })); 

app.post('/processar-imagem', async (req, res) => {
  const { imagem } = req.body;
  if (!imagem) return res.status(400).json({ error: 'Imagem não enviada' });

  const prompt = `
    Imagine que você é um expert em cupons e notas fiscais, extraia as seguintes informações do cupom fiscal:
    - Nome do estabelecimento
    - CNPJ
    - Data
    - Lista de itens (nome e preço)
    - Valor total
    Responda no formato JSON.
  `;

  try {
    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt },
                {
                  inlineData: {
                    mimeType: 'image/jpeg',
                    data: imagem,
                  },
                },
              ],
            },
          ],
        }),
      }
    );

    const dados = await resp.json();
    const texto = dados?.candidates?.[0]?.content?.parts?.[0]?.text || 'Sem resposta';
    res.json({ resultado: texto });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao processar imagem' });
  }
});
app.get('/', (req, res) => {
  res.send('API está rodando! Use POST em /processar-imagem');
});

app.listen(PORT, () => {
  console.log(`API rodando na porta ${PORT}`);
});
