import { AI } from "@/lib/services";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const style = searchParams.get("style") || undefined;

    const result = await AI.video.generatePromptSuggestions(style);
    return NextResponse.json(result);

  } catch (error) {
    console.error("Video prompt suggestions error:", error);
    
    // Provide user-friendly error message
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Detailed error:", errorMessage);
    
    // Determine user-friendly message based on error type
    let userMessage = "Failed to generate video prompt suggestions";
    if (errorMessage.includes("API key")) {
      userMessage = "AI service is not properly configured. Please check API keys.";
    } else if (errorMessage.includes("quota") || errorMessage.includes("limit")) {
      userMessage = "Service quota exceeded. Please try again later.";
    } else if (errorMessage.includes("network") || errorMessage.includes("timeout")) {
      userMessage = "Network error. Please check your connection and try again.";
    }
    
    return NextResponse.json(
      { 
        error: userMessage,
        details: errorMessage 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { style } = await request.json();

    const result = await AI.video.generatePromptSuggestions(style);
    return NextResponse.json(result);

  } catch (error) {
    console.error("Video prompt suggestions error:", error);
    
    // Provide user-friendly error message
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Detailed error:", errorMessage);
    
    // Determine user-friendly message based on error type
    let userMessage = "Failed to generate video prompt suggestions";
    if (errorMessage.includes("API key")) {
      userMessage = "AI service is not properly configured. Please check API keys.";
    } else if (errorMessage.includes("quota") || errorMessage.includes("limit")) {
      userMessage = "Service quota exceeded. Please try again later.";
    } else if (errorMessage.includes("network") || errorMessage.includes("timeout")) {
      userMessage = "Network error. Please check your connection and try again.";
    }
    
    return NextResponse.json(
      { 
        error: userMessage,
        details: errorMessage 
      },
      { status: 500 }
    );
  }
}
