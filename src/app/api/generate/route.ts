import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { prompt, currentFiles } = await req.json();

    // Decide se é criação do zero ou edição
    const isEditing = currentFiles && Object.keys(currentFiles).length > 1;

    const systemPrompt = `
      Você é um especialista em React e manutenção de código.
      Seu objetivo é retornar um objeto JSON onde as chaves são nomes de arquivos e valores são o código.
      
      REGRAS CRITICAS:
      1. Retorne APENAS o JSON válido.
      2. Mantenha os arquivos existentes a menos que precise mudá-los.
      3. Se for uma edição, mantenha a estrutura e lógica que já existe, apenas aplique a mudança solicitada.
      4. Sempre garanta que o arquivo principal exporte 'App' como default.
    `;

    const userContent = isEditing
      ? `CÓDIGO ATUAL: ${JSON.stringify(currentFiles)}
         
         PEDIDO DE ALTERAÇÃO: ${prompt}
         
         Retorne o JSON completo com os arquivos atualizados.`
      : `Crie um projeto web novo sobre: ${prompt}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userContent }
      ],
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0].message.content;
    const files = JSON.parse(content || "{}");

    return NextResponse.json(files);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro na IA' }, { status: 500 });
  }
}
