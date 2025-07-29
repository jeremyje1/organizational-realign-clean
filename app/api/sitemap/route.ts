'use server';

import { readdirSync } from 'fs';
import { resolve } from 'path';
import { NextResponse } from 'next/server';

// Helper function to read directories recursively
function getPages(directory: string): string[] {
  let pages: string[] = [];
  
  try {
    const items = readdirSync(directory, { withFileTypes: true });
    
    for (const item of items) {
      const path = resolve(directory, item.name);
      
      // Skip hidden files/directories and specific directories we don't want in the sitemap
      if (
        item.name.startsWith('_') || 
        item.name.startsWith('.') || 
        item.name === 'api' || 
        item.name === 'admin'
      ) {
        continue;
      }
      
      if (item.isDirectory()) {
        pages = [...pages, ...getPages(path)];
      } else if (item.name === 'page.tsx' || item.name === 'page.js') {
        // Convert file path to URL path
        const urlPath = directory
          .replace(resolve(process.cwd(), 'app'), '')
          .replace(/\\/g, '/');
        
        // Skip route groups (directories in parentheses)
        if (!urlPath.includes('(')) {
          pages.push(urlPath || '/');
        }
      }
    }
  } catch (error) {
    console.error('Error reading directory:', error);
  }
  
  return pages;
}

export async function GET() {
  const baseUrl = 'https://app.northpathstrategies.org';
  const appDirectory = resolve(process.cwd(), 'app');
  const pages = getPages(appDirectory);
  
  // Build XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages
    .map(page => {
      // Determine priority based on path depth
      const depth = (page.match(/\//g) || []).length;
      const priority = Math.max(1 - depth * 0.2, 0.2).toFixed(1);
      
      // Get current date for lastmod
      const date = new Date().toISOString().split('T')[0];
      
      return `<url>
    <loc>${baseUrl}${page}</loc>
    <lastmod>${date}</lastmod>
    <priority>${priority}</priority>
    <changefreq>${depth === 0 ? 'weekly' : 'monthly'}</changefreq>
  </url>`;
    })
    .join('\n  ')}
</urlset>`;
  
  // Return XML response
  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
