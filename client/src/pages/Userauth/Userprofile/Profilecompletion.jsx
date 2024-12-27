import React, { useState } from "react";
import useProfileCompletion from "../../hooks/useProfileCompletion";
import ProgressBar from "../../../components/progressbar/Progressbar";
import TaskList from "../../../components/Tasklist/Tasklist";
import VideoUpload from "../../../components/Videouplaod/Videoupload";
import CVModal from "../../../components/Cv/Cvmodal";

const ProfileCompletion = () => {
  const { completionPercentage, loading, tasks, noData } = useProfileCompletion();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCvLoading, setIsCvLoading] = useState(false);

  const handleDownloadCv = () => {
    setIsCvLoading(true);
    setIsModalOpen(true);
    setTimeout(() => setIsCvLoading(false), 1500);
  };

  if (loading) {
    return <div className="text-center text-blue-500 font-semibold">Loading...</div>;
  }

  if (noData) {
    return <div className="text-center text-gray-500">No data found.</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-lg mx-auto">
      <VideoUpload />
      <button
        className="w-full bg-[#4688F1] text-white font-semibold py-3 rounded-3xl"
        onClick={handleDownloadCv}
      >
        Download CV
      </button>
      <h3 className="text-[18px] font-semibold mt-6">
        Update your profile for better job recommendations
      </h3>
      <ProgressBar percentage={completionPercentage} />
      <TaskList tasks={tasks} />
      <CVModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isLoading={isCvLoading}
      />
    </div>
  );
};

export default ProfileCompletion;
