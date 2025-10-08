"use client"

import { useCallback, useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Props = {
  value?: string
  onChange: (src?: string) => void
}

export function PhotoUpload({ value, onChange }: Props) {
  const [dragOver, setDragOver] = useState(false)

  const handleFiles = useCallback(
    (files: FileList | null) => {
      const file = files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = () => {
        onChange(reader.result as string)
      }
      reader.readAsDataURL(file)
    },
    [onChange],
  )

  return (
    <div className="grid gap-2">
      <div
        className={cn(
          "relative grid place-items-center rounded-lg border border-dashed p-4 text-center",
          "bg-card/60 backdrop-blur-md transition-colors duration-150",
          dragOver ? "border-primary/60" : "border-border/60",
        )}
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragOver(false)
          handleFiles(e.dataTransfer.files)
        }}
      >
        <input
          type="file"
          accept="image/*"
          className="absolute inset-0 cursor-pointer opacity-0"
          onChange={(e) => handleFiles(e.currentTarget.files)}
          aria-label="Upload profile photo"
        />
        {value ? (
          <img
            src={value || "/placeholder.svg"}
            alt="Profile"
            className="h-24 w-24 rounded-full object-cover shadow-sm ring-1 ring-black/5"
          />
        ) : (
          <div className="grid gap-1">
            <div className="text-sm font-medium">Upload photo</div>
            <div className="text-xs text-muted-foreground">Drag & drop or click</div>
          </div>
        )}
      </div>
      {value && (
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">Photo added</div>
          <Button variant="ghost" size="sm" onClick={() => onChange(undefined)}>
            Remove
          </Button>
        </div>
      )}
    </div>
  )
}
