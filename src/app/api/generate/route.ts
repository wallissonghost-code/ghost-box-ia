import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Você é um gerador de código React especialista.
          Responda APENAS com um JSON válido.
          As chaves são os caminhos dos arquivos e os valores são o código.
          Use SEMPRE export default function App no arquivo principal.
          Exemplo: { "/App.js": "..." }`
        },
        { role: "user", content: `Crie um site: ${prompt}` }
      ],
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0].message.content;
    const files = JSON.parse(content || "{}");
    return NextResponse.json(files);
  } catch (error) {
    return NextResponse.json({ error: 'Erro na API' }, { status: 500 });
  }
}
