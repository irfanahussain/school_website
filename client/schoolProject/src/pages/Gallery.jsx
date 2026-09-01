import { useEffect, useState } from "react";
import { getGalleryImages } from "../api.js";

const CATEGORIES = [
  { value: "", label: "All photos" },
  { value: "campus", label: "Campus" },
  { value: "academics", label: "Academics" },
  { value: "sports", label: "Sports" },
  { value: "events", label: "Events" },
  { value: "arts", label: "Arts" },
];

export default function Gallery() {
  const [category, setCategory] = useState("");
  const [images, setImages] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");

    getGalleryImages(category)
      .then((data) => {
        if (cancelled) return;
        setImages(data);
        setStatus("ready");
      })
      .catch(() => {
        if (cancelled) return;
        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [category]);

  return (
    <>
      <section className="page-header">
        <p className="page-header__eyebrow">Life at Lemer</p>
        <h1>A look inside our classrooms and campus.</h1>
        <p className="page-header__lede">
          Photos from the school year — classrooms, the garden, athletics, and the events that
          bring the whole community together. Images are managed by staff through the Django
          admin.
        </p>
      </section>

      <section className="section">
        <div className="tabs" role="tablist" aria-label="Filter gallery by category">
          {CATEGORIES.map((c) => (
            <button
              key={c.value || "all"}
              role="tab"
              aria-selected={category === c.value}
              className={"tabs__button" + (category === c.value ? " tabs__button--active" : "")}
              onClick={() => setCategory(c.value)}
            >
              {c.label}
            </button>
          ))}
        </div>

        {status === "loading" && <p className="state-message">Loading photos…</p>}

        {status === "error" && (
          <p className="state-message state-message--error">
            We couldn't load the gallery right now. Please check that the backend API is running,
            or try again shortly.
          </p>
        )}

        {status === "ready" && images.length === 0 && (
          <p className="state-message">
            No photos in this category yet. Add some through the Django admin at
            <code> /admin/core/galleryimage/</code>.
          </p>
        )}

        {status === "ready" && images.length > 0 && (
          <div className="gallery-grid">
            {images.map((img) => (
              <figure key={img.id} className="gallery-grid__item">
                <img src={img.image} alt={img.caption || img.title} loading="lazy" />
                <figcaption>{img.caption || img.title}</figcaption>
              </figure>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
