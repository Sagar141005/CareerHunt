import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const generateImprovedResume = async (resumeText) => {
    const prompt = `
    You are a top-tier AI resume coach and writer.
    
    Please improve the following resume with strict formatting and ordering rules. The result must follow this structure **exactly and consistently**:
    
    1. First line: FULL NAME in ALL CAPS.
    2. Next lines: Contact information — address, phone, and email — each on its own line.
    3. Then a blank line.
    4. Then section headings in ALL CAPS: PROFESSIONAL SUMMARY, SKILLS, VOLUNTEER EXPERIENCE, ACCOMPLISHMENTS, etc.
    5. Under each section, use bullet points starting with "- " (dash + space) for each item.
    6. Each section must be separated by a **single blank line**.
    7. Do not add any symbols (e.g. ◆, •), emojis, or markdown (**bold**, *, etc.).
    8. Do not move or reorder the content. Only enhance grammar, clarity, and impact.
    9. Do not invent new content, jobs, roles, companies, or technologies.
    10. Keep language professional, concise, and ATS-friendly.
    
    Your goal is to enhance only the grammar, tone, and formatting of the resume, while preserving the original structure and information.
    
    --- RESUME TO IMPROVE ---
    ${resumeText}
    
    Return only the improved resume content as plain text. Do not include explanations or additional comments.
    `;
    



    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
            { role: 'system', content: `You are a world-class resume coach and career strategist. You help professionals refine their resumes for clarity, structure, and competitiveness in the job market while maintaining truthfulness and professionalism.` },
            { role: 'user', content: prompt },
        ],
    });

    return response.choices[0].message.content.trim();
}

export const generateJobSpecificResume = async (resumeText, jobPost) => {
    const {
        title,
        company,
        level,
        location,
        description,
        type,
        employmentType,
        department,
        tags = []
    } = jobPost;

    const sanitizedTags = tags
    .filter(tag => typeof tag === 'string' && tag.trim().length > 0)
    .slice(0, 10)
    .join(', ');

    const prompt = `
    You are a top-tier AI resume strategist with deep expertise in:
    - Tailoring resumes to specific job descriptions
    - Optimizing resumes for ATS (Applicant Tracking Systems)
    - Highlighting relevant skills, technologies, and industry language
    - Aligning resume tone, structure, and clarity with the target role

    Your task is to improve the resume below so that it is aligned with the provided job context.

    DO NOT fabricate new jobs or experiences. ONLY optimize the existing content to:
    - Emphasize alignment with the job's requirements, title, and responsibilities
    - Prioritize relevant skills, keywords, and industry terminology from the job posting
    - Rewrite or reorganize content to better match the role
    - Remove unrelated or redundant information
    - Maintain a truthful, professional tone with improved clarity and grammar

    --- FORMATTING RULES ---
    1. FIRST LINE: Full name in ALL CAPS.
    2. FOLLOWING LINES: Contact information (address, phone, email), each on its own line.
    3. Then a blank line.
    4. ALL SECTION HEADINGS must be in ALL CAPS on their own line (e.g., PROFESSIONAL SUMMARY, SKILLS, EXPERIENCE, PROJECTS, ACCOMPLISHMENTS, etc.)
    5. Use bullet points starting with "- " (dash + space) under all sections (for skills, responsibilities, and achievements).
    6. Use exactly ONE blank line between sections.
    7. DO NOT use symbols like ◆ or markdown like **bold**, *, or _.
    8. DO NOT include introductory or closing comments (e.g., “--- IMPROVED RESUME ---”).
    9. Return clean plain text ONLY.

    --- ORIGINAL RESUME ---
    ${resumeText}

    --- JOB CONTEXT ---
    Job Title: ${title}
    Company: ${company}
    Location: ${location}
    Level: ${level}
    Job Type: ${type} (${employmentType})
    Department: ${department}
    Tags / Skills: ${sanitizedTags}

    Full Job Description:
    ${description}

    Return only the fully updated resume content in plain text, formatted exactly as described above.
    `;



    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
            { role: 'system', content: `You are an expert resume optimization assistant for a professional job-matching platform. Your goal is to help candidates succeed by tailoring their resumes truthfully to job descriptions and improving their chances with recruiters and applicant tracking systems.` },
            { role: 'user', content: prompt },
        ]
    });

    return response.choices[0].message.content.trim();
}


export const generateCoverLetter = async (resumeText, jobPost) => {
    const {
        title,
        company,
        level,
        location,
        description,
        department,
        employmentType,
        tags = []
    } = jobPost;

    const sanitizedTags = tags
        .filter(tag => typeof tag === 'string' && tag.trim().length > 0)
        .slice(0, 10)
        .join(', ');

    const jobContext = `
    Job Title: ${title}
    Company: ${company}
    Location: ${location}
    Level: ${level}
    Employment Type: ${employmentType}
    Department: ${department}
    Key Tags: ${sanitizedTags}

    Full Job Description:
    ${description}
    `;


    const today = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    const prompt = `
    You are a professional career assistant and expert cover letter writer.
    
    Write a concise, personalized, and compelling cover letter tailored to the job description and the candidate’s actual experience.
    
    **Your Goals:**
    - Begin the letter with the candidate's contact info and today’s date: ${today}
    - Mirror the tone and style appropriate to the company and job level
    - Do not invent achievements — only use what is plausible based on resume text
    - Avoid filler and clichés — be specific, sincere, and impactful
    - Use active voice and strong verbs
    - Try to incorporate STAR method subtly (Situation, Task, Action, Result)
    - Do not use Markdown or formatting characters like asterisks or underscores. Return plain text only.
    
    **Length:** Keep it under 400 words, with proper formatting (salutation, body, closing).
    
    --- CANDIDATE RESUME ---
    ${resumeText}
    
    --- JOB POSTING ---
    ${jobContext}
    
    Write the full cover letter addressed to the hiring team at ${company}. Return only the letter content, including contact info and date at the top.
    `;
    
    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
            {
                role: 'system',
                content: `You are a top-tier cover letter generator with deep understanding of modern recruiting, writing tone, and tailoring communication for maximum impact.`
            },
            {
                role: 'user',
                content: prompt
            }
        ]
    });

    return response.choices[0].message.content.trim();
};
