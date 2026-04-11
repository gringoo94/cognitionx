import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Approach from "@/components/Approach";
import Specializations from "@/components/Specializations";
import Pricing from "@/components/Pricing";
import BookingForm from "@/components/BookingForm";
import Checklist from "@/components/Checklist";
import Blog from "@/components/Blog";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Дмитрий Яцко",
  jobTitle: "Психолог, КПТ-терапевт",
  url: "https://yatsko-psy.ru",
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Психолог Дмитрий Яцко — КПТ терапия",
  url: "https://yatsko-psy.ru",
  description: "Когнитивно-поведенческая терапия онлайн: депрессия, тревога, панические атаки, выгорание.",
  areaServed: ["Кишинёв", "Молдова", "Онлайн"],
  serviceType: "Психологическая консультация",
  provider: { "@type": "Person", name: "Дмитрий Яцко" },
};

const Index = () => (
  <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
    <SEOHead
      title="Психолог онлайн | КПТ терапия — Дмитрий Яцко"
      description="Когнитивно-поведенческая терапия онлайн. Помогаю при депрессии, тревоге, панических атаках, выгорании. Запись на консультацию."
      path="/"
      schema={[personSchema, serviceSchema]}
    />
    <Navbar />
    <main>
      <Hero />
      <About />
      <Approach />
      <Specializations />
      <Pricing />
      <Blog />
      <BookingForm />
      <Checklist />
    </main>
    <Footer />
  </div>
);

export default Index;
