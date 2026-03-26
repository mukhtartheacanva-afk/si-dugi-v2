"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function createOrRegisterUser(formData: FormData) {
  try {
    const nama = formData.get("nama") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    // Ambil role dari form, kalau ga ada default ke "USER"
    const role = (formData.get("role") as string) || "USER"; 

    // 1. Cek apakah email sudah dipakai
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return { success: false, message: "Email sudah terdaftar!" };

    // 2. Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Simpan ke tabel User (Pusat Login)
    await prisma.user.create({
      data: {
        nama,
        email,
        password: hashedPassword,
        role: role,
      },
    });

    // 4. Revalidate biar data di tabel admin langsung update
    revalidatePath("/admin/siswa"); 
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Terjadi kesalahan sistem" };
  }
}