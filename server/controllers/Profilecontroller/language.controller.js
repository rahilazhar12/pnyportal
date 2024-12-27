const Language = require("../../models/Newprofile/Language");

// Controller to add languages
exports.addLanguages = async (req, res) => {
  try {
    const userId = req.user.id;
    const { languages } = req.body; // Expecting an array of languages

    // Validate input
    if (!userId || !Array.isArray(languages)) {
      return res
        .status(400)
        .json({ message: "User ID and languages are required." });
    }

    // Check if the user already has a language entry
    let userLanguages = await Language.findOne({ userId });

    if (userLanguages) {
      // If the user already has languages, merge new languages with existing ones
      const existingCountries = userLanguages.languages.map(
        (lang) => lang.country
      );
      const newLanguages = languages.filter(
        (lang) => !existingCountries.includes(lang.country)
      );

      if (newLanguages.length > 0) {
        // Add new languages to the languages array for the user
        userLanguages.languages.push(...newLanguages);

        // Save the updated languages array
        await userLanguages.save();
      }

      return res.status(200).json(userLanguages.languages); // Return the updated list of languages
    } else {
      // If the user does not have any languages, create a new entry with the languages array
      const languageDocuments = new Language({
        userId,
        languages: languages,
      });

      // Save the new language entry to the database
      const savedLanguages = await languageDocuments.save();
      return res.status(201).json(savedLanguages.languages); // Return the newly created languages
    }
  } catch (error) {
    console.error("Error adding languages:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Controller to get languages for a user
exports.getLanguages = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you have user authentication in place

    // Find the language document for the user
    const userLanguages = await Language.findOne({ userId });

    if (!userLanguages) {
      return res
        .status(404)
        .json({ message: "No languages found for this user." });
    }

    return res.status(200).json(userLanguages.languages);
  } catch (error) {
    console.error("Error fetching languages:", error);
    return res.status(500).json({ message: "Server error" });
  }
};



// Controller for editing languages
exports.updateLanguages = async (req, res) => {
  try {
    const { languageId } = req.params; // Language ID from URL params
    const userId = req.user.id;
    const { country, proficiency } = req.body; // Expecting both country and proficiency in the body

    // Validate input
    if (!userId || !languageId || !country || !proficiency) {
      return res.status(400).json({
        message: "User ID, language ID, country, and proficiency are required.",
      });
    }

    // Find the user's existing language entry
    const userLanguages = await Language.findOne({ userId });

    if (!userLanguages) {
      return res.status(404).json({ message: "Languages not found for user." });
    }

    // Find the language entry by languageId (or country if preferred)
    const languageIndex = userLanguages.languages.findIndex(
      (lang) => lang._id.toString() === languageId // We use languageId to match the specific language
    );

    if (languageIndex === -1) {
      return res.status(404).json({ message: "Language not found." });
    }

    // Update the proficiency and country (if provided) of the language entry
    if (proficiency) {
      userLanguages.languages[languageIndex].proficiency = proficiency;
    }
    if (country) {
      userLanguages.languages[languageIndex].country = country;
    }

    // Save the updated languages list
    await userLanguages.save();

    return res.status(200).json(userLanguages.languages); // Return the updated list of languages
  } catch (error) {
    console.error("Error editing languages:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// controllers/languageController.js

exports.deleteLanguage = async (req, res) => {
  try {
    const { languageId } = req.params; // The ID of the language to delete
    const userId = req.user.id; // The authenticated user's ID

    // Validate input
    if (!languageId) {
      return res.status(400).json({ message: "Language ID is required." });
    }

    // Find the user's language entry
    const userLanguages = await Language.findOne({ userId });

    if (!userLanguages) {
      return res.status(404).json({ message: "Languages not found for user." });
    }

    // Find the index of the language to delete
    const languageIndex = userLanguages.languages.findIndex(
      (lang) => lang._id.toString() === languageId
    );

    if (languageIndex === -1) {
      return res.status(404).json({ message: "Language not found." });
    }

    // Remove the language from the list
    userLanguages.languages.splice(languageIndex, 1);

    // Save the updated languages list
    await userLanguages.save();

    return res.status(200).json({ message: "Language deleted successfully." });
  } catch (error) {
    console.error("Error deleting language:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
