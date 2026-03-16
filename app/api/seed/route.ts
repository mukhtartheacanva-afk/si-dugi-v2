import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function GET() {
  const hashedPassword = await bcrypt.hash("admin123", 10); // Passwordnya: admin123
  
  try {
    const user = await prisma.user.upsert({
      where: { email: "admin@test.com" },
      update: {},
      create: {
        email: "admin@test.com",
        nama: "Admin Si-Dugi",
        password: hashedPassword,
        role: "ADMIN",
      },
    });
    return NextResponse.json({ message: "User Admin berhasil dibuat", user });
  } catch (error) {
    return NextResponse.json({ message: "Gagal membuat user", error }, { status: 500 });
  }
}