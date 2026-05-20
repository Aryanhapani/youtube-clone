import React, { useEffect, useState } from 'react'
import VideoCard from '../components/VideoCard'
import { youtube } from '../api'

const Home = () => {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  // This runs automatically when Home page loads
  useEffect(() => {
    console.log("Home page opened - Loading videos...")
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    try {
      setLoading(true)
      
      // Fetch trending videos from YouTube
      const response = await youtube.get("/videos", {
        params: {
          part: "snippet,statistics",
          chart: "mostPopular",
          maxResults: 24,
          regionCode: "US"
        }
      })
      
      console.log("Videos loaded:", response.data.items.length)
      setVideos(response.data.items)
      
    } catch (error) {
      console.error("Error loading videos:", error)
      // Fallback videos that always work
      setVideos([
        {
          id: { videoId: "dQw4w9WgXcQ" },
          snippet: {
            title: "Popular Video 1",
            channelTitle: "Trending Channel",
            thumbnails: { high: { url: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg" } }
          }
        },
        {
          id: { videoId: "8jLObtpCz6U" },
          snippet: {
            title: "Popular Video 2",
            channelTitle: "Viral Videos",
            thumbnails: { high: { url: "https://img.youtube.com/vi/8jLObtpCz6U/hqdefault.jpg" } }
          }
        },
        {
          id: { videoId: "kxOuG8jMIgI" },
          snippet: {
            title: "Popular Video 3",
            channelTitle: "Top Channel",
            thumbnails: { high: { url: "https://img.youtube.com/vi/kxOuG8jMIgI/hqdefault.jpg" } }
          }
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className='bg-black min-h-screen flex justify-center items-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4'></div>
          <p className='text-white'>Loading videos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='bg-black min-h-screen p-5'>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
        {videos.map((video, index) => (
          <VideoCard key={video.id.videoId || index} video={video} />
        ))}
      </div>
    </div>
  )
}

export default Home