import './WatchScreen.css'
import VideoStage from './VideoStage'
import ChatSidebar from './ChatSidebar'

function WatchScreen() {
  return (
    <div className="watch-screen">
      <VideoStage />
      <ChatSidebar isChatOpen />
    </div>
  )
}

export default WatchScreen
