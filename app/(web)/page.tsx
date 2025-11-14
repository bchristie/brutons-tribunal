import { CTA, HeroLayout, Services } from '@/app/(web)/_components';

import heroImage from '@/public/img/bar-02.jpg'

export default function Home() {
  const heroContent = (
    <div className="flex flex-col justify-center items-center text-center h-full text-white">
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
        All rise! Court is now in session.
      </h1>
      <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl">
        The Honorable Judge Bruton presiding. Please be seated and prepare to
        examine today's evidence.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <a 
          href="/pwa/dashboard"
          className="
            bg-blue-600 hover:bg-blue-700 text-white font-semibold
            px-8 py-4 rounded-lg text-lg transition-colors duration-200
            inline-flex items-center justify-center
          "
        >
          Approach the Bench
        </a>
        <a 
          href="/about"
          className="
            border-2 border-white text-white hover:bg-white hover:text-gray-900
            font-semibold px-8 py-4 rounded-lg text-lg transition-colors duration-200
            inline-flex items-center justify-center
          "
        >
          Learn More
        </a>
      </div>
    </div>
  );

  return (
    <HeroLayout 
      heroImage={heroImage.src}
      heroContent={heroContent}
    >
      {/* Services Section */}
      <Services backgroundColor="primary">
        <Services.Title>Professional Legal Services</Services.Title>
        <Services.Body>
          With decades of experience, our team provides comprehensive legal solutions 
          tailored to your needs. We're committed to delivering excellence in every case.
        </Services.Body>
        <Services.Items columns={3} gap="lg">
          <Services.Item title="Corporate Law" icon="🏢">
            Comprehensive business legal services from formation to complex transactions.
          </Services.Item>
          <Services.Item title="Litigation" icon="⚖️">
            Aggressive representation in court with a track record of successful outcomes.
          </Services.Item>
          <Services.Item title="Estate Planning" icon="📋">
            Protect your legacy with comprehensive estate planning solutions.
          </Services.Item>
        </Services.Items>
      </Services>

      {/* Call to Action */}
      <CTA variant="primary">
        <CTA.Title>Ready to perform your civic duty?</CTA.Title>
        <CTA.Body>
          Learn how you can join our jury, and be part of the justice system.
        </CTA.Body>
        <CTA.Actions layout="horizontal" gap="md">
          <CTA.Button href="/contact">Approach the Bench</CTA.Button>
          <CTA.Button variant="outline" href="/about">Learn More</CTA.Button>
        </CTA.Actions>
      </CTA>
    </HeroLayout>
  );
}