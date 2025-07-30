/**
 * Org Chart Builder Service
 * 
 * @version 1.0.0
 * @author NorthPath Strategies
 */

import { buildOrgTree, estimateCost, buildScenarios, validateTree, type OrgNode, type Scenarios } from './costing';

export interface ChartBuildResult {
  tree: OrgNode[];
  scenarios: Scenarios;
  svg?: string;
  issues: Array<{ type: string; message: string; nodeId?: string }>;
}

export interface RoleData {
  id: string;
  roleTitle: string;
  fte: number;
  parentId?: string | null;
  level?: number;
  annualCost?: number;
}

/**
 * Main chart building orchestrator
 */
export async function buildChart(
  roles: RoleData[], 
  customRates?: Record<string, number>
): Promise<ChartBuildResult> {
  try {
    // 1. Build hierarchical tree structure
    const tree = buildOrgTree(roles);
    
    // 2. Validate tree structure
    const issues = validateTree(tree);
    
    // 3. Apply costing
    const costedTree = estimateCost(tree, customRates);
    
    // 4. Generate scenarios
    const scenarios = buildScenarios(costedTree);
    
    return {
      tree: costedTree,
      scenarios,
      issues
    };
  } catch (error) {
    console.error('Chart building failed:', error);
    throw new Error(`Failed to build org chart: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Converts tree to D3-compatible format with positioning
 */
export function treeToD3Format(tree: OrgNode[]): any {
  // Basic D3 hierarchy format
  const d3Data = {
    name: "Organization",
    children: tree.map(convertNode)
  };
  
  return d3Data;
}

function convertNode(node: OrgNode): any {
  const d3Node: any = {
    name: node.roleTitle,
    id: node.id,
    fte: node.fte,
    cost: node.annualCost,
    data: {
      id: node.id,
      roleTitle: node.roleTitle,
      fte: node.fte,
      annualCost: node.annualCost,
      level: node.level
    }
  };
  
  if (node.children && node.children.length > 0) {
    d3Node.children = node.children.map(convertNode);
  }
  
  return d3Node;
}

/**
 * Generates SVG representation of the org chart
 */
export async function generateSVG(tree: OrgNode[], width = 1200, _height = 800): Promise<string> {
  // Server-side D3 SVG generation
  // For now, return a placeholder - will implement with d3-node if needed
  const _d3Data = treeToD3Format(tree);
  
  // Calculate basic layout
  const nodeCount = countNodes(tree);
  const estimatedHeight = Math.max(400, nodeCount * 80);
  
  // Generate basic SVG structure
  const svg = `
    <svg width="${width}" height="${estimatedHeight}" viewBox="0 0 ${width} ${estimatedHeight}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          .org-node { fill: #3b82f6; stroke: #1d4ed8; stroke-width: 2; }
          .org-text { fill: white; font-family: Arial, sans-serif; font-size: 12px; text-anchor: middle; }
          .org-link { stroke: #6b7280; stroke-width: 2; fill: none; }
        </style>
      </defs>
      <g transform="translate(${width/2}, 40)">
        ${generateSVGNodes(tree, 0, 0, width)}
      </g>
    </svg>
  `.trim();
  
  return svg;
}

function generateSVGNodes(nodes: OrgNode[], x: number, y: number, totalWidth: number): string {
  if (!nodes || nodes.length === 0) return '';
  
  let svg = '';
  const nodeWidth = 150;
  const nodeHeight = 60;
  const verticalSpacing = 100;
  const horizontalSpacing = totalWidth / (nodes.length + 1);
  
  nodes.forEach((node, index) => {
    const nodeX = (index - (nodes.length - 1) / 2) * horizontalSpacing;
    const nodeY = y;
    
    // Draw node rectangle
    svg += `
      <rect x="${nodeX - nodeWidth/2}" y="${nodeY - nodeHeight/2}" 
            width="${nodeWidth}" height="${nodeHeight}" 
            class="org-node" rx="8"/>
    `;
    
    // Add text
    svg += `
      <text x="${nodeX}" y="${nodeY - 5}" class="org-text">
        ${escapeXml(node.roleTitle)}
      </text>
      <text x="${nodeX}" y="${nodeY + 15}" class="org-text" style="font-size: 10px;">
        FTE: ${node.fte} | $${(node.annualCost || 0).toLocaleString()}
      </text>
    `;
    
    // Draw children
    if (node.children && node.children.length > 0) {
      // Draw connecting line down
      svg += `
        <line x1="${nodeX}" y1="${nodeY + nodeHeight/2}" 
              x2="${nodeX}" y2="${nodeY + verticalSpacing - nodeHeight/2}" 
              class="org-link"/>
      `;
      
      // Draw children
      svg += generateSVGNodes(
        node.children, 
        nodeX, 
        nodeY + verticalSpacing, 
        Math.min(totalWidth, node.children.length * 200)
      );
    }
  });
  
  return svg;
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function countNodes(tree: OrgNode[]): number {
  let count = 0;
  
  function walkNode(node: OrgNode): void {
    count++;
    if (node.children) {
      node.children.forEach(walkNode);
    }
  }
  
  tree.forEach(walkNode);
  return count;
}

/**
 * Optimizes tree layout for better visualization
 */
export function optimizeLayout(tree: OrgNode[]): OrgNode[] {
  // Sort children by FTE or cost for better visual hierarchy
  function sortChildren(node: OrgNode): OrgNode {
    if (node.children && node.children.length > 0) {
      node.children = node.children
        .map(sortChildren)
        .sort((a, b) => (b.annualCost || 0) - (a.annualCost || 0));
    }
    return node;
  }
  
  return tree.map(sortChildren);
}

/**
 * Exports chart data to various formats
 */
export function exportToFormat(tree: OrgNode[], scenarios: Scenarios, format: 'json' | 'csv'): string {
  switch (format) {
    case 'json':
      return JSON.stringify({ tree, scenarios }, null, 2);
      
    case 'csv':
      const csvRows: string[] = ['Role Title,FTE,Annual Cost,Level,Parent ID'];
      
      function addNodeToCSV(node: OrgNode): void {
        const row = [
          `"${node.roleTitle}"`,
          node.fte.toString(),
          (node.annualCost || 0).toString(),
          (node.level || 0).toString(),
          node.parentId || ''
        ].join(',');
        csvRows.push(row);
        
        if (node.children) {
          node.children.forEach(addNodeToCSV);
        }
      }
      
      tree.forEach(addNodeToCSV);
      return csvRows.join('\n');
      
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
}
