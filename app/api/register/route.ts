import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // 1. Cek apakah email sudah terdaftar
    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      return NextResponse.json({ message: "Email sudah terdaftar!" }, { status: 400 });
    }

    // 2. Hash Password (Enkripsi)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Simpan ke Database (Default role adalah USER)
    const user = await prisma.user.create({
      data: {
        nama: name,
        email: email,
        password: hashedPassword,
        role: "USER", 
      },
    });

    return NextResponse.json({ message: "Registrasi Berhasil!", user }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Gagal registrasi", error }, { status: 500 });
  }
}