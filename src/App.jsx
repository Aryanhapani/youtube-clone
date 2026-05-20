import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Home from './pages/Home'
import Search from './pages/Search'
import Video from './pages/Video'

function App() {
  const [showSidebar, setShowSidebar] = useState(true) // Start with true on desktop
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024)

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      
      if (!mobile) {
        // On desktop/laptop, keep sidebar visible
        setShowSidebar(true)
      } else {
        // On mobile, hide sidebar by default
        setShowSidebar(false)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <Router>
      <div className='flex flex-col h-screen bg-black'>
        <Navbar 
          showSidebar={showSidebar} 
          setShowSidebar={setShowSidebar} 
          isMobile={isMobile}
        />
        <div className='flex flex-1 overflow-hidden relative'>
          {/* Sidebar */}
          <Sidebar 
            showSidebar={showSidebar} 
            setShowSidebar={setShowSidebar}
            isMobile={isMobile}
          />
          
          {/* Main Content */}
          <div className={`
            flex-1 overflow-auto transition-all duration-300
            ${isMobile && showSidebar ? 'blur-sm' : 'blur-0'}
          `}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search/:searchTerm" element={<Search />} />
              <Route path="/video/:id" element={<Video />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  )
}

export default App