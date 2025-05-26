export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { prompt } = req.body;
  const authorization = process.env.GOOGLE_IMAGEFX_KEY;

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

    // Recebe a resposta como texto (mesmo que venha com erro HTML)
    const raw = await response.text();

    // Faz log para identificar o problema
    console.error('[ImageFX API Response Raw]:', raw);

    // Tenta parsear o JSON, se possível
    try {
      const json = JSON.parse(raw);
      return res.status(200).json(json);
    } catch (parseErr) {
      return res.status(500).json({
        error: "Erro ao gerar imagem",
        detail: "Resposta não é um JSON válido. Conteúdo bruto:",
        content: raw
      });
    }

  } catch (err) {
    return res.status(500).json({
      error: "Erro ao gerar imagem (fetch)",
      detail: err.message,
    });
  }
}
