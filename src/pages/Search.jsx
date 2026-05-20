import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { youtube } from '../api'
import VideoCard from '../components/VideoCard'

const Search = () => {
  const { searchTerm } = useParams()
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  const getSearchVideos = async () => {
    try {
      const res = await youtube.get("/search", {
        params: {
          part: "snippet",
          maxResults: 20,
          q: searchTerm,
          type: "video",
        }
      })
      setVideos(res.data.items)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getSearchVideos()
  }, [searchTerm])

  if (loading) {
    return <div className='bg-black min-h-screen text-white p-5'>Loading...</div>
  }

  return (
    <div className='bg-black min-h-screen grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 p-5'>
      {videos.map((video) => (
        <VideoCard key={video.id.videoId} video={video} />
      ))}
    </div>
  )
}

export default Search