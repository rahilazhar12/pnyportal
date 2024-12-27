import React, { useEffect, useState } from "react";
import { fetchJobsByCategory } from "../hooks/Getcategories";
import {
  FaPenNib,
  FaCode,
  FaChartLine,
  FaMobileAlt,
  FaHardHat,
  FaLaptopCode,
  FaBuilding,
  FaFileAlt,
  FaMoneyBillAlt,
  FaHeadset,
  FaStethoscope,
  FaCog,
  FaChalkboardTeacher,
  FaUsers,
  FaIndustry,
  FaTasks,
  FaTruck,
  FaShoppingCart,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import CircularProgress from "../../components/Loader/Loader"; // Import CircularProgress for loading spinner

const Browsesector = () => {
  const [jobCounts, setJobCounts] = useState({}); // State to hold job counts for each category
  const [loading, setLoading] = useState(true); // State to handle loading status

  const categories = [
    {
      name: "Design & Creative",
      slug: "design-creative",
      apiName: "design-creative",
      icon: <FaPenNib className="text-pb md:text-6xl" />,
    },
    {
      name: "Design & Development",
      slug: "design-development",
      apiName: "design-development",
      icon: <FaCode className="text-pb md:text-6xl" />,
    },
    {
      name: "Sales & Marketing",
      slug: "sales-marketing",
      apiName: "sales-marketing",
      icon: <FaChartLine className="text-pb md:text-6xl" />,
    },
    {
      name: "Mobile Application",
      slug: "mobile-application",
      apiName: "mobile-application",
      icon: <FaMobileAlt className="text-pb md:text-6xl" />,
    },
    {
      name: "Construction",
      slug: "construction",
      apiName: "construction",
      icon: <FaHardHat className="text-pb md:text-6xl" />,
    },
    {
      name: "Information Technology",
      slug: "information-technology",
      apiName: "information-technology",
      icon: <FaLaptopCode className="text-pb md:text-6xl" />,
    },
    {
      name: "Real Estate",
      slug: "real-estate",
      apiName: "real-estate",
      icon: <FaBuilding className="text-pb md:text-6xl" />,
    },
    {
      name: "Content Writer",
      slug: "content-writer",
      apiName: "content-writer",
      icon: <FaFileAlt className="text-pb md:text-6xl" />,
    },
    {
      name: "Finance & Accounting",
      slug: "finance-accounting",
      apiName: "finance-accounting",
      icon: <FaMoneyBillAlt className="text-pb md:text-6xl" />,
    },
    {
      name: "Customer Service",
      slug: "customer-service",
      apiName: "customer-service",
      icon: <FaHeadset className="text-pb md:text-6xl" />,
    },
    {
      name: "Healthcare & Medical",
      slug: "healthcare-medical",
      apiName: "healthcare-medical",
      icon: <FaStethoscope className="text-pb md:text-6xl" />,
    },
    {
      name: "Engineering",
      slug: "engineering",
      apiName: "engineering",
      icon: <FaCog className="text-pb md:text-6xl" />,
    },
    {
      name: "Education & Training",
      slug: "education-training",
      apiName: "education-training",
      icon: <FaChalkboardTeacher className="text-pb md:text-6xl" />,
    },
    {
      name: "Human Resources",
      slug: "human-resources",
      apiName: "human-resources",
      icon: <FaUsers className="text-pb md:text-6xl" />,
    },
    {
      name: "Administrative & Clerical",
      slug: "administrative-clerical",
      apiName: "administrative-clerical",
      icon: <FaFileAlt className="text-pb md:text-6xl" />,
    },
    {
      name: "Legal",
      slug: "legal",
      apiName: "legal",
      icon: <FaIndustry className="text-pb md:text-6xl" />,
    },
    {
      name: "Manufacturing & Operations",
      slug: "manufacturing-operations",
      apiName: "manufacturing-operations",
      icon: <FaIndustry className="text-pb md:text-6xl" />,
    },
    {
      name: "Project Management",
      slug: "project-management",
      apiName: "project-management",
      icon: <FaTasks className="text-pb md:text-6xl" />,
    },
    {
      name: "Logistics & Supply Chain",
      slug: "logistics-supply-chain",
      apiName: "logistics-supply-chain",
      icon: <FaTruck className="text-pb md:text-6xl" />,
    },
    {
      name: "Retail & E-commerce",
      slug: "retail-ecommerce",
      apiName: "retail-ecommerce",
      icon: <FaShoppingCart className="text-pb md:text-6xl" />,
    },
  ];

  useEffect(() => {
    const fetchJobCounts = async () => {
      try {
        const countsPromises = categories.map(async (category) => {
          const jobs = await fetchJobsByCategory(category.apiName); // Fetch jobs for each category
          return { [category.slug]: jobs.length };
        });

        const results = await Promise.all(countsPromises);
        const counts = Object.assign({}, ...results);
        setJobCounts(counts);
        setLoading(false); // Set loading to false after fetching is complete
      } catch (error) {
        console.error("Error fetching job counts:", error);
        setLoading(false); // Ensure loading stops even if there is an error
      }
    };

    fetchJobCounts();
  }, [categories]);

  return (
    <>
      {/* Featured Tours Start */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          {/* Section Title */}
          <div className="text-center mb-10">
            <span className="text-pr text-2xl uppercase">All Categories</span>
          </div>
          {/* Categories Grid */}
          {loading ? (
            <div className="flex justify-center items-center">
              <CircularProgress /> {/* Show CircularProgress while loading */}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {categories.map((category) => (
                <Link key={category.slug} to={`/category/${category.slug}`}>
                  <div className="text-center border border-green-200 p-6 single-services">
                    <div className="flex justify-center items-center text-4xl mb-4">
                      {category.icon}
                    </div>
                    <h5 className="text-lg">{category.name}</h5>
                    <span className="text-pr">
                      (
                      {jobCounts[category.slug] !== undefined
                        ? jobCounts[category.slug]
                        : "Loading..."}
                      )
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
      {/* Featured Tours End */}
    </>
  );
};

export default Browsesector;
