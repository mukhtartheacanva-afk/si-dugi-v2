"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// Helper untuk simpan file ke folder public/uploads
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

  // --- 1. VALIDASI DATA ---
  const nik = formData.get("nik") as string;
  const noHp = formData.get("noHp") as string;
  const pekerjaan = formData.get("pekerjaan") as string;

  // Validasi NIK wajib 16 digit angka
  if (!/^\d{16}$/.test(nik)) {
    return { success: false, message: "NIK harus berupa 16 digit angka." };
  }

  // Validasi No HP minimal 10 angka
  if (!/^\d{10,15}$/.test(noHp)) {
    return { success: false, message: "Nomor HP tidak valid (Minimal 10 digit angka)." };
  }

  // Validasi field wajib lainnya
  if (!pekerjaan || pekerjaan.trim() === "") {
    return { success: false, message: "Field Pekerjaan wajib diisi." };
  }

  try {
    // 2. Cari ID User berdasarkan email session
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) return { success: false, message: "User tidak ditemukan." };

    // 3. Proses Upload File
    const fileKtp = formData.get("fileKtp") as File;
    const fileGanis = formData.get("fileKartuGanis") as File;
    const fileSk = formData.get("fileSkPenugasan") as File;

    const pathKtp = fileKtp && fileKtp.size > 0 ? await saveFile(fileKtp, "ktp") : undefined;
    const pathGanis = fileGanis && fileGanis.size > 0 ? await saveFile(fileGanis, "ganis") : undefined;
    const pathSk = fileSk && fileSk.size > 0 ? await saveFile(fileSk, "sk") : undefined;

    // 4. Update atau Create (Upsert) data Profile
    await prisma.profile.upsert({
      where: { userId: user.id },
      update: {
        nik,
        noHp,
        alamatKtp: formData.get("alamatKtp") as string,
        pekerjaan: formData.get("pekerjaan") as string,
        namaPerusahaan: formData.get("namaPerusahaan") as string,
        noRegGanis: formData.get("noRegGanis") as string,
        skPenugasan: formData.get("skPenugasan") as string,
        // Update path file hanya jika ada file baru yang diunggah
        ...(pathKtp && { fileKtp: pathKtp }),
        ...(pathGanis && { fileKartuGanis: pathGanis }),
        ...(pathSk && { fileSkPenugasan: pathSk }),
      },
      create: {
        userId: user.id,
        nik,
        noHp,
        alamatKtp: formData.get("alamatKtp") as string,
        pekerjaan: formData.get("pekerjaan") as string,
        namaPerusahaan: formData.get("namaPerusahaan") as string,
        noRegGanis: formData.get("noRegGanis") as string,
        skPenugasan: formData.get("skPenugasan") as string,
        fileKtp: pathKtp,
        fileKartuGanis: pathGanis,
        fileSkPenugasan: pathSk,
      }
    });

    revalidatePath("/profil");
    return { success: true };
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false, message: "Gagal menyimpan ke database." };
  }
}