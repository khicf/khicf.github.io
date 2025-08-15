'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function PhotoAlbumPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [photos, setPhotos] = useState([]);
  const [caption, setCaption] = useState('');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/api/auth/signin');
    } else if (status === 'authenticated' && session.user.role !== 'ADMIN') {
      router.push('/');
    } else if (status === 'authenticated') {
      fetchPhotos();
    }
  }, [session, status, router]);

  const fetchPhotos = async () => {
    try {
      const res = await fetch('/api/photos');
      if (!res.ok) throw new Error('Failed to fetch photos');
      const data = await res.json();
      setPhotos(data.photos);
    } catch (err) {
      setMessage(`Error fetching photos: ${err.message}`);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('caption', caption);

    try {
      const res = await fetch('/api/photos', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to upload photo');
      const data = await res.json();
      setMessage(data.message);
      setCaption('');
      setFile(null);
      fetchPhotos();
    } catch (err) {
      setMessage(`Error uploading photo: ${err.message}`);
    }
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (session && session.user.role === 'ADMIN') {
    return (
      <div>
        <h1>Photo Album</h1>
        {message && <div className="alert alert-info">{message}</div>}

        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Upload New Photo</h5>
            <form onSubmit={handleUpload}>
              <div className="mb-3">
                <label htmlFor="caption" className="form-label">Caption</label>
                <input
                  type="text"
                  className="form-control"
                  id="caption"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="file" className="form-label">Photo</label>
                <input
                  type="file"
                  className="form-control"
                  id="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">Upload</button>
            </form>
          </div>
        </div>

        <h2>Photo Gallery</h2>
        <div className="row">
          {photos.length > 0 ? (
            photos.map((photo) => (
              <div key={photo.id} className="col-md-4 mb-4">
                <div className="card">
                  <img src={photo.imageUrl} className="card-img-top" alt={photo.caption} />
                  <div className="card-body">
                    <p className="card-text">{photo.caption}</p>
                    <p className="card-text">
                      <small className="text-muted">
                        Uploaded by {photo.user.name} on {new Date(photo.createdAt).toLocaleDateString()}
                      </small>
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No photos found.</p>
          )}
        </div>
      </div>
    );
  }

  return null;
}
