import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  let fileUrl = searchParams.get("url");
  const fileName = searchParams.get("name") || "dokumen";

  if (!fileUrl) return new NextResponse("URL missing", { status: 400 });

  // LOGIK KHUSUS GOOGLE DRIVE:
  // Ngerubah link /file/d/ID/preview atau /view jadi link direct download
  if (fileUrl.includes("drive.google.com")) {
    const fileId = fileUrl.split("/d/")[1]?.split("/")[0] || fileUrl.split("id=")[1];
    if (fileId) {
      // Ini adalah URL sakti biar langsung narik file aslinya
      fileUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
    }
  }

  try {
    const response = await fetch(fileUrl);
    if (!response.ok) throw new Error("Gagal ambil file");

    const data = await response.arrayBuffer();

    return new NextResponse(data, {
      headers: {
        "Content-Type": "application/pdf",
        // Ini yang bikin browser langsung simpan file ke folder Download
        "Content-Disposition": `attachment; filename="${fileName.replace(/[/\\?%*:|"<>]/g, '-')}.pdf"`,
      },
    });
  } catch (e) {
    return new NextResponse("Error: Pastikan akses Google Drive 'Anyone with the link'", { status: 500 });
  }
}