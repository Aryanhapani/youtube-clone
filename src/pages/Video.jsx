import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { youtube } from '../api'

const Video = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [currentVideo, setCurrentVideo] = useState(null)
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState("")
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const videoRes = await youtube.get("/videos", {
          params: {
            part: "snippet,statistics",
            id: id
          }
        })
        setCurrentVideo(videoRes.data.items[0])
        setLikeCount(parseInt(videoRes.data.items[0]?.statistics.likeCount || 0))

        const title = videoRes.data.items[0]?.snippet.title || ""
        const searchQuery = title.split(" ").slice(0, 4).join(" ")
        
        const searchRes = await youtube.get("/search", {
          params: {
            part: "snippet",
            maxResults: 15,
            q: searchQuery,
            type: "video"
          }
        })
        
        const filtered = searchRes.data.items.filter(v => v.id.videoId !== id)
        setSuggestions(filtered)
        
        // Load sample comments
        setComments([
          {
            id: 1,
            author: "Tech Enthusiast",
            text: "This is an amazing video! Very helpful content. Keep up the great work! 🔥",
            likes: 124,
            timestamp: "2 days ago"
          },
          {
            id: 2,
            author: "Code Master",
            text: "Thanks for this tutorial. I learned a lot. Subscribed! 👍",
            likes: 89,
            timestamp: "5 days ago"
          },
          {
            id: 3,
            author: "Learning Daily",
            text: "Best explanation I've seen so far. Clear and concise. Thank you!",
            likes: 56,
            timestamp: "1 week ago"
          },
          {
            id: 4,
            author: "Developer Zone",
            text: "Can you make more videos like this? Really helpful content.",
            likes: 34,
            timestamp: "2 weeks ago"
          }
        ])
        
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  const handleAddComment = () => {
    if (newComment.trim() === "") return
    
    const newCommentObj = {
      id: Date.now(),
      author: "You",
      text: newComment,
      likes: 0,
      timestamp: "Just now"
    }
    
    setComments([newCommentObj, ...comments])
    setNewComment("")
  }

  const handleLikeComment = (commentId) => {
    setComments(comments.map(comment => 
      comment.id === commentId 
        ? { ...comment, likes: comment.likes + 1 }
        : comment
    ))
  }

  const handleDeleteComment = (commentId) => {
    if (window.confirm("Delete this comment?")) {
      setComments(comments.filter(comment => comment.id !== commentId))
    }
  }

  const handleSuggestionClick = (videoId) => {
    window.scrollTo(0, 0)
    navigate(`/video/${videoId}`)
  }

  const handleLike = () => {
    if (liked) {
      setLikeCount(likeCount - 1)
      setLiked(false)
    } else {
      setLikeCount(likeCount + 1)
      setLiked(true)
    }
  }

  if (loading) {
    return (
      <div className='bg-black min-h-screen flex justify-center items-center'>
        <div className='text-white text-xl'>Loading video...</div>
      </div>
    )
  }

  return (
    <div className='bg-black min-h-screen'>
      <div className='max-w-7xl mx-auto p-5'>
        <div className='flex flex-col lg:flex-row gap-6'>
          
          {/* Left Side - Video Player and Comments */}
          <div className='lg:w-2/3'>
            {/* Video Player */}
            <div className='w-full'>
              <div className='w-full aspect-video bg-black rounded-xl overflow-hidden'>
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${id}?autoplay=0`}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className='w-full h-full'
                ></iframe>
              </div>
              
              {currentVideo && (
                <div className='mt-4'>
                  <h1 className='text-white text-xl font-bold'>
                    {currentVideo.snippet.title}
                  </h1>
                  
                  <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-3 pb-3 border-b border-zinc-800'>
                    <div className='flex items-center gap-3'>
                      <div className='w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-bold'>
                        {currentVideo.snippet.channelTitle.charAt(0)}
                      </div>
                      <div>
                        <p className='text-white font-semibold'>
                          {currentVideo.snippet.channelTitle}
                        </p>
                        <p className='text-gray-400 text-sm'>
                          1.2M subscribers
                        </p>
                      </div>
                      <button className='ml-4 px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition'>
                        Subscribe
                      </button>
                    </div>
                    
                    <div className='flex items-center gap-2'>
                      <button 
                        onClick={handleLike}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full transition ${
                          liked ? 'bg-blue-600' : 'bg-zinc-800 hover:bg-zinc-700'
                        } text-white`}
                      >
                        👍 {likeCount.toLocaleString()}
                      </button>
                      <button className='flex items-center gap-2 px-4 py-2 bg-zinc-800 rounded-full hover:bg-zinc-700 text-white'>
                        👎
                      </button>
                      <button className='flex items-center gap-2 px-4 py-2 bg-zinc-800 rounded-full hover:bg-zinc-700 text-white'>
                        🔗 Share
                      </button>
                    </div>
                  </div>
                  
                  <div className='mt-4 p-3 bg-zinc-900 rounded-xl'>
                    <p className='text-gray-300 text-sm whitespace-pre-line'>
                      {currentVideo.snippet.description}
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            {/* COMMENTS SECTION - Definitely Visible */}
            <div className='mt-8 border-t border-zinc-800 pt-6'>
              {/* Comments Header */}
              <h2 className='text-white text-xl font-bold mb-4'>
                Comments ({comments.length})
              </h2>
              
              {/* Add Comment Box */}
              <div className='flex gap-3 mb-6'>
                <div className='w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold flex-shrink-0'>
                  Y
                </div>
                <div className='flex-1'>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder='Add a comment...'
                    className='w-full bg-transparent border-b border-zinc-700 text-white p-2 outline-none focus:border-blue-500 resize-none'
                    rows="2"
                  />
                  <div className='flex justify-end gap-2 mt-2'>
                    <button 
                      onClick={() => setNewComment("")}
                      className='px-4 py-2 text-white hover:bg-zinc-800 rounded-full'
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleAddComment}
                      className='px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50'
                      disabled={!newComment.trim()}
                    >
                      Comment
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Comments List */}
              <div className='space-y-6'>
                {comments.length === 0 ? (
                  <p className='text-gray-400 text-center py-8'>No comments yet. Be the first to comment!</p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className='flex gap-3'>
                      {/* Avatar */}
                      <div className='w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold flex-shrink-0'>
                        {comment.author.charAt(0)}
                      </div>
                      
                      {/* Comment Content */}
                      <div className='flex-1'>
                        <div className='flex items-center gap-2 flex-wrap'>
                          <span className='text-white font-semibold text-sm'>
                            {comment.author}
                          </span>
                          <span className='text-gray-500 text-xs'>
                            {comment.timestamp}
                          </span>
                        </div>
                        <p className='text-white text-sm mt-1'>
                          {comment.text}
                        </p>
                        
                        {/* Comment Actions */}
                        <div className='flex items-center gap-4 mt-2'>
                          <button 
                            onClick={() => handleLikeComment(comment.id)}
                            className='text-gray-400 text-xs hover:text-white transition flex items-center gap-1'
                          >
                            👍 {comment.likes > 0 && comment.likes}
                          </button>
                          <button className='text-gray-400 text-xs hover:text-white transition'>
                            Reply
                          </button>
                          {comment.author === "You" && (
                            <button 
                              onClick={() => handleDeleteComment(comment.id)}
                              className='text-red-500 text-xs hover:text-red-400 transition'
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          
          {/* Right Side - Suggested Videos */}
          <div className='lg:w-1/3'>
            <div className='sticky top-20'>
              <h3 className='text-white text-lg font-semibold mb-4 bg-black py-2'>
                Suggested Videos
              </h3>
              <div className='space-y-3'>
                {suggestions.map((video) => (
                  <div
                    key={video.id.videoId}
                    onClick={() => handleSuggestionClick(video.id.videoId)}
                    className='flex gap-3 cursor-pointer hover:bg-zinc-900 rounded-lg p-2 transition-all'
                  >
                    <img
                      src={video.snippet.thumbnails.medium?.url || video.snippet.thumbnails.default?.url}
                      alt={video.snippet.title}
                      className='w-40 h-24 object-cover rounded-lg flex-shrink-0'
                    />
                    <div className='flex-1 min-w-0'>
                      <h4 className='text-white text-sm font-semibold line-clamp-2'>
                        {video.snippet.title}
                      </h4>
                      <p className='text-gray-400 text-xs mt-1 truncate'>
                        {video.snippet.channelTitle}
                      </p>
                      <p className='text-gray-500 text-xs'>
                        {Math.floor(Math.random() * 1000)}K views
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  )
}

export default Video