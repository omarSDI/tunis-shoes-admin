import Navbar from '../components/Navbar';
import ContactForm from '../components/ContactForm';

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h1 className="text-5xl md:text-7xl font-black text-[#0a0a0a] mb-8 leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
                            Get in <span className="text-[#D4AF37]">Touch</span> with Excellence.
                        </h1>
                        <p className="text-xl text-gray-600 mb-12 max-w-lg leading-relaxed">
                            Have questions about our collection or need assistance? Our dedicated luxury support team is here to ensure your LuxeShopy experience is flawless.
                        </p>
                        <div className="space-y-6 text-[#0a0a0a]">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">Email</p>
                                    <p className="text-lg font-bold">concierge@luxeshopy.tn</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <ContactForm />
                    </div>
                </div>
            </div>
        </div>
    );
}
