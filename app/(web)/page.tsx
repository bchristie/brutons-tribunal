import { HeroLayout } from '@/app/(web)/_components';
import { CTA } from '@/app/(web)/_components/CTA';

import heroImage from '@/public/img/bar-02.jpg'

export default function Home() {
  return (
    <HeroLayout heroImage={heroImage.src}>
      {/* Content sections after the hero */}
      <section className="py-16 bg-theme-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-theme-primary mb-4">
              Professional Legal Services
            </h2>
            <p className="text-xl text-theme-secondary max-w-3xl mx-auto">
              With decades of experience, our team provides comprehensive legal solutions 
              tailored to your needs. We're committed to delivering excellence in every case.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <h3 className="text-xl font-semibold text-theme-primary mb-3">
                Corporate Law
              </h3>
              <p className="text-theme-secondary">
                Comprehensive business legal services from formation to complex transactions.
              </p>
            </div>
            
            <div className="text-center p-6">
              <h3 className="text-xl font-semibold text-theme-primary mb-3">
                Litigation
              </h3>
              <p className="text-theme-secondary">
                Aggressive representation in court with a track record of successful outcomes.
              </p>
            </div>
            
            <div className="text-center p-6">
              <h3 className="text-xl font-semibold text-theme-primary mb-3">
                Estate Planning
              </h3>
              <p className="text-theme-secondary">
                Protect your legacy with comprehensive estate planning solutions.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CTA variant="primary">
        <CTA.Title>Ready to Get Started?</CTA.Title>
        <CTA.Body>
          Contact us today for a consultation and discover how we can help you.
        </CTA.Body>
        <CTA.Actions layout="horizontal" gap="md">
          <CTA.Button href="/contact">Schedule Consultation</CTA.Button>
          <CTA.Button variant="outline" href="/about">Learn More</CTA.Button>
        </CTA.Actions>
      </CTA>

      {/* Theme Test Section */}
      <section className="py-8 bg-theme-secondary">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold text-theme-primary mb-2">
            Theme Test Section
          </h3>
          <p className="text-theme-secondary">
            This section uses theme-aware classes and should change with the theme toggle.
          </p>
        </div>
      </section>
    </HeroLayout>
  );
}