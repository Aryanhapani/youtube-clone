import React, { useState, useEffect, useRef } from 'react'
import { FaYoutube, FaSearch, FaMicrophone, FaBars } from "react-icons/fa"
import { useNavigate } from 'react-router-dom'

const Navbar = ({ showSidebar, setShowSidebar, isMobile }) => {
  const [search, setSearch] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const navigate = useNavigate()
  const searchRef = useRef(null)

  const handleSearch = () => {
    if (search.trim() !== "") {
      navigate(`/search/${search}`)
      setSearch("")
      setShowSuggestions(false)
    }
  }

  // Toggle sidebar function - works on both mobile and desktop
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar)
  }

  // Get search suggestions
  useEffect(() => {
    const getSuggestions = async () => {
      if (search.trim() === "") {
        setSuggestions([])
        return
      }

      try {
        const response = await fetch(
          `https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&q=${encodeURIComponent(search)}`
        )
        const data = await response.json()
        setSuggestions(data[1] || [])
      } catch (error) {
        console.log("Suggestions error:", error)
        setSuggestions([
          `${search} tutorial`,
          `${search} song`,
          `${search} video`
        ])
      }
    }

    const timer = setTimeout(() => {
      getSuggestions()
    }, 300)

    return () => clearTimeout(timer)
  }, [search])

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className='flex items-center justify-between px-3 sm:px-4 py-3 bg-black sticky top-0 z-50 border-b border-zinc-800'>
      {/* Left Section */}
      <div className='flex items-center gap-3 sm:gap-5'>
        <FaBars
          onClick={toggleSidebar}
          className='text-white text-xl sm:text-2xl cursor-pointer hover:text-gray-300 transition'
        />
        <div
          className='flex items-center gap-1 cursor-pointer'
          onClick={() => navigate("/")}
        >
          <FaYoutube className='text-red-600 text-3xl sm:text-4xl' />
          <h1 className='text-white text-lg sm:text-2xl font-semibold hidden sm:block'>
            YouTube
          </h1>
        </div>
      </div>

      {/* Center Search Section - Responsive */}
      <div className='flex items-center w-full max-w-md sm:max-w-xl lg:max-w-2xl mx-2 sm:mx-4' ref={searchRef}>
        <div className='flex w-full relative'>
          <input
            type="text"
            placeholder={isMobile ? "Search..." : "Search"}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setShowSuggestions(true)
            }}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            onFocus={() => setShowSuggestions(true)}
            className='w-full px-3 sm:px-4 py-1.5 sm:py-2 bg-black border border-zinc-700 rounded-l-full outline-none text-white text-sm sm:text-base focus:border-blue-500'
          />
          <button
            onClick={handleSearch}
            className='px-3 sm:px-6 bg-zinc-800 border border-zinc-700 rounded-r-full text-white cursor-pointer hover:bg-zinc-700 transition'
          >
            <FaSearch className="text-sm sm:text-base" />
          </button>

          {/* Search Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className='absolute top-10 sm:top-12 left-0 w-full bg-zinc-900 rounded-xl overflow-hidden shadow-lg z-50 border border-zinc-700'>
              {suggestions.map((item, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setSearch(item)
                    setSuggestions([])
                    setShowSuggestions(false)
                    navigate(`/search/${item}`)
                  }}
                  className='px-3 sm:px-4 py-2 sm:py-3 hover:bg-zinc-800 cursor-pointer text-white flex items-center gap-2 sm:gap-3 text-sm sm:text-base'
                >
                  <FaSearch className='text-gray-400 text-xs sm:text-sm' />
                  <span className="truncate">{item}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Microphone button - hide on very small screens */}
        <button className='ml-2 sm:ml-3 p-2 sm:p-3 bg-zinc-900 rounded-full text-white cursor-pointer hover:bg-zinc-800 transition hidden xs:block'>
          <FaMicrophone className="text-sm sm:text-base" />
        </button>
      </div>

      {/* Right Section */}
      <div className='flex items-center gap-2 sm:gap-4'>
        <div className='w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-red-500 flex items-center justify-center text-white font-bold cursor-pointer hover:bg-red-600 transition text-sm sm:text-base'>
          A
        </div>
      </div>
    </div>
  )
}

export default Navbar