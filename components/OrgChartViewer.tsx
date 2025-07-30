/**
 * Interactive Org Chart Viewer
 * 
 * @version 1.0.0
 * @author NorthPath Strategies
 */

'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Button } from '@/components/ui/button';
import { ZoomInIcon, ZoomOutIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

interface OrgNode {
  id: string;
  roleTitle: string;
  fte: number;
  annualCost?: number;
  level?: number;
  children?: OrgNode[];
}

interface OrgChartViewerProps {
  data: OrgNode[];
  className?: string;
  onNodeClick?: (node: OrgNode) => void;
  width?: number;
  height?: number;
}

export function OrgChartViewer({ 
  data, 
  className = '',
  onNodeClick,
  width = 1200,
  height = 800
}: OrgChartViewerProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [zoom, setZoom] = useState(1);
  const [_transform, setTransform] = useState({ x: 0, y: 0 });

  const renderChart = React.useCallback(() => {
    if (!svgRef.current || !data.length) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current);
    const margin = { top: 40, right: 40, bottom: 40, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create main group
    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Convert data to D3 hierarchy
    const hierarchyData = {
      id: 'root',
      roleTitle: 'Organization',
      fte: 0,
      children: data
    };

    const root = d3.hierarchy(hierarchyData);
    
    // Create tree layout
    const treeLayout = d3.tree<OrgNode>()
      .size([innerWidth, innerHeight - 100])
      .separation((a, b) => (a.parent === b.parent ? 1 : 2) / a.depth);

    // Apply layout
    treeLayout(root);

    // Draw links
    g.selectAll('.link')
      .data(root.links())
      .enter().append('path')
      .attr('class', 'link')
      .attr('fill', 'none')
      .attr('stroke', '#6b7280')
      .attr('stroke-width', 2)
      .attr('d', d3.linkVertical<any, any>()
        .x(d => d.x)
        .y(d => d.y)
      );

    // Draw nodes
    const node = g.selectAll('.node')
      .data(root.descendants().filter(d => d.data.id !== 'root'))
      .enter().append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x},${d.y})`)
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        onNodeClick?.(d.data);
      });

    // Add node rectangles
    node.append('rect')
      .attr('width', 180)
      .attr('height', 80)
      .attr('x', -90)
      .attr('y', -40)
      .attr('rx', 8)
      .attr('fill', d => getNodeColor(d.data))
      .attr('stroke', '#1d4ed8')
      .attr('stroke-width', 2)
      .on('mouseover', function(_event, _d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('stroke-width', 3)
          .attr('filter', 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))');
      })
      .on('mouseout', function(_event, _d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('stroke-width', 2)
          .attr('filter', 'none');
      });

    // Add role title
    node.append('text')
      .attr('dy', '-10')
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .each(function(d) {
        const text = d3.select(this);
        const words = d.data.roleTitle.split(' ');
        
        if (words.length > 3) {
          text.text(words.slice(0, 3).join(' ') + '...');
        } else {
          text.text(d.data.roleTitle);
        }
      });

    // Add FTE and cost info
    node.append('text')
      .attr('dy', '8')
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('font-size', '10px')
      .text(d => `FTE: ${d.data.fte}`);

    node.append('text')
      .attr('dy', '22')
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('font-size', '10px')
      .text(d => d.data.annualCost ? `$${d.data.annualCost.toLocaleString()}` : 'Cost: TBD');

    // Add zoom behavior
    const zoomBehavior = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 3])
      .on('zoom', (event) => {
        const { transform } = event;
        g.attr('transform', 
          `translate(${margin.left + transform.x},${margin.top + transform.y}) scale(${transform.k})`
        );
        setZoom(transform.k);
        setTransform({ x: transform.x, y: transform.y });
      });

    // Add role title
    node.append('text')
      .attr('dy', '-10')
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .each(function(d) {
        const text = d3.select(this);
        const words = d.data.roleTitle.split(' ');
        
        if (words.length > 3) {
          text.text(words.slice(0, 3).join(' ') + '...');
        } else {
          text.text(d.data.roleTitle);
        }
      });

    // Add FTE and cost info
    node.append('text')
      .attr('dy', '8')
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('font-size', '10px')
      .text(d => `FTE: ${d.data.fte}`);

    node.append('text')
      .attr('dy', '22')
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('font-size', '10px')
      .text(d => d.data.annualCost ? `$${d.data.annualCost.toLocaleString()}` : 'Cost: TBD');

    // Add zoom behavior
    const zoomBehavior = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 3])
      .on('zoom', (event) => {
        const { transform } = event;
        g.attr('transform', 
          `translate(${margin.left + transform.x},${margin.top + transform.y}) scale(${transform.k})`
        );
        setZoom(transform.k);
        setTransform({ x: transform.x, y: transform.y });
      });

    svg.call(zoomBehavior);

    // Center the chart initially
    const bbox = g.node()?.getBBox();
    if (bbox) {
      const centerX = (width - bbox.width) / 2 - bbox.x;
      const centerY = 50;
      
      svg.call(
        zoomBehavior.transform,
        d3.zoomIdentity.translate(centerX, centerY)
      );
    }
  }, [data, width, height, onNodeClick]);

  useEffect(() => {
    renderChart();
  }, [renderChart]);

  const getNodeColor = (node: OrgNode): string => {
    // Color nodes based on level or cost
    if (node.level === 0) return '#1e40af'; // CEO level - dark blue
    if (node.level === 1) return '#2563eb'; // VP level - blue
    if (node.level === 2) return '#3b82f6'; // Director level - lighter blue
    if (node.level === 3) return '#60a5fa'; // Manager level - light blue
    return '#93c5fd'; // Individual contributor - lightest blue
  };

  const handleZoomIn = () => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.transition().call(
      d3.zoom<SVGSVGElement, unknown>().scaleBy as any,
      1.5
    );
  };

  const handleZoomOut = () => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.transition().call(
      d3.zoom<SVGSVGElement, unknown>().scaleBy as any,
      1 / 1.5
    );
  };

  const handleReset = () => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.transition().call(
      d3.zoom<SVGSVGElement, unknown>().transform as any,
      d3.zoomIdentity
    );
  };

  if (!data.length) {
    return (
      <div className={`flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 ${className}`}>
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Chart Data</h3>
          <p className="text-gray-600">Generate an org chart to view it here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Chart Controls */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleZoomIn}
          className="bg-white shadow-sm"
        >
          <ZoomInIcon className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleZoomOut}
          className="bg-white shadow-sm"
        >
          <ZoomOutIcon className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          className="bg-white shadow-sm"
        >
          <ArrowPathIcon className="w-4 h-4" />
        </Button>
      </div>

      {/* Chart Info */}
      <div className="absolute top-4 left-4 z-10 bg-white p-2 rounded shadow-sm text-sm">
        <div>Zoom: {Math.round(zoom * 100)}%</div>
        <div>Nodes: {data.length}</div>
      </div>

      {/* SVG Chart */}
      <div className="border rounded-lg bg-white overflow-hidden">
        <svg
          ref={svgRef}
          width={width}
          height={height}
          className="cursor-move"
        />
      </div>

      {/* Legend */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Legend</h4>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-900 rounded"></div>
            <span>C-Level</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-700 rounded"></div>
            <span>VP Level</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span>Director Level</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-300 rounded"></div>
            <span>Manager Level</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-200 rounded"></div>
            <span>Individual Contributor</span>
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-600">
          Click on nodes to view details. Use mouse wheel or controls to zoom.
        </div>
      </div>
    </div>
  );
}
