import React, { useEffect, useState } from "react";
import { FaBirthdayCake, FaMobile, FaFemale, FaMale } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import Loader from "../Loader/Loader";
import { useParams } from "react-router-dom";

const Cv1 = () => {
  const [profileData, setProfileData] = useState(null);
  const [profileImageDataUrl, setProfileImageDataUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { id } = useParams(); // Retrieve 'id' from URL parameters

  const getImageDataUrl = async (imageUrl) => {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;
        if (id) {
          // If 'id' is available, fetch data for that specific profile
          response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/v1/profile/profile/${id}`,
            {
              method: "GET",
              credentials: "include",
            }
          );
        } else {
          // If no 'id', fetch the default profile data with credentials
          response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/v1/profile/profile`,
            {
              method: "GET",
              credentials: "include",
            }
          );
        }

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setProfileData(data);

        // Fetch the profile image as a Data URL if available
        if (data.personalInfo?.profilePicture) {
          const imageUrl = `${import.meta.env.VITE_API_URL}/${
            data.personalInfo.profilePicture
          }`;
          const dataUrl = await getImageDataUrl(imageUrl);
          setProfileImageDataUrl(dataUrl);
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]); // re-run effect if 'id' changes

  if (loading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // Check if profileData is null or empty
  if (!profileData || Object.keys(profileData).length === 0) {
    return <div>No data available</div>;
  }

  const stripHtmlTags = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  return (
    <>
      <div className="max-w-4xl mx-auto h-full bg-gray-100 shadow-lg font-source-sans">
        <div className="flex flex-col md:flex-row">
          <div className="bg-black text-white p-6 md:w-1/2.5">
            <div className="flex items-center justify-center mb-6">
              {profileImageDataUrl && (
                <img
                  src={profileImageDataUrl}
                  alt="Profile picture of a man in a suit"
                  className="rounded-full border-4 border-white"
                />
              )}
            </div>
            <div className="mb-6 space-y-2">
              <div className="text-2xl font-bold text-center">
                {profileData.personalInfo?.name || "Not available"}
              </div>
              <div className="flex items-center gap-2">
                <span>
                  <MdEmail />
                </span>
                {profileData.personalInfo?.email || "Not available"}
              </div>

              <div className="flex items-center gap-2">
                <strong>
                  <FaBirthdayCake />
                </strong>
                {profileData.personalInfo?.dob || "Not available"}
              </div>
              <div className="flex items-center gap-2">
                <strong>
                  {profileData.personalInfo?.gender === "Male" ? (
                    <FaMale />
                  ) : (
                    <FaFemale />
                  )}
                </strong>
                {profileData.personalInfo?.gender || "Not available"}
              </div>
              <div className="flex items-center gap-2">
                <strong>
                  <FaMobile />
                </strong>
                {profileData.personalInfo?.mobile || "Not available"}
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Languages</h2>
              {profileData.language && profileData.language.length > 0 ? (
                profileData.language.map((lang) => (
                  <li
                    key={lang._id}
                    className="flex items-center gap-2 text-sm"
                  >
                    <span>{lang.country}</span>
                    <span>({lang.proficiency})</span>
                  </li>
                ))
              ) : (
                <p>No languages available</p>
              )}
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Skills</h2>
              {profileData.skills && profileData.skills.length > 0 ? (
                profileData.skills.map((skill) => (
                  <li
                    key={skill._id}
                    className="flex items-center gap-2 text-sm"
                  >
                    <span>{skill.skill}</span>
                    <span>({skill.experience})</span>
                  </li>
                ))
              ) : (
                <p>No skills available</p>
              )}
            </div>
          </div>
          <div className="p-6 md:w-2/3">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Summary</h2>
              <p className="text-justify">
                {profileData.summary
                  ? stripHtmlTags(profileData.summary)
                  : "No summary available."}
              </p>
            </div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Experience</h2>
              {profileData.experiences && profileData.experiences.length > 0 ? (
                profileData.experiences.map((experience) => (
                  <div className="mb-4" key={experience._id}>
                    <h3 className="text-sm font-bold">{experience.jobTitle}</h3>
                    <p className="text-gray-600">
                      {experience.company} - {experience.location}
                    </p>
                    <p className="text-gray-600">
                      {experience.startMonth} {experience.startYear} -{" "}
                      {experience.endMonth} {experience.endYear}
                    </p>
                    <p
                      dangerouslySetInnerHTML={{
                        __html: experience.description,
                      }}
                    />
                  </div>
                ))
              ) : (
                <div>No experience data available.</div>
              )}
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Education</h2>
              {profileData.education && profileData.education.length > 0 ? (
                profileData.education.map((edu) => (
                  <div className="mb-4" key={edu._id}>
                    <h3 className="text-sm font-bold">{edu.degreeTitle}</h3>
                    <p className="text-gray-600">
                      {edu.fieldOfStudy} - {edu.institution}
                    </p>
                    <p className="text-gray-600">
                      Completed in {edu.completionYear}
                    </p>
                  </div>
                ))
              ) : (
                <div>No education data available.</div>
              )}
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Projects</h2>
              {profileData.projects && profileData.projects.length > 0 ? (
                profileData.projects.map((project) => (
                  <div key={project._id} className="mb-4 rounded text-sm">
                    <h3 className="font-semibold">{project.name}</h3>
                    <p>
                      <strong>Description:</strong> {project.description}
                    </p>
                    <p>
                      <strong>Duration:</strong> {project.startMonth}{" "}
                      {project.startYear} -{" "}
                      {project.isOngoing
                        ? "Ongoing"
                        : `${project.endMonth} ${project.endYear}`}
                    </p>
                    <p>
                      <strong>Association:</strong> {project.association}
                    </p>
                    <a
                      href={project.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      {project.projectUrl}
                    </a>
                  </div>
                ))
              ) : (
                <p>No projects available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cv1;
