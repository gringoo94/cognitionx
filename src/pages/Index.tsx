import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TelegramCTA from "@/components/TelegramCTA";
import About from "@/components/About";
import AboutDetailed from "@/components/AboutDetailed";
import Approach from "@/components/Approach";
import Specializations from "@/components/Specializations";
import HowWeStart from "@/components/HowWeStart";
import Expectations from "@/components/Expectations";
import Testimonials, { testimonialsSchema } from "@/components/Testimonials";
import Pricing from "@/components/Pricing";
import BookingForm from "@/components/BookingForm";
import Ethics from "@/components/Ethics";
import Projects from "@/components/Projects";
import SessionPrep from "@/components/SessionPrep";
import Blog from "@/components/Blog";
import HomeFAQ, { homeFaqSchema } from "@/components/HomeFAQ";
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
      schema={[personSchema, serviceSchema, homeFaqSchema, testimonialsSchema]}
    />
    <Navbar />
    <main>
      <Hero />
      <TelegramCTA />
      <About />
      <AboutDetailed />
      <Approach />
      <Specializations />
      <HowWeStart />
      <Expectations />
      <Testimonials />
      <Pricing />
      <Ethics />
      <Projects />
      <SessionPrep />
      <Blog />
      <HomeFAQ />
      <BookingForm />
    </main>
    <Footer />
  </div>
);

export default Index;
