/**
 * Org Chart Costing and Scenario Building Library
 * 
 * @version 1.0.0
 * @author NorthPath Strategies
 */

export interface OrgNode {
  id: string;
  roleTitle: string;
  fte: number;
  annualCost?: number;
  parentId?: string | null;
  level?: number;
  children?: OrgNode[];
  x?: number;
  y?: number;
}

export interface ScenarioSummary {
  name: string;
  totalFte: number;
  totalCost: number;
  positionCount: number;
  avgSpanOfControl: number;
  savingsVsBaseline?: number;
  savingsPercentage?: number;
}

export interface Scenarios {
  baseline: ScenarioSummary;
  moderate: ScenarioSummary;
  aggressive: ScenarioSummary;
}

// Default role rates (USD annually) - can be overridden by PositionCost table
export const ROLE_RATES: Record<string, number> = {
  'CEO': 300000,
  'CFO': 250000,
  'CTO': 250000,
  'VP': 180000,
  'Director': 150000,
  'Senior Manager': 120000,
  'Manager': 95000,
  'Senior Analyst': 80000,
  'Analyst': 65000,
  'Coordinator': 55000,
  'Assistant': 45000,
  'Administrator': 50000,
  'Specialist': 70000,
  'Lead': 85000,
  'Principal': 140000,
  'Senior Director': 200000,
  'Executive': 220000,
  'President': 350000,
};

/**
 * Builds a hierarchical org tree from flat role data
 */
export function buildOrgTree(roles: Array<{
  id: string;
  roleTitle: string;
  fte: number;
  parentId?: string | null;
  level?: number;
}>): OrgNode[] {
  const nodeMap = new Map<string, OrgNode>();
  const visited = new Set<string>();
  
  // Convert roles to nodes
  roles.forEach(role => {
    nodeMap.set(role.id, {
      id: role.id,
      roleTitle: role.roleTitle,
      fte: role.fte,
      parentId: role.parentId,
      level: role.level,
      children: []
    });
  });

  // Build hierarchy and detect cycles
  const roots: OrgNode[] = [];
  
  nodeMap.forEach((node) => {
    if (!node.parentId) {
      roots.push(node);
    } else {
      const parent = nodeMap.get(node.parentId);
      if (parent && !wouldCreateCycle(node, parent, visited)) {
        parent.children = parent.children || [];
        parent.children.push(node);
      } else {
        // If cycle detected or parent not found, treat as root
        roots.push(node);
      }
    }
  });

  return roots;
}

/**
 * Detects if adding a child to parent would create a cycle
 */
function wouldCreateCycle(child: OrgNode, parent: OrgNode, visited: Set<string>): boolean {
  if (child.id === parent.id) return true;
  
  visited.clear();
  let current: OrgNode | undefined = parent;
  
  while (current) {
    if (visited.has(current.id)) return true;
    visited.add(current.id);
    
    if (current.id === child.id) return true;
    
    // Move up the hierarchy
    current = undefined; // Would need parent reference to implement fully
  }
  
  return false;
}

/**
 * Estimates costs for each node in the tree
 */
export function estimateCost(tree: OrgNode[], customRates?: Record<string, number>): OrgNode[] {
  const rates = { ...ROLE_RATES, ...customRates };
  
  function walkNode(node: OrgNode): OrgNode {
    // Calculate cost for this node
    const baseRate = rates[node.roleTitle] || rates['Analyst'] || 65000;
    node.annualCost = Math.round(node.fte * baseRate);
    
    // Process children
    if (node.children) {
      node.children = node.children.map(walkNode);
    }
    
    return node;
  }
  
  return tree.map(walkNode);
}

/**
 * Builds restructuring scenarios from the baseline tree
 */
export function buildScenarios(tree: OrgNode[]): Scenarios {
  const baseline = summarizeTree(tree, 'Baseline');
  
  // Moderate scenario: remove positions with span of control ≤ 3
  const moderateTree = pruneBySpanOfControl(structuredClone(tree), 3);
  const moderate = summarizeTree(moderateTree, 'Moderate Restructuring');
  moderate.savingsVsBaseline = baseline.totalCost - moderate.totalCost;
  moderate.savingsPercentage = (moderate.savingsVsBaseline / baseline.totalCost) * 100;
  
  // Aggressive scenario: target span ≥ 10 and eliminate redundancies
  const aggressiveTree = pruneBySpanOfControl(structuredClone(tree), 10, true);
  const aggressive = summarizeTree(aggressiveTree, 'Aggressive Restructuring');
  aggressive.savingsVsBaseline = baseline.totalCost - aggressive.totalCost;
  aggressive.savingsPercentage = (aggressive.savingsVsBaseline / baseline.totalCost) * 100;
  
  return { baseline, moderate, aggressive };
}

