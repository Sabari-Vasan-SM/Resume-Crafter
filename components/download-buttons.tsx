"use client"

import type React from "react"

import { useCallback, useState } from "react"
import * as htmlToImage from "html-to-image"
import { jsPDF } from "jspdf"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FileDown, ImageDown, FileImage, Loader2 } from "lucide-react"

type DownloadFormat = "pdf" | "png" | "jpg"

export function DownloadButtons({ previewRef }: { previewRef: React.RefObject<HTMLDivElement> }) {
  const [downloading, setDownloading] = useState<DownloadFormat | null>(null)
  const [open, setOpen] = useState(false)

  const handleDownload = useCallback(
    async (format: DownloadFormat) => {
      if (!previewRef.current || downloading) return
      setDownloading(format)
      try {
        if (format === "pdf") {
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
        } else if (format === "png") {
          const dataUrl = await htmlToImage.toPng(previewRef.current, {
            cacheBust: true,
            pixelRatio: 2,
            imagePlaceholder: "/transparent.jpg",
          })
          const link = document.createElement("a")
          link.download = "resume.png"
          link.href = dataUrl
          link.click()
        } else {
          const dataUrl = await htmlToImage.toJpeg(previewRef.current, {
            cacheBust: true,
            quality: 0.95,
            pixelRatio: 2,
          })
          const link = document.createElement("a")
          link.download = "resume.jpg"
          link.href = dataUrl
          link.click()
        }
      } finally {
        setDownloading(null)
        setOpen(false)
      }
    },
    [downloading, previewRef],
  )

  return (
    <Dialog open={open} onOpenChange={(value) => !downloading && setOpen(value)}>
      <DialogTrigger asChild>
        <Button className="gap-2" onClick={() => setOpen(true)} disabled={!!downloading}>
          <FileDown className="size-4" />
          {downloading ? "Preparing..." : "Download Resume"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select download format</DialogTitle>
          <DialogDescription>Choose the format you’d like to export your resume in.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-3">
          <Button
            variant="outline"
            className="flex items-center justify-between gap-3"
            onClick={() => handleDownload("pdf")}
            disabled={!!downloading}
          >
            <span className="flex items-center gap-2">
              <FileDown className="size-4" />
              PDF
            </span>
            {downloading === "pdf" && <Loader2 className="size-4 animate-spin" />}
          </Button>
          <Button
            variant="outline"
            className="flex items-center justify-between gap-3"
            onClick={() => handleDownload("png")}
            disabled={!!downloading}
          >
            <span className="flex items-center gap-2">
              <ImageDown className="size-4" />
              PNG
            </span>
            {downloading === "png" && <Loader2 className="size-4 animate-spin" />}
          </Button>
          <Button
            variant="outline"
            className="flex items-center justify-between gap-3"
            onClick={() => handleDownload("jpg")}
            disabled={!!downloading}
          >
            <span className="flex items-center gap-2">
              <FileImage className="size-4" />
              JPG
            </span>
            {downloading === "jpg" && <Loader2 className="size-4 animate-spin" />}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
