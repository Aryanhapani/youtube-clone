import React from 'react'
import { useNavigate } from 'react-router-dom'

const VideoCard = ({ video }) => {
  const navigate = useNavigate()

  return (
    <div
      className='cursor-pointer'
      onClick={() => navigate(`/video/${video.id.videoId}`)}
    >
      <img
        src={video.snippet.thumbnails.high.url}
        alt=""
        className='rounded-xl w-full h-[220px] object-cover'
      />
      <div className='mt-3'>
        <h2 className='font-semibold line-clamp-2 text-white'>
          {video.snippet.title}
        </h2>
        <p className='text-gray-400 text-sm mt-1'>
          {video.snippet.channelTitle}
        </p>
      </div>
    </div>
  )
}

export default VideoCard