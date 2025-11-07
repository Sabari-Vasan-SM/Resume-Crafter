"use client"

import useSWR from "swr"

export type ResumeData = {
  name: string
  title: string
  contact: {
    email: string
    phone: string
    location: string
    website?: string
    linkedin?: string
    github?: string
  }
  summary: string
  skills: string[]
  areasOfInterest?: string[]
  projects: Array<{ name: string; description?: string; techStack: string[]; liveLink?: string }>
  education: Array<{ school: string; degree: string; start: string; end: string; details?: string }>
  experience: Array<{ company: string; role: string; start: string; end: string; bullets: string[] }>
  photo?: string
  template: "classic" | "modern"
  font: "sans" | "serif" | "mono" | "inter" | "merri"
  color: "blue" | "gray"
  layout: "left" | "right"
}

const DEFAULT_RESUME: ResumeData = {
  name: "",
  title: "",
  contact: { email: "", phone: "", location: "", website: "", linkedin: "", github: "" },
  summary: "",
  skills: [],
  projects: [],
  education: [],
  experience: [],
  photo: undefined,
  template: "modern",
  font: "sans",
  color: "blue",
  layout: "right",
}

export function useResume() {
  const { data, mutate } = useSWR<ResumeData>("resume", {
    fallbackData: DEFAULT_RESUME,
    keepPreviousData: true,
  })

  function setResume(patch: Partial<ResumeData>) {
    mutate({ ...(data as ResumeData), ...patch }, false)
  }

  function replaceResume(next: ResumeData) {
    mutate(next, false)
  }

  return { resume: data as ResumeData, setResume, replaceResume }
}
