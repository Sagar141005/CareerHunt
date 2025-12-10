import React from "react";
import UserNavbar from "./job-seeker/UserNavbar";
import RecruiterPannel from "./recruiter/RecruiterPannel";

export const LayoutSetting = React.memo(({ children, user }) => {
  if (user.role === "recruiter") {
    return (
      <>
        <div className="md:hidden min-h-screen bg-neutral-50 dark:bg-neutral-950">
          <RecruiterPannel />
          <div className="px-4 py-6">{children}</div>
        </div>

        <div className="hidden md:flex h-screen bg-neutral-50 dark:bg-neutral-950">
          <RecruiterPannel />
          <div className="flex-1 overflow-y-auto px-8 py-10">{children}</div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300">
      <UserNavbar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">{children}</div>
    </div>
  );
});

export const LayoutProfile = React.memo(({ children, user }) => {
  if (user.role === "recruiter") {
    return (
      <>
        <div className="md:hidden min-h-screen bg-neutral-50 dark:bg-neutral-950">
          <RecruiterPannel /> <div>{children}</div>
        </div>
        <div className="hidden md:flex h-screen bg-neutral-50 dark:bg-neutral-950">
          <RecruiterPannel />
          <div className="flex-1 overflow-y-auto">{children}</div>
        </div>
      </>
    );
  }
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300">
      <UserNavbar /> <div>{children}</div>
    </div>
  );
});
