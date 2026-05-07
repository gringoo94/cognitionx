import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { HelmetProvider } from "react-helmet-async";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import PageViewTracker from "./components/PageViewTracker.tsx";
import ScrollToTop from "./components/ScrollToTop.tsx";
import GoogleAnalytics from "./components/GoogleAnalytics.tsx";
import NotFound from "./pages/NotFound.tsx";

// Lazy-load everything below the home page to keep initial JS small
const LandingPageEuropa = lazy(() => import("./pages/LandingPageEuropa.tsx"));
const LandingPageIT = lazy(() => import("./pages/LandingPageIT.tsx"));
const LandingPageAsia = lazy(() => import("./pages/LandingPageAsia.tsx"));
const CityLandingPage = lazy(() => import("./pages/CityLandingPage.tsx"));
const LandingPageKishinev = lazy(() => import("./pages/LandingPageKishinev.tsx"));
const BlogList = lazy(() => import("./pages/BlogList.tsx"));
const BlogPost = lazy(() => import("./pages/BlogPost.tsx"));
const Tools = lazy(() => import("./pages/Tools.tsx"));
const SchemaQuizPage = lazy(() => import("./pages/SchemaQuizPage.tsx"));
const EmotionWheelPage = lazy(() => import("./pages/EmotionWheelPage.tsx"));
const AbcAnalysisPage = lazy(() => import("./pages/AbcAnalysisPage.tsx"));
const AboutPage = lazy(() => import("./pages/AboutPage.tsx"));
const ContactPage = lazy(() => import("./pages/ContactPage.tsx"));
const AdminLogin = lazy(() => import("./pages/AdminLogin.tsx"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard.tsx"));
const ProblemPage = lazy(() => import("./components/ProblemPage.tsx"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy.tsx"));
const InformedConsent = lazy(() => import("./pages/InformedConsent.tsx"));
const ThankYou = lazy(() => import("./pages/ThankYou.tsx"));

const queryClient = new QueryClient();

const PageFallback = () => (
  <div className="min-h-screen bg-background" aria-hidden="true" />
);

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <GoogleAnalytics />
          <ScrollToTop />
          <PageViewTracker />

          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/blog" element={<BlogList />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/tools" element={<Tools />} />
              <Route path="/tools/schema-quiz" element={<SchemaQuizPage />} />
              <Route path="/tools/emotion-wheel" element={<EmotionWheelPage />} />
              <Route path="/tools/abc-analysis" element={<AbcAnalysisPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/depression" element={<ProblemPage />} />
              <Route path="/anxiety" element={<ProblemPage />} />
              <Route path="/panic-attacks" element={<ProblemPage />} />
              <Route path="/burnout" element={<ProblemPage />} />
              <Route path="/co-dependency" element={<ProblemPage />} />
              <Route path="/cbt-therapy" element={<ProblemPage />} />
              <Route path="/online-therapy" element={<ProblemPage />} />
              <Route path="/schema-therapy" element={<ProblemPage />} />
              <Route path="/self-esteem" element={<ProblemPage />} />
              <Route path="/stress" element={<ProblemPage />} />
              <Route path="/addiction" element={<ProblemPage />} />
              <Route path="/in-person-therapy" element={<ProblemPage />} />
              <Route path="/psiholog-moskva" element={<ProblemPage />} />
              <Route path="/psiholog-europa" element={<LandingPageEuropa />} />
              <Route path="/psiholog-dlya-it" element={<LandingPageIT />} />
              <Route path="/psiholog-aziya" element={<LandingPageAsia />} />
              <Route path="/psiholog-usa" element={<ProblemPage />} />
              <Route path="/psiholog-berlin" element={<CityLandingPage />} />
              <Route path="/psiholog-amsterdam" element={<CityLandingPage />} />
              <Route path="/psiholog-lissabon" element={<CityLandingPage />} />
              <Route path="/psiholog-tbilisi" element={<CityLandingPage />} />
              <Route path="/psiholog-kishinev" element={<LandingPageKishinev />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/informed-consent" element={<InformedConsent />} />
              <Route path="/thank-you" element={<ThankYou />} />

              {/* Redirects from old Tilda URLs */}
              <Route path="/about_cognitionx" element={<Navigate to="/about" replace />} />
              <Route path="/oursolution" element={<Navigate to="/" replace />} />
              <Route path="/practice/generator" element={<Navigate to="/tools" replace />} />
              <Route path="/tpost/*" element={<Navigate to="/blog" replace />} />
              <Route path="/it-specialist" element={<Navigate to="/psiholog-dlya-it" replace />} />
              <Route path="/css/*" element={<Navigate to="/" replace />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
