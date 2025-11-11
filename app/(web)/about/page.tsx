import { StandardLayout } from '@/app/(web)/_components';

export default function About() {
  return (
    <StandardLayout
      title="About Us"
      description="Learn more about our firm's history, values, and commitment to excellence."
    >
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Our Story
              </h2>
              <div className="prose prose-lg text-gray-600 dark:text-gray-400 space-y-4">
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
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Our Values
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    Integrity in all our professional relationships
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    Excellence in legal knowledge and representation
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    Commitment to client success and satisfaction
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    Innovation in legal solutions and technology
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Ready to Work Together?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
            Contact us today to discuss how we can help you achieve your legal objectives.
          </p>
          <button className="
            bg-blue-600 hover:bg-blue-700 text-white font-semibold
            px-8 py-4 rounded-lg text-lg transition-colors duration-200
          ">
            Contact Us
          </button>
        </div>
      </section>
    </StandardLayout>
  );
}