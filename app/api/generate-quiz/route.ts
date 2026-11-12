import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { lesson } = body;

    if (!lesson || !lesson.title) {
      return Response.json({ error: 'Please select a saved lesson first.' }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return Response.json({ error: 'AI configuration is missing.' }, { status: 500 });
    }

    const prompt = `
      You are Hagwon, an AI study tutor.
      Create a rigorous quiz based on the saved lesson below.
      Include a mix of multiple choice, short answer, true/false, fill in the blank, and calculation/problem solving if appropriate.
      Do not reveal the answer immediately. Give clear explanations after each answer.
      Return valid JSON only.

      Lesson title: ${lesson.title}
      Subject: ${lesson.subject}
      Lesson content:
      ${JSON.stringify(lesson, null, 2)}

      Output JSON schema:
      {
        "questions": [
          {
            "question": "question text",
            "type": "multiple-choice",
            "choices": ["A", "B", "C", "D"],
            "answer": "B",
            "explanation": "Why this is correct",
            "difficulty": "Basic",
            "whyWrong": ["Why A is wrong", "Why C is wrong"]
          }
        ]
      }
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.5,
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    });

    const raw = response.choices[0]?.message?.content;

    if (!raw) {
      throw new Error('No quiz content returned.');
    }

    const parsed = JSON.parse(raw);
    return Response.json(parsed);
  } catch (error) {
    console.error('Generate quiz error', error);
    return Response.json(
      { error: 'Something went wrong while generating your quiz. Please try again.' },
      { status: 500 },
    );
  }
}
