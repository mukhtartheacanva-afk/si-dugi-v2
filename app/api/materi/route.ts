import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await prisma.materi.findMany({
      orderBy: { createdAt: "desc" }, // Yang terbaru muncul di atas
    });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ message: "Gagal ambil data" }, { status: 500 });
  }
}