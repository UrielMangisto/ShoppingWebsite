import { useState } from 'react';
import { imageService } from '../../../services/imageService';
import './ImageUpload.css';

const ImageUpload = ({ initialImage, onUploadComplete }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(initialImage);
  const [error, setError] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    try {
      setUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append('image', file);

      const imageUrl = await imageService.uploadImage(formData);
      setPreview(imageUrl);
      onUploadComplete(imageUrl);
    } catch (err) {
      setError('Failed to upload image');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="image-upload">
      {preview && (
        <div className="image-preview">
          <img src={preview} alt="Preview" />
        </div>
      )}
      
      <div className="upload-controls">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
        />
        {uploading && <div className="upload-progress">Uploading...</div>}
        {error && <div className="upload-error">{error}</div>}
      </div>
    </div>
  );
};

export default ImageUpload;