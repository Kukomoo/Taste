import { useEffect, useMemo, useState } from "react";
import { clusterNodes, latestCluster } from "../logic/selectors";
import type { AppState, MemoryCluster, MemoryNode } from "../types";

const nodeOrder = ["source", "keyframe", "audio", "transcript", "ocr", "prompt", "summary"];

export function ClusterDetail({ state }: { state: AppState }) {
  const [selectedClusterId, setSelectedClusterId] = useState(latestCluster(state)?.id ?? "");
  const newestClusterId = latestCluster(state)?.id ?? "";

  useEffect(() => {
    if (newestClusterId) setSelectedClusterId(newestClusterId);
  }, [newestClusterId]);

  const selectedCluster = state.clusters.find((cluster) => cluster.id === selectedClusterId) ?? latestCluster(state);
  const nodes = useMemo(
    () => (selectedCluster ? clusterNodes(state, selectedCluster.id).sort(sortNodes) : []),
    [selectedCluster, state]
  );

  if (!selectedCluster) return null;

  return (
    <section className="cluster-detail">
      <div className="cluster-detail-header">
        <div>
          <span className="section-label">Cluster inspector</span>
          <h2>{selectedCluster.title}</h2>
          <p>{clusterMeta(selectedCluster, nodes)}</p>
        </div>
        <select value={selectedCluster.id} onChange={(event) => setSelectedClusterId(event.target.value)}>
          {state.clusters.map((cluster) => (
            <option key={cluster.id} value={cluster.id}>
              {cluster.title}
            </option>
          ))}
        </select>
      </div>
      <div className="cluster-node-table">
        {nodes.map((node) => (
          <article key={node.id} className={`cluster-node-row node-${node.type}`}>
            <div>
              <span>{node.type}</span>
              <strong>{node.title}</strong>
            </div>
            <p>{node.content}</p>
            <small>{node.tags.join(" / ")}</small>
          </article>
        ))}
      </div>
    </section>
  );
}

function sortNodes(a: MemoryNode, b: MemoryNode) {
  return nodeOrder.indexOf(a.type) - nodeOrder.indexOf(b.type);
}

function clusterMeta(cluster: MemoryCluster, nodes: MemoryNode[]) {
  const nodeTypes = [...new Set(nodes.map((node) => node.type))].join(", ");
  return `${cluster.source} · ${cluster.status} · ${nodes.length} nodes${nodeTypes ? ` · ${nodeTypes}` : ""}`;
}
