import React, { useEffect, useState } from 'react';
import { ArrowRightIcon, SparklesIcon, CpuChipIcon } from './icons/AllIcons';

const HeroSection: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
      {/* Neural Network Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="neural-network">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="neural-node"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Holographic Orb */}
      <div 
        className="absolute w-96 h-96 rounded-full opacity-30 blur-3xl animate-pulse"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x * 0.1}% ${mousePosition.y * 0.1}%, 
            rgba(147, 51, 234, 0.4) 0%, 
            rgba(59, 130, 246, 0.3) 35%, 
            rgba(16, 185, 129, 0.2) 70%, 
            transparent 100%)`,
          transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
        }}
      />

      {/* Glassmorphism Container */}
      <div className={`relative z-10 max-w-6xl mx-auto px-6 text-center transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        
        {/* Floating Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full text-sm text-cyan-300 hover:bg-white/10 transition-all duration-300 cursor-pointer group">
          <SparklesIcon className="w-4 h-4 group-hover:rotate-12 transition-transform" />
          <span className="font-medium">Powered by Advanced AI • 2025 Edition</span>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        </div>

        {/* Main Headline */}
        <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight">
          <span className="bg-gradient-to-r from-cyan-300 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x">
            Nexus AI
          </span>
          <br />
          <span className="text-white/90 text-4xl md:text-6xl font-light">
            Problem Solver
          </span>
        </h1>

        {/* Subtitle with Typewriter Effect */}
        <p className="text-xl md:text-2xl text-white/70 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
          Discover, analyze, and solve real-world problems with 
          <span className="text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text font-semibold"> cutting-edge AI intelligence</span>. 
          Transform challenges into opportunities with neural-powered insights.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <button className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/25">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative flex items-center gap-2">
              <CpuChipIcon className="w-5 h-5" />
              <span>Start Discovering</span>
              <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
          
          <button className="px-8 py-4 bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl font-semibold text-white hover:bg-white/10 transition-all duration-300 hover:scale-105">
            Watch Demo
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            { number: '10K+', label: 'Problems Analyzed', icon: '🧠' },
            { number: '95%', label: 'Solution Accuracy', icon: '⚡' },
            { number: '2.5s', label: 'Average Response', icon: '🚀' }
          ].map((stat, index) => (
            <div key={index} className="group p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-bold text-white mb-1">{stat.number}</div>
              <div className="text-white/60 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;