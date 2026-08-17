import { GoogleGenAI, Type } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

async function generateContentWithFallback(
  ai: GoogleGenAI,
  params: Parameters<typeof ai.models.generateContent>[0]
) {
  const models = [
    params.model || 'gemini-3.7-flash',
    'gemini-flash-latest',
    'gemini-2.5-flash',
  ];

  let lastError: any = null;

  for (let i = 0; i < models.length; i++) {
    const currentModel = models[i];
    try {
      const response = await ai.models.generateContent({
        ...params,
        model: currentModel,
      });
      return response;
    } catch (err: any) {
      console.warn(`Gemini API call failed for model ${currentModel}:`, err?.message || err);
      lastError = err;

      const isUnavailableOrRateLimited =
        err?.status === 503 ||
        err?.code === 503 ||
        err?.status === 429 ||
        err?.code === 429 ||
        (err?.message &&
          (err.message.includes('503') ||
            err.message.includes('high demand') ||
            err.message.includes('UNAVAILABLE') ||
            err.message.includes('RESOURCE_EXHAUSTED')));

      if (isUnavailableOrRateLimited && i < models.length - 1) {
        await new Promise((res) => setTimeout(res, 1000));
        continue;
      }

      throw err;
    }
  }

  throw lastError;
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY environment variable is not configured.' },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const body = await req.json();
    const { action, subject, classLevel, topic, week, studentName, averageScore, gradeSummary } = body;

    if (action === 'generate_cbt_questions') {
      const prompt = `You are a Senior Subject Specialist at Divine Academy Secondary School, Okene.
Generate 5 high-quality Computer-Based Test (CBT) multiple choice questions for ${classLevel || 'JSS1'} ${subject || 'Mathematics'} on the topic "${topic || 'General Revision'}".
Each question must have 4 options (A, B, C, D), exactly 1 correct option ID, and marks allocation (e.g. 4 or 5).`;

      const response = await generateContentWithFallback(ai, {
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                questionText: { type: Type.STRING },
                options: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING, description: "e.g. opt-a, opt-b, opt-c, opt-d" },
                      text: { type: Type.STRING },
                    },
                    required: ['id', 'text'],
                  },
                },
                correctOptionId: { type: Type.STRING, description: "e.g. opt-a" },
                marks: { type: Type.INTEGER },
                topic: { type: Type.STRING },
              },
              required: ['questionText', 'options', 'correctOptionId', 'marks'],
            },
          },
        },
      });

      const jsonText = response.text ? response.text.trim() : '[]';
      const questions = JSON.parse(jsonText);
      return NextResponse.json({ questions });
    }

    if (action === 'generate_lesson_plan') {
      const prompt = `You are an expert Nigerian Secondary School Curriculum Planner for Divine Academy Secondary School, Okene.
Create a comprehensive, highly detailed Lesson Plan for Week ${week || 1} for ${classLevel || 'JSS1'} ${subject || 'Mathematics'} on the topic "${topic || 'Whole Numbers'}".
Follow the official Divine Academy Curriculum format including:
- topic
- subTopics (array of strings)
- objectives (array of clear behavioral objectives)
- instructionalMaterials (array of teaching aids)
- previousKnowledge
- teacherActivities
- learnerActivities
- boardSummary
- evaluationQuestions (array of 2-3 questions)
- homework`;

      const response = await generateContentWithFallback(ai, {
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              weekNumber: { type: Type.INTEGER },
              topic: { type: Type.STRING },
              subTopics: { type: Type.ARRAY, items: { type: Type.STRING } },
              objectives: { type: Type.ARRAY, items: { type: Type.STRING } },
              instructionalMaterials: { type: Type.ARRAY, items: { type: Type.STRING } },
              previousKnowledge: { type: Type.STRING },
              teacherActivities: { type: Type.STRING },
              learnerActivities: { type: Type.STRING },
              boardSummary: { type: Type.STRING },
              evaluationQuestions: { type: Type.ARRAY, items: { type: Type.STRING } },
              homework: { type: Type.STRING },
            },
            required: [
              'weekNumber',
              'topic',
              'subTopics',
              'objectives',
              'instructionalMaterials',
              'previousKnowledge',
              'teacherActivities',
              'learnerActivities',
              'boardSummary',
              'evaluationQuestions',
              'homework',
            ],
          },
        },
      });

      const jsonText = response.text ? response.text.trim() : '{}';
      const lessonPlan = JSON.parse(jsonText);
      return NextResponse.json({ lessonPlan });
    }

    if (action === 'generate_report_comments') {
      const prompt = `Draft professional, encouraging academic report card comments for student "${studentName || 'Student'}" at Divine Academy Secondary School, Okene.
Average Score: ${averageScore || 75}%. Performance summary: ${gradeSummary || 'Good'}.
Provide two comments:
1. Teacher Comment (class teacher perspective)
2. Principal Comment (school leadership perspective)`;

      const response = await generateContentWithFallback(ai, {
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              teacherComment: { type: Type.STRING },
              principalComment: { type: Type.STRING },
            },
            required: ['teacherComment', 'principalComment'],
          },
        },
      });

      const jsonText = response.text ? response.text.trim() : '{}';
      const comments = JSON.parse(jsonText);
      return NextResponse.json({ comments });
    }

    return NextResponse.json({ error: 'Invalid action parameter provided.' }, { status: 400 });
  } catch (error: any) {
    console.error('Error in /api/gemini route:', error);
    return NextResponse.json({ error: error?.message || 'Failed to generate AI response' }, { status: 500 });
  }
}
