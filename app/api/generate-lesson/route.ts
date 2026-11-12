import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { notes, subject, mode } = body;

    if (!notes || !String(notes).trim()) {
      return Response.json({ error: 'Please add some notes first.' }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return Response.json({ error: 'AI configuration is missing.' }, { status: 500 });
    }

    const prompt = `
      You are Hagwon, an elite Korean tutoring AI. Teach the student with rigor like a top hagwon instructor.
      Based on the notes below, create a structured lesson that goes beyond summary.
      Rules:
      - Distinguish facts, definitions, examples, formulas, rules, and misconceptions.
      - Correct any student misconceptions or errors clearly.
      - If notes are incomplete, say what information is missing instead of inventing facts.
      - Prioritize conceptual understanding and exam readiness.
      - Adapt to the student level and the selected mode: ${mode || '0.1% Student'}.
      - Return valid JSON only, no markdown, no code fences.

      Subject: ${subject || 'General'}
      Notes:
      ${notes}

      Output JSON schema:
      {
        "title": "short title",
        "subject": "${subject || 'General'}",
        "mode": "${mode || '0.1% Student'}",
        "summary": "concise overview",
        "sections": [
          {
            "title": "핵심 개념",
            "content": "clear explanation in paragraph form",
            "bullets": ["bullet 1", "bullet 2"]
          },
          {
            "title": "쉬운 설명",
            "content": "simple explanation",
            "bullets": ["bullet 1"]
          },
          {
            "title": "깊이 이해하기",
            "content": "cause/effect logic and reasoning",
            "bullets": ["bullet 1"]
          },
          {
            "title": "예시",
            "content": "example guide",
            "bullets": ["example 1", "example 2"]
          },
          {
            "title": "시험 포인트",
            "content": "important things for tests",
            "bullets": ["definition", "formula", "rule"]
          },
          {
            "title": "실수 방지",
            "content": "common pitfalls",
            "bullets": ["mistake and how to avoid it"]
          },
          {
            "title": "암기 포인트",
            "content": "memory hooks",
            "bullets": ["mnemonic or memory association"]
          },
          {
            "title": "문제 풀이",
            "content": "step-by-step reasoning",
            "bullets": ["step 1", "step 2"]
          },
          {
            "title": "연습",
            "content": "practice guidance",
            "bullets": ["practice 1", "practice 2"]
          },
          {
            "title": "한눈에 보기",
            "content": "one-minute summary",
            "bullets": ["key takeaway 1", "key takeaway 2"]
          }
        ],
        "practice": [
          {
            "question": "Question text",
            "type": "multiple-choice",
            "choices": ["A", "B", "C", "D"],
            "answer": "B",
            "explanation": "Why it is correct",
            "difficulty": "Basic"
          }
        ],
        "keyTakeaways": ["important idea 1", "important idea 2"]
      }
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.6,
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    });

    const raw = response.choices[0]?.message?.content;

    if (!raw) {
      throw new Error('No content returned from AI.');
    }

    const lesson = JSON.parse(raw);

    return Response.json(lesson);
  } catch (error) {
    console.error('Generate lesson error', error);
    return Response.json(
      { error: 'Something went wrong while generating your lesson. Please try again.' },
      { status: 500 },
    );
  }
}
