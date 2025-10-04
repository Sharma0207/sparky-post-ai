import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        {/* Background Image */}
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/hero-background.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        
        {/* Fallback gradient background */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-deep-teal via-deep-teal/90 to-deep-teal/70" />
        
        {/* Subtle pattern overlay for texture */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(184,134,11,0.1)_0%,transparent_50%)]" />
        </div>
        
        {/* Dark Gradient Overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-br from-deep-teal/30 to-deep-teal/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        {/* Main Headline */}
        <h1 className="hero-headline hero-fade-in text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-off-white mb-6 drop-shadow-2xl">
          MASTER THE ART.
          <br />
          <span className="block mt-2 bg-gradient-to-r from-off-white to-soft-gold bg-clip-text text-transparent">
            TRANSFORM YOUR CAREER.
          </span>
        </h1>

        {/* Sub-headline */}
        <p className="hero-subheadline hero-fade-in-delayed text-lg sm:text-xl md:text-2xl lg:text-3xl text-off-white/90 mb-12 max-w-4xl mx-auto leading-relaxed">
          Certified Professional Training in Makeup, Hair, & Skincare Excellence
        </p>

        {/* CTA Buttons */}
        <div className="hero-fade-in-more-delayed flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
          {/* Primary CTA */}
          <button className="hero-cta-pulse bg-soft-gold hover:bg-soft-gold/90 text-off-white font-semibold px-8 py-4 rounded-lg text-lg sm:text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-gold min-w-[200px] shadow-lg">
            Explore Courses
          </button>

          {/* Secondary CTA */}
          <button className="border-2 border-soft-gold text-off-white hover:bg-soft-gold hover:text-deep-teal font-semibold px-8 py-4 rounded-lg text-lg sm:text-xl transition-all duration-300 transform hover:scale-105 min-w-[200px] backdrop-blur-sm bg-deep-teal/10">
            Book Free Demo Class
          </button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="w-6 h-10 border-2 border-off-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-off-white/70 rounded-full mt-2 animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;