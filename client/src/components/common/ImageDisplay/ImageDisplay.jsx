import { useState } from 'react'
import { getImageUrl } from '../../../services/imageService'
import './ImageDisplay.css'

const ImageDisplay = ({ 
  imageId, 
  alt = 'Image', 
  className = '',
  size = 'medium',
  showPlaceholder = true,
  onError = null,
  onLoad = null
}) => {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // Get the image URL from the service
  const imageUrl = getImageUrl(imageId)

  const handleImageLoad = () => {
    setIsLoading(false)
    setHasError(false)
    if (onLoad) onLoad()
  }

  const handleImageError = () => {
    setIsLoading(false)
    setHasError(true)
    if (onError) onError()
  }

  // If no imageId provided and placeholder is disabled
  if (!imageId && !showPlaceholder) {
    return null
  }

  // If no imageId provided, show placeholder
  if (!imageId) {
    return (
      <div className={`image-display image-placeholder image-${size} ${className}`}>
        <div className="placeholder-content">
          <span className="placeholder-icon">📷</span>
          <span className="placeholder-text">No Image</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`image-display image-${size} ${className}`}>
      {/* Loading state */}
      {isLoading && (
        <div className="image-loading">
          <div className="loading-spinner"></div>
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div className="image-error">
          <span className="error-icon">❌</span>
          <span className="error-text">Failed to load</span>
        </div>
      )}

      {/* Actual image */}
      <img
        src={imageUrl}
        alt={alt}
        className={`image-img ${isLoading ? 'image-hidden' : ''} ${hasError ? 'image-hidden' : ''}`}
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
    </div>
  )
}

export default ImageDisplay