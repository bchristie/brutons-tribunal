import { StandardLayout } from '@/app/(web)/_components';
import { CTA } from '@/app/(web)/_components/CTA';

export default function About() {
  return (
    <StandardLayout
      title="About Us"
      description="Learn more about our firm's history, values, and commitment to excellence."
    >
      <section className="py-16 bg-theme-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-theme-primary mb-6">
                Our Story
              </h2>
              <div className="prose prose-lg text-theme-secondary space-y-4">
                <p>
                  Founded in 1985, Bruton's Tribunal has been at the forefront of legal 
                  excellence for nearly four decades. What started as a small practice 
                  has grown into a full-service law firm serving clients across the region.
                </p>
                <p>
                  Our commitment to integrity, excellence, and client satisfaction has 
                  remained unwavering throughout our growth. We believe that every client 
                  deserves dedicated, personalized attention and the highest quality 
                  legal representation.
                </p>
                <p>
                  Today, our team of experienced attorneys continues to uphold the 
                  values and standards that have made us a trusted name in legal services.
                </p>
              </div>
            </div>
            <div className="bg-theme-secondary rounded-lg p-8">
              <h3 className="text-2xl font-bold text-theme-primary mb-4">
                Our Values
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span style={{ color: 'var(--color-primary-600)' }} className="mr-2">•</span>
                  <span className="text-theme-secondary">
                    Integrity in all our professional relationships
                  </span>
                </li>
                <li className="flex items-start">
                  <span style={{ color: 'var(--color-primary-600)' }} className="mr-2">•</span>
                  <span className="text-theme-secondary">
                    Excellence in legal knowledge and representation
                  </span>
                </li>
                <li className="flex items-start">
                  <span style={{ color: 'var(--color-primary-600)' }} className="mr-2">•</span>
                  <span className="text-theme-secondary">
                    Commitment to client success and satisfaction
                  </span>
                </li>
                <li className="flex items-start">
                  <span style={{ color: 'var(--color-primary-600)' }} className="mr-2">•</span>
                  <span className="text-theme-secondary">
                    Innovation in legal solutions and technology
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <CTA variant="secondary">
        <CTA.Title>Ready to Work Together?</CTA.Title>
        <CTA.Body>
          Contact us today to discuss how we can help you achieve your legal objectives.
        </CTA.Body>
        <CTA.Actions>
          <CTA.Button href="/contact">Contact Us</CTA.Button>
        </CTA.Actions>
      </CTA>
    </StandardLayout>
  );
}