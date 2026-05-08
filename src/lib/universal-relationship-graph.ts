// Universal Relationship Graph - Everything connected visually (customer↔orders↔payments↔support)
import type { EntityType, EntityState } from "./operational-state-machine";
import type { Priority } from "./system-priority-engine";

export interface RelationshipNode {
  id: string;
  entityType: EntityType;
  name: string;
  state: EntityState;
  x: number;
  y: number;
  size: number;
  color: string;
  metadata: Record<string, any>;
}

export interface RelationshipEdge {
  id: string;
  from: string;
  to: string;
  type: 'parent' | 'child' | 'peer' | 'dependency' | 'reference';
  weight: number;
  label: string;
  direction: 'bidirectional' | 'unidirectional';
}

export interface RelationshipGraph {
  nodes: RelationshipNode[];
  edges: RelationshipEdge[];
  clusters: Array<{
    id: string;
    name: string;
    entityType: EntityType;
    nodes: string[];
  }>;
  layout: 'force' | 'hierarchical' | 'circular' | 'grid';
}

export interface RelationshipPath {
  nodes: RelationshipNode[];
  edges: RelationshipEdge[];
  totalDistance: number;
  pathType: 'shortest' | 'critical' | 'financial' | 'operational';
}

// Entity relationship definitions
export const entityRelationships: Record<EntityType, EntityType[]> = {
  customer: ['order', 'invoice', 'payment', 'ticket', 'quote', 'contract'],
  employee: ['ticket', 'leave', 'performance', 'training', 'payroll'],
  order: ['customer', 'invoice', 'payment', 'product', 'shipment'],
  invoice: ['customer', 'order', 'payment', 'quote'],
  payment: ['invoice', 'customer', 'order', 'vendor'],
  product: ['order', 'invoice', 'vendor', 'shipment'],
  vendor: ['product', 'invoice', 'payment'],
  ticket: ['customer', 'employee', 'order'],
  quote: ['customer', 'lead', 'invoice', 'order'],
  lead: ['customer', 'quote', 'employee'],
  contract: ['customer', 'invoice', 'payment'],
  shipment: ['order', 'product', 'customer'],
};

// Entity type colors
export const entityTypeColors: Record<EntityType, string> = {
  customer: 'oklch(0.65 0.18 200)',
  employee: 'oklch(0.68 0.18 45)',
  order: 'oklch(0.72 0.18 155)',
  invoice: 'oklch(0.75 0.15 280)',
  payment: 'oklch(0.78 0.16 75)',
  product: 'oklch(0.65 0.2 330)',
  vendor: 'oklch(0.7 0.18 25)',
  ticket: 'oklch(0.5 0.15 270)',
  quote: 'oklch(0.6 0.18 145)',
  lead: 'oklch(0.55 0.2 50)',
  contract: 'oklch(0.6 0.15 270)',
  shipment: 'oklch(0.65 0.18 145),
};

