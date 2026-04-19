import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are an AI CI/CD Pipeline Config Generator. Given a project description (language, framework, test framework, deployment target), generate:
1. GitHub Actions workflow (.github/workflows/ci.yml) with lint, test, build, deploy stages
2. OR GitLab CI config (.gitlab-ci.yml)
3. Include matrix builds, caching, artifact passing
4. Add branch protection and PR checks recommendations

Output valid YAML pipeline configurations.`;

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: 'API key not configured' }, { status: 500 });

    const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 2500,
      }),
    });

    if (!res.ok) return NextResponse.json({ error: await res.text() }, { status: res.status });
    const data = await res.json();
    return NextResponse.json({ result: data.choices[0].message.content });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
