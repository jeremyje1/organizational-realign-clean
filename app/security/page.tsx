import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Security Policy - NorthPath Strategies',
  description: 'NorthPath Strategies security policy outlines our commitment to protecting your data and ensuring the security of our services.',
};

export default function SecurityPolicyPage() {
  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Security Policy</h1>
          
          <div className="prose prose-lg">
            <p>
              Last Updated: July 1, 2025
            </p>

            <h2>Our Commitment to Security</h2>
            <p>
              At NorthPath Strategies, we take the security of your data seriously. We understand that when you share information with us—whether as a client, 
              website visitor, or assessment participant—you're placing your trust in us. This security policy outlines our commitment to protecting your data 
              and ensuring the security of our services.
            </p>

            <h2>Data Protection Measures</h2>
            <p>
              We implement a variety of security measures to maintain the safety of your personal information when you enter, submit, or access your personal information:
            </p>
            <ul>
              <li>
                <strong>Encryption:</strong> All sensitive data is encrypted using industry-standard SSL/TLS encryption when transmitted over the internet.
              </li>
              <li>
                <strong>Secure Infrastructure:</strong> We host our applications and store data in secure, SOC 2 compliant cloud environments with robust physical and network security measures.
              </li>
              <li>
                <strong>Access Controls:</strong> We implement strict access controls and follow the principle of least privilege. Only authorized personnel with specific job functions have access to personal information.
              </li>
              <li>
                <strong>Regular Security Testing:</strong> We conduct regular security assessments, vulnerability scanning, and penetration testing to identify and address potential security issues.
              </li>
              <li>
                <strong>Data Minimization:</strong> We collect only the information necessary for the services we provide and retain it only for as long as necessary or as required by law.
              </li>
            </ul>

            <h2>Confidentiality of Client Information</h2>
            <p>
              For our consulting clients, we understand the sensitivity of the organizational information shared during our engagements:
            </p>
            <ul>
              <li>
                <strong>Confidentiality Agreements:</strong> All consulting engagements begin with comprehensive confidentiality agreements.
              </li>
              <li>
                <strong>Secure Collaboration:</strong> We use secure, enterprise-grade collaboration tools for sharing and storing client documents and communications.
              </li>
              <li>
                <strong>Staff Training:</strong> Our team members undergo regular security and privacy training and are bound by confidentiality obligations.
              </li>
              <li>
                <strong>Data Segregation:</strong> Client data is logically segregated to ensure separation between different clients' information.
              </li>
            </ul>

            <h2>Assessment Tool Security</h2>
            <p>
              Our organizational assessment tools are designed with security as a priority:
            </p>
            <ul>
              <li>
                <strong>Anonymized Analytics:</strong> Aggregate assessment data used for benchmarking is anonymized and contains no identifying information.
              </li>
              <li>
                <strong>Secure Authentication:</strong> Our assessment platform uses secure authentication mechanisms and session management.
              </li>
              <li>
                <strong>Data Protection:</strong> Assessment responses are protected both in transit and at rest using industry-standard encryption.
              </li>
            </ul>

            <h2>Incident Response</h2>
            <p>
              Despite our best efforts, we recognize that security incidents can occur. We maintain a comprehensive incident response plan:
            </p>
            <ul>
              <li>
                <strong>Rapid Response:</strong> We have procedures in place for prompt identification and remediation of security incidents.
              </li>
              <li>
                <strong>Notification:</strong> We will notify affected parties of any confirmed data breach as required by applicable laws and regulations.
              </li>
              <li>
                <strong>Continuous Improvement:</strong> We analyze security incidents to improve our security measures and prevent future occurrences.
              </li>
            </ul>

            <h2>Vendor Management</h2>
            <p>
              We carefully select and monitor our third-party service providers:
            </p>
            <ul>
              <li>
                <strong>Security Assessment:</strong> We evaluate the security practices of vendors before engaging their services.
              </li>
              <li>
                <strong>Contractual Obligations:</strong> Our agreements with vendors include appropriate security and confidentiality provisions.
              </li>
              <li>
                <strong>Ongoing Monitoring:</strong> We regularly review our vendors' security practices and compliance certifications.
              </li>
            </ul>

            <h2>Compliance</h2>
            <p>
              We adhere to relevant security standards and regulations:
            </p>
            <ul>
              <li>
                <strong>GDPR:</strong> For European clients and users, we comply with the General Data Protection Regulation.
              </li>
              <li>
                <strong>CCPA:</strong> We respect the privacy rights of California residents under the California Consumer Privacy Act.
              </li>
              <li>
                <strong>Industry Standards:</strong> We follow industry best practices for information security, including principles from frameworks such as NIST and ISO 27001.
              </li>
            </ul>

            <h2>Your Role in Security</h2>
            <p>
              Security is a shared responsibility. We recommend that you:
            </p>
            <ul>
              <li>Use strong, unique passwords for your NorthPath Strategies account.</li>
              <li>Keep your login credentials confidential.</li>
              <li>Access our services from secure devices and networks.</li>
              <li>Report any suspected security issues to security@northpathstrategies.org.</li>
            </ul>

            <h2>Updates to This Policy</h2>
            <p>
              We may update this Security Policy periodically to reflect changes in our practices or legal requirements. 
              The date at the top of this page indicates when this policy was last updated.
            </p>

            <h2>Contact Us</h2>
            <p>
              If you have questions about our security practices or want to report a security concern, please contact us at:
            </p>
            <address>
              Email: security@northpathstrategies.org<br />
              Phone: (555) 123-4567<br />
              Mail: NorthPath Strategies<br />
              1234 Strategy Avenue<br />
              Suite 500<br />
              San Francisco, CA 94105<br />
              United States
            </address>
          </div>
        </div>
      </div>
    </div>
  );
}
