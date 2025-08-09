import { NextRequest, NextResponse } from "next/server";

const BACKEND_BASE_URL = "http://localhost:5000";

export async function POST(request: NextRequest) {
  try {
    const { slug } = await request.json();

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    // Make GET request to backend API
    const response = await fetch(
      `${BACKEND_BASE_URL}/api/animeTribes/products/check-slug/${encodeURIComponent(
        slug
      )}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Backend API responded with status: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error checking product slug:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
