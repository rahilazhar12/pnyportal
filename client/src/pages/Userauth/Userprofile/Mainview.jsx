import React from "react";
import Personal from "./Personal";
import SummarySection from "./Summary";
import ProfileCompletion from "./Profilecompletion";
import ExperienceSection from "./Experience";
import JobPreferences from "./Jobpreference";
import Education from "./Education";
import Projects from "./Projects";
import Language from "./Language";
import Skills from "./Skills";

const Mainview = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto flex flex-wrap lg:flex-nowrap gap-6">
        {/* Left Section */}
        <div className="flex-1">
          <Personal />
          <SummarySection />
          <ExperienceSection />
          <Skills />
          <Education />
          <JobPreferences />
          <Projects />
          <Language />
        </div>

        {/* Right Section */}
        <div className="w-full lg:w-1/3">
          <ProfileCompletion />
        </div>
      </div>
    </div>
  );
};

export default Mainview;
