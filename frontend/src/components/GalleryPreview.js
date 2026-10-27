import React from 'react';
import { Link } from 'react-router-dom';

const previewImages = [
  '/gallery/IMG_0538.JPG',
  '/gallery/IMG_3364.JPG',
  '/gallery/IMG_5574.JPG',
  '/gallery/IMG_5881.JPG',
  '/gallery/1726854847155.JPG',
  '/gallery/WhatsApp Image 2026-04-28 at 3.23.21 AM.jpeg',
  '/gallery/WhatsApp Image 2026-04-28 at 3.23.21 AM (1).jpeg',
  '/gallery/WhatsApp Image 2026-04-28 at 3.23.22 AM.jpeg'
];

function GalleryPreview({ data }) {
  const items = (data && data.length ? data : [
    { id: 1, title: 'Studio Frame', category: 'Photography' },
    { id: 2, title: 'Portrait Study', category: 'Portrait' },
    { id: 3, title: 'Candid Campus Moment', category: 'Lifestyle' },
    { id: 4, title: 'IEEE Annual Convention', category: 'Events' },
    { id: 5, title: 'Evening Walk', category: 'Lifestyle' },
    { id: 6, title: 'Soft Light', category: 'Photography' },
    { id: 7, title: 'Campus Stories', category: 'Lifestyle' },
    { id: 8, title: 'A Moment on Stage', category: 'Events' }
  ]).slice(0, 8);

  return (
    <section className="home-section gallery-preview" id="gallery-preview">
      <div className="section-heading section-heading-row">
        <div>
          <p className="eyebrow">Visual archive</p>
          <h2>Gallery of Selected Frames</h2>
        </div>
        <Link to="/gallery" className="text-link">Explore gallery <span aria-hidden="true">↗</span></Link>
      </div>
      <div className="gallery-preview-grid">
        {items.map((item, index) => (
          <Link to="/gallery" className="gallery-preview-card" key={item.id || item.title || index}>
            <img src={item.image || previewImages[index % previewImages.length]} alt={item.title || 'Selected portfolio frame'} loading="lazy" />
            <span className="gallery-card-copy">
              <span>{item.category || 'Photography'}</span>
              <strong>{item.title || 'Selected frame'}</strong>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default GalleryPreview;
