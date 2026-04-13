import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import LandingPageEuropa from "./pages/LandingPageEuropa.tsx";
import { HelmetProvider } from "react-helmet-async";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import BlogList from "./pages/BlogList.tsx";
import BlogPost from "./pages/BlogPost.tsx";
import Tools from "./pages/Tools.tsx";
import SchemaQuizPage from "./pages/SchemaQuizPage.tsx";
import AboutPage from "./pages/AboutPage.tsx";
import ContactPage from "./pages/ContactPage.tsx";
import AdminLogin from "./pages/AdminLogin.tsx";
import AdminDashboard from "./pages/AdminDashboard.tsx";
import ProblemPage from "./components/ProblemPage.tsx";
import PageViewTracker from "./components/PageViewTracker.tsx";
import ScrollToTop from "./components/ScrollToTop.tsx";
import GoogleAnalytics from "./components/GoogleAnalytics.tsx";

import PrivacyPolicy from "./pages/PrivacyPolicy.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

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
          
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/tools/schema-quiz" element={<SchemaQuizPage />} />
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
            <Route path="/psiholog-usa" element={<ProblemPage />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            
            {/* Redirects from old Tilda URLs */}
            <Route path="/about_cognitionx" element={<Navigate to="/about" replace />} />
            <Route path="/oursolution" element={<Navigate to="/" replace />} />
            <Route path="/practice/generator" element={<Navigate to="/tools" replace />} />
            <Route path="/tpost/*" element={<Navigate to="/blog" replace />} />
            <Route path="/css/*" element={<Navigate to="/" replace />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
