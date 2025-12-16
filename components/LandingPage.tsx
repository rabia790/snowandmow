import React, { useState, useEffect } from 'react';
import { 
  Snowflake, Sun, Menu, X, CheckCircle, Zap, 
  ShieldCheck, Wallet, DollarSign, CalendarCheck, 
  MapPin,
  Mail, Send, Loader2 
} from 'lucide-react';

const customStyles = {
  // Equivalent to the CSS classes defined in the <style> block
  heroBg: {
    backgroundColor: '#0f172a',
    backgroundImage: "url('https://placehold.co/1920x800/0f172a/0f172a?text=')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  // The text-gradient effect will be handled by a specific utility class in index.css or a dynamic style object.
  // For simplicity in JSX, we'll use a functional class name and ensure the CSS is loaded globally.
};

// --- Sub-Components ---

const NavLink = ({ href, children }) => (
  <a href={href} className="nav-link text-slate-600 font-medium transition-colors hover:text-blue-600">
    {children}
  </a>
);

const MobileMenu = ({ isOpen, toggleMenu }) => (
  <div id="mobile-menu" className={`${isOpen ? 'block' : 'hidden'} md:hidden`}>
    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 text-center">
      <a href="#how-it-works" onClick={toggleMenu} className="block py-2 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-lg">How It Works</a>
      <a href="#provider-pitch" onClick={toggleMenu} className="block py-2 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-lg">For Providers</a>
      <a href="#contact" onClick={toggleMenu} className="block py-2 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-lg">Contact</a>
      <a href="/auth" onClick={toggleMenu} className="block w-full py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition-all mt-4">
        Start Service Now
      </a>
    </div>
  </div>
);

const NavBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <a href="#" className="flex items-center space-x-2">
            <Snowflake className="w-6 h-6 text-blue-600" />
            <Sun className="w-6 h-6 text-green-600" />
            <span className="text-xl font-extrabold text-slate-900">Snow & Mow</span>
          </a>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 items-center">
            <NavLink href="#how-it-works">How It Works</NavLink>
            <NavLink href="#provider-pitch">For Providers</NavLink>
            <NavLink href="#contact">Contact</NavLink>
            
         
          </div>

          {/* Mobile Menu Button */}
          <button id="mobile-menu-button" onClick={toggleMenu} className="md:hidden text-slate-600 hover:text-blue-600">
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
      <MobileMenu isOpen={isMobileMenuOpen} toggleMenu={toggleMenu} />
    </nav>
  );
};