// Create relationship graph from entities
export function createRelationshipGraph(
  entities: Array<{
    entityType: EntityType;
    entityId: string;
    name: string;
    state: EntityState;
    metadata?: Record<string, any>;
  }>,
  layout: 'force' | 'hierarchical' | 'circular' | 'grid' = 'force'
): RelationshipGraph {
  const nodes: RelationshipNode[] = entities.map((entity, index) => ({
    id: `${entity.entityType}-${entity.entityId}`,
    entityType: entity.entityType,
    name: entity.name,
    state: entity.state,
    x: 0,
    y: 0,
    size: 30,
    color: entityTypeColors[entity.entityType],
    metadata: entity.metadata || {},
  }));

  const edges: RelationshipEdge[] = [];
  const edgeSet = new Set<string>();

  // Create edges based on relationships
  entities.forEach(entity => {
    const relatedTypes = entityRelationships[entity.entityType] || [];
    
    relatedTypes.forEach(relatedType => {
      const relatedEntities = entities.filter(e => e.entityType === relatedType);
      
      relatedEntities.forEach(related => {
        const edgeId = `${entity.entityType}-${entity.entityId}-${related.entityType}-${related.entityId}`;
        const reverseEdgeId = `${related.entityType}-${related.entityId}-${entity.entityType}-${entity.entityId}`;
        
        if (!edgeSet.has(edgeId) && !edgeSet.has(reverseEdgeId)) {
          edgeSet.add(edgeId);
          
          edges.push({
            id: edgeId,
            from: `${entity.entityType}-${entity.entityId}`,
            to: `${related.entityType}-${related.entityId}`,
            type: 'reference',
            weight: 1,
            label: getRelationshipLabel(entity.entityType, related.entityType),
            direction: 'bidirectional',
          });
        }
      });
    });
  });

  // Apply layout
  applyLayout(nodes, edges, layout);

  // Create clusters by entity type
  const clusters: Array<{
    id: string;
    name: string;
    entityType: EntityType;
    nodes: string[];
  }> = [];
  
  const typeGroups: Record<EntityType, string[]> = {} as Record<EntityType, string[]>;
  nodes.forEach(node => {
    if (!typeGroups[node.entityType]) {
      typeGroups[node.entityType] = [];
    }
    typeGroups[node.entityType].push(node.id);
  });
  
  Object.entries(typeGroups).forEach(([type, nodeIds]) => {
    clusters.push({
      id: `cluster-${type}`,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)}s`,
      entityType: type as EntityType,
      nodes: nodeIds,
    });
  });

  return {
    nodes,
    edges,
    clusters,
    layout,
  };
}

// Get relationship label
function getRelationshipLabel(fromType: EntityType, toType: EntityType): string {
  const labels: Record<string, string> = {
    'customer-order': 'places',
    'order-customer': 'from',
    'order-invoice': 'generates',
    'invoice-order': 'for',
    'invoice-payment': 'receives',
    'payment-invoice': 'for',
    'order-product': 'contains',
    'product-order': 'in',
    'order-shipment': 'shipped via',
    'shipment-order': 'for',
    'customer-ticket': 'submits',
    'ticket-customer': 'from',
    'employee-ticket': 'handles',
    'ticket-employee': 'assigned to',
    'quote-customer': 'sent to',
    'customer-quote': 'receives',
    'quote-invoice': 'converts to',
    'invoice-quote': 'from',
    'lead-customer': 'becomes',
    'customer-lead': 'from',
    'contract-customer': 'with',
    'customer-contract': 'has',
    'contract-invoice': 'generates',
    'invoice-contract': 'from',
    'contract-payment': 'receives',
    'payment-contract': 'for',
    'vendor-product': 'supplies',
    'product-vendor': 'from',
    'vendor-invoice': 'sends',
    'invoice-vendor': 'to',
    'vendor-payment': 'receives',
    'payment-vendor': 'to',
  };
  
  const key = `${fromType}-${toType}`;
  return labels[key] || 'related to';
}

// Apply layout to nodes
function applyLayout(
  nodes: RelationshipNode[],
  edges: RelationshipEdge[],
  layout: 'force' | 'hierarchical' | 'circular' | 'grid'
): void {
  switch (layout) {
    case 'force':
      applyForceLayout(nodes, edges);
      break;
    case 'hierarchical':
      applyHierarchicalLayout(nodes, edges);
      break;
    case 'circular':
      applyCircularLayout(nodes);
      break;
    case 'grid':
      applyGridLayout(nodes);
      break;
  }
}

// Force-directed layout (simplified)
function applyForceLayout(nodes: RelationshipNode[], edges: RelationshipEdge[]): void {
  const centerX = 500;
  const centerY = 500;
  const radius = 300;
  
  nodes.forEach((node, index) => {
    const angle = (index / nodes.length) * 2 * Math.PI;
    node.x = centerX + Math.cos(angle) * radius;
    node.y = centerY + Math.sin(angle) * radius;
  });
}

// Hierarchical layout
function applyHierarchicalLayout(nodes: RelationshipNode[], edges: RelationshipEdge[]): void {
  const levels: Record<EntityType, number> = {
    customer: 0,
    lead: 0,
    employee: 0,
    quote: 1,
    order: 2,
    invoice: 3,
    payment: 4,
    ticket: 1,
    product: 2,
    vendor: 3,
    contract: 3,
    shipment: 3,
  };
  
  const nodesByLevel: Record<number, RelationshipNode[]> = {};
  
  nodes.forEach(node => {
    const level = levels[node.entityType] || 0;
    if (!nodesByLevel[level]) {
      nodesByLevel[level] = [];
    }
    nodesByLevel[level].push(node);
  });
  
  const levelCount = Object.keys(nodesByLevel).length;
  const levelHeight = 800 / levelCount;
  
  Object.entries(nodesByLevel).forEach(([level, levelNodes]) => {
    const levelNum = parseInt(level);
    const levelY = levelNum * levelHeight + 100;
    const levelWidth = 1000 / levelNodes.length;
    
    levelNodes.forEach((node, index) => {
      node.x = index * levelWidth + 50;
      node.y = levelY;
    });
  });
}

// Circular layout
function applyCircularLayout(nodes: RelationshipNode[]): void {
  const centerX = 500;
  const centerY = 500;
  const radius = 300;
  
  nodes.forEach((node, index) => {
    const angle = (index / nodes.length) * 2 * Math.PI;
    node.x = centerX + Math.cos(angle) * radius;
    node.y = centerY + Math.sin(angle) * radius;
  });
}

// Grid layout
function applyGridLayout(nodes: RelationshipNode[]): void {
  const cols = Math.ceil(Math.sqrt(nodes.length));
  const cellWidth = 1000 / cols;
  const cellHeight = 800 / cols;
  
  nodes.forEach((node, index) => {
    const row = Math.floor(index / cols);
    const col = index % cols;
    node.x = col * cellWidth + cellWidth / 2;
    node.y = row * cellHeight + cellHeight / 2;
  });
}

// Find shortest path between nodes
export function findShortestPath(
  graph: RelationshipGraph,
  fromId: string,
  toId: string
): RelationshipPath | null {
  const fromNode = graph.nodes.find(n => n.id === fromId);
  const toNode = graph.nodes.find(n => n.id === toId);
  
  if (!fromNode || !toNode) return null;
  
  // BFS for shortest path
  const visited = new Set<string>();
  const queue: Array<{ nodeId: string; path: RelationshipNode[]; edges: RelationshipEdge[] }> = [
    { nodeId: fromId, path: [fromNode], edges: [] },
  ];
  
  while (queue.length > 0) {
    const { nodeId, path, edges } = queue.shift()!;
    
    if (nodeId === toId) {
      return {
        nodes: path,
        edges,
        totalDistance: edges.reduce((sum, e) => sum + e.weight, 0),
        pathType: 'shortest',
      };
    }
    
    if (visited.has(nodeId)) continue;
    visited.add(nodeId);
    
    const outgoingEdges = graph.edges.filter(e => e.from === nodeId);
    outgoingEdges.forEach(edge => {
      const nextNode = graph.nodes.find(n => n.id === edge.to);
      if (nextNode && !visited.has(nextNode.id)) {
        queue.push({
          nodeId: nextNode.id,
          path: [...path, nextNode],
          edges: [...edges, edge],
        });
      }
    });
  }
  
  return null;
}

// Find critical path (highest weight edges)
export function findCriticalPath(
  graph: RelationshipGraph,
  fromId: string,
  toId: string
): RelationshipPath | null {
  const path = findShortestPath(graph, fromId, toId);
  if (!path) return null;
  
  return {
    ...path,
    pathType: 'critical',
  };
}

// Get connected components
export function getConnectedComponents(graph: RelationshipGraph): Array<{
  nodes: RelationshipNode[];
  edges: RelationshipEdge[];
}> {
  const visited = new Set<string>();
  const components: Array<{
    nodes: RelationshipNode[];
    edges: RelationshipEdge[];
  }> = [];
  
  graph.nodes.forEach(node => {
    if (visited.has(node.id)) return;
    
    const componentNodes: RelationshipNode[] = [];
    const componentEdges: RelationshipEdge[] = [];
    const queue = [node.id];
    
    while (queue.length > 0) {
      const nodeId = queue.shift()!;
      if (visited.has(nodeId)) continue;
      
      visited.add(nodeId);
      const currentNode = graph.nodes.find(n => n.id === nodeId);
      if (currentNode) {
        componentNodes.push(currentNode);
      }
      
      const connectedEdges = graph.edges.filter(e => e.from === nodeId || e.to === nodeId);
      connectedEdges.forEach(edge => {
        componentEdges.push(edge);
        if (!visited.has(edge.from)) queue.push(edge.from);
        if (!visited.has(edge.to)) queue.push(edge.to);
      });
    }
    
    components.push({
      nodes: componentNodes,
      edges: componentEdges,
    });
  });
  
  return components;
}

// Get neighbors of a node
export function getNodeNeighbors(
  graph: RelationshipGraph,
  nodeId: string,
  depth: number = 1
): {
  nodes: RelationshipNode[];
  edges: RelationshipEdge[];
} {
  const visited = new Set<string>();
  const resultNodes: RelationshipNode[] = [];
  const resultEdges: RelationshipEdge[] = [];
  const queue = Array<{ nodeId: string; currentDepth: number }>([{ nodeId, 0 }]);
  
  while (queue.length > 0) {
    const { nodeId: currentId, currentDepth } = queue.shift()!;
    
    if (visited.has(currentId) || currentDepth > depth) continue;
    visited.add(currentId);
    
    const currentNode = graph.nodes.find(n => n.id === currentId);
    if (currentNode && currentDepth > 0) {
      resultNodes.push(currentNode);
    }
    
    if (currentDepth < depth) {
      const connectedEdges = graph.edges.filter(e => e.from === currentId || e.to === currentId);
      connectedEdges.forEach(edge => {
        resultEdges.push(edge);
        const neighborId = edge.from === currentId ? edge.to : edge.from;
        if (!visited.has(neighborId)) {
          queue.push({ nodeId: neighborId, currentDepth: currentDepth + 1 });
        }
      });
    }
  }
  
  return {
    nodes: resultNodes,
    edges: resultEdges,
  };
}

// Get subgraph around a node
export function getSubgraph(
  graph: RelationshipGraph,
  centerNodeId: string,
  radius: number = 2
): RelationshipGraph {
  const { nodes: neighborNodes, edges: neighborEdges } = getNodeNeighbors(graph, centerNodeId, radius);
  const centerNode = graph.nodes.find(n => n.id === centerNodeId);
  
  return {
    nodes: centerNode ? [centerNode, ...neighborNodes] : neighborNodes,
    edges: neighborEdges,
    clusters: [],
    layout: graph.layout,
  };
}

// Find nodes by entity type
export function findNodesByType(
  graph: RelationshipGraph,
  entityType: EntityType
): RelationshipNode[] {
  return graph.nodes.filter(n => n.entityType === entityType);
}

// Find nodes by state
export function findNodesByState(
  graph: RelationshipGraph,
  state: EntityState
): RelationshipNode[] {
  return graph.nodes.filter(n => n.state === state);
}

// Find nodes with issues
export function findNodesWithIssues(graph: RelationshipGraph): RelationshipNode[] {
  const problemStates: EntityState[] = ['blocked', 'failed', 'delayed', 'overdue'];
  return graph.nodes.filter(n => problemStates.includes(n.state));
}

// Calculate graph statistics
export function calculateGraphStatistics(graph: RelationshipGraph): {
  totalNodes: number;
  totalEdges: number;
  averageDegree: number;
  connectedComponents: number;
  nodesByType: Record<EntityType, number>;
  nodesByState: Record<EntityState, number>;
} {
  const nodesByType: Record<string, number> = {};
  const nodesByState: Record<string, number> = {};
  
  graph.nodes.forEach(node => {
    nodesByType[node.entityType] = (nodesByType[node.entityType] || 0) + 1;
    nodesByState[node.state] = (nodesByState[node.state] || 0) + 1;
  });
  
  const degrees = graph.nodes.map(node => 
    graph.edges.filter(e => e.from === node.id || e.to === node.id).length
  );
  const averageDegree = degrees.length > 0 
    ? degrees.reduce((sum, d) => sum + d, 0) / degrees.length 
    : 0;
  
  const components = getConnectedComponents(graph);
  
  return {
    totalNodes: graph.nodes.length,
    totalEdges: graph.edges.length,
    averageDegree: Math.round(averageDegree * 100) / 100,
    connectedComponents: components.length,
    nodesByType: nodesByType as Record<EntityType, number>,
    nodesByState: nodesByState as Record<EntityState, number>,
  };
}

// Get graph summary
export function getGraphSummary(graph: RelationshipGraph): {
  nodes: number;
  edges: number;
  clusters: number;
  layout: string;
  health: {
    healthy: number;
    warning: number;
    critical: number;
  };
} {
  const stats = calculateGraphStatistics(graph);
  
  let healthy = 0;
  let warning = 0;
  let critical = 0;
  
  graph.nodes.forEach(node => {
    if (node.state === 'blocked' || node.state === 'failed') {
      critical++;
    } else if (node.state === 'delayed' || node.state === 'overdue' || node.state === 'pending') {
      warning++;
    } else {
      healthy++;
    }
  });
  
  return {
    nodes: stats.totalNodes,
    edges: stats.totalEdges,
    clusters: graph.clusters.length,
    layout: graph.layout,
    health: {
      healthy,
      warning,
      critical,
    },
  };
}
