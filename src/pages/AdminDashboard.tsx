import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, LogOut, Mail, Eye, Calendar, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

interface Submission {
  id: string;
  name: string;
  email: string;
  messenger: string | null;
  message: string;
  created_at: string;
}

interface PageView {
  id: string;
  path: string;
  referrer: string | null;
  user_agent: string | null;
  created_at: string;
}

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [pageViews, setPageViews] = useState<PageView[]>([]);
  const [tab, setTab] = useState<"submissions" | "analytics">("submissions");
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/admin/login");
        return;
      }

      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin");

      if (!roles || roles.length === 0) {
        await supabase.auth.signOut();
        navigate("/admin/login");
        return;
      }

      // Fetch data
      const [subs, views] = await Promise.all([
        supabase.from("contact_submissions").select("*").order("created_at", { ascending: false }).limit(100),
        supabase.from("page_views").select("*").order("created_at", { ascending: false }).limit(500),
      ]);

      setSubmissions(subs.data || []);
      setPageViews(views.data || []);
      setLoading(false);
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  // Aggregate page views by path
  const viewsByPath = pageViews.reduce<Record<string, number>>((acc, v) => {
    acc[v.path] = (acc[v.path] || 0) + 1;
    return acc;
  }, {});

  const sortedPaths = Object.entries(viewsByPath).sort((a, b) => b[1] - a[1]);

  // Views by day (last 7 days)
  const viewsByDay = pageViews.reduce<Record<string, number>>((acc, v) => {
    const day = v.created_at.slice(0, 10);
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {});

  const sortedDays = Object.entries(viewsByDay).sort((a, b) => a[0].localeCompare(b[0])).slice(-7);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
        <title>Админ-панель | Дмитрий Яцко</title>
      </Helmet>
      <header className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="text-lg font-bold">Админ-панель</h1>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
            <LogOut className="w-4 h-4" /> Выйти
          </Button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              <Mail className="w-4 h-4" /> Заявки
            </div>
            <p className="text-2xl font-bold">{submissions.length}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              <Eye className="w-4 h-4" /> Просмотры
            </div>
            <p className="text-2xl font-bold">{pageViews.length}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              <Calendar className="w-4 h-4" /> Сегодня
            </div>
            <p className="text-2xl font-bold">
              {pageViews.filter((v) => v.created_at.slice(0, 10) === new Date().toISOString().slice(0, 10)).length}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              Страниц
            </div>
            <p className="text-2xl font-bold">{sortedPaths.length}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={tab === "submissions" ? "default" : "outline"}
            size="sm"
            onClick={() => setTab("submissions")}
          >
            Заявки
          </Button>
          <Button
            variant={tab === "analytics" ? "default" : "outline"}
            size="sm"
            onClick={() => setTab("analytics")}
          >
            Аналитика
          </Button>
        </div>

        {tab === "submissions" && (
          <div className="space-y-3">
            {submissions.length === 0 ? (
              <p className="text-muted-foreground text-sm">Заявок пока нет</p>
            ) : (
              submissions.map((s) => (
                <div key={s.id} className="rounded-xl border border-border bg-card p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{s.name}</p>
                      <p className="text-sm text-muted-foreground">{s.email}{s.messenger ? ` · ${s.messenger}` : ""}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(s.created_at).toLocaleDateString("ru-RU", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{s.message}</p>
                </div>
              ))
            )}
          </div>
        )}

        {tab === "analytics" && (
          <div className="space-y-8">
            {/* Views by day */}
            <div>
              <h3 className="text-sm font-medium mb-3">Просмотры по дням</h3>
              <div className="space-y-2">
                {sortedDays.map(([day, count]) => {
                  const max = Math.max(...sortedDays.map(([, c]) => c));
                  return (
                    <div key={day} className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground w-20 shrink-0">{day}</span>
                      <div className="flex-1 h-6 bg-muted rounded-md overflow-hidden">
                        <div
                          className="h-full bg-primary/80 rounded-md"
                          style={{ width: `${(count / max) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium w-8 text-right">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top pages */}
            <div>
              <h3 className="text-sm font-medium mb-3">Топ страниц</h3>
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                {sortedPaths.slice(0, 15).map(([path, count], i) => (
                  <div key={path} className={`flex items-center justify-between px-4 py-2.5 text-sm ${i > 0 ? "border-t border-border" : ""}`}>
                    <span className="text-muted-foreground">{path}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
