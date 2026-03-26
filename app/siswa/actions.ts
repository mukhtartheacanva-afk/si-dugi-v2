"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// HELPER: Fungsi untuk handle simpan file ke folder public/uploads
async function saveFile(file: File | null, subFolder: string) {
  if (!file || file.size === 0) return null;

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Buat folder jika belum ada
    const uploadDir = path.join(process.cwd(), "public/uploads", subFolder);
    await mkdir(uploadDir, { recursive: true });

    // Nama file unik (timestamp + nama asli)
    const fileName = `${Date.now()}-${file.name.replaceAll(" ", "_")}`;
    const filePath = path.join(uploadDir, fileName);

    await writeFile(filePath, buffer);
    return `/uploads/${subFolder}/${fileName}`;
  } catch (error) {
    console.error("Gagal upload file:", error);
    return null;
  }
}

// 1. FUNGSI TAMBAH (Lengkap dengan Profile & Upload)
export async function tambahSiswa(formData: FormData) {
  const nama = formData.get("nama") as string;
  const email = formData.get("email") as string;
  const kelas = formData.get("kelas") as string;
  const passwordDefault = "123456"; 
  const hashedPassword = await bcrypt.hash(passwordDefault, 10);

  // Proses Upload File
  const pathKtp = await saveFile(formData.get("fileKtp") as File, "ktp");
  const pathGanis = await saveFile(formData.get("fileKartuGanis") as File, "ganis");
  const pathSk = await saveFile(formData.get("fileSkPenugasan") as File, "sk");

  try {
    await prisma.user.create({
      data: {
        nama,
        email,
        kelas,
        password: hashedPassword,
        role: "USER",
        status: "Aktif",
        // Hubungkan langsung dengan tabel Profile
        profile: {
          create: {
            nik: formData.get("nik") as string,
            alamatKtp: formData.get("alamatKtp") as string,
            noHp: formData.get("noHp") as string,
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
        }
      },
    });

    revalidatePath("/siswa");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Email/NIK sudah terdaftar atau terjadi error." };
  }
}

// 2. FUNGSI UPDATE/EDIT (Termasuk Update Profile)
export async function updateSiswa(formData: FormData) {
  const id = Number(formData.get("id"));
  const nama = formData.get("nama") as string;
  const email = formData.get("email") as string;
  const kelas = formData.get("kelas") as string;
  const status = formData.get("status") as string;

  try {
    // Update data User dan Profile sekaligus menggunakan 'upsert' atau 'update'
    await prisma.user.update({
      where: { id },
      data: {
        nama,
        email,
        kelas,
        status,
        profile: {
          upsert: {
            create: {
              nik: formData.get("nik") as string,
              noHp: formData.get("noHp") as string,
              alamatKtp: formData.get("alamatKtp") as string,
            },
            update: {
              nik: formData.get("nik") as string,
              noHp: formData.get("noHp") as string,
              alamatKtp: formData.get("alamatKtp") as string,
              // Tambahkan field lain jika ingin bisa di-edit juga
            }
          }
        }
      },
    });

    revalidatePath("/siswa");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}

// 3. FUNGSI HAPUS (Otomatis hapus Profile karena onDelete: Cascade di schema)
export async function hapusSiswa(id: number) {
  try {
    await prisma.user.delete({
      where: { id },
    });

    revalidatePath("/siswa");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

// 4. FUNGSI IMPORT EXCEL (Data Dasar)
export async function importSiswa(data: any[]) {
  const passwordDefault = await bcrypt.hash("123456", 10);

  try {
    // Untuk import, biasanya kita hanya masukkan data dasar User
    const formattedData = data.map((item) => ({
      nama: item.Nama || item.nama, 
      email: item.Email || item.email,
      kelas: item.Kelas || item.kelas,
      password: passwordDefault,
      role: "USER",
      status: "Aktif",
    }));

    await prisma.user.createMany({
      data: formattedData,
      skipDuplicates: true,
    });

    revalidatePath("/siswa");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}

