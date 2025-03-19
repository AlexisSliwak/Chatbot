import { NextResponse } from "next/server";
import models from "../../../src/lib/ai-models";

export async function GET() {
    return NextResponse.json({ models })
}