import './Loading.css'

const Loading = ({ size = 'medium', message = 'Loading...', className = '' }) => {
  return (
    <div className={`loading-container ${className}`}>
      <div className={`loading-spinner loading-${size}`}></div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  )
}

export default Loading