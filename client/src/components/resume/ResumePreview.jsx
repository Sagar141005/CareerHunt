import React from "react";

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString + "-01");
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

const ModernLayout = ({ data }) => {
  const accentColor = data.color || "#2563eb";

  return (
    <div className="p-[15mm]">
      <header
        className="border-b-2 pb-5 mb-5 flex justify-between items-start"
        style={{ borderColor: accentColor }}
      >
        <div className="flex gap-4">
          {data.personal.imageUrl && (
            <img
              src={data.personal.imageUrl}
              alt="Profile"
              className="w-16 h-16 rounded-lg object-cover border border-neutral-200"
            />
          )}
          <div>
            <h1 className="text-2xl font-extrabold uppercase tracking-wide text-neutral-900 mb-1">
              {data.personal.fullName || "Your Name"}
            </h1>
            <p
              className="text-base font-semibold uppercase tracking-wide"
              style={{ color: accentColor }}
            >
              {data.personal.profession || "Target Role"}
            </p>
          </div>
        </div>
        <div className="text-right text-xs text-neutral-600 font-medium space-y-1">
          <p>{data.personal.email}</p>
          <p>{data.personal.phone}</p>
          <p>{data.personal.location}</p>
          {data.personal.linkedin && (
            <a
              className="block hover:underline"
              href={data.personal.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: accentColor }}
            >
              LinkedIn
            </a>
          )}
          {data.personal.website && (
            <a
              className="block hover:underline"
              href={data.personal.website}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: accentColor }}
            >
              Portfolio
            </a>
          )}
        </div>
      </header>

      <div className="space-y-6">
        {data.personal.summary && (
          <section>
            <h3
              className="text-xs font-bold uppercase tracking-widest border-b border-neutral-200 pb-1 mb-2"
              style={{ color: accentColor }}
            >
              Profile
            </h3>
            <p className="text-neutral-800 text-justify leading-5">
              {data.personal.summary}
            </p>
          </section>
        )}

        {data.experience.length > 0 && (
          <section>
            <h3
              className="text-xs font-bold uppercase tracking-widest border-b border-neutral-200 pb-1 mb-3"
              style={{ color: accentColor }}
            >
              Experience
            </h3>
            <div className="space-y-3">
              {data.experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between font-bold text-neutral-900 text-sm">
                    <span>{exp.role}</span>
                    <span className="text-neutral-500 font-medium text-xs">
                      {formatDate(exp.startDate)} -{" "}
                      {exp.isCurrent ? "Present" : formatDate(exp.endDate)}
                    </span>
                  </div>
                  <div className="text-xs italic text-neutral-600 mb-1 font-semibold">
                    {exp.company}
                  </div>
                  <p className="text-neutral-700 whitespace-pre-line text-xs">
                    {exp.details}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.projects.length > 0 && (
          <section>
            <h3
              className="text-xs font-bold uppercase tracking-widest border-b border-neutral-200 pb-1 mb-3"
              style={{ color: accentColor }}
            >
              Projects
            </h3>
            <div className="space-y-3">
              {data.projects.map((proj) => (
                <div key={proj.id}>
                  <div className="flex justify-between font-bold text-neutral-900 text-sm">
                    <span>{proj.title}</span>
                    {proj.link && (
                      <a
                        href={proj.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs hover:underline"
                        style={{ color: accentColor }}
                      >
                        View Project &rarr;
                      </a>
                    )}
                  </div>
                  <div className="text-[10px] font-bold text-neutral-500 mb-1 uppercase">
                    {proj.technologies}
                  </div>
                  <p className="text-neutral-700 text-xs">{proj.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.education.length > 0 && (
          <section>
            <h3
              className="text-xs font-bold uppercase tracking-widest border-b border-neutral-200 pb-1 mb-3"
              style={{ color: accentColor }}
            >
              Education
            </h3>
            <div className="space-y-2">
              {data.education.map((edu) => (
                <div key={edu.id} className="flex justify-between items-center">
                  <div>
                    <span className="font-bold text-neutral-900 text-sm block">
                      {edu.school}
                    </span>
                    <span className="text-neutral-600 text-xs">
                      {edu.degree}
                    </span>
                  </div>
                  <span className="text-neutral-500 text-xs font-bold">
                    {formatDate(edu.endDate)}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.skills.length > 0 && (
          <section>
            <h3
              className="text-xs font-bold uppercase tracking-widest border-b border-neutral-200 pb-1 mb-2"
              style={{ color: accentColor }}
            >
              Skills
            </h3>
            <p className="text-neutral-800 text-xs leading-relaxed font-medium">
              {data.skills.join(" • ")}
            </p>
          </section>
        )}
      </div>
    </div>
  );
};

const ProfessionalLayout = ({ data }) => {
  const accentColor = data.color || "#000000";

  return (
    <div className="p-[15mm] font-serif">
      <header
        className="text-center border-b pb-6 mb-6"
        style={{ borderColor: accentColor }}
      >
        <h1
          className="text-3xl font-bold uppercase mb-2 tracking-widest"
          style={{ color: accentColor }}
        >
          {data.personal.fullName || "Your Name"}
        </h1>
        <p className="text-sm italic text-gray-700 mb-3">
          {data.personal.profession || "Target Role"}
        </p>
        <div className="text-xs text-black flex justify-center flex-wrap gap-3">
          {data.personal.email && <span>{data.personal.email}</span>}
          {data.personal.phone && <span>• {data.personal.phone}</span>}
          {data.personal.location && <span>• {data.personal.location}</span>}
          {data.personal.linkedin && (
            <>
              •{" "}
              <a
                href={data.personal.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                LinkedIn
              </a>
            </>
          )}
          {data.personal.website && (
            <>
              •{" "}
              <a
                href={data.personal.website}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Portfolio
              </a>
            </>
          )}
        </div>
      </header>

      <div className="space-y-5">
        {data.personal.summary && (
          <section>
            <h3
              className="text-sm font-bold uppercase border-b border-gray-400 mb-2 pb-1"
              style={{ color: accentColor }}
            >
              Professional Summary
            </h3>
            <p className="text-xs text-justify leading-5 text-gray-800">
              {data.personal.summary}
            </p>
          </section>
        )}

        {data.experience.length > 0 && (
          <section>
            <h3
              className="text-sm font-bold uppercase border-b border-gray-400 mb-3 pb-1"
              style={{ color: accentColor }}
            >
              Experience
            </h3>
            {data.experience.map((exp) => (
              <div key={exp.id} className="mb-4">
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="font-bold text-sm text-black">
                    {exp.company}
                  </h4>
                  <span className="text-xs font-bold text-gray-600">
                    {formatDate(exp.startDate)} –{" "}
                    {exp.isCurrent ? "Present" : formatDate(exp.endDate)}
                  </span>
                </div>
                <div className="text-xs italic text-gray-700 mb-1">
                  {exp.role}
                </div>
                <p className="text-xs text-gray-800 whitespace-pre-line leading-relaxed">
                  {exp.details}
                </p>
              </div>
            ))}
          </section>
        )}

        {data.projects.length > 0 && (
          <section>
            <h3
              className="text-sm font-bold uppercase border-b border-gray-400 mb-3 pb-1"
              style={{ color: accentColor }}
            >
              Projects
            </h3>
            {data.projects.map((proj) => (
              <div key={proj.id} className="mb-3">
                <div className="flex justify-between items-baseline">
                  <h4 className="font-bold text-sm text-black">{proj.title}</h4>
                  {proj.link && (
                    <a
                      href={proj.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs italic hover:underline"
                      style={{ color: accentColor }}
                    >
                      View Project
                    </a>
                  )}
                </div>
                <div className="text-[10px] text-gray-600 mb-1">
                  {proj.technologies}
                </div>
                <p className="text-xs text-gray-800 leading-tight">
                  {proj.description}
                </p>
              </div>
            ))}
          </section>
        )}

        <div className="grid grid-cols-2 gap-8">
          {data.education.length > 0 && (
            <section>
              <h3
                className="text-sm font-bold uppercase border-b border-gray-400 mb-3 pb-1"
                style={{ color: accentColor }}
              >
                Education
              </h3>
              {data.education.map((edu) => (
                <div key={edu.id} className="mb-2">
                  <div className="font-bold text-xs text-black">
                    {edu.school}
                  </div>
                  <div className="text-xs text-gray-700">{edu.degree}</div>
                  <div className="text-[10px] italic text-gray-600">
                    {formatDate(edu.endDate)}
                  </div>
                </div>
              ))}
            </section>
          )}

          {data.skills.length > 0 && (
            <section>
              <h3
                className="text-sm font-bold uppercase border-b border-gray-400 mb-3 pb-1"
                style={{ color: accentColor }}
              >
                Skills
              </h3>
              <div className="text-xs text-gray-800 leading-relaxed">
                {data.skills.join(", ")}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};
const CreativeLayout = ({ data }) => {
  const accentColor = data.color || "#10b981";

  return (
    <div className="flex h-full min-h-[297mm]">
      <div
        className="w-[30%] text-white p-6 flex flex-col gap-6"
        style={{
          backgroundColor: accentColor,
          WebkitPrintColorAdjust: "exact",
          printColorAdjust: "exact",
        }}
      >
        <div className="text-center">
          {data.personal.imageUrl && (
            <img
              src={data.personal.imageUrl}
              alt="Profile"
              className="block w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-white/20"
            />
          )}
          <h1 className="text-xl font-bold uppercase leading-tight mb-2">
            {data.personal.fullName}
          </h1>
          <p className="text-xs text-white/80 font-medium uppercase tracking-widest">
            {data.personal.profession}
          </p>
        </div>

        <div className="text-[10px] space-y-2 opacity-90 border-t border-white/20 pt-4">
          <p className="font-bold text-white/60 uppercase">Contact</p>
          <div className="break-words">{data.personal.email}</div>
          <div>{data.personal.phone}</div>
          <div>{data.personal.location}</div>
          {data.personal.linkedin && (
            <a
              href={data.personal.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="block underline hover:text-white"
            >
              LinkedIn
            </a>
          )}
          {data.personal.website && (
            <a
              href={data.personal.website}
              target="_blank"
              rel="noopener noreferrer"
              className="block underline hover:text-white"
            >
              Portfolio
            </a>
          )}
        </div>

        {data.skills.length > 0 && (
          <div className="border-t border-white/20 pt-4">
            <p className="font-bold text-white/60 uppercase text-[10px] mb-2">
              Skills
            </p>
            <div className="flex flex-wrap gap-1">
              {data.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="bg-white/20 text-[9px] px-2 py-1 rounded text-white"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 bg-white p-8 print:p-8">
        {data.personal.summary && (
          <section className="mb-6">
            <h3
              className="text-lg font-bold uppercase mb-2"
              style={{ color: accentColor }}
            >
              Profile
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              {data.personal.summary}
            </p>
          </section>
        )}

        <div
          className="h-1 w-10 mb-6"
          style={{ backgroundColor: accentColor }}
        ></div>

        {data.experience.length > 0 && (
          <section className="mb-6">
            <h3
              className="text-lg font-bold uppercase mb-4"
              style={{ color: accentColor }}
            >
              Experience
            </h3>
            <div className="border-l-2 border-neutral-200 pl-4 space-y-5">
              {data.experience.map((exp) => (
                <div key={exp.id} className="relative">
                  <div
                    className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: accentColor }}
                  ></div>
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="text-sm font-bold text-neutral-900">
                      {exp.role}
                    </h4>
                    <span className="text-xs font-semibold text-neutral-500">
                      {formatDate(exp.startDate)} -{" "}
                      {exp.isCurrent ? "Present" : formatDate(exp.endDate)}
                    </span>
                  </div>
                  <div
                    className="text-xs font-semibold mb-2"
                    style={{ color: accentColor }}
                  >
                    {exp.company}
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {exp.details}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.projects.length > 0 && (
          <section>
            <h3
              className="text-lg font-bold uppercase mb-4"
              style={{ color: accentColor }}
            >
              Projects
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {data.projects.map((proj) => (
                <div
                  key={proj.id}
                  className="bg-gray-50 p-3 rounded border-l-2"
                  style={{ borderLeftColor: accentColor }}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="font-bold text-sm text-neutral-900">
                      {proj.title}
                    </div>
                    {proj.link && (
                      <a
                        href={proj.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] underline hover:no-underline"
                        style={{ color: accentColor }}
                      >
                        Link
                      </a>
                    )}
                  </div>
                  <div
                    className="text-[10px] font-bold uppercase mb-1"
                    style={{ color: accentColor }}
                  >
                    {proj.technologies}
                  </div>
                  <p className="text-[10px] text-neutral-600 leading-tight">
                    {proj.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

const ResumePreview = ({ data }) => {
  const getLayout = () => {
    switch (data.theme) {
      case "professional":
        return <ProfessionalLayout data={data} />;
      case "creative":
        return <CreativeLayout data={data} />;
      case "modern":
      default:
        return <ModernLayout data={data} />;
    }
  };

  return (
    <div>
      <div
        id="resume-preview"
        className="bg-white w-[210mm] min-h-[297mm]
        shadow-2xl origin-top scale-[0.7] xl:scale-[0.85] 2xl:scale-100 transition-transform duration-300 print:scale-100 print:shadow-none print:m-0 print:w-full overflow-visible"
      >
        {getLayout()}
      </div>
      <style>{`
        @media print {
          @page { margin: 0; size: auto; }
          body { background: white; }
          body * { visibility: hidden; }
          #resume-preview, #resume-preview * { visibility: visible; }
          #resume-preview {
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            margin: 0 !important;
            padding: 0 !important;
            transform: none !important;
            z-index-9999;
          }
        }
      `}</style>
    </div>
  );
};

export default ResumePreview;
