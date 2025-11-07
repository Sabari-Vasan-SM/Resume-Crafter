"use client"

import { forwardRef } from "react"
import { cn } from "@/lib/utils"
import { useResume } from "@/lib/use-resume"

export const ResumePreview = forwardRef<HTMLDivElement, {}>(function ResumePreview(_, ref) {
  const { resume } = useResume()
  const fontClass = resume.font === "serif" ? "font-serif" : resume.font === "mono" ? "font-mono" : "font-sans"

  return (
    <div
      ref={ref}
      className={cn(
        "mx-auto w-full max-w-[850px] rounded-xl bg-card p-6 shadow-md ring-1 ring-border/60",
        "transition-all duration-200",
        fontClass,
      )}
      role="region"
      aria-label="Live resume preview"
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="size-20 shrink-0 overflow-hidden rounded-lg bg-muted">
          {resume.photo ? (
            <img src={resume.photo || "/placeholder.svg"} alt="Profile photo" className="size-full object-cover" />
          ) : (
            <img src="/professional-headshot.png" alt="" className="size-full object-cover" />
          )}
        </div>
        <div className="min-w-0">
          <h2 className="text-pretty text-2xl font-semibold leading-tight">{resume.name || "Your Name"}</h2>
          <p className="text-muted-foreground text-sm">{resume.title || "Professional Title"}</p>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            {resume.contact.email && <span>{resume.contact.email}</span>}
            {resume.contact.phone && <span>{resume.contact.phone}</span>}
            {resume.contact.location && <span>{resume.contact.location}</span>}
            {resume.contact.website && <span>{resume.contact.website}</span>}
            {resume.contact.linkedin && <span>LinkedIn: {resume.contact.linkedin}</span>}
            {resume.contact.github && <span>GitHub: {resume.contact.github}</span>}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="my-5 h-px bg-border" />

      {/* Summary */}
      <section className="grid gap-1">
        <h3 className="text-sm font-semibold text-primary">Summary</h3>
        <p className="text-pretty text-sm leading-relaxed">
          {resume.summary || "Write a concise professional summary highlighting your value and key strengths."}
        </p>
      </section>

      {/* Skills */}
      {resume.skills.length > 0 && (
        <>
          <div className="my-5 h-px bg-border" />
          <section className="grid gap-2">
            <h3 className="text-sm font-semibold text-primary">Skills</h3>
            <ul className="flex flex-wrap gap-2">
              {resume.skills.map((s, i) => (
                <li key={`${s}-${i}`} className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">
                  {s}
                </li>
              ))}
            </ul>
          </section>
        </>
      )}

      {/* Areas of Interest */}
      {(resume.areasOfInterest?.length ?? 0) > 0 && (
        <>
          <div className="my-5 h-px bg-border" />
          <section className="grid gap-2">
            <h3 className="text-sm font-semibold text-primary">Areas of Interest</h3>
            <ul className="flex flex-wrap gap-2">
              {resume.areasOfInterest!.map((a, i) => (
                <li key={`${a}-${i}`} className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">
                  {a}
                </li>
              ))}
            </ul>
          </section>
        </>
      )}

      {/* Projects */}
      {resume.projects && resume.projects.length > 0 && (
        <>
          <div className="my-5 h-px bg-border" />
          <section className="grid gap-2">
            <h3 className="text-sm font-semibold text-primary">Projects</h3>
            <div className="grid gap-4">
              {resume.projects.map((p, idx) => (
                <div key={idx} className="grid gap-1">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-pretty">{p.name || "Project"}</div>
                    {p.liveLink && (
                      <a href={p.liveLink} target="_blank" rel="noreferrer" className="text-xs text-primary underline">
                        Live
                      </a>
                    )}
                  </div>
                  {p.description && <p className="text-sm text-muted-foreground">{p.description}</p>}
                  {(p.techStack?.length ?? 0) > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {p.techStack!.map((t, ti) => (
                        <span key={ti} className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* Experience */}
      {resume.experience.length > 0 && (
        <>
          <div className="my-5 h-px bg-border" />
          <section className="grid gap-2">
            <h3 className="text-sm font-semibold text-primary">Experience</h3>
            <div className="grid gap-4">
              {resume.experience.map((exp, idx) => (
                <div key={idx} className="grid gap-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div className="font-medium">
                      {exp.role || "Role"} · {exp.company || "Company"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {(exp.start || "Start") + " — " + (exp.end || "Present")}
                    </div>
                  </div>
                  {(exp.bullets?.length ?? 0) > 0 && (
                    <ul className="ml-4 list-disc text-sm leading-relaxed">
                      {exp.bullets!.map((b, bi) => (
                        <li key={bi} className="pl-1">
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* Education */}
      {resume.education.length > 0 && (
        <>
          <div className="my-5 h-px bg-border" />
          <section className="grid gap-2">
            <h3 className="text-sm font-semibold text-primary">Education</h3>
            <div className="grid gap-3">
              {resume.education.map((ed, idx) => (
                <div key={idx} className="flex flex-wrap items-baseline justify-between gap-2">
                  <div className="font-medium">
                    {ed.degree || "Degree"} · {ed.school || "School"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {(ed.start || "Start") + " — " + (ed.end || "End")}
                  </div>
                  {ed.details && <p className="basis-full text-sm text-muted-foreground">{ed.details}</p>}
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  )
})
