import React, { useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import {IoArrowBack} from "react-icons/io5";
const WikipediaSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (event) => {
    if (event.key === "Enter" && searchQuery.trim()) {
      setLoading(true);
      setSearchResults([]);
      const url = `https://apis.ccbp.in/wiki-search?search=${searchQuery}`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        setSearchResults(data.search_results);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="min-h-screen bg-[#1b1c24] flex flex-col items-center py-8">
      <div className="bg-[#2a2b33] border border-[#2a2b33] p-6 rounded-lg shadow-md w-full max-w-2xl">
        <div onClick={navigate("/chat")}>
          <IoArrowBack className="text-4xl lg:text-6xl text-white/90 cursor-pointer"/>
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#eaeaea]">
            Wikipedia Search </h1>
          <img
            className="mx-auto mb-4 w-24"
            src="https://nkb-backend-otg-media-static.s3.ap-south-1.amazonaws.com/ccbp-dynamic-webapps/wiki-logo-img.png"
            alt="Wiki Logo"
          />
          <input
            type="search"
            placeholder="Type a keyword and press Enter to search"
            value={searchQuery}
            onChange={handleInputChange}
            onKeyDown={handleSearch}
            className="w-full p-3 border border-[#3a3b43] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#3a3b43] text-[#eaeaea]"
          />
        </div>
      </div>
      {loading && (
        <div className="flex justify-center items-center mt-8">
          <div className="loader border-t-4 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
        </div>
      )}
      <div className="w-full max-w-2xl mt-6">
        {searchResults.map((result, index) => (
          <div key={index} className="mb-6">
            <a
              href={result.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-bold text-[#eaeaea] hover:underline"
            >
              {result.title}
            </a>
            <br />
            <a
              href={result.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-green-700"
            >
              {result.link}
            </a>
            <p className="text-gray-600 mt-2">{result.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WikipediaSearch;
