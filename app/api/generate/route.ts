import { NextResponse } from "next/server"
import { generateText } from "ai"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, title, summary, skills, experience } = body as {
      name: string
      title: string
      summary: string
      skills: string[]
      experience: Array<{ company: string; role: string; start: string; end: string; bullets: string[] }>
    }

    const prompt = `
You are a career coach. Write a concise, professional resume summary (3-4 sentences) and bullet points per role.
Return JSON with keys: summary, experienceBullets (array of bullet arrays), skills (refined top 10).

Candidate:
Name: ${name || "Candidate"}
Title: ${title || "Professional"}
Current summary: ${summary || "(none)"}
Skills: ${(skills || []).join(", ") || "(none)"}
Experience:\n${(experience || [])
      .map(
        (e, idx) =>
          `#${idx + 1} ${e.role || "Role"} at ${e.company || "Company"} (${e.start || "Start"} - ${
            e.end || "End"
          })\nBullets: ${(e.bullets || []).join(" | ")}`,
      )
      .join("\n\n")}
Output strict JSON without code fences.
`

    const { text } = await generateText({
      model: "openai/gpt-5-mini",
      prompt,
    })

    let parsed = { summary, experienceBullets: [], skills }
    try {
      parsed = JSON.parse(text)
    } catch {
      // best-effort fallback: keep existing
    }

    return NextResponse.json(parsed)
  } catch (e) {
    return NextResponse.json({ error: "Failed to generate" }, { status: 500 })
  }
}
