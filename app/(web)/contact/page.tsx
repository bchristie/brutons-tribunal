import { Hero, NavigationHeader } from '@/app/(web)/_components';
import { NavigationProvider, ScrollProvider } from '@/app/(web)/_providers';

export default function Contact() {
  return (
    <NavigationProvider>
      <ScrollProvider scrollThreshold={100}>
        <NavigationHeader logoScale="normal" variant="auto" />
        
        {/* Two-Column Hero Example */}
        <Hero height="75vh">
          <Hero.Background 
            src="/img/contact-hero.jpg" 
            overlay={0.6}
            position="center"
          />
          <Hero.Content layout="two-column" gap="large" alignment="center">
            <Hero.Column alignment="left">
              <div className="text-white">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Get In Touch
                </h1>
                <p className="text-xl text-gray-200 mb-8">
                  Ready to discuss your legal needs? Our experienced team is here to help.
                </p>
                <div className="space-y-4 text-lg">
                  <div className="flex items-center">
                    <span className="mr-3">📧</span>
                    <span>contact@brutonstribunal.com</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-3">📞</span>
                    <span>(555) 123-4567</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-3">📍</span>
                    <span>123 Legal Way, Justice City</span>
                  </div>
                </div>
              </div>
            </Hero.Column>
            
            <Hero.Column alignment="center">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
                <h2 className="text-2xl font-bold text-white mb-6">Quick Contact</h2>
                <form className="space-y-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70"
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70"
                  />
                  <textarea
                    placeholder="How can we help?"
                    rows={4}
                    className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70"
                  />
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </Hero.Column>
          </Hero.Content>
          
          <Hero.ScrollIndicator variant="chevron" />
        </Hero>

        {/* Main Content */}
        <main className="relative z-20">
          <section className="py-16 bg-white dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                  Our Office Hours
                </h2>
                <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Monday - Friday
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">8:00 AM - 6:00 PM</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Saturday
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">9:00 AM - 3:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </ScrollProvider>
    </NavigationProvider>
  );
}