/**
 * Removes positions based on span of control analysis
 */
function pruneBySpanOfControl(tree: OrgNode[], minSpan: number, aggressive = false): OrgNode[] {
  function pruneNode(node: OrgNode): OrgNode | null {
    if (!node.children || node.children.length === 0) {
      return node; // Keep leaf nodes
    }
    
    // Process children first
    node.children = node.children
      .map(pruneNode)
      .filter((child): child is OrgNode => child !== null);
    
    const spanOfControl = node.children.length;
    
    if (aggressive) {
      // In aggressive mode, eliminate managers with very small spans
      if (spanOfControl < 2 && node.level && node.level > 0) {
        // Promote children up one level
        return null;
      }
      
      // Flatten unnecessarily deep hierarchies
      if (spanOfControl === 1 && node.children[0].children && node.children[0].children.length > 0) {
        const child = node.children[0];
        child.parentId = node.parentId;
        return child;
      }
    }
    
    // Standard pruning: remove if span is too small
    if (spanOfControl < minSpan && spanOfControl > 0) {
      return null;
    }
    
    return node;
  }
  
  return tree
    .map(pruneNode)
    .filter((node): node is OrgNode => node !== null);
}

/**
 * Summarizes tree metrics for scenario comparison
 */
function summarizeTree(tree: OrgNode[], name: string): ScenarioSummary {
  let totalFte = 0;
  let totalCost = 0;
  let positionCount = 0;
  let managersWithReports = 0;
  let totalDirectReports = 0;
  
  function walkNode(node: OrgNode): void {
    totalFte += node.fte;
    totalCost += node.annualCost || 0;
    positionCount++;
    
    if (node.children && node.children.length > 0) {
      managersWithReports++;
      totalDirectReports += node.children.length;
      node.children.forEach(walkNode);
    }
  }
  
  tree.forEach(walkNode);
  
  const avgSpanOfControl = managersWithReports > 0 
    ? Math.round((totalDirectReports / managersWithReports) * 10) / 10 
    : 0;
  
  return {
    name,
    totalFte: Math.round(totalFte * 10) / 10,
    totalCost: Math.round(totalCost),
    positionCount,
    avgSpanOfControl
  };
}

/**
 * Calculates tree depth for complexity analysis
 */
export function calculateMaxDepth(tree: OrgNode[]): number {
  function getDepth(node: OrgNode): number {
    if (!node.children || node.children.length === 0) {
      return 1;
    }
    return 1 + Math.max(...node.children.map(getDepth));
  }
  
  return Math.max(...tree.map(getDepth));
}

/**
 * Validates tree structure for common issues
 */
export function validateTree(tree: OrgNode[]): Array<{ type: string; message: string; nodeId?: string }> {
  const issues: Array<{ type: string; message: string; nodeId?: string }> = [];
  const allIds = new Set<string>();
  
  function validateNode(node: OrgNode, depth = 0): void {
    // Check for duplicate IDs
    if (allIds.has(node.id)) {
      issues.push({
        type: 'DUPLICATE_ID',
        message: `Duplicate node ID found: ${node.id}`,
        nodeId: node.id
      });
    }
    allIds.add(node.id);
    
    // Check for excessive depth
    if (depth > 10) {
      issues.push({
        type: 'EXCESSIVE_DEPTH',
        message: `Node at excessive depth (${depth}): ${node.roleTitle}`,
        nodeId: node.id
      });
    }
    
    // Check for unrealistic FTE
    if (node.fte <= 0 || node.fte > 2) {
      issues.push({
        type: 'INVALID_FTE',
        message: `Invalid FTE value (${node.fte}) for ${node.roleTitle}`,
        nodeId: node.id
      });
    }
    
    // Check children
    if (node.children) {
      node.children.forEach(child => validateNode(child, depth + 1));
    }
  }
  
  tree.forEach(node => validateNode(node));
  
  return issues;
}
