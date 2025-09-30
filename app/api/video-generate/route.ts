import { NextRequest, NextResponse } from "next/server";
import { VideoGenerationRequest } from "@/lib/types/video-ai";
import { AI } from "@/lib/services/google-ai";

export async function POST(request: NextRequest) {
  try {
    const body: VideoGenerationRequest = await request.json();

    // Validate required fields
    if (!body.prompt || !body.style || !body.aspectRatio) {
      return NextResponse.json(
        { error: "Missing required fields: prompt, style, aspectRatio" },
        { status: 400 }
      );
    }

    // Validate aspect ratio
    if (!["16:9", "9:16"].includes(body.aspectRatio)) {
      return NextResponse.json(
        { error: "Invalid aspect ratio. Must be '16:9' or '9:16'" },
        { status: 400 }
      );
    }

    const result = await AI.video.generate(body);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Video generation error:", error);

    // Use the functional error handler
    const { message, details } = AI.video.handleError(error);

    return NextResponse.json(
      {
        error: message,
        details: details,
      },
      { status: 500 }
    );
  }
}
