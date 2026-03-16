"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";


export async function tambahMateri(formData: FormData) {
  const judul = formData.get("judul") as string;
  const kategori = formData.get("kategori") as string;
  const deskripsi = formData.get("deskripsi") as string;
  let urlInput = formData.get("urlYoutube") as string;

  let finalEmbedUrl = "";

  try {
    // Logika Pembersihan URL yang lebih kuat
    if (urlInput.includes("youtube.com/watch?v=")) {
      // Mengambil ID video dari parameter 'v'
      const urlObj = new URL(urlInput);
      const videoId = urlObj.searchParams.get("v");
      finalEmbedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (urlInput.includes("youtu.be/")) {
      // Mengambil ID video dari link pendek (share link)
      const videoId = urlInput.split("youtu.be/")[1]?.split("?")[0];
      finalEmbedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (urlInput.includes("youtube.com/embed/")) {
      // Jika user sudah memasukkan link embed, biarkan saja
      finalEmbedUrl = urlInput;
    } else {
      // Fallback jika format tidak dikenali
      finalEmbedUrl = urlInput;
    }

    await prisma.materi.create({
      data: { 
        judul, 
        kategori, 
        urlYoutube: finalEmbedUrl, 
        deskripsi 
      },
    });

    revalidatePath("/materi");
    revalidatePath("/admin/materi");
  } catch (error) {
    console.error("Gagal simpan materi:", error);
    throw new Error("Gagal memproses URL YouTube");
  }
}

// Tambahkan ini di lib/materiActions.ts

export async function updateMateri(id: number, formData: FormData) {
  const judul = formData.get("judul") as string;
  const kategori = formData.get("kategori") as string;
  const deskripsi = formData.get("deskripsi") as string;
  let urlInput = formData.get("urlYoutube") as string;

  let finalEmbedUrl = "";

  try {
    // 1. Logika pembersihan URL (harus sama dengan fungsi tambah)
    if (urlInput.includes("youtube.com/watch?v=")) {
      const urlObj = new URL(urlInput);
      const videoId = urlObj.searchParams.get("v");
      finalEmbedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (urlInput.includes("youtu.be/")) {
      const videoId = urlInput.split("youtu.be/")[1]?.split("?")[0];
      finalEmbedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else {
      finalEmbedUrl = urlInput;
    }

    // 2. INI YANG KURANG: Perintah Update ke Database
    await prisma.materi.update({
      where: { id: id },
      data: { 
        judul, 
        kategori, 
        urlYoutube: finalEmbedUrl, 
        deskripsi 
      },
    });

    // 3. Paksa refresh cache biar datanya berubah di layar
    revalidatePath("/materi");
    revalidatePath("/admin/materi");
    
  } catch (error) {
    console.error("Gagal update materi:", error);
  }
}

export async function hapusMateri(id: number) {
  try {
    await prisma.materi.delete({ where: { id } });
    revalidatePath("/materi");
    revalidatePath("/admin/materi");
  } catch (error) {
    console.error("Gagal hapus materi:", error);
  }
}