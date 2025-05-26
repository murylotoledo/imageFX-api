export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { prompt } = req.body;
  const authorization = process.env.GOOGLE_IMAGEFX_KEY; // agora usa variável do Vercel

  if (!prompt || !authorization) {
    return res.status(400).json({ error: 'Prompt e token são obrigatórios.' });
  }

  try {
    const response = await fetch('https://content-prompt-images-ui.googleapis.com/v1beta/content:generatePromptImage', {
      method: 'POST',
      headers: {
        'Authorization': authorization,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: {
          text: prompt
        }
      }),
    });

    const result = await response.json();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({
      error: "Erro ao gerar imagem",
      detail: err.message,
    });
  }
}
