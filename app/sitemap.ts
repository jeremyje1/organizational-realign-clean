import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://northpathstrategies.org'
  
  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/assessment`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/assessment/start`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/dashboard`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/reports`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/analytics`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/realignment`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
  ]
  
  try {
    const supabase = await createClient()

    // Dynamic routes for assessments (public ones)
    const { data: assessments } = await supabase
      .from('assessments')
      .select('id, updated_at, organization_type')
      .eq('is_public', true)
      .order('updated_at', { ascending: false })
      .limit(100)

    const assessmentRoutes: MetadataRoute.Sitemap = assessments?.map(assessment => ({
      url: `${baseUrl}/assessment/${assessment.id}`,
      lastModified: new Date(assessment.updated_at),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    })) || []

    // Dynamic routes for organizations (if public profiles exist)
    const { data: organizations } = await supabase
      .from('organizations')
      .select('id, updated_at, name')
      .eq('is_public_profile', true)
      .order('updated_at', { ascending: false })
      .limit(50)

    const organizationRoutes: MetadataRoute.Sitemap = organizations?.map(org => ({
      url: `${baseUrl}/organization/${org.id}`,
      lastModified: new Date(org.updated_at),
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    })) || []

    return [
      ...staticRoutes,
      ...assessmentRoutes,
      ...organizationRoutes,
    ]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    
    // Return static routes only if database query fails
    return staticRoutes
  }
}
