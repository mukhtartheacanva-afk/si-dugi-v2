"use client";

import { useState } from "react";
import ModalVideo from "./ModalVideo";

export default function VideoLink({ url }: { url: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setOpen(true)}
        className="text-blue-500 hover:text-blue-700 text-xs font-medium underline truncate max-w-[200px] block"
      >
        {url}
      </button>

      <ModalVideo 
        url={url} 
        isOpen={open} 
        onClose={() => setOpen(false)} 
      />
    </>
  );
}