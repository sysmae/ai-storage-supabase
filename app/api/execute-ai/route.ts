import { NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";

export async function POST(request: Request) {
  try {
    const { prompt, input } = await request.json();
    if (!prompt || !input) {
      throw new Error("Missing prompt or input");
    }

    const model = new ChatOpenAI({
      model: "gpt-3.5-turbo",
      temperature: 0.7,
    });

    const promptTemplate = PromptTemplate.fromTemplate(prompt);
    const chain = promptTemplate.pipe(model);
    const response = await chain.invoke({ input });

    return NextResponse.json({ result: response.content });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request." },
      { status: 500 }
    );
  }
}
