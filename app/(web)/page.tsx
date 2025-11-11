import { HeroLayout } from '@/app/(web)/_components';

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

      {/* CTA Section */}
      <section className="py-16" style={{ backgroundColor: 'var(--color-primary-600)', color: 'white' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8" style={{ color: 'var(--color-primary-100)' }}>
            Contact us today for a consultation and discover how we can help you.
          </p>
          <button className="
            bg-white font-semibold
            px-8 py-4 rounded-lg text-lg transition-colors duration-200
            hover:bg-theme-secondary
          " 
          style={{ color: 'var(--color-primary-600)' }}
          >
            Schedule Consultation
          </button>
        </div>
      </section>

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