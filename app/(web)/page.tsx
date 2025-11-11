import { HeroLayout } from '@/app/(web)/_components';

import heroImage from '@/public/img/bar-02.jpg'

export default function Home() {
  return (
    <HeroLayout heroImage={heroImage.src}>
      {/* Content sections after the hero */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Professional Legal Services
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              With decades of experience, our team provides comprehensive legal solutions 
              tailored to your needs. We're committed to delivering excellence in every case.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Corporate Law
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Comprehensive business legal services from formation to complex transactions.
              </p>
            </div>
            
            <div className="text-center p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Litigation
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Aggressive representation in court with a track record of successful outcomes.
              </p>
            </div>
            
            <div className="text-center p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Estate Planning
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Protect your legacy with comprehensive estate planning solutions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Contact us today for a consultation and discover how we can help you.
          </p>
          <button className="
            bg-white text-blue-600 hover:bg-gray-100 font-semibold
            px-8 py-4 rounded-lg text-lg transition-colors duration-200
          ">
            Schedule Consultation
          </button>
        </div>
      </section>
    </HeroLayout>
  );
}