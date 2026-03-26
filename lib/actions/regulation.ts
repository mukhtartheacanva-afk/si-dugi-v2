"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { writeFile, unlink, mkdir } from "fs/promises";
import path from "path";
import * as XLSX from "xlsx";

// FUNGSI CREATE (Support File & Google Drive)
export async function createRegulation(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const description = formData.get("description") as string;
    const driveLink = formData.get("driveLink") as string;
    const file = formData.get("file") as File;

    let finalFileUrl = "";
    let finalFileName = "";

    if (driveLink) {
      // Convert Link Drive ke Direct View Link
      const fileId = driveLink.match(/\/d\/(.+?)\//)?.[1] || driveLink;
      finalFileUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
      finalFileName = "Google Drive Link";
    } else if (file && file.size > 0) {
      // Proses Simpan File Lokal
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uniqueName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
      const uploadDir = path.join(process.cwd(), "public/uploads/peraturan");
      await mkdir(uploadDir, { recursive: true });
      await writeFile(path.join(uploadDir, uniqueName), buffer);
      finalFileUrl = `/uploads/peraturan/${uniqueName}`;
      finalFileName = file.name;
    }

    await prisma.regulation.create({
      data: { title, category, description, fileUrl: finalFileUrl, fileName: finalFileName },
    });

    revalidatePath("/admin/peraturan");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Gagal menyimpan data" };
  }
}

// FUNGSI DELETE (Bersihkan file lokal jika ada)
export async function deleteRegulation(id: string) { // Cuma terima ID
  try {
    // 1. Cari data di DB dulu buat ambil path filenya
    const data = await prisma.regulation.findUnique({ where: { id } });
    
    // 2. Kalau ada file lokal, hapus file fisiknya
    if (data?.fileUrl && data.fileUrl.startsWith("/uploads")) {
      const filePath = path.join(process.cwd(), "public", data.fileUrl);
      try { await unlink(filePath); } catch (e) { console.log("File fisik tidak ada"); }
    }

    // 3. Hapus data di database
    await prisma.regulation.delete({ where: { id } });

    revalidatePath("/admin/peraturan");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}

// FUNGSI EXPORT EXCEL
export async function exportRegulationsToExcel() {
  try {
    const data = await prisma.regulation.findMany();
    const worksheet = XLSX.utils.json_to_sheet(data.map(item => ({
      Judul: item.title,
      Kategori: item.category,
      Deskripsi: item.description,
      URL: item.fileUrl,
      Nama_File: item.fileName
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Peraturan");
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
    return { success: true, data: buffer.toString("base64") };
  } catch (error) {
    return { success: false };
  }
}
// Tambahkan fungsi ini di lib/actions/regulation.ts

export async function updateRegulation(id: string, formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const description = formData.get("description") as string;
    const driveLink = formData.get("driveLink") as string;
    const file = formData.get("file") as File;

    console.log("DEBUG: driveLink yang masuk ->", driveLink); // Cek di terminal VS Code lo

    const existing = await prisma.regulation.findUnique({ where: { id } });
    if (!existing) return { success: false, message: "Data tidak ditemukan" };

    let newFileUrl = existing.fileUrl;
    let newFileName = existing.fileName;

    // LOGIKA 1: Jika ada upload file fisik (Prioritas Utama)
    if (file && file.size > 0) {
      if (existing.fileUrl.startsWith("/uploads")) {
        try { await unlink(path.join(process.cwd(), "public", existing.fileUrl)); } catch (e) {}
      }
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uniqueName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
      const uploadDir = path.join(process.cwd(), "public/uploads/peraturan");
      await mkdir(uploadDir, { recursive: true });
      await writeFile(path.join(uploadDir, uniqueName), buffer);
      
      newFileUrl = `/uploads/peraturan/${uniqueName}`;
      newFileName = file.name;
    } 
    // LOGIKA 2: Jika ada input Drive Link (dan tidak upload file)
    else if (driveLink && driveLink.trim() !== "") {
      // Ekstrak ID Drive dengan cara yang lebih aman (mendukung berbagai format link)
      const driveMatch = driveLink.match(/[-\w]{25,}/); // Cari string acak panjang khas ID Google
      const fileId = driveMatch ? driveMatch[0] : null;

      if (fileId) {
        // Hapus file lokal lama jika pindah ke Drive
        if (existing.fileUrl.startsWith("/uploads")) {
          try { await unlink(path.join(process.cwd(), "public", existing.fileUrl)); } catch (e) {}
        }
        newFileUrl = `https://drive.google.com/file/d/${fileId}/preview`;
        newFileName = "Google Drive Link";
        console.log("DEBUG: ID Berhasil diekstrak ->", fileId);
      } else {
        console.log("DEBUG: Gagal ekstrak ID dari link ->", driveLink);
      }
    }

    // UPDATE DATABASE
    await prisma.regulation.update({
      where: { id },
      data: { 
        title, 
        category, 
        description, 
        fileUrl: newFileUrl, 
        fileName: newFileName 
      },
    });

    revalidatePath("/admin/peraturan");
    revalidatePath("/peraturan");
    return { success: true };
  } catch (error) {
    console.error("ERROR UPDATE:", error);
    return { success: false, message: "Gagal mengupdate data" };
  }
}

export async function importRegulationsFromExcel(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) return { success: false, message: "File tidak ditemukan" };

    const bytes = await file.arrayBuffer();
    const workbook = XLSX.read(bytes, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Ambil data dari excel jadi Array JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];

    if (jsonData.length === 0) return { success: false, message: "Excel kosong" };

    // Format data agar sesuai schema Prisma
    const records = jsonData.map((row) => ({
      title: row.Judul || row.title || "Tanpa Judul",
      category: row.Kategori || row.category || "Lainnya",
      description: row.Deskripsi || row.description || "",
      fileUrl: row.URL || row.fileUrl || "#", 
      fileName: row.Nama_File || row.fileName || "Imported File",
    }));

    // Simpan banyak sekaligus (Bulk Create)
    await prisma.regulation.createMany({
      data: records,
    });

    revalidatePath("/admin/peraturan");
    return { success: true, message: `${records.length} data berhasil diimport!` };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Format Excel salah atau bermasalah" };
  }
}