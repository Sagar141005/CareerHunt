import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const improveSectionText = async (text, type, jobDescription = "") => {
  let systemInstruction = "";
  let userContent = text;

  const styleGuide = `
    STYLE GUIDE:
    - Use simple, direct English. 
    - Avoid complex corporate jargon (e.g., instead of "leveraged," use "used").
    - Keep sentences short and punchy.
    - Write for a 10th-grade reading level.
  `;

  const atsContext = jobDescription
    ? `IMPORTANT: Tailor the content specifically to keywords found in this Job Description: \n"${jobDescription}"`
    : "Ensure the content is optimized for general Applicant Tracking Systems (ATS) by using standard industry keywords.";

  if (type === "summary") {
    systemInstruction = `
      You are an expert Resume Strategist and Career Coach. 
      Your goal is to write a high-impact Professional Summary that hooks a recruiter instantly.
      
      RULES:
      1. ${styleGuide}
      2. Write in the first person (implied "I") but do not use pronouns like "I" or "My" repeatedly. Start sentences with strong attributes or verbs.
      3. Keep it strictly under 4 sentences.
      4. Focus on: Years of experience, top hard skills, and one major quantifiable achievement.
      5. Tone: Professional, confident, and direct. No fluff words like "hard-working" or "dedicated".
      6. ${atsContext}
    `;
  } else if (type === "experience" || type === "project") {
    systemInstruction = `
      You are an expert Resume Writer specialized in transforming generic tasks into high-impact achievements.
      
      RULES:
      1. ${styleGuide}
      2. output ONLY valid Markdown bullet points (using '-').
      3. Apply the Google XYZ formula: "Accomplished [X] as measured by [Y], by doing [Z]".
      4. Start every bullet with a strong power verb (e.g., Engineered, Spearheaded, Optimized).
      5. QUANTIFY results wherever possible (e.g., "reduced latency by 20%", "managed $50k budget"). If exact numbers aren't in the input, focus on the *scale* or *impact*.
      6. Do NOT include headers, company names, or dates. Just the bullet points.
      7. ${atsContext}
    `;
  }

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemInstruction },
      {
        role: "user",
        content: `Here is the draft text to rewrite:\n"${userContent}"`,
      },
    ],
    temperature: 0.6,
  });

  return response.choices[0].message.content.trim();
};

export const generateCoverLetter = async (resumeJson, jobPost) => {
  const experienceSummary = resumeJson.experience
    ? resumeJson.experience
        .map((exp) => `${exp.position} at ${exp.company}`)
        .join(", ")
    : "relevant experience";

  const systemInstruction = `
    You are a Senior Recruiter and Career Coach. You write cover letters that get candidates interviewed.
    
    PHILOSOPHY:
    - NO PLACEHOLDERS. Do not use brackets like [Your Name] or [Company Address].
    - NO HEADER. Do not write the address block. Start directly with "Dear Hiring Manager,".
    - NO ROBOT WORDS. Do not use: "Spearheaded", "Leveraged", "Showcased", "Passionate", "Thrilled", "Synergy".
    - NO CLICHÉS. Avoid saying "I am the perfect fit." Instead, say "I am writing because..."
    - Write like a human. Use simple, conversational English (Grade 8 reading level).
    - Focus on the "Hook": Why the candidate is the *perfect solution* to the company's problem.
    
    STRATEGY FOR SHORT JOB DESCRIPTIONS:
    - If the Job Description is short or vague, focus on the specific Company Name (${jobPost.company}) and why the candidate admires them.
    - Do not repeat generic phrases like "I am excited about the opportunity."
  `;

  const prompt = `
    Write a tailored cover letter based on the following data.

    CANDIDATE PROFILE:
    Name: ${resumeJson.personal.fullName}
    Current Role: ${resumeJson.personal.profession}
    Top Skills: ${resumeJson.skills}
    Experience History: ${experienceSummary}
    
    TARGET JOB:
    Role: ${jobPost.title}
    Company: ${jobPost.company}
    Job Description Context: ${jobPost.description.slice(
      0,
      1000
    )} (truncated for focus)

    STRUCTURE REQUIREMENTS:
    1. Start immediately with why the candidate fits this specific role (The Hook).
    2. Mention 1-2 specific hard skills or achievements from the history provided.
    3. If you don't have a specific metric (numbers), don't make one up. Just describe the impact.
    4. Sign off simply with "Best regards, ${resumeJson.personal.fullName}".
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemInstruction },
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
  });

  return response.choices[0].message.content.trim();
};
