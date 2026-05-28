import type { AppState, MemoryCluster, MemoryNode } from "../types";

export interface AuthUser {
  id: string;
  email?: string;
}

export interface StorageProvider {
  getCurrentUser: () => Promise<AuthUser | null>;
  saveState: (state: AppState) => Promise<void>;
  saveCluster: (cluster: MemoryCluster, nodes: MemoryNode[]) => Promise<void>;
}

export class LocalStorageProvider implements StorageProvider {
  async getCurrentUser() {
    return { id: "local-demo-user", email: "local@kukomo.dev" };
  }

  async saveState(state: AppState) {
    localStorage.setItem("kukomo.backend.state", JSON.stringify(state));
  }

  async saveCluster(cluster: MemoryCluster, nodes: MemoryNode[]) {
    localStorage.setItem(
      `kukomo.backend.cluster.${cluster.id}`,
      JSON.stringify({
        cluster,
        nodes,
        savedAt: new Date().toISOString()
      })
    );
  }
}

export function createStorageProvider(): StorageProvider {
  return new LocalStorageProvider();
}
