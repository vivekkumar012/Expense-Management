import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Home() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 15,
      duration: Math.random() * 10 + 10,
    }));
    setParticles(newParticles);
  }, []);

  const features = [
    {
      icon: '🤖',
      title: 'OCR Intelligence',
      description: 'Scan receipts and auto-extract expense details with advanced AI recognition'
    },
    {
      icon: '⚡',
      title: 'Smart Approvals',
      description: 'Multi-level workflow with conditional rules and flexible approval chains'
    },
    {
      icon: '🌍',
      title: 'Global Currency',
      description: 'Real-time currency conversion for international expense management'
    },
    {
      icon: '📊',
      title: 'Real-time Tracking',
      description: 'Monitor expense status and approval progress in real-time dashboard'
    }
  ];

  const stats = [
    { number: '85%', label: 'Time Saved' },
    { number: '99%', label: 'Accuracy' },
    { number: '150+', label: 'Currencies' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white overflow-hidden relative">
      {/* Animated Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-0.5 h-0.5 bg-white/30 rounded-full animate-float"
            style={{
              left: `${particle.left}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative z-5 text-center px-10 py-24 max-w-6xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-5 bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent animate-fadeInUp">
          Smart Expense Management
        </h1>
        <p className="text-xl text-white/80 mb-10 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
          Automate approvals, eliminate errors, and gain complete transparency over your expense reimbursement process
        </p>
      </section>

      {/* Features Grid */}
      <section className="relative z-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-10 py-16 max-w-7xl mx-auto">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-lg hover:-translate-y-3 hover:bg-white/8 hover:border-blue-400/50 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] transition-all duration-300 animate-fadeInUp"
            style={{ animationDelay: `${0.3 + index * 0.1}s` }}
          >
            <div className="text-5xl mb-4">{feature.icon}</div>
            <h3 className="text-2xl font-semibold mb-3 text-blue-400">{feature.title}</h3>
            <p className="text-white/70 leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </section>

      {/* Stats Section */}
      <section className="relative z-5 flex flex-wrap justify-around gap-8 px-10 py-16 max-w-5xl mx-auto bg-white/3 rounded-2xl mb-16">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-500 to-purple-700 bg-clip-text text-transparent">
              {stat.number}
            </div>
            <div className="text-white/60 mt-3">{stat.label}</div>
          </div>
        ))}
      </section>

      {/* CTA Section */}
      <section className="relative z-5 text-center px-10 py-20">
        <h2 className="text-4xl md:text-5xl font-bold mb-8">Ready to Transform Your Expenses?</h2>
        <button className="px-12 py-5 text-lg font-semibold bg-gradient-to-r from-purple-500 to-purple-700 rounded-full hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(102,126,234,0.6)] transition-all duration-300 animate-pulse">
          Get Started Free
        </button>
      </section>

      <style jsx>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0) translateX(0); 
            opacity: 0; 
          }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { 
            transform: translateY(-100vh) translateX(50px); 
            opacity: 0; 
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-float {
          animation: float 15s infinite;
        }

        .animate-fadeInUp {
          animation: fadeInUp 1s ease forwards;
          opacity: 0;
        }
      `}</style>

      <Footer />
    </div>
  );
}