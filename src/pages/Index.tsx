import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Specializations from "@/components/Specializations";
import Approach from "@/components/Approach";
import Pricing from "@/components/Pricing";
import BookingForm from "@/components/BookingForm";
import Checklist from "@/components/Checklist";
import Footer from "@/components/Footer";

const Index = () => (
  <div className="min-h-screen bg-background font-sans">
    <Navbar />
    <Hero />
    <About />
    <Specializations />
    <Approach />
    <Pricing />
    <BookingForm />
    <Checklist />
    <Footer />
  </div>
);

export default Index;
