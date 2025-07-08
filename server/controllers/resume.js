import Resume from '../models/resume.js';
import { fetchAndParseResume } from '../utils/parseResume.js';
import { generateCoverLetter, generateImprovedResume, generateJobSpecificResume } from '../utils/openaiClient.js';
import JobPost from '../models/jobPost.js';
import puppeteer from 'puppeteer';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';

function formatPlainTextToHTML(text) {
    // Example simple logic:
    // - Lines in ALL CAPS => <h2> headings
    // - Lines starting with '-' or '*' => <li>
    // - Blank lines => new <div class="section">
    const lines = text.split('\n');
    let html = '';
    let inList = false;
  
    lines.forEach(line => {
      if(line.trim() === '') {
        if(inList) {
          html += '</ul>';
          inList = false;
        }
        html += '<div class="section"></div>';
      } else if (/^[A-Z\s]+$/.test(line.trim())) {
        if(inList) {
          html += '</ul>';
          inList = false;
        }
        html += `<h2>${line.trim()}</h2>`;
      } else if (/^\s*[-*]\s+/.test(line)) {
        if(!inList) {
          html += '<ul>';
          inList = true;
        }
        const li = line.replace(/^\s*[-*]\s+/, '');
        html += `<li>${li}</li>`;
      } else {
        if(inList) {
          html += '</ul>';
          inList = false;
        }
        html += `<p>${line.trim()}</p>`;
      }
    });
  
    if(inList) html += '</ul>';
  
    return html;
}  

function parseResumeToDocxParagraphs(text) {
    const lines = text.split('\n');
    const children = [];
  
    lines.forEach(line => {
      const trimmed = line.trim();
      if(trimmed === '') {
        children.push(new Paragraph(''));
      } else if (/^[A-Z\s]+$/.test(trimmed)) {
        children.push(new Paragraph({
          text: trimmed,
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 200 },
        }));
      } else if (/^[-*]\s+/.test(trimmed)) {
        const bulletText = trimmed.replace(/^[-*]\s+/, '');
        children.push(new Paragraph({
          text: bulletText,
          bullet: { level: 0 }
        }));
      } else {
        children.push(new Paragraph(trimmed));
      }
    });
  
    return children;
}



export const uploadResume = async (req, res) => {
    try {
        const user = req.user._id;
        const { title, fileUrl, fileType } = req.body;

        if(!fileUrl || !fileType) return res.status(400).json({ message: 'Missing fileUrl or filetype' });

        let content;
        try {
          content = await fetchAndParseResume(fileUrl, fileType);;
        } catch (parseErr) {
          console.error('[UPLOAD] parsing failed:', parseErr);
          return res.status(500).json({ message: 'Parsing failed', error: parseErr.message });
        }

        const resume = await Resume.create({
            user,
            title,
            fileUrl,
            content
        });

        res.status(200).json({ message: "Resume uploaded successfully" });
    } catch (error) {
        res.status(500).json({ message: 'Upload failed', error: error.message });
    }
}

export const improveResume = async (req, res) => {
    try {
        const user = req.user._id;
        const { resumeId } = req.params;

        const resume = await Resume.findOne({ _id: resumeId, user });
        if(!resume) return res.status(404).json({ message: "Resume not found" });

        const improvedContent = await generateImprovedResume(resume.content);

        const nextVersion = (resume.versions?.length || 0) + 1;

        resume.versions.push({
            versionNumber: nextVersion,
            content: improvedContent,
            type: 'generalImproved',
            createdAt: new Date()
        });

        await resume.save();

        res.status(200).json({ message: "Resume improved and saved as new version", versionNumber: nextVersion, improvedContent });

    } catch (error) {
        res.status(500).json({ message: 'Improvement failed', error: error.message });
    }
}

export const improveResumeForJob = async (req, res) => {
    try {
        const user = req.user._id;
        const { resumeId, jobId } = req.params;

        const resume = await Resume.findOne({ _id: resumeId, user });
        const job = await JobPost.findById(jobId);
        if(!resume || !job) return res.status(404).json({ message: 'Missing resume or job' });

        const improvedContent = await generateJobSpecificResume(resume.content, job);
        const nextVersion = (resume.versions?.length || 0) + 1;

        resume.versions.push({
            versionNumber: nextVersion,
            content: improvedContent,
            type: 'jobSpecific',
            job: job._id,
            createdAt: new Date()
        });

        await resume.save();

        res.status(200).json({ message: "Job-specific resume improved and saved as new version", versionNumber: nextVersion, improvedContent });
    } catch (error) {
        res.status(500).json({ message: 'Job-specific improvement failed', error: error.message });
    }
}

