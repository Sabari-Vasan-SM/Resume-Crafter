"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { useResume } from "@/lib/use-resume"
import { PhotoUpload } from "@/components/photo-upload"
import { ResumePreview } from "@/components/resume-preview"
import { DownloadButtons } from "@/components/download-buttons"
import { Wand2, Edit3 } from "lucide-react"

type TagInputProps = {
  tags: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
}

function TagInput({ tags, onChange, placeholder }: TagInputProps) {
  const [value, setValue] = useState("")

  function addTag(t: string) {
    const v = t.trim()
    if (!v) return
    if (tags.includes(v)) return
    onChange([...tags, v])
    setValue("")
  }

  function removeTag(idx: number) {
    onChange(tags.filter((_, i) => i !== idx))
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addTag(value)
    } else if (e.key === "Backspace" && value === "" && tags.length) {
      // remove last when empty backspace
      removeTag(tags.length - 1)
    }
  }

  return (
    <div className="grid gap-2">
      <div className="flex flex-wrap items-center gap-2">
        {tags.map((t, i) => (
          <span key={t + i} className="inline-flex items-center gap-2 rounded-md bg-primary/10 px-2 py-1 text-sm">
            <span>{t}</span>
            <button
              type="button"
              aria-label={`Remove ${t}`}
              onClick={() => removeTag(i)}
              className="-mr-1 rounded px-1 text-xs opacity-70 hover:opacity-100"
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onKeyDown}
      />
    </div>
  )
}

export default function Page() {
  const { resume, setResume, replaceResume } = useResume()
  const [loadingAI, setLoadingAI] = useState(false)
  const [editing, setEditing] = useState(true)
  const previewRef = useRef<HTMLDivElement | null>(null)

  const onGenerate = async () => {
    setLoadingAI(true)
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resume),
      })
      if (!res.ok) throw new Error("Failed to generate")
      const data = await res.json()
      replaceResume({
        ...resume,
        summary: data.summary || resume.summary,
        experience: resume.experience.map((exp, i) => ({
          ...exp,
          bullets: data.experienceBullets?.[i] ?? exp.bullets,
        })),
        skills: data.skills?.length ? data.skills : resume.skills,
      })
    } catch (e) {
      console.log("[v0] AI generate error:", (e as Error).message)
    } finally {
      setLoadingAI(false)
    }
  }

  const sidebar = (
    <aside
      className={cn("glass-card flex h-full flex-col gap-4 p-4", "transition-all duration-200")}
      aria-label="Resume editor"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-pretty">Editor</h2>
        <Badge variant="secondary">Live</Badge>
      </div>

      <PhotoUpload value={resume.photo} onChange={(src) => setResume({ photo: src })} />

      <div className="grid gap-3">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          placeholder="Jane Doe"
          value={resume.name}
          onChange={(e) => setResume({ name: e.target.value })}
        />
      </div>
      <div className="grid gap-3">
        <Label htmlFor="title">Professional Title</Label>
        <Input
          id="title"
          placeholder="Senior Software Engineer"
          value={resume.title}
          onChange={(e) => setResume({ title: e.target.value })}
        />
      </div>

      <Separator />

      <div className="grid gap-3">
        <Label>Contact</Label>
        <div className="grid grid-cols-2 gap-3">
          <Input
            placeholder="Email"
            value={resume.contact.email}
            onChange={(e) => setResume({ contact: { ...resume.contact, email: e.target.value } })}
          />
          <Input
            placeholder="Phone"
            value={resume.contact.phone}
            onChange={(e) => setResume({ contact: { ...resume.contact, phone: e.target.value } })}
          />
          <Input
            placeholder="Location"
            value={resume.contact.location}
            onChange={(e) =>
              setResume({
                contact: { ...resume.contact, location: e.target.value },
              })
            }
          />
          <Input
            placeholder="Website"
            value={resume.contact.website || ""}
            onChange={(e) =>
              setResume({
                contact: { ...resume.contact, website: e.target.value },
              })
            }
          />
          <Input
            placeholder="LinkedIn"
            value={resume.contact.linkedin || ""}
            onChange={(e) =>
              setResume({
                contact: { ...resume.contact, linkedin: e.target.value },
              })
            }
          />
          <Input
            placeholder="GitHub"
            value={resume.contact.github || ""}
            onChange={(e) =>
              setResume({
                contact: { ...resume.contact, github: e.target.value },
              })
            }
          />
        </div>
      </div>

      <div className="grid gap-3">
        <Label htmlFor="summary">Summary</Label>
        <Textarea
          id="summary"
          placeholder="Concise professional summary..."
          className="min-h-24"
          value={resume.summary}
          onChange={(e) => setResume({ summary: e.target.value })}
        />
      </div>

      <div className="grid gap-3">
        <Label>Skills</Label>
        <TagInput
          tags={resume.skills}
          onChange={(tags) => setResume({ skills: tags })}
          placeholder="Add a skill and press Enter"
        />
      </div>

      <div className="grid gap-3">
        <Label>Areas of Interest</Label>
        <TagInput
          tags={resume.areasOfInterest || []}
          onChange={(tags) => setResume({ areasOfInterest: tags })}
          placeholder="Add an interest and press Enter"
        />
      </div>

      <Separator />

      <SectionEditor
        title="Education"
        items={resume.education}
        onChange={(items) => setResume({ education: items })}
        renderItem={(item, update) => (
          <div className="grid grid-cols-2 gap-2">
            <Input placeholder="School" value={item.school} onChange={(e) => update({ school: e.target.value })} />
            <Input placeholder="Degree" value={item.degree} onChange={(e) => update({ degree: e.target.value })} />
            <Input placeholder="Start" value={item.start} onChange={(e) => update({ start: e.target.value })} />
            <Input placeholder="End" value={item.end} onChange={(e) => update({ end: e.target.value })} />
            <Textarea
              placeholder="Details"
              className="col-span-2 min-h-16"
              value={item.details || ""}
              onChange={(e) => update({ details: e.target.value })}
            />
          </div>
        )}
        getNewItem={() => ({
          school: "",
          degree: "",
          start: "",
          end: "",
          details: "",
        })}
      />

      <SectionEditor
        title="Experience"
        items={resume.experience}
        onChange={(items) => setResume({ experience: items })}
        renderItem={(item, update) => (
          <div className="grid grid-cols-2 gap-2">
            <Input placeholder="Company" value={item.company} onChange={(e) => update({ company: e.target.value })} />
            <Input placeholder="Role" value={item.role} onChange={(e) => update({ role: e.target.value })} />
            <Input placeholder="Start" value={item.start} onChange={(e) => update({ start: e.target.value })} />
            <Input placeholder="End" value={item.end} onChange={(e) => update({ end: e.target.value })} />
            <Textarea
              placeholder="Bullets (one per line)"
              className="col-span-2 min-h-20"
              value={(item.bullets || []).join("\n")}
              onChange={(e) =>
                update({
                  bullets: e.currentTarget.value
                    .split("\n")
                    .map((b) => b.trim())
                    .filter(Boolean),
                })
              }
            />
          </div>
        )}
        getNewItem={() => ({
          company: "",
          role: "",
          start: "",
          end: "",
          bullets: [],
        })}
      />

      <Separator />

      <div className="grid gap-3">
        <Label>Style & Template</Label>
        <div className="grid grid-cols-2 gap-3">
          <select
            className="rounded-md border bg-background px-3 py-2 text-sm"
            value={resume.template}
            onChange={(e) => setResume({ template: e.target.value as "classic" | "modern" })}
          >
            <option value="modern">Modern</option>
            <option value="classic">Classic</option>
          </select>

          <select
            className="rounded-md border bg-background px-3 py-2 text-sm"
            value={resume.font}
            onChange={(e) => setResume({ font: e.target.value as "sans" | "serif" | "mono" })}
          >
            <option value="sans">Sans</option>
            <option value="serif">Serif</option>
            <option value="mono">Monospace</option>
          </select>

          <select
            className="rounded-md border bg-background px-3 py-2 text-sm"
            value={resume.color}
            onChange={(e) => setResume({ color: e.target.value as "blue" | "gray" })}
          >
            <option value="blue">Blue</option>
            <option value="gray">Gray</option>
          </select>

          <div className="flex items-center justify-between rounded-md border px-3 py-2">
            <span className="text-sm">Sidebar Right</span>
            <Switch
              checked={resume.layout === "right"}
              onCheckedChange={(v) => setResume({ layout: v ? "right" : "left" })}
              aria-label="Toggle sidebar position"
            />
          </div>
        </div>
      </div>
    </aside>
  )

  return (
    <main
      className={cn("mx-auto flex min-h-dvh max-w-[1400px] flex-col gap-4 p-4 md:p-6")}
      style={
        resume.color === "blue"
          ? { ["--color-primary" as any]: "oklch(0.6 0.12 240)" }
          : { ["--color-primary" as any]: "oklch(0.5 0.02 260)" }
      }
    >
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-primary/10" />
          <div>
            <h1 className="text-balance text-xl font-semibold md:text-2xl">Resume crafter</h1>
            <p className="text-muted-foreground text-xs md:text-sm">Professional. Editable. Exportable.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => setEditing((v) => !v)} className="gap-2">
            <Edit3 className="size-4" />
            {editing ? "Preview Focus" : "Edit"}
          </Button>
          <Button onClick={onGenerate} disabled={loadingAI} className="gap-2">
            <Wand2 className="size-4" />
            {loadingAI ? "Generating..." : "Generate Resume"}
          </Button>
        </div>
      </header>

      <div
        className={cn(
          "grid flex-1 gap-4",
          resume.layout === "right" ? "md:grid-cols-[420px_1fr]" : "md:grid-cols-[1fr_420px]",
        )}
      >
        {resume.layout === "right" ? (
          <>
            {editing && sidebar}
            <Card className="glass-card relative flex min-h-[70dvh] items-stretch overflow-hidden">
              <CardContent className="p-3 md:p-6">
                <ResumePreview ref={previewRef} />
              </CardContent>
              <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-black/5" />
            </Card>
          </>
        ) : (
          <>
            <Card className="glass-card relative flex min-h-[70dvh] items-stretch overflow-hidden">
              <CardContent className="p-3 md:p-6">
                <ResumePreview ref={previewRef} />
              </CardContent>
              <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-black/5" />
            </Card>
            {editing && sidebar}
          </>
        )}
      </div>

      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Export</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">Download your resume as PDF or PNG.</p>
          <DownloadButtons previewRef={previewRef as React.RefObject<HTMLDivElement>} />
        </CardContent>
      </Card>
    </main>
  )
}

type EditorItemProps<T> = {
  title: string
  items: T[]
  onChange: (items: T[]) => void
  renderItem: (item: T, update: (patch: Partial<T>) => void) => React.ReactNode
  getNewItem: () => T
}

function SectionEditor<T>({ title, items, onChange, renderItem, getNewItem }: EditorItemProps<T>) {
  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between">
        <Label>{title}</Label>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => onChange([...items, getNewItem()])}>
            Add
          </Button>
          {items.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => onChange(items.slice(0, -1))}>
              Remove
            </Button>
          )}
        </div>
      </div>
      <div className="grid gap-3">
        {items.map((it, idx) => {
          const update = (patch: Partial<T>) => {
            const copy = [...items]
            copy[idx] = { ...(copy[idx] as any), ...patch }
            onChange(copy)
          }
          return (
            <Card key={idx} className="glass-card">
              <CardContent className="grid gap-3 p-3">{renderItem(it, update)}</CardContent>
            </Card>
          )
        })}
        {items.length === 0 && <p className="text-xs text-muted-foreground">No items yet. Click Add to create one.</p>}
      </div>
    </div>
  )
}
