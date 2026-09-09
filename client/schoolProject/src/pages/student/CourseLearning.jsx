import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getCourseLearn,
  markLessonComplete,
  markLessonIncomplete,
  downloadLessonFile,
} from "../../api.js";

function getYoutubeEmbedUrl(url) {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    let videoId = null;

    if (parsed.hostname.includes("youtu.be")) {
      videoId = parsed.pathname.slice(1);
    } else if (parsed.hostname.includes("youtube.com")) {
      if (parsed.pathname === "/watch") {
        videoId = parsed.searchParams.get("v");
      } else if (parsed.pathname.startsWith("/embed/")) {
        videoId = parsed.pathname.split("/embed/")[1];
      } else if (parsed.pathname.startsWith("/shorts/")) {
        videoId = parsed.pathname.split("/shorts/")[1];
      }
    }

    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  } catch {
    return null;
  }
}

export default function CourseLearning() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const [activeLessonId, setActiveLessonId] = useState(null);
  const [pendingLessonId, setPendingLessonId] = useState(null);
  const [downloadingFileId, setDownloadingFileId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");

    getCourseLearn(id)
      .then((data) => {
        if (cancelled) return;
        setCourse(data);
        const allLessons = data.subjects.flatMap((s) => s.lessons);
        const firstIncomplete = allLessons.find((l) => !l.completed);
        setActiveLessonId((firstIncomplete || allLessons[0])?.id ?? null);
        setStatus("ready");
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err?.data?.detail || "You don't have access to this course.");
        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  const allLessons = useMemo(
    () => (course ? course.subjects.flatMap((s) => s.lessons) : []),
    [course]
  );

  const activeLesson = allLessons.find((l) => l.id === activeLessonId) || null;
  const embedUrl = getYoutubeEmbedUrl(activeLesson?.youtube_url);

  async function toggleComplete(lesson) {
    setPendingLessonId(lesson.id);
    try {
      if (lesson.completed) {
        await markLessonIncomplete(lesson.id);
      } else {
        await markLessonComplete(lesson.id);
      }
      setCourse((prev) => {
        if (!prev) return prev;
        const subjects = prev.subjects.map((subject) => ({
          ...subject,
          lessons: subject.lessons.map((l) =>
            l.id === lesson.id ? { ...l, completed: !l.completed } : l
          ),
        }));
        const total = subjects.reduce((sum, s) => sum + s.lessons.length, 0);
        const completed = subjects.reduce(
          (sum, s) => sum + s.lessons.filter((l) => l.completed).length,
          0
        );
        return {
          ...prev,
          subjects,
          progress: { total, completed, percent: total ? Math.round((completed / total) * 100) : 0 },
        };
      });
    } catch {
      // Leave state as-is if the request fails.
    } finally {
      setPendingLessonId(null);
    }
  }

  async function handleDownload(file) {
    setDownloadingFileId(file.id);
    try {
      await downloadLessonFile(file.download_url, file.label);
    } catch {
      // Could surface a toast here; keep silent for now.
    } finally {
      setDownloadingFileId(null);
    }
  }

  if (status === "loading") {
    return <p className="state-message">Loading course…</p>;
  }

  if (status === "error") {
    return (
      <div className="student__empty-card">
        <h3>Can't open this course</h3>
        <p>{error}</p>
        <Link to="/dashboard/courses" className="button button--primary button--sm">
          Back to My Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="learn">
      <div className="learn__header">
        <p className="eyebrow">Course Learning</p>
        <h1>{course.title}</h1>
        <div className="learn__progress-bar" role="progressbar" aria-valuenow={course.progress.percent} aria-valuemin={0} aria-valuemax={100}>
          <div className="learn__progress-fill" style={{ width: `${course.progress.percent}%` }} />
        </div>
        <p className="learn__progress-label">
          {course.progress.completed} of {course.progress.total} lessons complete ({course.progress.percent}%)
        </p>
      </div>

      <div className="learn__body">
        <nav className="learn__outline">
          {course.subjects.map((subject) => (
            <div key={subject.id} className="learn__subject">
              <p className="learn__subject-title">{subject.title}</p>
              {subject.lessons.map((lesson) => (
                <button
                  key={lesson.id}
                  type="button"
                  className={
                    "learn__lesson-link" +
                    (lesson.id === activeLessonId ? " learn__lesson-link--active" : "")
                  }
                  onClick={() => setActiveLessonId(lesson.id)}
                >
                  <span
                    className={
                      "learn__lesson-check" +
                      (lesson.completed ? " learn__lesson-check--done" : "")
                    }
                    aria-hidden="true"
                  >
                    {lesson.completed ? "✓" : ""}
                  </span>
                  {lesson.title}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="learn__viewer">
          {!activeLesson && <p className="state-message">This course doesn't have any lessons yet.</p>}

          {activeLesson && (
            <>
              <h2>{activeLesson.title}</h2>

              {embedUrl && (
                <div className="learn__video">
                  <iframe
                    src={embedUrl}
                    title={activeLesson.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}

              {activeLesson.files.length > 0 && (
                <div className="learn__files">
                  <h3>Downloads</h3>
                  <ul>
                    {activeLesson.files.map((file) => (
                      <li key={file.id}>
                        <button
                          type="button"
                          className="button button--ghost button--sm"
                          onClick={() => handleDownload(file)}
                          disabled={downloadingFileId === file.id}
                        >
                          {downloadingFileId === file.id ? "Downloading…" : `Download: ${file.label}`}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                type="button"
                className={
                  "button button--sm " +
                  (activeLesson.completed ? "button--ghost" : "button--primary")
                }
                onClick={() => toggleComplete(activeLesson)}
                disabled={pendingLessonId === activeLesson.id}
              >
                {pendingLessonId === activeLesson.id
                  ? "Updating…"
                  : activeLesson.completed
                  ? "Mark as incomplete"
                  : "Mark as complete"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
