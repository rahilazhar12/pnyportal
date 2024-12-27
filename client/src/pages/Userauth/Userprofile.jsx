import React, { useEffect, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useParams } from "react-router-dom";

const Resume = () => {
  const { id } = useParams();
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/users/getprofile/${id}`
        );
        const data = await response.json();
        setProfileData(data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfileData();
  }, []);

  const downloadPDF = () => {
    const button = document.getElementById("downloadButton");
    button.style.visibility = "hidden";

    const input = document.getElementById("cvToDownload");
    html2canvas(input, {
      useCORS: true,
      scale: 2, // Adjust scale based on your content size and quality needs
      logging: true,
      onclone: (document) => {
        document.getElementById("downloadButton").style.visibility = "hidden";
      },
    }).then((canvas) => {
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      const contentDataURL = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      let position = 0;

      pdf.addImage(contentDataURL, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(contentDataURL, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("profile-cv.pdf");
      button.style.visibility = "visible";
    });
  };

  return (
    <div id="cvToDownload" className="mx-auto shadow-lg overflow-hidden">
      {profileData ? (
        <>
          <div className="bg-gradient-to-r from-blue-500 to-teal-500 p-6 text-white text-center">
            <div className="mb-3">
              <img
                className="h-24 w-24 rounded-full mx-auto"
                src={`${import.meta.env.VITE_API_URL}/${
                  profileData.profilePicture
                }`}
                alt="Profile picture"
              />
            </div>
            <h1 className="text-2xl font-semibold">
              {profileData.fname} {profileData.lname}
            </h1>
            <p>
              {new Date(profileData.dob).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}{" "}
              | {profileData.age} years old | {profileData.gender}
            </p>
            <p>
              {profileData.martialstatus} | {profileData.religion}
            </p>
            <p>{profileData.mobile}</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-3">
            <div class="bg-gray-100 p-4 rounded-lg shadow-md">
              <h2 class="text-lg font-semibold mb-2">Personal Information</h2>
              <ul>
                <li>
                  <strong>Father's Name:</strong> {profileData.fathername}
                </li>
                <li>
                  <strong>Nationality:</strong> {profileData.nationality}
                </li>
                <li>
                  <strong>CNIC:</strong> {profileData.CNIC}
                </li>
                <li>
                  <strong>CNIC Expiry:</strong> {profileData.CNICexpiry}
                </li>
              </ul>
            </div>

            <div class="bg-gray-100 p-4 rounded-lg shadow-md">
              <h2 class="text-lg font-semibold mb-2">Contact Information</h2>
              <ul>
                <li>
                  <strong>Land Line:</strong> {profileData.landline}
                </li>
                <li>
                  <strong>Postal Address:</strong> {profileData.postaladdress}
                </li>
                <li>
                  <strong>Residential Country:</strong> {profileData.ResCountry}
                </li>
                <li>
                  <strong>Residential City:</strong> {profileData.ResCity}
                </li>
              </ul>
            </div>

            <div class="bg-gray-100 p-4 rounded-lg shadow-md">
              <h2 class="text-lg font-semibold mb-2">Other Information</h2>
              <ul>
                <li>
                  <strong>Hafiz Quran:</strong> {profileData.hafizquran}
                </li>
                <li>
                  <strong>Ex-Service Official:</strong>{" "}
                  {profileData.ExServiceOfficial}
                </li>
                <li>
                  <strong>Government Official:</strong>{" "}
                  {profileData.Governmentofficial}
                </li>
                <li>
                  <strong>Disabled:</strong> {profileData.Disabled}
                </li>
              </ul>
            </div>

            <div class="bg-gray-100 p-4 rounded-lg shadow-md">
              <h2 class="text-lg font-semibold mb-2">Target Job</h2>
              <ul>
                <li>
                  <strong>Job Title:</strong> {profileData.JobTitle}
                </li>
                <li>
                  <strong>Career Level:</strong> {profileData.CareerLevel}
                </li>
                <li>
                  <strong>Target Monthly Salary (PKR):</strong>{" "}
                  {profileData.TargetMonthlySalary}
                </li>
                <li>
                  <strong>Last Monthly Salary (PKR):</strong>{" "}
                  {profileData.LastMonthlySalary}
                </li>
              </ul>
            </div>
          </div>

          {/* Professional_____________________________________________________________________________________________________________ */}

          <div className="p-6 bg-white">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">
                Professional Experience(s)
              </h2>
              {profileData.jobs && profileData.jobs.length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="px-4 py-2 text-left">Position</th>
                      <th className="px-4 py-2 text-left">Company</th>
                      <th className="px-4 py-2 text-left">Dates</th>
                      <th className="px-4 py-2 text-left">Level</th>
                      <th className="px-4 py-2 text-left">Responsibilities</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profileData.jobs.map((job, index) => (
                      <tr
                        key={index}
                        className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
                      >
                        <td className="px-4 py-2">{job.positionTitle}</td>
                        <td className="px-4 py-2">{job.companyName}</td>
                        <td className="px-4 py-2">
                          {new Date(job.from).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}{" "}
                          -
                          {new Date(job.to).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </td>
                        <td className="px-4 py-2">{job.jobLevel}</td>
                        <td className="px-4 py-2">{job.jobResponsibilities}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div>No professional experience listed.</div>
              )}
            </div>
          </div>

          {/* Academic_____________________________________________________________________________________________________________ */}

          <div className="p-6 bg-white">
            <h2 className="text-xl font-semibold mb-4">
              Academic Information(s)
            </h2>
            {profileData.academics && profileData.academics.length > 0 ? (
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-4 py-2 text-left">Degree</th>
                    <th className="px-4 py-2 text-left">Institute</th>
                    <th className="px-4 py-2 text-left">Dates</th>
                    <th className="px-4 py-2 text-left">Major Subjects</th>
                    <th className="px-4 py-2 text-left">Marks Percentage</th>
                    <th className="px-4 py-2 text-left">Country</th>
                    <th className="px-4 py-2 text-left">Grading Criteria</th>
                    <th className="px-4 py-2 text-left">Position Holder</th>
                  </tr>
                </thead>
                <tbody>
                  {profileData.academics.map((academic, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
                    >
                      <td className="px-4 py-2">
                        {academic.degreeLevel} - {academic.degree}
                      </td>
                      <td className="px-4 py-2">{academic.institute}</td>
                      <td className="px-4 py-2">
                        {new Date(academic.startdate).toLocaleDateString(
                          "en-US",
                          { year: "numeric", month: "long", day: "numeric" }
                        )}{" "}
                        -
                        {new Date(academic.completiondate).toLocaleDateString(
                          "en-US",
                          { year: "numeric", month: "long", day: "numeric" }
                        )}
                      </td>
                      <td className="px-4 py-2">{academic.majorsubjects}</td>
                      <td className="px-4 py-2">{academic.markspercentage}</td>
                      <td className="px-4 py-2">{academic.Country}</td>
                      <td className="px-4 py-2">{academic.gradingcriteria}</td>
                      <td className="px-4 py-2">{academic.positionholder}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div>No academic information listed.</div>
            )}
          </div>
          {/* Skills_____________________________________________________________________________________________________________ */}

          <div className="p-6 bg-white">
            <h2 className="text-xl font-semibold mb-4">Skill(s)</h2>
            {profileData.skills && profileData.skills.length > 0 ? (
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-4 py-2 text-left">Skill</th>
                    <th className="px-4 py-2 text-left">SkillLevel</th>
                    <th className="px-4 py-2 text-left">SkillSummary</th>
                  </tr>
                </thead>
                <tbody>
                  {profileData.skills.map((skills, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
                    >
                      <td className="px-4 py-2">{skills.Skill}</td>
                      <td className="px-4 py-2">{skills.SkillLevel}</td>
                      <td className="px-4 py-2">{skills.SkillSummary}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div>No Skills information listed.</div>
            )}
          </div>
          {/* Trainings_____________________________________________________________________________________________________________ */}

          <div className="p-6 bg-white">
            <h2 className="text-xl font-semibold mb-4">Training(s):</h2>
            {profileData.trainings && profileData.trainings.length > 0 ? (
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-4 py-2 text-left">TRAINING</th>
                    <th className="px-4 py-2 text-left">INSTITUTE</th>
                    <th className="px-4 py-2 text-left">FROM</th>
                    <th className="px-4 py-2 text-left">TO</th>
                  </tr>
                </thead>
                <tbody>
                  {profileData.trainings.map((trainings, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
                    >
                      <td className="px-4 py-2">{trainings.Training}</td>
                      <td className="px-4 py-2">{trainings.Institute}</td>
                      <td className="px-4 py-2">{trainings.From}</td>
                      <td className="px-4 py-2">{trainings.To}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div>No Training information listed.</div>
            )}
          </div>
          {/* certification_____________________________________________________________________________________________________________ */}

          <div className="p-6 bg-white">
            <h2 className="text-xl font-semibold mb-4">Certification(s):</h2>
            {profileData.certification &&
            profileData.certification.length > 0 ? (
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-4 py-2 text-left">Certification</th>
                    <th className="px-4 py-2 text-left">Institute</th>
                    <th className="px-4 py-2 text-left">Valid Till</th>
                  </tr>
                </thead>
                <tbody>
                  {profileData.certification.map((trainings, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
                    >
                      <td className="px-4 py-2">{trainings.Certification}</td>
                      <td className="px-4 py-2">{trainings.Institutee}</td>
                      <td className="px-4 py-2">{trainings.ValidTill}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div>No certification information listed.</div>
            )}
          </div>
          {/* achievements_____________________________________________________________________________________________________________ */}

          <div className="p-6 bg-white">
            <h2 className="text-xl font-semibold mb-4">Achievement(s):</h2>
            {profileData.achievements && profileData.achievements.length > 0 ? (
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-4 py-2 text-left">Achievement Title</th>
                    <th className="px-4 py-2 text-left">
                      Achievement Descriptions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {profileData.achievements.map((trainings, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
                    >
                      <td className="px-4 py-2">
                        {trainings.AchievementTitle}
                      </td>
                      <td className="px-4 py-2">
                        {trainings.AchievementDescriptions}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div>No achievements information listed.</div>
            )}
          </div>
          {/* research_____________________________________________________________________________________________________________ */}

          <div className="p-6 bg-white">
            <h2 className="text-xl font-semibold mb-4">Research(s):</h2>
            {profileData.research && profileData.research.length > 0 ? (
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-4 py-2 text-left">Research Title</th>
                    <th className="px-4 py-2 text-left">Publication Venue</th>
                    <th className="px-4 py-2 text-left">Publication Link</th>
                  </tr>
                </thead>
                <tbody>
                  {profileData.research.map((trainings, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
                    >
                      <td className="px-4 py-2">{trainings.ResearchTitle}</td>
                      <td className="px-4 py-2">
                        {trainings.PublicationVenue}
                      </td>
                      <td className="px-4 py-2">{trainings.PublicationLink}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div>No research information listed.</div>
            )}
          </div>

          {/* _________________________________________________________________________________________________________________ */}
        </>
      ) : (
        <div className="text-center p-6 bg-white">
          <p>No data available</p>
        </div>
      )}

      <div className="flex justify-center p-4">
        <button
          id="downloadButton"
          onClick={downloadPDF}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Download CV
        </button>
      </div>
    </div>
  );
};

export default Resume;
