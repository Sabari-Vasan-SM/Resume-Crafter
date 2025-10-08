"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ImageDown, FileDown } from "lucide-react"
import * as htmlToImage from "html-to-image"
import { jsPDF } from "jspdf"

export function DownloadButtons({ previewRef }: { previewRef: React.RefObject<HTMLDivElement> }) {
  const [downloading, setDownloading] = useState<"png" | "pdf" | null>(null)

  const downloadPNG = async () => {
    if (!previewRef.current) return
    setDownloading("png")
    try {
      const dataUrl = await htmlToImage.toPng(previewRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        imagePlaceholder: "/transparent.jpg",
      })
      const link = document.createElement("a")
      link.download = "resume.png"
      link.href = dataUrl
      link.click()
    } finally {
      setDownloading(null)
    }
  }

  const downloadPDF = async () => {
    if (!previewRef.current) return
    setDownloading("pdf")
    try {
      const dataUrl = await htmlToImage.toPng(previewRef.current, {
        cacheBust: true,
        pixelRatio: 2,
      })
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.src = dataUrl
      await new Promise((res) => (img.onload = res))

      const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" })
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()

      const ratio = Math.min(pageWidth / img.width, pageHeight / img.height)
      const imgWidth = img.width * ratio
      const imgHeight = img.height * ratio
      const x = (pageWidth - imgWidth) / 2
      const y = 40

      pdf.addImage(img, "PNG", x, y, imgWidth, imgHeight)
      pdf.save("resume.pdf")
    } finally {
      setDownloading(null)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" className="gap-2 bg-transparent" onClick={downloadPNG} disabled={!!downloading}>
        <ImageDown className="size-4" />
        {downloading === "png" ? "Preparing..." : "Download PNG"}
      </Button>
      <Button className="gap-2" onClick={downloadPDF} disabled={!!downloading}>
        <FileDown className="size-4" />
        {downloading === "pdf" ? "Exporting..." : "Download PDF"}
      </Button>
    </div>
  )
}
