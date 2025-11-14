'use client';

import { useState } from 'react';
import type { ContactFormProps, ContactFormData } from './ContactForm.types';

export function ContactForm({ 
  title = "Quick Contact",
  className = "",
  variant = "dark"
}: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Simulate API call - replace with your actual API endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Here you would typically send the data to your API
      console.log('Contact form submitted:', formData);
      
      // Reset form on success
      setFormData({ name: '', email: '', message: '' });
      setSubmitStatus('success');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSubmitStatus('idle'), 3000);
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Variant-based styling
  const getContainerStyle = () => {
    return variant === 'dark' 
      ? 'bg-white/10 backdrop-blur-sm border-white/20 text-white'
      : 'bg-theme-secondary shadow-lg border-gray-200 text-theme-primary';
  };

  const getTitleStyle = () => {
    return variant === 'dark' ? 'text-white' : 'text-theme-primary';
  };

  const getInputStyle = () => {
    return variant === 'dark'
      ? `w-full p-3 rounded-lg bg-white/20 border border-white/30 
         text-white placeholder-white/70 transition-all duration-200
         focus:bg-white/25 focus:border-white/50 focus:outline-none focus:ring-2 focus:ring-white/20
         disabled:opacity-50 disabled:cursor-not-allowed`
      : `w-full p-3 rounded-lg bg-white border border-gray-300
         text-gray-900 placeholder-gray-500 transition-all duration-200
         focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200
         disabled:opacity-50 disabled:cursor-not-allowed`;
  };

  const getSuccessStyle = () => {
    return variant === 'dark'
      ? 'bg-green-500/20 border-green-500/30 text-green-200'
      : 'bg-green-50 border-green-200 text-green-800';
  };

  const getErrorStyle = () => {
    return variant === 'dark'
      ? 'bg-red-500/20 border-red-500/30 text-red-200'
      : 'bg-red-50 border-red-200 text-red-800';
  };

  return (
    <div className={`
      ${getContainerStyle()} rounded-lg p-8 border
      w-full max-w-md mx-auto
      ${className}
    `}>
      <h2 className={`text-2xl font-bold ${getTitleStyle()} mb-6`}>{title}</h2>
      
      {/* Success/Error Messages */}
      {submitStatus === 'success' && (
        <div className={`mb-4 p-3 ${getSuccessStyle()} border rounded-lg`}>
          <p className="text-sm">Thank you! Your message has been sent successfully.</p>
        </div>
      )}
      
      {submitStatus === 'error' && (
        <div className={`mb-4 p-3 ${getErrorStyle()} border rounded-lg`}>
          <p className="text-sm">Sorry, there was an error sending your message. Please try again.</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Your Name"
            required
            disabled={isSubmitting}
            className={getInputStyle()}
          />
        </div>
        
        <div>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Your Email"
            required
            disabled={isSubmitting}
            className={getInputStyle()}
          />
        </div>
        
        <div>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            placeholder="How can we help?"
            rows={4}
            required
            disabled={isSubmitting}
            className={`${getInputStyle()} resize-none`}
          />
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="
            w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold 
            py-3 px-6 rounded-lg transition-colors duration-200
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
          "
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending...
            </span>
          ) : (
            'Send Message'
          )}
        </button>
      </form>
    </div>
  );
}