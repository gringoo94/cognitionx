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
import FloatingTelegramFab from "./components/FloatingTelegramFab.tsx";
import ExitIntentPopup from "./components/ExitIntentPopup.tsx";

import NotFound from "./pages/NotFound.tsx";
import Gone from "./pages/Gone.tsx";
import { redirects } from "./lib/redirects";

// Lazy-load everything below the home page to keep initial JS small
const LandingPageEuropa = lazy(() => import("./pages/LandingPageEuropa.tsx"));
const LandingPageIT = lazy(() => import("./pages/LandingPageIT.tsx"));
const LandingPageAsia = lazy(() => import("./pages/LandingPageAsia.tsx"));
const CityLandingPage = lazy(() => import("./pages/CityLandingPage.tsx"));
const LandingPageKishinev = lazy(() => import("./pages/LandingPageKishinev.tsx"));
const BlogList = lazy(() => import("./pages/BlogList.tsx"));
const BlogPost = lazy(() => import("./pages/BlogPost.tsx"));
const Tools = lazy(() => import("./pages/Tools.tsx"));
const TestsHub = lazy(() => import("./pages/TestsHub.tsx"));
const TestPage = lazy(() => import("./pages/TestPage.tsx"));
const SchemaQuizPage = lazy(() => import("./pages/SchemaQuizPage.tsx"));
const EmotionWheelPage = lazy(() => import("./pages/EmotionWheelPage.tsx"));
const AbcAnalysisPage = lazy(() => import("./pages/AbcAnalysisPage.tsx"));
const DecisionMatrixPage = lazy(() => import("./pages/DecisionMatrixPage.tsx"));
const BehavioralActivationPage = lazy(() => import("./pages/BehavioralActivationPage.tsx"));
const AbstractToConcretePage = lazy(() => import("./pages/AbstractToConcretePage.tsx"));
const CbtWorkbookPage = lazy(() => import("./pages/CbtWorkbookPage.tsx"));
const ThoughtDiaryPage = lazy(() => import("./pages/ThoughtDiaryPage.tsx"));
const DayPlannerPage = lazy(() => import("./pages/DayPlannerPage.tsx"));
const BreathingPage = lazy(() => import("./pages/BreathingPage.tsx"));
const AboutPage = lazy(() => import("./pages/AboutPage.tsx"));
const ContactPage = lazy(() => import("./pages/ContactPage.tsx"));
const AdminLogin = lazy(() => import("./pages/AdminLogin.tsx"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard.tsx"));
const ProblemPage = lazy(() => import("./components/ProblemPage.tsx"));
const MethodPage = lazy(() => import("./components/MethodPage.tsx"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy.tsx"));
const InformedConsent = lazy(() => import("./pages/InformedConsent.tsx"));
const ThankYou = lazy(() => import("./pages/ThankYou.tsx"));
const FreeConsultationPage = lazy(() => import("./pages/FreeConsultationPage.tsx"));
const StartQuizPage = lazy(() => import("./pages/StartQuizPage.tsx"));
const CountryHubPage = lazy(() => import("./pages/CountryHubPage.tsx"));

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
          <ScrollToTop />
          <PageViewTracker />

          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/blog" element={<BlogList />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/tools" element={<Tools />} />
              <Route path="/tools/tests" element={<TestsHub />} />
              <Route path="/tools/tests/:slug" element={<TestPage />} />
              <Route path="/tools/schema-quiz" element={<SchemaQuizPage />} />
              <Route path="/tools/emotion-wheel" element={<EmotionWheelPage />} />
              <Route path="/tools/abc-analysis" element={<AbcAnalysisPage />} />
              <Route path="/tools/decision-matrix" element={<DecisionMatrixPage />} />
              <Route path="/tools/behavioral-activation" element={<BehavioralActivationPage />} />
              <Route path="/tools/abstract-to-concrete" element={<AbstractToConcretePage />} />
              <Route path="/tools/thought-diary" element={<ThoughtDiaryPage />} />
              <Route path="/tools/day-planner" element={<DayPlannerPage />} />
              <Route path="/tools/breathing" element={<BreathingPage />} />
              <Route path="/cbtworkbook" element={<CbtWorkbookPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/depression" element={<ProblemPage />} />
              <Route path="/anxiety" element={<ProblemPage />} />
              <Route path="/panic-attacks" element={<ProblemPage />} />
              <Route path="/burnout" element={<ProblemPage />} />
              <Route path="/ocd" element={<ProblemPage />} />
              <Route path="/co-dependency" element={<ProblemPage />} />
              <Route path="/cbt-therapy" element={<MethodPage />} />
              <Route path="/online-therapy" element={<MethodPage />} />
              <Route path="/schema-therapy" element={<MethodPage />} />
              <Route path="/self-esteem" element={<ProblemPage />} />
              <Route path="/stress" element={<ProblemPage />} />
              <Route path="/addiction" element={<ProblemPage />} />
              <Route path="/in-person-therapy" element={<MethodPage />} />
              <Route path="/psiholog-moskva" element={<ProblemPage />} />
              <Route path="/psiholog-europa" element={<LandingPageEuropa />} />
              <Route path="/psiholog-dlya-it" element={<LandingPageIT />} />
              <Route path="/psiholog-aziya" element={<LandingPageAsia />} />
              <Route path="/psiholog-usa" element={<ProblemPage />} />
              <Route path="/psiholog-berlin" element={<CityLandingPage />} />
              <Route path="/psiholog-amsterdam" element={<CityLandingPage />} />
              <Route path="/psiholog-lissabon" element={<CityLandingPage />} />
              <Route path="/psiholog-tbilisi" element={<CityLandingPage />} />
              <Route path="/psiholog-myunhen" element={<CityLandingPage />} />
              <Route path="/psiholog-gamburg" element={<CityLandingPage />} />
              <Route path="/psiholog-rotterdam" element={<CityLandingPage />} />
              <Route path="/psiholog-porto" element={<CityLandingPage />} />
              <Route path="/psiholog-kishinev" element={<LandingPageKishinev />} />
              <Route path="/psiholog-germaniya" element={<CountryHubPage />} />
              <Route path="/psiholog-niderlandy" element={<CountryHubPage />} />
              <Route path="/psiholog-portugaliya" element={<CountryHubPage />} />
              <Route path="/psiholog-gruziya" element={<CountryHubPage />} />
              <Route path="/psiholog-moldova" element={<CountryHubPage />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/informed-consent" element={<InformedConsent />} />
              <Route path="/thank-you" element={<ThankYou />} />
              <Route path="/free-consultation" element={<FreeConsultationPage />} />
              <Route path="/start" element={<StartQuizPage />} />

              {/* Redirects and gone pages — single source in src/lib/redirects.ts */}
              {redirects.map((r) =>
                r.type === "410" ? (
                  <Route key={r.from} path={r.from} element={<Gone />} />
                ) : (
                  <Route
                    key={r.from}
                    path={r.from}
                    element={<Navigate to={r.to} replace />}
                  />
                )
              )}


              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <FloatingTelegramFab />
          <ExitIntentPopup />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
