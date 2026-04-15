import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Pencil, Trash2, ArrowLeft, Eye, EyeOff } from "lucide-react";
import type { ContentBlock } from "@/data/blogPosts";

interface DbBlogPost {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  date: string;
  tags: string[];
  content: ContentBlock[];
  published: boolean;
  created_at: string;
  updated_at: string;
}

type View = "list" | "edit";

const AdminBlog = () => {
  const [posts, setPosts] = useState<DbBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>("list");
  const [editPost, setEditPost] = useState<Partial<DbBlogPost> | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    } else {
      setPosts((data || []) as unknown as DbBlogPost[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleNew = () => {
    setEditPost({
      title: "",
      slug: "",
      description: "",
      image: "",
      date: new Date().toISOString().slice(0, 10),
      tags: [],
      content: [],
      published: false,
    });
    setView("edit");
  };

  const handleEdit = (post: DbBlogPost) => {
    setEditPost({ ...post });
    setView("edit");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить статью?")) return;
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Удалено" });
      fetchPosts();
    }
  };

  const handleTogglePublished = async (post: DbBlogPost) => {
    const { error } = await supabase
      .from("blog_posts")
      .update({ published: !post.published })
      .eq("id", post.id);

    if (error) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    } else {
      fetchPosts();
    }
  };

  const handleSave = async () => {
    if (!editPost) return;
    if (!editPost.title || !editPost.slug) {
      toast({ title: "Заполните заголовок и slug", variant: "destructive" });
      return;
    }

    setSaving(true);

    const payload = {
      slug: editPost.slug,
      title: editPost.title,
      description: editPost.description || "",
      image: editPost.image || "",
      date: editPost.date || new Date().toISOString().slice(0, 10),
      tags: editPost.tags || [],
      content: editPost.content || [],
      published: editPost.published || false,
    };

    let error;
    if (editPost.id) {
      ({ error } = await supabase.from("blog_posts").update(payload).eq("id", editPost.id));
    } else {
      ({ error } = await supabase.from("blog_posts").insert(payload));
    }

    if (error) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    } else {
      toast({ title: editPost.id ? "Сохранено" : "Создано" });
      setView("list");
      setEditPost(null);
      fetchPosts();
    }
    setSaving(false);
  };

  // Convert content blocks to HTML string for editing
  const contentToHtml = (blocks: ContentBlock[]): string => {
    return blocks
      .map((b) => {
        if (b.type === "heading") return `<h${b.level || 2}>${b.text}</h${b.level || 2}>`;
        if (b.type === "quote") return `<blockquote>${b.text}</blockquote>`;
        if (b.type === "preface") return `<preface>${b.text}</preface>`;
        if (b.type === "component") return `<component id="${b.componentId || ""}"/>`;
        return `<p>${b.text}</p>`;
      })
      .join("\n\n");
  };

  // Parse HTML string back to content blocks
  const htmlToContent = (html: string): ContentBlock[] => {
    const blocks: ContentBlock[] = [];
    const lines = html.split(/\n\n+/).filter((l) => l.trim());

    for (const line of lines) {
      const trimmed = line.trim();

      const componentMatch = trimmed.match(/^<component\s+id="([^"]*)"?\s*\/?>$/i);
      if (componentMatch) {
        blocks.push({ type: "component", text: "", componentId: componentMatch[1] });
        continue;
      }

      const headingMatch = trimmed.match(/^<h([23])>([\s\S]*?)<\/h[23]>$/i);
      if (headingMatch) {
        blocks.push({ type: "heading", text: headingMatch[2], level: parseInt(headingMatch[1]) });
        continue;
      }

      const quoteMatch = trimmed.match(/^<blockquote>([\s\S]*?)<\/blockquote>$/i);
      if (quoteMatch) {
        blocks.push({ type: "quote", text: quoteMatch[1] });
        continue;
      }

      const prefaceMatch = trimmed.match(/^<preface>([\s\S]*?)<\/preface>$/i);
      if (prefaceMatch) {
        blocks.push({ type: "preface", text: prefaceMatch[1] });
        continue;
      }

      // Strip <p> wrapper if present
      const pMatch = trimmed.match(/^<p>([\s\S]*?)<\/p>$/i);
      blocks.push({ type: "text", text: pMatch ? pMatch[1] : trimmed });
    }

    return blocks;
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-5 h-5 animate-spin text-primary" />
      </div>
    );
  }

  if (view === "edit" && editPost) {
    const htmlContent = contentToHtml(editPost.content || []);

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => { setView("list"); setEditPost(null); }}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Назад
          </Button>
          <h2 className="text-lg font-bold">{editPost.id ? "Редактирование" : "Новая статья"}</h2>
        </div>

        <div className="grid gap-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">Заголовок</Label>
              <Input
                value={editPost.title || ""}
                onChange={(e) => setEditPost({ ...editPost, title: e.target.value })}
                placeholder="Заголовок статьи"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">Slug (URL)</Label>
              <Input
                value={editPost.slug || ""}
                onChange={(e) => setEditPost({ ...editPost, slug: e.target.value })}
                placeholder="my-article-slug"
              />
            </div>
          </div>

          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">Описание</Label>
            <Textarea
              value={editPost.description || ""}
              onChange={(e) => setEditPost({ ...editPost, description: e.target.value })}
              placeholder="Краткое описание для карточки и SEO"
              rows={2}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">Изображение (URL)</Label>
              <Input
                value={editPost.image || ""}
                onChange={(e) => setEditPost({ ...editPost, image: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">Дата</Label>
              <Input
                type="date"
                value={editPost.date || ""}
                onChange={(e) => setEditPost({ ...editPost, date: e.target.value })}
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">Теги (через запятую)</Label>
              <Input
                value={(editPost.tags || []).join(", ")}
                onChange={(e) =>
                  setEditPost({
                    ...editPost,
                    tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                  })
                }
                placeholder="КПТ, Депрессия"
              />
            </div>
          </div>

          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">
              Контент (HTML-блоки, разделённые пустой строкой)
            </Label>
            <p className="text-xs text-muted-foreground mb-2">
              Используйте: <code className="bg-muted px-1 rounded">&lt;p&gt;</code> текст,{" "}
              <code className="bg-muted px-1 rounded">&lt;h2&gt;/&lt;h3&gt;</code> заголовки,{" "}
              <code className="bg-muted px-1 rounded">&lt;blockquote&gt;</code> цитаты,{" "}
              <code className="bg-muted px-1 rounded">&lt;preface&gt;</code> вступление,{" "}
              <code className="bg-muted px-1 rounded">&lt;component id="emotion-wheel"/&gt;</code> компоненты
            </p>
            <Textarea
              defaultValue={htmlContent}
              onChange={(e) =>
                setEditPost({ ...editPost, content: htmlToContent(e.target.value) })
              }
              rows={16}
              className="font-mono text-sm"
              placeholder="<preface>Вступление...</preface>

<h2>Заголовок</h2>

<p>Текст абзаца с <strong>жирным</strong> и <a href='/blog/...'>ссылками</a>.</p>

<blockquote>Цитата</blockquote>"
            />
          </div>

          <div className="flex items-center gap-3">
            <Switch
              checked={editPost.published || false}
              onCheckedChange={(v) => setEditPost({ ...editPost, published: v })}
            />
            <Label className="text-sm">Опубликовано</Label>
          </div>

          <div className="flex gap-3 pt-2">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {editPost.id ? "Сохранить" : "Создать"}
            </Button>
            <Button variant="outline" onClick={() => { setView("list"); setEditPost(null); }}>
              Отмена
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Блог ({posts.length} статей)</h2>
        <Button size="sm" onClick={handleNew}>
          <Plus className="w-4 h-4 mr-1" /> Новая статья
        </Button>
      </div>

      {posts.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">
          Статей в базе пока нет. Нажмите «Новая статья» или мигрируйте существующие.
        </p>
      ) : (
        <div className="space-y-2">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm truncate">{post.title}</span>
                  {!post.published && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground shrink-0">
                      Черновик
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  /{post.slug} · {post.date} · {post.tags.join(", ")}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleTogglePublished(post)}
                  title={post.published ? "Скрыть" : "Опубликовать"}
                >
                  {post.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleEdit(post)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive"
                  onClick={() => handleDelete(post.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminBlog;
