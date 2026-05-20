import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Home from './pages/Home'
import Search from './pages/Search'
import Video from './pages/Video'

function App() {
  const [showSidebar, setShowSidebar] = useState(true)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024)

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      
      if (!mobile) {
        setShowSidebar(true)
      } else {
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
          <Sidebar 
            showSidebar={showSidebar} 
            setShowSidebar={setShowSidebar}
            isMobile={isMobile}
          />
          
          <div className={`
            flex-1 overflow-auto transition-all duration-300
            ${isMobile && showSidebar ? 'blur-sm' : 'blur-0'}
          `}>
            <Routes>
              {/* Default route - Home page */}
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/search/:searchTerm" element={<Search />} />
              <Route path="/video/:id" element={<Video />} />
              {/* Redirect any unknown routes to Home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  )
}

export default App