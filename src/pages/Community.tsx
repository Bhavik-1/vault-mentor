import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users, MessageSquare, ThumbsUp, Search, Plus, X } from "lucide-react";

// --- Data Interfaces and Mock Data ---

interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: string;
  avatar: string;
  date: Date;
  likes: number;
  replies: number;
  category: string;
}

const initialPosts: ForumPost[] = [
  {
    id: "1",
    title: "Best practices for password storage in college dorms?",
    content:
      "Living in shared spaces makes password security tricky. What are your tips for keeping passwords safe when roommates might see your screen?",
    author: "StudyBuddy23",
    avatar: "SB",
    date: new Date(2025, 2, 15),
    likes: 12,
    replies: 8,
    category: "Security Tips",
  },
  {
    id: "2",
    title: "University WiFi safety - what should I know?",
    content:
      "Our campus WiFi seems open to everyone. How can I protect my accounts when using public networks for studying?",
    author: "TechNewbie",
    avatar: "TN",
    date: new Date(2025, 2, 14),
    likes: 18,
    replies: 15,
    category: "Network Security",
  },
  {
    id: "3",
    title: "Phishing email that looked like university IT",
    content:
      "Almost fell for a convincing email asking to verify my student portal password. Here's how I spotted it was fake...",
    author: "CyberSavvy",
    avatar: "CS",
    date: new Date(2025, 2, 13),
    likes: 25,
    replies: 6,
    category: "Phishing Alerts",
  },
];

const categories = [
  "All",
  "Security Tips",
  "Network Security",
  "Phishing Alerts",
  "Tools & Apps",
];

// --- Community Component ---

export default function Community() {
  const [posts, setPosts] = useState<ForumPost[]>(initialPosts);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // State for the new post form
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostCategory, setNewPostCategory] = useState("Security Tips");

  const handleCreatePost = () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      alert("Please fill out both the title and content.");
      return;
    }

    const newPost: ForumPost = {
      id: Date.now().toString(),
      title: newPostTitle.trim(),
      content: newPostContent.trim(),
      author: "You", // Placeholder for current user
      avatar: "ME",
      date: new Date(),
      likes: 0,
      replies: 0,
      category: newPostCategory,
    };

    // Add the new post to the top of the list
    setPosts([newPost, ...posts]);

    // Reset and hide the form
    setNewPostTitle("");
    setNewPostContent("");
    setShowNewPostForm(false);
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Student Security Forum</h1>
        <p className="text-muted-foreground">
          Learn from peers and share your security tips.
        </p>
      </div>

      {/* --- Forum Controls --- */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search discussions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        {!showNewPostForm && (
          <Button
            onClick={() => setShowNewPostForm(true)}
            className="bg-gradient-hero hover:opacity-90 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Post
          </Button>
        )}
      </div>

      {/* --- New Post Form (Inline) --- */}
      {showNewPostForm && (
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle>Create a New Post</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Title of your post..."
              value={newPostTitle}
              onChange={(e) => setNewPostTitle(e.target.value)}
              className="text-lg font-semibold"
            />
            <Textarea
              placeholder="Share your thoughts or ask a question..."
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              rows={4}
            />
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <Select
                value={newPostCategory}
                onValueChange={setNewPostCategory}
              >
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.slice(1).map(
                    (
                      cat // Exclude "All"
                    ) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  onClick={() => setShowNewPostForm(false)}
                  className="w-full"
                >
                  <X className="w-4 h-4 mr-2" /> Cancel
                </Button>
                <Button onClick={handleCreatePost} className="w-full">
                  <Plus className="w-4 h-4 mr-2" /> Post
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* --- Category Filters --- */}
      <div className="flex flex-wrap gap-2 border-b pb-4">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className={
              selectedCategory === category
                ? "bg-primary text-primary-foreground"
                : ""
            }
          >
            {category}
          </Button>
        ))}
      </div>

      {/* --- Forum Posts List --- */}
      <div className="space-y-4">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <Card
              key={post.id}
              className="hover:shadow-card transition-all duration-200"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarFallback className="bg-gradient-hero text-white">
                      {post.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg hover:text-primary cursor-pointer">
                          {post.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>by {post.author}</span>
                          <span>•</span>
                          <span>{post.date.toLocaleDateString()}</span>
                        </div>
                      </div>
                      <Badge variant="outline" className="ml-4 flex-shrink-0">
                        {post.category}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {post.content}
                    </p>
                    <div className="flex items-center gap-6 pt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-primary"
                      >
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        {post.likes}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-primary"
                      >
                        <MessageSquare className="w-4 h-4 mr-1" />
                        {post.replies} replies
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Posts Found</h3>
              <p className="text-muted-foreground">
                {searchTerm
                  ? "Try adjusting your search or category filter."
                  : "Be the first to create a post in this category!"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