export const getUserResumes = async (req, res) => {
    try {
        const user = req.user._id;

        const resumes = await Resume.find({ user }).sort({ createdAt: -1 });

        if(!resumes || resumes.length === 0)  return res.status(200).json({ resumes: [] });

        const response = resumes.map(resume => ({
            id: resume._id,
            title: resume.title,
            fileUrl: resume.fileUrl,
            originalContent: resume.content,
            versions: resume.versions.map(version => ({
                versionNumber: version.versionNumber,
                type: version.type,
                job: version.job,
                content: version.content,
                contentPreview: version.content?.slice(0, 200) + '...' || '',
                createdAt: version.createdAt
            })),
            coverLetters: (resume.coverLetters || []).map(cl => ({
              versionNumber: cl.versionNumber,
              job: cl.job,
              content: cl.content,
              createdAt: cl.createdAt,
            })),
            createdAt: resume.createdAt,
            updatedAt: resume.updatedAt
        }))

        return res.status(200).json({ resumes: response });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

export const generateCoverLetterForJob = async (req, res) => {
    try {
        const user = req.user._id;
        const { resumeId, jobId } = req.params;

        const resume = await Resume.findOne({ _id: resumeId, user });
        const job = await JobPost.findById(jobId);

        if (!resume || !job) return res.status(404).json({ message: 'Resume or Job not found' });

        const coverLetterContent = await generateCoverLetter(resume.content, job);
        const nextVersion = (resume.coverLetters?.length || 0) + 1;

        resume.coverLetters.push({
            versionNumber: nextVersion,
            content: coverLetterContent,
            job: job._id,
            createdAt: new Date()
        });

        await resume.save();

        res.status(200).json({ message: "Cover letter generated and saved", versionNumber: nextVersion, content: coverLetterContent });
    } catch (error) {
        res.status(500).json({ message: 'Failed to generate cover letter', error: error.message });
    }
}

export const downloadResumeVersion = async (req, res) => {
    try {
      const { resumeId, versionNumber } = req.query;
      const format = req.query.format || 'pdf';
  
      const resume = await Resume.findOne({ _id: resumeId });
      if (!resume) return res.status(404).json({ message: "Resume not found" });
  
      let content;
      if (!versionNumber || versionNumber === '0') {
        content = resume.content;
      } else {
        const version = resume.versions.find(v => v.versionNumber === parseInt(versionNumber));
        if (!version) return res.status(404).json({ message: "Resume version not found" });
        content = version.content;
      }
  
      if (format === 'pdf') {
        const htmlContent = `
          <html>
            <head>
              <style>
                body {
                  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                  margin: 40px;
                  line-height: 1.4;
                  color: #222;
                }
                h2 {
                  color: #333;
                  border-bottom: 1px solid #ccc;
                  padding-bottom: 6px;
                  margin-top: 24px;
                  margin-bottom: 12px;
                }
                ul {
                  margin-top: 0;
                  padding-left: 20px;
                  margin-bottom: 20px;
                }
                p, li {
                  font-size: 12pt;
                  margin: 4px 0;
                }
              </style>
            </head>
            <body>
              ${formatPlainTextToHTML(content)}
            </body>
          </html>
        `;
  
        const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await browser.newPage();
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
        const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true, margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' } });
        await browser.close();
  
        res.set({
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="resume_v${versionNumber || 'original'}.pdf"`,
          'Content-Length': pdfBuffer.length,
        });
        return res.send(pdfBuffer);
      } else if (format === 'docx') {
        const children = parseResumeToDocxParagraphs(content);
  
        const doc = new Document({
          sections: [{
            children,
            properties: {}
          }],
        });
  
        const buffer = await Packer.toBuffer(doc);
  
        res.set({
          'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'Content-Disposition': `attachment; filename="resume_v${versionNumber || 'original'}.docx"`,
          'Content-Length': buffer.length,
        });
  
        return res.send(buffer);
      } else {
        return res.status(400).json({ message: 'Invalid format requested. Use pdf or docx.' });
      }
    } catch (error) {
      console.error('Download error:', error);
      return res.status(500).json({ message: 'Failed to generate resume download', error: error.message });
    }
};

export const downloadCoverLetter = async (req, res) => {
    try {
        const{ resumeId, versionNumber } = req.query;
        const format = req.query.format || 'pdf';

        const resume = await Resume.findOne({ _id: resumeId });
        if (!resume) return res.status(404).json({ message: "Resume not found" });

        let content;
        if(!versionNumber || versionNumber === '0') {
            return res.status(400).json({ message: 'Version number required for cover letter' });
        } else {
            const version = resume.coverLetters.find(version => version.versionNumber === parseInt(versionNumber));
            if (!version) return res.status(404).json({ message: "Resume version not found" });
            content = version.content;
        }

        if(format === 'pdf') {
          const htmlContent = `
          <html>
            <head>
              <style>
                body {
                  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                  margin: 40px;
                  line-height: 1.4;
                  color: #222;
                }
                h2 {
                  color: #333;
                  border-bottom: 1px solid #ccc;
                  padding-bottom: 6px;
                  margin-top: 24px;
                  margin-bottom: 12px;
                }
                ul {
                  margin-top: 0;
                  padding-left: 20px;
                  margin-bottom: 20px;
                }
                p, li {
                  font-size: 12pt;
                  margin: 4px 0;
                }
              </style>
            </head>
            <body>
              ${formatPlainTextToHTML(content)}
            </body>
          </html>
        `;
            const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
            const page = await browser.newPage();
            await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
            const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true, margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' } });
            await browser.close();

            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="resume_v${versionNumber || 'original'}.pdf"`,
                'Content-Length': pdfBuffer.length,
            });
            return res.send(pdfBuffer);
        } else if (format === 'docx') {
          const children = parseResumeToDocxParagraphs(content);
  
          const doc = new Document({
            sections: [{
              children,
              properties: {}
            }],
          });
    
          const buffer = await Packer.toBuffer(doc);
    
          res.set({
            'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'Content-Disposition': `attachment; filename="resume_v${versionNumber || 'original'}.docx"`,
            'Content-Length': buffer.length,
          });

            return res.send(buffer); 
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to download cover letter', error: error.message });
    }
}
