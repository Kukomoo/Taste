import type { ButtonHTMLAttributes, PropsWithChildren } from "react";
import type { Capture } from "../types";

export function Button({
  children,
  variant = "primary",
  ...props
}: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" }>) {
  return (
    <button className={`button ${variant}`} {...props}>
      {children}
    </button>
  );
}

export function CaptureCard({
  capture,
  onPin,
  onArchive
}: {
  capture: Capture;
  onPin?: () => void;
  onArchive?: () => void;
}) {
  return (
    <article className={`capture-card ${capture.thumbnail ? "visual" : ""}`}>
      {capture.thumbnail ? <img src={capture.thumbnail} alt="" /> : null}
      <div className="capture-body">
        <div className="capture-kicker">{capture.type}</div>
        <h3>{capture.title}</h3>
        {capture.note ? <p>{capture.note}</p> : null}
        <div className="tag-row">
          {capture.tags.slice(0, 3).map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <div className="card-actions">
          {onPin ? <Button variant="ghost" onClick={onPin}>{capture.pinned ? "Unpin" : "Pin"}</Button> : null}
          {onArchive ? <Button variant="ghost" onClick={onArchive}>{capture.archived ? "Unarchive" : "Archive"}</Button> : null}
        </div>
      </div>
    </article>
  );
}
