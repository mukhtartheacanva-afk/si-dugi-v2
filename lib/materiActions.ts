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

export async function getMateriForExport(query: string, category: string) {
  // Logic ambil data tanpa pagination (biar semua ke-export)
  return await prisma.materi.findMany({
    where: {
      AND: [
        category ? { kategori: category } : {},
        {
          OR: [
            { judul: { contains: query } },
            { kategori: { contains: query } },
          ],
        },
      ],
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function importMateriFromExcel(data: any[]) {
  try {
    const result = await prisma.materi.createMany({
      data: data.map((item) => {
        // Logika untuk nangkep nama kolom meskipun ada spasi/huruf besar
        const judul = item.judul || item["Judul Materi"] || item["Judul"] || "Tanpa Judul";
        const kategori = item.kategori || item["Kategori"] || "umum";
        const urlYoutube = item.urlYoutube || item["Link YouTube"] || item["URL Video"] || "";
        const deskripsi = item.deskripsi || item["Deskripsi"] || "";

        return {
          judul: judul,
          kategori: kategori.toLowerCase(),
          urlYoutube: urlYoutube,
          deskripsi: deskripsi,
        };
      }),
    });

    revalidatePath("/admin/materi");
    return { success: true, count: result.count };
  } catch (error) {
    console.error("Import Error:", error);
    return { success: false, message: "Gagal import data." };
  }
}