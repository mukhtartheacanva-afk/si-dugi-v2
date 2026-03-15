"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";


// Tambahkan fungsi ini di app/siswa/actions.ts untuk tambah data
export async function tambahSiswa(formData: FormData) {
  const nama = formData.get("nama") as string;
  const kelas = formData.get("kelas") as string;

  await prisma.siswa.create({
    data: {
      nama,
      kelas,
      status: "Aktif",
    },
  });

  // Biar tabel langsung update otomatis tanpa refresh browser
  revalidatePath("/siswa");
}

// Tambahkan fungsi ini di app/siswa/actions.ts untuk edit data
export async function updateSiswa(formData: FormData) {
  const id = Number(formData.get("id"));
  const nama = formData.get("nama") as string;
  const kelas = formData.get("kelas") as string;
  const status = formData.get("status") as string;

  await prisma.siswa.update({
    where: { id },
    data: {
      nama,
      kelas,
      status,
    },
  });

  revalidatePath("/siswa");
}

// Tambahkan ini di app/siswa/actions.ts untuk hapus data
export async function hapusSiswa(id: number) {
  await prisma.siswa.delete({
    where: { id },
  });

  revalidatePath("/siswa");
}

// Tambahkan ini di app/siswa/actions.ts untuk import excel
export async function importSiswa(data: any[]) {
  // Kita pakai createMany biar cepat (sekaligus banyak)
  // Data dari Excel biasanya berupa array of objects
  await prisma.siswa.createMany({
    data: data.map((item) => ({
      nama: item.Nama, // Sesuaikan dengan header di Excel nanti
      kelas: item.Kelas,
      status: item.Status || "Aktif",
    })),
  });

  revalidatePath("/siswa");
}