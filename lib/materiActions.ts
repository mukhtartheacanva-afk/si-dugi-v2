"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

function cleanYoutubeUrl(urlInput: string): string {
  if (!urlInput) return "";
  try {
    if (urlInput.includes("youtube.com/watch?v=")) {
      const urlObj = new URL(urlInput);
      const videoId = urlObj.searchParams.get("v");
      return `https://www.youtube.com/embed/${videoId}`;
    } 
    if (urlInput.includes("youtu.be/")) {
      const videoId = urlInput.split("youtu.be/")[1]?.split("?")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (urlInput.includes("youtube.com/embed/")) return urlInput;
    return urlInput;
  } catch (error) {
    return urlInput;
  }
}

export async function tambahMateri(formData: FormData) {
  const judul = formData.get("judul") as string;
  const kategori = formData.get("kategori") as string;
  const deskripsi = formData.get("deskripsi") as string;
  const urlInput = formData.get("urlYoutube") as string;

  try {
    await prisma.materi.create({
      data: { 
        judul, 
        kategori, 
        urlYoutube: cleanYoutubeUrl(urlInput), 
        deskripsi 
      },
    });
    revalidatePath("/admin/materi");
    revalidatePath("/materi");
  } catch (error) {
    console.error(error);
  }
}

export async function updateMateri(id: any, formData: FormData) {
  const judul = formData.get("judul") as string;
  const kategori = formData.get("kategori") as string;
  const deskripsi = formData.get("deskripsi") as string;
  const urlInput = formData.get("urlYoutube") as string;

  try {
    await prisma.materi.update({
      where: { id: id },
      data: { 
        judul, 
        kategori, 
        urlYoutube: cleanYoutubeUrl(urlInput), 
        deskripsi 
      },
    });
    revalidatePath("/admin/materi");
    revalidatePath("/materi");
  } catch (error) {
    console.error("Gagal update:", error);
  }
}

export async function hapusMateri(id: any) {
  try {
    await prisma.materi.delete({ where: { id } });
    revalidatePath("/admin/materi");
    revalidatePath("/materi");
  } catch (error) {
    console.error(error);
  }
}

export async function getMateriForExport(query: string, category: string) {
  // Logic ambil data tanpa pagination
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
        const judul = item.judul || item["Judul Materi"] || item["Judul"] || "Tanpa Judul";
        const kategori = item.kategori || item["Kategori"] || "umum";
        const urlYoutube = item.urlYoutube || item["Link YouTube"] || item["URL Video"] || "";
        const deskripsi = item.deskripsi || item["Deskripsi"] || "";

        return {
          judul: judul,
          kategori: kategori.toLowerCase(),
          urlYoutube: cleanYoutubeUrl(urlYoutube), // Bersihkan juga saat import Excel
          deskripsi: deskripsi,
        };
      }),
    });

    revalidatePath("/admin/materi");
    revalidatePath("/materi");
    return { success: true, count: result.count };
  } catch (error) {
    console.error("Import Error:", error);
    return { success: false, message: "Gagal import data." };
  }
}