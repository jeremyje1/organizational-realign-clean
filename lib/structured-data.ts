export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'NorthPath Strategies',
  description: 'Professional organizational transformation consulting with AI-powered assessment technology',
  url: 'https://northpathstrategies.org',
  logo: 'https://northpathstrategies.org/logo.svg',
  image: 'https://northpathstrategies.org/og-image.png',
  telephone: '+1-555-123-4567',
  email: 'jeremy.estrella@gmail.com',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'US'
  },
  founder: {
    '@type': 'Person',
    name: 'Jeremy Estrella',
    jobTitle: 'Founder & Strategic Consultant',
    image: 'https://northpathstrategies.org/images/jeremy-estrella.jpg'
  },
  sameAs: [
    'https://www.linkedin.com/company/northpath-strategies',
    'https://twitter.com/northpathstrat'
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Strategic Consulting Services',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Organizational Assessment',
          description: 'AI-powered organizational analysis and recommendations'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service', 
          name: 'Strategic Consulting',
          description: 'Expert guidance for organizational transformation'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Change Management',
          description: 'Implementation support for organizational changes'
        }
      }
    ]
  }
}

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'NorthPath Strategies',
  url: 'https://app.northpathstrategies.org',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://app.northpathstrategies.org/search?q={search_term_string}',
    'query-input': 'required name=search_term_string'
  }
}

export const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Organizational Transformation Consulting',
  provider: {
    '@type': 'Organization',
    name: 'NorthPath Strategies'
  },
  serviceType: 'Business Consulting',
  description: 'Comprehensive organizational assessment and transformation services using AI-powered analytics',
  areaServed: 'United States',
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Assessment Packages',
    itemListElement: [
      {
        '@type': 'Offer',
        name: 'Single Use Assessment',
        price: '899',
        priceCurrency: 'USD',
        description: 'One-time organizational analysis with AI-enhanced assessment tool'
      },
      {
        '@type': 'Offer',
        name: 'Monthly Subscription',
        price: '899',
        priceCurrency: 'USD',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: '899',
          priceCurrency: 'USD',
          billingPeriod: 'P1M'
        },
        description: 'Unlimited access to assessment platform with monthly reports'
      }
    ]
  }
}

export const breadcrumbSchema = (items: Array<{name: string, url: string}>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url
  }))
})

export const faqSchema = (faqs: Array<{question: string, answer: string}>) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(faq => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer
    }
  }))
})
