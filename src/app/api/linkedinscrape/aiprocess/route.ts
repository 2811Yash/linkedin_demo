  import { ChatGroq } from '@langchain/groq';
  import { NextRequest, NextResponse } from 'next/server';
  const { GoogleGenerativeAI } = require("@google/generative-ai");  

  // ✅ API handler for POST requests
  export async function POST(req: NextRequest) {
    try {
      const body = await req.json();
      const posts = body.posts;

      if (!posts || !Array.isArray(posts)) {
        return new NextResponse(JSON.stringify({ error: 'Invalid post data' }), {
          status: 400,
        });
      }

      const results = await Promise.all(
        posts.map(async (post: string) => {
          const { email, subject, draft } = await generateEmailDraftWithChatGroq(post);
          return { email, subject, draft };
        })
      );

      return NextResponse.json({ results });
    } catch (error) {
      console.error('Error in API:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }

  // const llm = new ChatGroq({
  //   apiKey: process.env.GROQ_API_KEY || "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", // use env vars in production
  //   model: 'llama-3.1-8b-instant',
  //   temperature: 0.5,
  //   maxRetries: 5,
  // });

  const API_KEY = "AIzaSyAGlwJMRzm77xDD-jZlzHAR5C6El5PfGb0"; 
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });



  async function generateEmailDraftWithChatGroq(post: string): Promise<{ email: string; subject: string; draft: string }> {
    const emailMatch = post.match(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i);
    const email = emailMatch ? emailMatch[0] : 'hr@example.com';

    try {
  //     const response = await llm.invoke([
  //   {
  //     role: "system",
  //     content: `You are an expert email writer. Return only strict JSON with "subject" and "draft". Do NOT add comments or anything else.`,
  //   },
  //   {
  //     role: "user",
  //     content: `Here is a LinkedIn post:\n"${post}"\nGenerate a short email draft from it.`,
  //   },
  // ]);
  //     console.log(response)
  // const raw = response?.content ?? '';


    const result  = await model.generateContent( `You are an expert email writer. Return only strict JSON with "subject" and "draft". Do NOT add comments or anything else.Here is a LinkedIn post:\n"${post}"\nGenerate a short email draft from it.`)
    console.log(result.response.text());


      

      const raw=result.response.text()
      
      const cleanJson = extractJsonString(raw);
      const parsed = JSON.parse(cleanJson);
      console.log(parsed)
      return {
        email,
        subject: parsed.subject ?? 'No subject',
        draft: parsed.draft ?? 'No draft',
      };
    } catch (err) {
      console.error('AI generation failed:', err);
      return {
        email,
        subject: 'AI generation failed',
        draft: 'Could not generate draft.',
      };
    }
  }

  // ✅ JSON Cleaner

  function extractJsonString(raw: any): string {
    const rawStr = typeof raw === "string" ? raw : JSON.stringify(raw);
    const start = rawStr.indexOf('{');
    const end = rawStr.lastIndexOf('}');

    if (start === -1 || end === -1 || start >= end) {
      throw new Error("Invalid JSON format in AI response.");
    }

    return rawStr.substring(start, end + 1);
  }


