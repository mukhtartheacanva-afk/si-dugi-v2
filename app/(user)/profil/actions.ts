"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// Helper tetap aman
async function saveFile(file: File | null, subFolder: string) {
  if (!file || file.size === 0) return null;

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "public/uploads", subFolder);
    await mkdir(uploadDir, { recursive: true });

    const fileName = `${Date.now()}-${file.name.replaceAll(" ", "_")}`;
    const filePath = path.join(uploadDir, fileName);

    await writeFile(filePath, buffer);
    return `/uploads/${subFolder}/${fileName}`;
  } catch (error) {
    console.error("Gagal upload file:", error);
    return null;
  }
}

export async function updateProfilMandiri(formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) return { success: false, message: "Sesi berakhir, silakan login kembali." };

  // --- 1. AMBIL ID TARGET & FIX KONVERSI KE NUMBER ---
  const formUserId = formData.get("userId") as string;
  const sessionId = Number((session.user as any).id); // Pastikan ID session jadi Number
  
  // Jika ada formUserId dari admin, konversi ke Number. Jika tidak, pakai sessionId.
  const targetIdFromForm = formUserId ? Number(formUserId) : null;

  // Validasi: Jika Admin edit orang lain, pastikan role-nya ADMIN
  if (targetIdFromForm && targetIdFromForm !== sessionId && (session.user as any).role !== "ADMIN") {
    return { success: false, message: "Anda tidak memiliki izin untuk mengedit profil ini." };
  }

  // Ini variabel final yang bertipe Number untuk Prisma
  const finalUserId = targetIdFromForm || sessionId;

  // --- 2. VALIDASI DATA ---
  const nik = formData.get("nik") as string;
  const noHp = formData.get("noHp") as string;
  const pekerjaan = formData.get("pekerjaan") as string;

  if (!/^\d{16}$/.test(nik)) {
    return { success: false, message: "NIK harus berupa 16 digit angka." };
  }

  if (!/^\d{10,15}$/.test(noHp)) {
    return { success: false, message: "Nomor HP tidak valid (Minimal 10 digit angka)." };
  }

  if (!pekerjaan || pekerjaan.trim() === "") {
    return { success: false, message: "Field Pekerjaan wajib diisi." };
  }

  try {
    // 3. Proses Upload File
    const fileKtp = formData.get("fileKtp") as File;
    const fileGanis = formData.get("fileKartuGanis") as File;
    const fileSk = formData.get("fileSkPenugasan") as File;

    const pathKtp = fileKtp && fileKtp.size > 0 ? await saveFile(fileKtp, "ktp") : undefined;
    const pathGanis = fileGanis && fileGanis.size > 0 ? await saveFile(fileGanis, "ganis") : undefined;
    const pathSk = fileSk && fileSk.size > 0 ? await saveFile(fileSk, "sk") : undefined;

    // 4. Update atau Create (Upsert) data Profile menggunakan finalUserId
    await prisma.profile.upsert({
      where: { userId: finalUserId }, // Sekarang sudah pasti bertipe Number
      update: {
        nik,
        noHp,
        alamatKtp: formData.get("alamatKtp") as string,
        pekerjaan: formData.get("pekerjaan") as string,
        namaPerusahaan: formData.get("namaPerusahaan") as string,
        alamatPerusahaan: formData.get("alamatPerusahaan") as string,
        kualifikasi: formData.get("kualifikasi") as string,
        noRegGanis: formData.get("noRegGanis") as string,
        skPenugasan: formData.get("skPenugasan") as string,
        ...(pathKtp && { fileKtp: pathKtp }),
        ...(pathGanis && { fileKartuGanis: pathGanis }),
        ...(pathSk && { fileSkPenugasan: pathSk }),
      },
      create: {
        userId: finalUserId,
        nik,
        noHp,
        alamatKtp: formData.get("alamatKtp") as string,
        pekerjaan: formData.get("pekerjaan") as string,
        namaPerusahaan: formData.get("namaPerusahaan") as string,
        alamatPerusahaan: formData.get("alamatPerusahaan") as string,
        kualifikasi: formData.get("kualifikasi") as string,
        noRegGanis: formData.get("noRegGanis") as string,
        skPenugasan: formData.get("skPenugasan") as string,
        fileKtp: pathKtp,
        fileKartuGanis: pathGanis,
        fileSkPenugasan: pathSk,
      }
    });

    // Revalidate semua path terkait agar data fresh
    revalidatePath("/profil");
    revalidatePath(`/profil/${finalUserId}`); 
    revalidatePath("/siswa"); 
    
    return { success: true };
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false, message: "Gagal menyimpan ke database." };
  }
}