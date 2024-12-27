import React, { useState, useEffect } from "react";
import Personal from "./Personal";
import { useForm } from "react-hook-form";
import Experience from "./Experience";
import Academics from "./Academics";
import Skills from "./Skills";
import Trainings from "./Trainings";
import Certification from "./Certification";
import Achievement from "./Achievement";
import Reasearch from "./Reasearch";
import Targetjobs from "./Targetjobs";

// Define the titles of the steps here
const stepTitles = [
  "Personal Information",
  "Experience",
  "Academics",
  "Skills",
  "Training",
  "Certification",
  "Achievement",
  "Research",
  "Target Job",
];

const Newprofile = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false); // Loading state
  const [canProceed, setCanProceed] = useState(false);
  const [accessibleSteps, setAccessibleSteps] = useState([
    true,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  const progressPercentage = (currentStep / (stepTitles.length - 1)) * 100;

  const User = sessionStorage.getItem("user");
  const token = User ? JSON.parse(User).token : null;
  const id = User ? JSON.parse(User)._id : null;

  console.log(token);

  const selectStep = (index) => {
    setCurrentStep(index); // Set the current step to the clicked step index
  };

  // const nextStep = () => {
  //   if (canProceed && currentStep < stepTitles.length - 1) {
  //     setCurrentStep((prevStep) => prevStep + 1);
  //     setAccessibleSteps((prevAccessibleSteps) =>
  //       prevAccessibleSteps.map((accessible, index) => index <= currentStep + 1 ? true : accessible)
  //     );
  //     // Reset canProceed if needed, based on your form's validation logic
  //     // setCanProceed(false);
  //   }
  // };

  const nextStep = () => {
    setCurrentStep((prev) => (prev < stepTitles.length - 1 ? prev + 1 : prev));
  };
  const previousStep = () => {
    setCurrentStep((prev) => (prev > 0 ? prev - 1 : prev));
  };

  // Personal
  const [formData, setFormData] = React.useState({
    firstName: "",
    lastName: "",
    dob: "",
    martialstatus: "",
    fathername: "",
    religion: "",
    mobile: "",
    landline: "",
    postaladdress: "",
    domicile: "",
    ResCountry: "",
    ResCity: "",
    nationality: "",
    CNIC: "",
    CNICexpiry: "",
    hafizquran: "",
    ExServiceOfficial: "",
    Governmentofficial: "",
    Disabled: "",
    profilePicture: "",
    JobTitle: "",
    CareerLevel: "",
    TargetMonthlySalary: "",
    LastMonthlySalary: "",
  });

  // Experience
  const [experiences, setExperiences] = useState([]);
  const [currentExperience, setCurrentExperience] = useState({
    positionTitle: "",
    from: "",
    to: "",
    companyName: "",
    jobLevel: "",
    jobResponsibilities: "",
  });

  const handleAddExperience = () => {
    const allFieldsFilled = Object.values(currentExperience).every(
      (value) => value.trim() !== ""
    );
    if (allFieldsFilled) {
      // All fields are filled, proceed to add the currentAcademics to the academics array
      setExperiences((prevAcademics) => [...prevAcademics, currentExperience]);
      // Clear the current input fields for a new entry
      setCurrentExperience({
        positionTitle: "",
        from: "",
        to: "",
        companyName: "",
        jobLevel: "",
        jobResponsibilities: "",
      });
    } else {
      // Not all fields are filled, maybe show an alert or a message to the user
      alert("Please fill in all fields before adding the Experience record.");
    }
  };
  // ______________________________________________________________________________________
  // Academics
  const [academics, setAcademics] = useState([]);
  const [currentacademics, setCurrentacademics] = useState({
    degreeLevel: "",
    degree: "",
    institute: "",
    majorsubjects: "",
    startdate: "",
    completiondate: "",
    Country: "",
    markspercentage: "",
    positionholder: "",
    gradingcriteria: "",
  });
  const handleAddacademics = () => {
    // Check if all fields in currentacademics are filled
    const allFieldsFilled = Object.values(currentacademics).every(
      (value) => value.trim() !== ""
    );
    if (allFieldsFilled) {
      // All fields are filled, proceed to add the currentAcademics to the academics array
      setAcademics((prevAcademics) => [...prevAcademics, currentacademics]);
      // Clear the current input fields for a new entry
      setCurrentacademics({
        degreeLevel: "",
        degree: "",
        institute: "",
        majorsubjects: "",
        startdate: "",
        completiondate: "",
        Country: "",
        markspercentage: "",
        positionholder: "",
        gradingcriteria: "",
      });
    } else {
      // Not all fields are filled, maybe show an alert or a message to the user
      alert("Please fill in all fields before adding the academic record.");
    }
  };

  // ________________________________________________________________________________________________________
  // Skills
  const [skills, setSkills] = useState([]);
  const [currentskills, setCurrentskills] = useState({
    Skill: "",
    SkillLevel: "",
    SkillSummary: "",
  });
  const handleAddskills = () => {
    // Check if all fields in currentacademics are filled
    const allFieldsFilled = Object.values(currentskills).every(
      (value) => value.trim() !== ""
    );
    if (allFieldsFilled) {
      // All fields are filled, proceed to add the currentAcademics to the academics array
      setSkills((prevAcademics) => [...prevAcademics, currentskills]);
      // Clear the current input fields for a new entry
      setCurrentskills({
        Skill: "",
        SkillLevel: "",
        SkillSummary: "",
      });
    } else {
      // Not all fields are filled, maybe show an alert or a message to the user
      alert("Please fill in all fields before adding the Skills record");
    }
  };
  // ________________________________________________________________________________________________________
  // Trainings
  const [trainings, setTrainings] = useState([]);
  const [currenttrainings, setCurrenttrainings] = useState({
    Training: "",
    Institute: "",
    From: "",
    To: "",
  });
  const handleAddtrainings = () => {
    // Check if all fields in currentacademics are filled
    const allFieldsFilled = Object.values(currenttrainings).every(
      (value) => value.trim() !== ""
    );
    if (allFieldsFilled) {
      // All fields are filled, proceed to add the currentAcademics to the academics array
      setTrainings((prevAcademics) => [...prevAcademics, currenttrainings]);
      // Clear the current input fields for a new entry
      setCurrenttrainings({
        Training: "",
        Institute: "",
        From: "",
        To: "",
      });
    } else {
      // Not all fields are filled, maybe show an alert or a message to the user
      alert("Please fill in all fields before adding the Skills record");
    }
  };
  // ________________________________________________________________________________________________________
  // Certification
  const [certification, setCertification] = useState([]);
  const [currentcertification, setCurrentcertification] = useState({
    Certification: "",
    Institutee: "",
    ValidTill: "",
  });
  const handleAddcertification = () => {
    // Check if all fields in currentacademics are filled
    const allFieldsFilled = Object.values(currentcertification).every(
      (value) => value.trim() !== ""
    );
    if (allFieldsFilled) {
      // All fields are filled, proceed to add the currentAcademics to the academics array
      setCertification((prevAcademics) => [
        ...prevAcademics,
        currentcertification,
      ]);
      // Clear the current input fields for a new entry
      setCurrentcertification({
        Certification: "",
        Institutee: "",
        ValidTill: "",
      });
    } else {
      // Not all fields are filled, maybe show an alert or a message to the user
      alert("Please fill in all fields before adding the Skills record");
    }
  };
  // ________________________________________________________________________________________________________
  // Achievement
  const [achievements, setAchievements] = useState([]);
  const [currentachievement, setCurrentachievement] = useState({
    AchievementTitle: "",
    AchievementDescriptions: "",
  });
  const handleAddachievement = () => {
    // Check if all fields in currentacademics are filled
    const allFieldsFilled = Object.values(currentachievement).every(
      (value) => value.trim() !== ""
    );
    if (allFieldsFilled) {
      // All fields are filled, proceed to add the currentAcademics to the academics array
      setAchievements((prevAcademics) => [
        ...prevAcademics,
        currentachievement,
      ]);
      // Clear the current input fields for a new entry
      setCurrentachievement({
        AchievementTitle: "",
        AchievementDescriptions: "",
      });
    } else {
      // Not all fields are filled, maybe show an alert or a message to the user
      alert("Please fill in all fields before adding the Skills record");
    }
  };
  // ________________________________________________________________________________________________________
  // Research
  const [research, setresearch] = useState([]);
  const [currentresearch, setCurrentresearch] = useState({
    ResearchTitle: "",
    PublicationVenue: "",
    PublicationLink: "",
  });
  const handleAddresearch = () => {
    // Check if all fields in currentacademics are filled
    const allFieldsFilled = Object.values(currentresearch).every(
      (value) => value.trim() !== ""
    );
    if (allFieldsFilled) {
      // All fields are filled, proceed to add the currentAcademics to the academics array
      setresearch((prevAcademics) => [...prevAcademics, currentresearch]);
      // Clear the current input fields for a new entry
      setCurrentresearch({
        ResearchTitle: "",
        PublicationVenue: "",
        PublicationLink: "",
      });
    } else {
      // Not all fields are filled, maybe show an alert or a message to the user
      alert("Please fill in all fields before adding the Skills record");
    }
  };

  // _________________________________________________________________________________

  const calculateAge = (dob) => {
    if (!dob) return "";
    const birthday = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthday.getFullYear();
    const m = today.getMonth() - birthday.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthday.getDate())) {
      age--;
    }
    return age;
  };

  const handleChange = (event) => {
    const { name, files } = event.target;

    // Check if the input field is for files
    if (name === "profilePicture" && files.length > 0) {
      // Assuming you only want the first selected file
      const file = files[0];
      if (file && file.size > 2 * 1024 * 1024) {
        alert("The size of the image should be 2 MB or less.");
        event.target.value = ""; // Reset the file input
      }

      // Update your formData state with the selected file
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: file,
      }));
    } else {
      const { name, value } = event.target;
      let newFormData = {
        ...formData,
        [name]: value,
      };
      setCurrentExperience((prevState) => ({
        ...prevState,
        [name]: value,
      }));
      setCurrentacademics((prevState) => ({
        ...prevState,
        [name]: value,
      }));
      setCurrentskills((prevState) => ({
        ...prevState,
        [name]: value,
      }));
      setCurrenttrainings((prevState) => ({
        ...prevState,
        [name]: value,
      }));
      setCurrentcertification((prevState) => ({
        ...prevState,
        [name]: value,
      }));
      setCurrentachievement((prevState) => ({
        ...prevState,
        [name]: value,
      }));
      setCurrentresearch((prevState) => ({
        ...prevState,
        [name]: value,
      }));

      // Automatically calculate age when dob changes
      if (name === "dob") {
        const age = calculateAge(value);
        newFormData = { ...newFormData, age };
      }
      setFormData(newFormData);
    }
  };

  const { handleSubmit } = useForm();

  const onSubmit = async () => {
    setLoading(true); // Start loading
    // Create a FormData object
    const submitFormData = new FormData();

    submitFormData.append("fname", formData.firstName);
    submitFormData.append("lname", formData.lastName);
    submitFormData.append("dob", formData.dob);
    submitFormData.append("age", formData.age.toString()); // Assuming age is stored as a number and needs to be converted to a string
    submitFormData.append("gender", formData.gender);
    submitFormData.append("martialstatus", formData.martialstatus);
    submitFormData.append("fathername", formData.fathername);
    submitFormData.append("religion", formData.religion);
    submitFormData.append("mobile", formData.mobile);
    submitFormData.append("landline", formData.landline);
    submitFormData.append("postaladdress", formData.postaladdress);
    submitFormData.append("domicile", formData.domicile);
    submitFormData.append("ResCountry", formData.ResCountry);
    submitFormData.append("ResCity", formData.ResCity);
    submitFormData.append("nationality", formData.nationality);
    submitFormData.append("CNIC", formData.CNIC);
    submitFormData.append("CNICexpiry", formData.CNICexpiry);
    submitFormData.append("hafizquran", formData.hafizquran);
    submitFormData.append("ExServiceOfficial", formData.ExServiceOfficial);
    submitFormData.append("Governmentofficial", formData.Governmentofficial);
    submitFormData.append("Disabled", formData.Disabled);
    submitFormData.append("JobTitle", formData.JobTitle);
    submitFormData.append("CareerLevel", formData.CareerLevel);
    submitFormData.append("TargetMonthlySalary", formData.TargetMonthlySalary);
    submitFormData.append("LastMonthlySalary", formData.LastMonthlySalary);

    // Append JSON data for complex objects
    submitFormData.append("skills", JSON.stringify(skills));
    submitFormData.append("jobs", JSON.stringify(experiences)); // Assuming `experiences` is the array for jobs
    submitFormData.append("academics", JSON.stringify(academics));
    submitFormData.append("trainings", JSON.stringify(trainings));
    submitFormData.append("certification", JSON.stringify(certification));
    submitFormData.append("achievements", JSON.stringify(achievements));
    submitFormData.append("research", JSON.stringify(research));

    // Append the profile picture if available and correctly referenced
    // This assumes you have a method to capture and set the profile picture file in state
    if (formData.profilePicture) {
      submitFormData.append("profilePicture", formData.profilePicture);
    }

    try {
      let response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/users/profile`,
        {
          method: "POST",
          body: submitFormData,
          credentials: "include", // Ensure credentials are included
        }
      );

      const responseData = await response.json();

      if (response.ok) {
        // Success response handling
        alert(responseData.message); // Backend should provide a success message
        // Optional: Redirect or update UI upon success
      } else {
        // Error response handling
        alert(
          "Registration failed: " +
            (responseData.message || "An unknown error occurred")
        );
        // Optional: Handle specific error scenarios based on responseData.details or similar
      }
    } catch (error) {
      // Exception handling if the request failed to fetch or there was a network error
      console.error("Request Failed:", error);
      alert("Failed to submit: Network error or invalid server response.");
    } finally {
      setLoading(false); // Stop loading after response
    }
  };

  useEffect(() => {
  }, []);

  return (
    <div className="container mx-auto p-4">
      {/* Step Navigation */}
      <div className="flex flex-wrap mb-2 border-b lg:justify-center lg:items-center ">
        {stepTitles.map((title, index) => (
          <div
            key={index}
            className={`w-1/2 sm:w-1/4 md:w-1/9 lg:w-1/12 py-2 text-center font-medium cursor-pointer ${
              currentStep === index
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-100"
                : accessibleSteps[index]
                ? "text-gray-500 hover:text-gray-600"
                : "text-gray-500 cursor-not-allowed"
            }`}
            onClick={() => selectStep(index)}
          >
            {title}
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="h-2 mb-4 rounded-lg bg-gray-200">
        <div
          className="h-2 bg-green-500 rounded-lg progress-bar"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      {/* Form Content */}

      {/* You will place the form fields for each step here */}
      {currentStep === 0 && (
        <Personal
          setCanProceed={setCanProceed}
          onSubmit={onSubmit}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          formData={formData}
        />
      )}

      {currentStep === 1 && (
        <>
          <Experience
            experience={currentExperience}
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            onSubmit={onSubmit}
            handleAddExperience={handleAddExperience}
            experiences={experiences}
            setCurrentExperience={setCurrentExperience}
            setExperiences={setExperiences}
          />
        </>
      )}

      {/* You will place the form fields for each step here */}
      {currentStep === 2 && (
        <>
          <Academics
            currentacademics={currentacademics}
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            handleAddacademics={handleAddacademics}
            onSubmit={onSubmit}
            academics={academics}
            setAcademics={setAcademics} // <-- Pass setAcademics here
          />
        </>
      )}

      {currentStep === 3 && (
        <>
          <Skills
            currentskills={currentskills}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            handleAddskills={handleAddskills}
            onSubmit={onSubmit}
            skills={skills}
            setSkills={setSkills}
          />
        </>
      )}
      {currentStep === 4 && (
        <>
          <Trainings
            currenttrainings={currenttrainings}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            handleAddtrainings={handleAddtrainings}
            onSubmit={onSubmit}
            trainings={trainings}
            setTrainings={setTrainings}
          />
        </>
      )}

      {currentStep === 5 && (
        <>
          <Certification
            currentcertification={currentcertification}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            handleAddcertification={handleAddcertification}
            onSubmit={onSubmit}
            certification={certification}
            setCertification={setCertification}
          />
        </>
      )}
      {currentStep === 6 && (
        <>
          <Achievement
            currentachievement={currentachievement}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            handleAddachievement={handleAddachievement}
            onSubmit={onSubmit}
            achievements={achievements}
            setAchievements={setAchievements}
          />
        </>
      )}
      {currentStep === 7 && (
        <>
          <Reasearch
            currentresearch={currentresearch}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            handleAddresearch={handleAddresearch}
            onSubmit={onSubmit}
            research={research}
            setResearch={setresearch}
          />
        </>
      )}

      {currentStep === 8 && (
        <Targetjobs
          setCanProceed={setCanProceed}
          onSubmit={onSubmit}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          formData={formData}
          loading={loading} // Pass loading prop to Targetjobs
        />
      )}

      {/* Navigation Buttons */}
      <div className="flex flex-wrap justify-between">
        {currentStep > 0 && (
          <button
            className="mt-4 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={previousStep}
          >
            Previous
          </button>
        )}
        {currentStep < stepTitles.length - 1 && (
          <button
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={nextStep}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default Newprofile;