const HeroSection = () => (
  <header style={customStyles.heroBg} className="py-24 sm:py-32 lg:py-40">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6">
        <span className="block text-white">Your Snow & Yard Service,</span>
        {/* The 'text-gradient' class needs to be defined in a global CSS file for this to work correctly with Tailwind */}
        <span className="block" style={{ backgroundImage: 'linear-gradient(to right, #3b82f6, #10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Instant & Done.
        </span>
      </h1>
      <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-10">
        Book local Pros for immediate snow removal (driveway, salt, walk) or quick lawn care. Simple requests, transparent pricing, zero hassle.
      </p>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        {/* Primary CTA (Client) */}
        <a href="/auth" className="px-8 py-3 text-lg font-bold text-white bg-green-600 rounded-xl shadow-xl hover:bg-green-700 transition-all transform hover:scale-[1.02]">
          Start Service Now
        </a>
        {/* Secondary CTA (Provider) */}
        <a href="/auth" className="px-8 py-3 text-lg font-bold text-white bg-blue-600 rounded-xl border-2 border-blue-600 hover:bg-blue-700 transition-all shadow-md">
          Start Earning Today
        </a>
      </div>

      {/* Trust Bar / Quick Stat */}
      <div className="mt-16 text-slate-400 text-sm flex justify-center items-center gap-4">
        <CheckCircle className="w-5 h-5 text-green-500" />
        <span>Trusted by thousands of local users for seasonal work.</span>
      </div>
    </div>
  </header>
);

const ValuePropCard = ({ icon: Icon, title, description, colorClass }) => (
  <div className="bg-slate-50 p-8 rounded-xl shadow-lg border border-slate-100 text-center transform hover:scale-[1.02] transition-all">
    <Icon className={`w-10 h-10 mx-auto ${colorClass} mb-4`} />
    <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
    <p className="text-slate-600">{description}</p>
  </div>
);

const ValuePropositionSection = () => (
  <section className="py-16 sm:py-24 bg-white scroll-mt-20" id="value-prop">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-extrabold text-slate-900 text-center mb-12">
        Snow & Mow: Service, Solved Simply.
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <ValuePropCard
          icon={Zap}
          title="Instant Dispatch"
          description="Post your request, and a Pro accepts and starts work immediately. No waiting for quotes."
          colorClass="text-blue-600"
        />
        <ValuePropCard
          icon={ShieldCheck}
          title="Vetted Professionals"
          description="All providers are background-checked, insured, and highly rated. Quality service guaranteed."
          colorClass="text-green-600"
        />
        <ValuePropCard
          icon={Wallet}
          title="Upfront Pricing"
          description="Know the exact price immediately. Pay securely for the job, and the funds are held until completion."
          colorClass="text-indigo-600"
        />
      </div>
    </div>
  </section>
);

const HowItWorksStep = ({ number, title, description, bgColor }) => (
  <div className="flex-1 text-center relative z-10 p-4">
    <div className={`w-16 h-16 rounded-full ${bgColor} text-white flex items-center justify-center mx-auto mb-4 text-3xl font-extrabold border-4 border-slate-100 shadow-xl`}>
      {number}
    </div>
    <h3 className="text-2xl font-bold text-slate-900 mb-2">{title}</h3>
    <p className="text-slate-600">{description}</p>
  </div>
);

const HowItWorksSection = () => (
  <section className="py-16 sm:py-24 bg-slate-100 scroll-mt-20" id="how-it-works">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-extrabold text-slate-900 text-center mb-16">
        Your 3-Step Service Request
      </h2>
      <div className="relative flex flex-col md:flex-row justify-between items-start gap-12">
        {/* Timeline Connector Line (Desktop Only) */}
        <div className="hidden md:block absolute top-10 left-0 right-0 h-1 bg-slate-300 z-0"></div>

        <HowItWorksStep
          number="1"
          title="Post Simple Request"
          description="Enter your address and select your fixed-price service: Driveway Clear, Sidewalk Salt, or Lawn Mow."
          bgColor="bg-blue-600"
        />
        <HowItWorksStep
          number="2"
          title="Pro Accepts & Works"
          description="A local Pro accepts your job request instantly. They arrive and complete the physical work quickly."
          bgColor="bg-green-600"
        />
        <HowItWorksStep
          number="3"
          title="Confirm Done & Pay"
          description="Verify the work is complete on site or via simple confirmation. Your secure, prepaid funds are instantly released."
          bgColor="bg-indigo-600"
        />
      </div>
    </div>
  </section>
);

const ProviderPitchSection = () => (
  <section className="py-24 sm:py-32 bg-white scroll-mt-20" id="provider-pitch">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="order-2 lg:order-1">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-6">
            <span className="text-green-600">Drive Your Business.</span> Get Paid Instantly.
          </h2>
          <p className="text-xl text-slate-600 mb-8">
            Stop wasting time quoting and chasing invoices. Snow & Mow delivers simple, single-job leads directly to your dashboard. You focus purely on the service.
          </p>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <DollarSign className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
              <span className="text-slate-700 font-medium">Instant Payment:</span> Funds are processed securely the moment the job is confirmed complete—no payment delays.
            </li>
            <li className="flex items-start gap-3">
              <CalendarCheck className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
              <span className="text-slate-700 font-medium">Total Flexibility:</span> Accept only the one-off jobs that fit your route. Log in, accept, complete, and get paid.
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="w-6 h-6 text-indigo-600 mt-1 flex-shrink-0" />
              <span className="text-slate-700 font-medium">Local Leads:</span> Access a real-time feed of local service requests in your immediate area.
            </li>
          </ul>
          <a href="/auth" className="mt-10 inline-block px-8 py-3 text-lg font-bold text-white bg-blue-600 rounded-xl shadow-xl hover:bg-blue-700 transition-all transform hover:scale-[1.02]">
            Join Our Network & Start Earning
          </a>
        </div>
        <div className="order-1 lg:order-2">
          <img
            src="https://placehold.co/600x400/1e293b/ffffff?text=Provider+Job+Acceptance+Screen"
            alt="Provider dashboard interface"
            className="rounded-2xl shadow-2xl border-4 border-white transform rotate-3 hover:rotate-0 transition-transform duration-500"
          />
        </div>
      </div>
    </div>
  </section>
);

const ContactSection = () => {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

const handleSubmit = (e) => {

  e.preventDefault();
  const { name, email, message } = formState;
  const subject = encodeURIComponent(`Inquiry from ${name}`);
  const body = encodeURIComponent(
    `Name: ${name}\n` +
    `Email: ${email}\n\n` +
    `Message:\n${message}`
  );
  const mailtoLink = `mailto:manager@cygnisoft.com?subject=${subject}&body=${body}`;
  window.location.href = mailtoLink;
  setFormState({ name: '', email: '', message: '' });
};

  return (
    <section className="py-24 bg-slate-50 scroll-mt-20" id="contact">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">Get in Touch</h2>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">Have questions about a service or interested in partnering? Send us a message.</p>
        </div>
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden md:flex">
          <div className="bg-slate-900 p-10 text-white md:w-2/5 flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-8">Contact Information</h3>
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <Mail className="w-6 h-6 text-blue-400 mt-1" />
                  <div><p className="font-medium text-slate-300 text-sm uppercase">Email</p><p className="text-white text-lg">manager@cygnisoft.com</p></div>
                </div>
              
              </div>
            </div>
         
          </div>
          <div className="p-10 md:w-3/5">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div><label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label><input type="text" required className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none" value={formState.name} onChange={(e) => setFormState({...formState, name: e.target.value})} /></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label><input type="email" required className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none" value={formState.email} onChange={(e) => setFormState({...formState, email: e.target.value})} /></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-2">Message</label><textarea required rows={4} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none resize-none" value={formState.message} onChange={(e) => setFormState({...formState, message: e.target.value})}></textarea></div>
              <button type="submit" disabled={isSubmitting} className="w-full bg-slate-900 text-white font-bold py-4 px-6 rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center space-x-2 disabled:opacity-70">{isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><span className="mr-2">Send Message</span><Send className="w-5 h-5" /></>}</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};


const Footer = () => (
  <footer className="bg-slate-800 py-12" id="contact">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Logo & Mission */}
        <div>
          <a href="#" className="flex items-center space-x-2 mb-4">
            <Snowflake className="w-6 h-6 text-blue-400" />
            <Sun className="w-6 h-6 text-green-400" />
            <span className="text-xl font-extrabold">Snow & Mow</span>
          </a>
          <p className="text-sm text-slate-400">Making yard maintenance effortless for homeowners and profitable for Pros.</p>
        </div>

        {/* Company Links 
        <div>
          <h4 className="font-bold mb-3">Company</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
          </ul>
        </div>

       
        <div>
          <h4 className="font-bold mb-3">Legal</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Service Guarantee</a></li>
          </ul>
        </div>*/}

        {/* Contact & Social */}
        <div>
          <h4 className="font-bold mb-3">Connect</h4>
          <p className="text-sm text-slate-400 mb-4">Email: manager@cygnisoft.com</p>
        </div>
      </div>
      <div className="mt-12 border-t border-slate-700 pt-6 text-center text-sm text-slate-500">
        &copy; 2025 Snow & Mow. All rights reserved.
      </div>
    </div>
  </footer>
);


// --- Main App Component ---

const LApp = () => {
  useEffect(() => {
    document.documentElement.classList.add('scroll-smooth');
  }, []);

  return (
    // The body styling is applied here. In a real app, this would be in index.css
    <div style={{ fontFamily: "'Inter', sans-serif", backgroundColor: '#f8fafc' }}>
      <NavBar />
      <main>
        <HeroSection />
        <ValuePropositionSection />
        <HowItWorksSection />
        <ProviderPitchSection />
         <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default LApp;