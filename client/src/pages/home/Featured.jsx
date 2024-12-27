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
} from "react-icons/fa";
import { Link } from "react-router-dom";
import Jobslider from "../../components/Jobslider/Jobslider";

const Featured = () => {
  const [jobCounts, setJobCounts] = useState({}); // State to hold job counts for each category

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
  ];

  useEffect(() => {
    const fetchJobCounts = async () => {
      const counts = {};
      for (const category of categories) {
        const jobs = await fetchJobsByCategory(category.apiName); // Use the shared API service
        counts[category.slug] = jobs.length;
      }
      setJobCounts(counts);
    };

    fetchJobCounts();
  }, []);

  return (
    <>
      {/* Featured Tours Start */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          {/* Section Title */}
          <div className="text-center mb-10">
            <h2 className="text-5xl font-semibold mt-2">
              Browse Top Categories
            </h2>
          </div>
          {/* Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {categories.slice(0, 8).map((category) => (
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
          {/* Browse All Button */}
          <div className="text-center mt-14">
            <Link to="/all-categories" className="bg-pb px-7 py-3 text-white">
              Browse All Sectors
            </Link>
          </div>
        </div>
      </section>
      {/* Featured Tours End */}

      <div>
        <Jobslider />
      </div>
    </>
  );
};

export default Featured;
