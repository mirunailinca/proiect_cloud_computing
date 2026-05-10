import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { messages, plant } = await request.json();

    const apiKey = process.env.TOGETHER_API_KEY;

    if (!apiKey || apiKey === 'PUNE_CHEIA_TA_AICI') {
      return NextResponse.json(
        { error: 'API Key-ul Together AI nu este configurat. Adaugă TOGETHER_API_KEY în fișierul .env' },
        { status: 500 }
      );
    }

    // Context pentru AI
    const systemPrompt = `Ești un botanist expert prietenos. Răspunzi DOAR în limba română. 
Userul îți vorbește despre planta sa: Nume "${plant.name}", Specie: "${plant.species || 'Necunoscută'}". 
Oferă sfaturi scurte, concrete și utile despre îngrijirea acestei plante. Fii cald și încurajator si raspunde corect gramatical in limba romana, folosind cuvinte existente.`;

    const apiMessages = [
      { role: 'system', content: systemPrompt },
      ...messages
    ];

    const response = await fetch('https://api.together.xyz/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'meta-llama/Meta-Llama-3-8B-Instruct-Lite',
        messages: apiMessages,
        max_tokens: 512,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      const errorMsg = err.error?.message || JSON.stringify(err);
      console.error('Together AI error:', errorMsg);
      // Returnăm eroarea exactă ca să știm ce se întâmplă
      return NextResponse.json(
        { error: `Eroare Together AI: ${errorMsg}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content;

    if (!reply) {
      throw new Error('Răspuns gol de la Together AI');
    }

    return NextResponse.json({ reply });

  } catch (error) {
    console.error('Chat error:', error.message);
    return NextResponse.json(
      { error: error.message || 'Eroare necunoscută la generarea răspunsului' },
      { status: 500 }
    );
  }
}
