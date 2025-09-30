import { AI } from "@/lib/services";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const style = searchParams.get("style") || undefined;

    // Generate prompt suggestions using Google AI service
    const result = await AI.image.generatePromptSuggestions(style);

    return NextResponse.json(result);

  } catch (error) {
    console.error("Prompt suggestions error:", error);
    return NextResponse.json(
      { error: "Failed to generate prompt suggestions" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { style } = await request.json();
    
    const result = await AI.image.generatePromptSuggestions(style);

    return NextResponse.json(result);

  } catch (error) {
    console.error("Prompt suggestions error:", error);
    return NextResponse.json(
      { error: "Failed to generate prompt suggestions" },
      { status: 500 }
    );
  }
}
