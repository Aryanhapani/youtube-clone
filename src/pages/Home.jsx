import React, { useEffect, useState } from 'react'
import VideoCard from '../components/VideoCard'
import { youtube } from '../api'

const Home = () => {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  const getVideos = async () => {
    try {
      const res = await youtube.get("/search", {
        params: {
          part: "snippet",
          maxResults: 20,
          q: "programming",
          type: "video"
        }
      })
      setVideos(res.data.items)
    } catch (error) {
      console.log("API Error:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getVideos()
  }, [])

  return (
    <div className='bg-black min-h-screen p-5'>
      {loading ? (
        <div className='flex justify-center items-center h-64'>
          <div className='text-white text-xl'>Loading...</div>
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
          {videos.map((video) => (
            <VideoCard key={video.id.videoId} video={video} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Home