import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const Blog = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    seo_title: "",
    seo_description: "",
    is_published: false,
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load blog posts");
    } else {
      setPosts(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingPost) {
        const { error } = await supabase
          .from("blog_posts")
          .update(formData)
          .eq("id", editingPost.id);

        if (error) throw error;
        toast.success("Post updated successfully");
      } else {
        const { error } = await supabase
          .from("blog_posts")
          .insert([formData]);

        if (error) throw error;
        toast.success("Post created successfully");
      }

      setDialogOpen(false);
      resetForm();
      fetchPosts();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    const { error } = await supabase
      .from("blog_posts")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete post");
    } else {
      toast.success("Post deleted successfully");
      fetchPosts();
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      seo_title: "",
      seo_description: "",
      is_published: false,
    });
    setEditingPost(null);
  };

  const handleEdit = (post: any) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt || "",
      seo_title: post.seo_title || "",
      seo_description: post.seo_description || "",
      is_published: post.is_published,
    });
    setDialogOpen(true);
  };

  return (
    <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Blog Posts</h1>
            <p className="text-muted-foreground">Create and manage blog content</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="mr-2 h-4 w-4" />
                Add Post
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingPost ? "Edit Post" : "Create New Post"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={8}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="seo_title">SEO Title</Label>
                  <Input
                    id="seo_title"
                    value={formData.seo_title}
                    onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="seo_description">SEO Description</Label>
                  <Textarea
                    id="seo_description"
                    value={formData.seo_description}
                    onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                    rows={2}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_published"
                    checked={formData.is_published}
                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                  />
                  <Label htmlFor="is_published">Published</Label>
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : editingPost ? "Update Post" : "Create Post"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                    <p className="text-muted-foreground mb-2">{post.excerpt}</p>
                    <p className="text-sm text-muted-foreground">
                      Status: {post.is_published ? "Published" : "Draft"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => handleEdit(post)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDelete(post.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
    </div>
  );
};

export default Blog;
