import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions - NorthPath Strategies',
  description: 'Find answers to frequently asked questions about NorthPath Strategies\' organizational transformation, cost reduction, team optimization, and talent alignment services.',
};

export default function FAQPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 to-primary-100 py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              Find answers to common questions about our services, methodology, pricing,
              and the results you can expect.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Categories Navigation */}
      <section className="py-12 border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex flex-wrap justify-center gap-4 md:gap-8">
            <a href="#services" className="text-primary-600 font-medium hover:text-primary-800 transition-colors">
              Services
            </a>
            <a href="#methodology" className="text-primary-600 font-medium hover:text-primary-800 transition-colors">
              Methodology
            </a>
            <a href="#results" className="text-primary-600 font-medium hover:text-primary-800 transition-colors">
              Results & ROI
            </a>
            <a href="#engagement" className="text-primary-600 font-medium hover:text-primary-800 transition-colors">
              Engagement Process
            </a>
            <a href="#pricing" className="text-primary-600 font-medium hover:text-primary-800 transition-colors">
              Pricing
            </a>
          </nav>
        </div>
      </section>

      {/* Services FAQs */}
      <section id="services" className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-10 text-center">Services</h2>
          
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-3">What services does NorthPath Strategies offer?</h3>
              <p className="text-gray-700">
                NorthPath Strategies offers a comprehensive suite of organizational transformation services 
                focused on three key areas: Cost Reduction, Team Optimization, and Talent Alignment. Our 
                services include organizational assessments, strategic roadmap development, implementation 
                support, and capability transfer to ensure sustainable results.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-3">How are NorthPath's services different from traditional consulting firms?</h3>
              <p className="text-gray-700">
                Unlike traditional consulting firms that often deliver recommendations with limited implementation 
                support, NorthPath partners with clients throughout the entire transformation journey. We focus on 
                practical, implementable solutions with measurable ROI, and we transfer knowledge and capabilities 
                to your team to ensure sustainability. Additionally, our pricing model includes risk-sharing 
                components to align our incentives with your success.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-3">What industries do you work with?</h3>
              <p className="text-gray-700">
                Our methodology has been successfully applied across diverse industries including manufacturing, 
                financial services, healthcare, technology, retail, and professional services. While industry 
                context matters, our focus on universal organizational principles allows us to deliver value 
                regardless of sector. Our team includes consultants with deep expertise in specific industries 
                when specialized knowledge is required.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-3">Do you work with both large enterprises and smaller organizations?</h3>
              <p className="text-gray-700">
                Yes, we have tailored engagement models for organizations of all sizes. While our methodologies 
                were initially developed working with Fortune 500 companies, we've successfully adapted them for 
                mid-sized businesses and growth-stage companies. We customize our approach based on your 
                organization's size, complexity, and specific needs.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Methodology FAQs */}
      <section id="methodology" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-10 text-center">Methodology</h2>
          
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-3">What is NorthPath's transformation methodology?</h3>
              <p className="text-gray-700">
                Our methodology follows a proven 5-step process: (1) Comprehensive Assessment to understand 
                your current state and identify opportunities; (2) Strategic Roadmap Development that balances 
                quick wins with long-term initiatives; (3) Implementation & Change Management to execute 
                changes and build buy-in; (4) Monitoring & Optimization to track progress and make adjustments; 
                and (5) Sustainability & Capability Transfer to ensure lasting impact.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-3">How long does the transformation process typically take?</h3>
              <p className="text-gray-700">
                The timeline varies based on your organization's size, complexity, and the scope of 
                transformation. Quick-win cost reduction initiatives often deliver results within 30-90 days. 
                Team optimization typically shows measurable improvements within 60-120 days. Comprehensive 
                talent alignment programs may take 6-12 months for full implementation, though initial benefits 
                emerge much sooner. We'll provide a detailed timeline during the roadmap development phase.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-3">How disruptive is the transformation process to our daily operations?</h3>
              <p className="text-gray-700">
                Our approach is designed to minimize operational disruption while driving necessary change. 
                We work closely with your leadership to schedule activities during lower-impact periods, and 
                we implement changes in manageable phases. Our change management framework focuses on clear 
                communication and stakeholder engagement to reduce resistance and maintain productivity 
                throughout the transformation journey.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-3">Do you tailor your methodology to each client?</h3>
              <p className="text-gray-700">
                Absolutely. While our core methodology provides a proven framework, we customize our approach 
                for each client based on your unique challenges, culture, and objectives. During the assessment 
                phase, we identify the specific elements that need to be adapted to your organization. This 
                customization is critical to achieving sustainable results that align with your strategic goals.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Results & ROI FAQs */}
      <section id="results" className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-10 text-center">Results & ROI</h2>
          
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-3">What kind of results can we expect?</h3>
              <p className="text-gray-700">
                Our clients typically experience the following results: Cost Reduction initiatives deliver 
                15-30% cost savings within the first 90 days; Team Optimization leads to 25-40% productivity 
                improvement and enhanced collaboration; Talent Alignment programs reduce turnover by 35-45% 
                and improve employee satisfaction by 30-40%. During the assessment phase, we'll identify your 
                organization's specific opportunity areas and provide projected results.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-3">How do you measure success?</h3>
              <p className="text-gray-700">
                We establish clear, measurable KPIs at the beginning of each engagement, tailored to your 
                specific goals. These typically include both quantitative metrics (cost savings, productivity 
                improvements, turnover reduction) and qualitative indicators (employee satisfaction, leadership 
                effectiveness). We implement robust measurement systems and conduct regular reviews to track 
                progress against these KPIs.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-3">What is the typical ROI on your services?</h3>
              <p className="text-gray-700">
                Our clients consistently achieve a 10-30x return on their consulting investment. For example, 
                a typical mid-sized company engagement might cost $150,000-$250,000 while delivering 
                $1.5-7.5 million in annualized benefits through cost savings, productivity improvements, 
                and reduced turnover costs. We provide detailed ROI projections during the proposal stage 
                and track actual returns throughout the engagement.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-3">How sustainable are the results?</h3>
              <p className="text-gray-700">
                Sustainability is core to our methodology. We focus on building internal capabilities, 
                embedding new processes into your operational rhythms, and ensuring knowledge transfer. 
                The final phase of our methodology specifically addresses sustainability through leadership 
                development, governance structures, and continuous improvement mechanisms. Most of our clients 
                maintain or even enhance their results years after our engagement concludes.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Engagement Process FAQs */}
      <section id="engagement" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-10 text-center">Engagement Process</h2>
          
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-3">How does the engagement process begin?</h3>
              <p className="text-gray-700">
                The process typically begins with a free initial consultation to understand your challenges 
                and objectives. Next, we offer a low-cost assessment to identify specific opportunity areas 
                and develop a preliminary roadmap with projected ROI. Based on this assessment, we'll propose 
                a full engagement with clear deliverables, timeline, and pricing. You can also begin with our 
                free online assessment tool to get a preliminary view of your organization's potential.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-3">What resources will we need to commit to the process?</h3>
              <p className="text-gray-700">
                Resource requirements vary based on the engagement scope. Typically, we need: a senior sponsor 
                (1-2 hours weekly); core team members from relevant departments (3-5 hours weekly); and access 
                to data and stakeholders for interviews. We work to minimize disruption to daily operations and 
                can adjust our approach based on your resource constraints. Our goal is to achieve maximum impact 
                with minimal disruption.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-3">How do you handle sensitive data and confidentiality?</h3>
              <p className="text-gray-700">
                We maintain strict confidentiality protocols for all client data. Before beginning any engagement, 
                we sign comprehensive NDAs and data protection agreements. We use secure, encrypted systems for 
                data storage and transmission, and we can work within your security requirements. All team members 
                undergo regular security training, and we can restrict data access based on your specific needs.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-3">What happens after the engagement ends?</h3>
              <p className="text-gray-700">
                We don't just implement changes and leave. The final phase of our methodology focuses on ensuring 
                sustainability through capability transfer, establishing measurement systems, and creating a 
                long-term success roadmap. We also offer optional post-engagement support packages with quarterly 
                check-ins, refresher training, and ongoing advisory services. Many clients maintain a relationship 
                with us for continued guidance as their organization evolves.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Pricing FAQs */}
      <section id="pricing" className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-10 text-center">Pricing</h2>
          
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-3">How is your pricing structured?</h3>
              <p className="text-gray-700">
                We offer flexible pricing models including fixed-fee projects, phased engagements, and 
                value-based arrangements with success fees tied to results. Our pricing is transparent with 
                no hidden costs. For mid-sized organizations, engagements typically range from $75,000-$350,000 
                depending on scope and complexity. We also offer smaller, focused initiatives starting around 
                $25,000. Each proposal includes detailed pricing and expected ROI.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-3">Do you offer any guarantees?</h3>
              <p className="text-gray-700">
                Yes, we stand behind our work with ROI guarantees. Depending on the engagement type, we often 
                structure a portion of our fees as success-based payments tied to achieving specific, measurable 
                results. If we don't deliver the agreed-upon outcomes, you don't pay the success fee component. 
                The specific guarantee terms are tailored to each engagement and clearly defined in our proposal.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-3">Are there payment plans available?</h3>
              <p className="text-gray-700">
                Yes, we offer flexible payment options including monthly installments and milestone-based 
                payments. For larger engagements, we can structure payments to align with value delivery phases. 
                Some clients choose to pay a portion of fees using the initial savings generated by our work. 
                We'll work with you to develop a payment schedule that accommodates your budget constraints 
                while ensuring project momentum.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-3">What's included in the initial assessment cost?</h3>
              <p className="text-gray-700">
                Our initial assessment (typically $15,000-$25,000) includes a comprehensive analysis of your 
                current state, identification of opportunity areas, preliminary savings/improvement estimates, 
                and a high-level transformation roadmap. The deliverable is a detailed report with specific 
                recommendations and projected ROI. This assessment fee is credited toward the cost of a full 
                engagement if you choose to proceed within 60 days.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-16 bg-primary-700 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Still Have Questions?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Contact us for answers to specific questions about how we can help your organization.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" variant="secondary">
                Contact Us
              </Button>
            </Link>
            <Link href="/assessment/secure-access">
              <Button size="lg" variant="outline" className="border-white hover:bg-white hover:text-primary-700">
                Start Assessment
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
