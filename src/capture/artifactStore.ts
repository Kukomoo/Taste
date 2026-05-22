const DB_NAME = "kukomo-artifacts";
const DB_VERSION = 1;
const STORE_NAME = "recordings";

export interface StoredRecording {
  id: string;
  blob: Blob;
  createdAt: string;
  mimeType: string;
  size: number;
}

export async function saveRecordingArtifact(blob: Blob): Promise<StoredRecording> {
  const db = await openArtifactDb();
  const record: StoredRecording = {
    id: `artifact_${crypto.randomUUID?.() ?? Math.random().toString(36).slice(2)}`,
    blob,
    createdAt: new Date().toISOString(),
    mimeType: blob.type || "video/webm",
    size: blob.size
  };
  await requestToPromise(db.transaction(STORE_NAME, "readwrite").objectStore(STORE_NAME).put(record));
  db.close();
  return record;
}

export async function loadRecordingArtifact(id: string): Promise<StoredRecording | undefined> {
  const db = await openArtifactDb();
  const record = await requestToPromise<StoredRecording | undefined>(
    db.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME).get(id)
  );
  db.close();
  return record;
}

export function artifactUri(id: string) {
  return `artifact://${id}`;
}

export function parseArtifactUri(value: string) {
  return value.startsWith("artifact://") ? value.replace("artifact://", "") : undefined;
}

function openArtifactDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Could not open artifact database."));
  });
}

function requestToPromise<T = unknown>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Artifact database request failed."));
  });
}
