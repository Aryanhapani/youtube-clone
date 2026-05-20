import React, { useEffect } from 'react'
import { FaHome, FaFire, FaMusic, FaGamepad, FaFilm, FaTimes } from "react-icons/fa"
import { useNavigate } from 'react-router-dom'

const Sidebar = ({ showSidebar, setShowSidebar, isMobile }) => {
  const navigate = useNavigate()

  const menus = [
    { icon: <FaHome />, name: "Home", path: "/", searchQuery: "programming" },
    { icon: <FaFire />, name: "Trending", path: "/search/trending", searchQuery: "trending videos" },
    { icon: <FaMusic />, name: "Music", path: "/search/music", searchQuery: "music videos" },
    { icon: <FaGamepad />, name: "Gaming", path: "/search/gaming", searchQuery: "gaming videos" },
    { icon: <FaFilm />, name: "Movies", path: "/search/movies", searchQuery: "movie trailers" },
  ]

  const handleClick = (menu) => {
    if (menu.name === "Home") {
      navigate("/")
    } else {
      navigate(`/search/${menu.searchQuery}`)
    }
    // Close sidebar on mobile after clicking
    if (isMobile) {
      setShowSidebar(false)
    }
  }

  const closeSidebar = () => {
    if (isMobile) {
      setShowSidebar(false)
    }
  }

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobile && showSidebar) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobile, showSidebar])

  return (
    <>
      {/* Overlay - only on mobile when sidebar is open */}
      {isMobile && showSidebar && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={closeSidebar}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        ${isMobile ? 'fixed' : 'relative'} 
        top-0 left-0 h-full bg-black border-r border-zinc-800 
        text-white overflow-y-auto transition-all duration-300 z-50
        w-[280px] lg:w-[240px] flex-shrink-0
        ${isMobile ? (
          showSidebar ? 'translate-x-0' : '-translate-x-full'
        ) : (
          showSidebar ? 'block' : 'hidden'
        )}
      `}>
        
        {/* Close button - only on mobile */}
        {isMobile && (
          <div className="flex justify-end p-4 border-b border-zinc-800">
            <button 
              onClick={closeSidebar}
              className="p-2 hover:bg-zinc-800 rounded-full transition"
            >
              <FaTimes className="text-white text-xl" />
            </button>
          </div>
        )}
        
        {/* YouTube Logo in Sidebar (Mobile only) */}
        {isMobile && (
          <div className="px-4 py-4 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <FaHome className="text-red-600 text-3xl" />
              <h1 className="text-white text-xl font-semibold">YouTube Clone</h1>
            </div>
          </div>
        )}
        
        {/* Menu Items */}
        <div className="px-2 py-2">
          {menus.map((menu, index) => (
            <div
              key={index}
              onClick={() => handleClick(menu)}
              className='flex items-center gap-4 p-3 rounded-xl hover:bg-zinc-800 cursor-pointer transition-colors'
            >
              <span className='text-xl'>{menu.icon}</span>
              <span className="text-sm lg:text-base">{menu.name}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default Sidebar