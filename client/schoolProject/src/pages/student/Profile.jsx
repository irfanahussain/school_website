import { useState } from "react";
import { useAuth } from "../../AuthContext.jsx";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function Profile() {
  const { user, updateAvatar } = useAuth();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const initial = (user?.full_name || user?.email || "S").charAt(0).toUpperCase();

  async function handleFileChange(event) {
    const file = event.target.files?.[0];
    event.target.value = ""; // allow re-selecting the same file later
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError("Image must be smaller than 5MB.");
      return;
    }

    setError("");
    setSaving(true);
    try {
      await updateAvatar(file);
    } catch (err) {
      setError(err?.data?.avatar?.[0] || "Couldn't upload the photo. Try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="student__header">
        <p className="eyebrow">Profile</p>
        <h1>Your profile</h1>
        <p className="student__lede">Personal details on file for your Softspire account.</p>
      </div>

      <div className="student__profile-card">
        <span className="student__avatar student__avatar--lg" aria-hidden="true">
          {user?.avatar ? <img src={user.avatar} alt="" /> : initial}
        </span>

        <div className="student__avatar-upload">
          <label htmlFor="avatar-upload">
            {saving ? "Uploading…" : "Change profile photo"}
          </label>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={saving}
          />
          {error && <p className="error">{error}</p>}
        </div>

        <dl className="student__profile-list">
          <div>
            <dt>Full name</dt>
            <dd>{user?.full_name}</dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>{user?.email}</dd>
          </div>
        </dl>
      </div>

      <p className="student__profile-note">
        Need to update these details? Reach out via the Contact page — self-serve profile
        editing isn't available yet.
      </p>
    </>
  );
}