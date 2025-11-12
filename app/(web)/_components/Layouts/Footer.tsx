import { Footer } from '@/app/(web)/_components';

export function ComposedFooter() {
  return (
    <Footer backgroundColor="dark" totalColumns={12}>
      <Footer.Section title="Navigation" width={3}>
        <a href="/" className="block text-gray-400 hover:text-white transition-colors">
          Home
        </a>
        <a href="/about" className="block text-gray-400 hover:text-white transition-colors">
          About
        </a>
        <a href="/contact" className="block text-gray-400 hover:text-white transition-colors">
          Contact
        </a>
      </Footer.Section>
      
      <Footer.Section title="Legal Services" width={3}>
        <span className="block text-gray-400">Corporate Law</span>
        <span className="block text-gray-400">Litigation</span>
        <span className="block text-gray-400">Estate Planning</span>
      </Footer.Section>
      
            <Footer.Section title="Stay Connected" width={6}>
        <p className="text-gray-400 mb-4">
          Subscribe to our newsletter for legal insights and updates.
        </p>
        <div className="flex gap-2">
          <input 
            type="email" 
            placeholder="Enter your email"
            className="flex-1 px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
          />
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            Subscribe
          </button>
        </div>
      </Footer.Section>
    </Footer>
  );
}