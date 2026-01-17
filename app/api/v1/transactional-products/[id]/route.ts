import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  return Response.json({ message: "success" });
}

export async function PATCH() {
  return Response.json({ message: "success" });
}

export async function DELETE() {
  return Response.json({ message: "success" });
}
