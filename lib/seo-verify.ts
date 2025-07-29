'use client';

/**
 * Helper utility to verify SEO meta tags on pages
 * This is for development use only and should not be included in production
 */

export function verifySEO() {
  if (process.env.NODE_ENV === 'production') {
    return;
  }
  
  console.group('SEO Check');
  
  // Check basic meta tags
  const title = document.title;
  console.log('Title:', title, title.length > 10 && title.length < 60 ? '✅' : '⚠️');
  
  const description = document.querySelector('meta[name="description"]')?.getAttribute('content');
  console.log('Description:', description, 
    description && description.length > 50 && description.length < 160 ? '✅' : '⚠️');
  
  const keywords = document.querySelector('meta[name="keywords"]')?.getAttribute('content');
  console.log('Keywords:', keywords ? '✅' : '⚠️');
  
  // Check OG and Twitter tags
  const ogTitle = document.querySelector('meta[property="og:title"]')?.getAttribute('content');
  console.log('OG Title:', ogTitle ? '✅' : '⚠️');
  
  const ogDescription = document.querySelector('meta[property="og:description"]')?.getAttribute('content');
  console.log('OG Description:', ogDescription ? '✅' : '⚠️');
  
  const ogImage = document.querySelector('meta[property="og:image"]')?.getAttribute('content');
  console.log('OG Image:', ogImage ? '✅' : '⚠️');
  
  const twitterCard = document.querySelector('meta[name="twitter:card"]')?.getAttribute('content');
  console.log('Twitter Card:', twitterCard ? '✅' : '⚠️');
  
  // Check canonical URL
  const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href');
  console.log('Canonical URL:', canonical ? '✅' : '⚠️');
  
  // Check heading hierarchy
  const h1Count = document.querySelectorAll('h1').length;
  console.log('H1 Tags:', h1Count, h1Count === 1 ? '✅' : '⚠️');
  
  // Check image alt attributes
  const images = document.querySelectorAll('img');
  const imagesWithoutAlt = Array.from(images).filter(img => !img.alt);
  console.log('Images without alt tags:', imagesWithoutAlt.length, imagesWithoutAlt.length === 0 ? '✅' : '⚠️');
  
  // Check for structured data
  const structuredData = document.querySelectorAll('script[type="application/ld+json"]');
  console.log('Structured Data:', structuredData.length > 0 ? '✅' : '⚠️');
  
  // Check for proper landmarks
  const hasMain = document.querySelector('main') !== null;
  const hasHeader = document.querySelector('header') !== null;
  const hasFooter = document.querySelector('footer') !== null;
  console.log('Semantic Structure:', hasMain && hasHeader && hasFooter ? '✅' : '⚠️');
  
  // Check for mobile viewport
  const hasViewport = document.querySelector('meta[name="viewport"]') !== null;
  console.log('Viewport Meta:', hasViewport ? '✅' : '⚠️');
  
  console.groupEnd();
  
  return {
    title,
    description,
    ogTitle,
    ogImage,
    canonical,
    h1Count,
    imagesWithoutAlt: imagesWithoutAlt.length,
    hasStructuredData: structuredData.length > 0,
    hasProperSemantics: hasMain && hasHeader && hasFooter,
  };
}

// Auto-run in development if included
if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
  setTimeout(() => {
    verifySEO();
  }, 1000);
}
