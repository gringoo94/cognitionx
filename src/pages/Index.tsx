import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Approach from "@/components/Approach";
import Specializations from "@/components/Specializations";
import Pricing from "@/components/Pricing";
import BookingForm from "@/components/BookingForm";
import Checklist from "@/components/Checklist";
import Footer from "@/components/Footer";

const Index = () => (
  <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
    <Navbar />
    <main>
      <Hero />
      <About />
      <Approach />
      <Specializations />
      <Pricing />
      <BookingForm />
      <Checklist />
    </main>
    <Footer />
  </div>
);

export default Index;
