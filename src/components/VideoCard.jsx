import React from 'react'
import { useNavigate } from 'react-router-dom'

const VideoCard = ({ video }) => {
  const navigate = useNavigate()
  
  // Get video ID from different possible formats
  const videoId = video?.id?.videoId || video?.id || video?.videoId
  
  // Get thumbnail URL - multiple fallbacks
  const getThumbnail = () => {
    if (video?.snippet?.thumbnails?.high?.url) {
      return video.snippet.thumbnails.high.url
    }
    if (video?.snippet?.thumbnails?.medium?.url) {
      return video.snippet.thumbnails.medium.url
    }
    if (video?.snippet?.thumbnails?.default?.url) {
      return video.snippet.thumbnails.default.url
    }
    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    }
    return "https://via.placeholder.com/320x180/333333/FFFFFF?text=No+Image"
  }
  
  const title = video?.snippet?.title || "Video Title"
  const channelTitle = video?.snippet?.channelTitle || "Channel Name"
  const viewCount = video?.statistics?.viewCount 
    ? `${parseInt(video.statistics.viewCount).toLocaleString()} views` 
    : ""
  
  const handleClick = () => {
    if (videoId) {
      navigate(`/video/${videoId}`)
    }
  }

  return (
    <div
      className='cursor-pointer hover:scale-[1.02] transition-transform duration-300'
      onClick={handleClick}
    >
      {/* Thumbnail */}
      <div className='relative rounded-xl overflow-hidden'>
        <img
          src={getThumbnail()}
          alt={title}
          className='w-full aspect-video object-cover'
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/320x180/333333/FFFFFF?text=Video"
          }}
        />
      </div>
      
      {/* Video Info */}
      <div className='mt-3'>
        <h2 className='font-semibold line-clamp-2 text-white text-sm sm:text-base'>
          {title}
        </h2>
        <p className='text-gray-400 text-sm mt-1'>
          {channelTitle}
        </p>
        {viewCount && (
          <p className='text-gray-500 text-xs mt-1'>
            {viewCount}
          </p>
        )}
      </div>
    </div>
  )
}

export default VideoCard