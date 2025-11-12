import { HeroLayout, ContactForm } from '@/app/(web)/_components';

export default function Contact() {
  const heroContent = (
    <div className="grid lg:grid-cols-2 gap-12 items-center justify-items-center max-w-6xl mx-auto h-full">
      <div className="text-white flex flex-col justify-center items-center text-center lg:text-left lg:items-start">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
          Get In Touch
        </h1>
        <p className="text-xl text-gray-200 mb-8">
          Ready to discuss your legal needs? Our experienced team is here to help.
        </p>
        <div className="space-y-4 text-lg">
          {/* <div className="flex items-center justify-center lg:justify-start">
            <span className="mr-3">📧</span>
            <span>contact@brutonstribunal.com</span>
          </div> */}
          <div className="flex items-center justify-center lg:justify-start">
            <span className="mr-3">📞</span>
            <span>(813) 704-4671</span>
          </div>
          <div className="flex items-center justify-center lg:justify-start">
            <span className="mr-3">📍</span>
            <span>204 N Collins St, Plant City, FL 33563</span>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center items-center">
        <ContactForm title="Quick Contact" />
      </div>
    </div>
  );

  return (
    <HeroLayout 
      heroImage="/img/contact-hero.jpg"
      heroContent={heroContent}
      heroHeight="screen"
    >
      {/* Main Content */}
      <section className="py-16 bg-theme-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-theme-primary mb-8">
              Our Office Hours
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
              <div>
                <h3 className="font-semibold text-theme-primary mb-2">
                  Monday - Thursday
                </h3>
                <p className="text-theme-secondary">12:00 PM - 10:00 PM</p>
              </div>
              <div>
                <h3 className="font-semibold text-theme-primary mb-2">
                  Friday - Saturday
                </h3>
                <p className="text-theme-secondary">12:00 PM - 12:00 AM</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </HeroLayout>
  );
}