import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Users, Trophy, MessageSquare, ThumbsUp, Star, Search, Plus } from "lucide-react";

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

interface LeaderboardEntry {
  rank: number;
  username: string;
  score: number;
  badge: string;
  trend: "up" | "down" | "same";
}

const mockPosts: ForumPost[] = [
  {
    id: "1",
    title: "Best practices for password storage in college dorms?",
    content: "Living in shared spaces makes password security tricky. What are your tips for keeping passwords safe when roommates might see your screen?",
    author: "StudyBuddy23",
    avatar: "SB",
    date: new Date(2024, 2, 15),
    likes: 12,
    replies: 8,
    category: "Security Tips"
  },
  {
    id: "2", 
    title: "University WiFi safety - what should I know?",
    content: "Our campus WiFi seems open to everyone. How can I protect my accounts when using public networks for studying?",
    author: "TechNewbie",
    avatar: "TN",
    date: new Date(2024, 2, 14),
    likes: 18,
    replies: 15,
    category: "Network Security"
  },
  {
    id: "3",
    title: "Phishing email that looked like university IT",
    content: "Almost fell for a convincing email asking to verify my student portal password. Here's how I spotted it was fake...",
    author: "CyberSavvy",
    avatar: "CS",
    date: new Date(2024, 2, 13),
    likes: 25,
    replies: 6,
    category: "Phishing Alerts"
  }
];

const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, username: "PasswordMaster", score: 2840, badge: "Security Expert", trend: "up" },
  { rank: 2, username: "CyberGuardian", score: 2650, badge: "Privacy Pro", trend: "same" },
  { rank: 3, username: "SafeStudier", score: 2420, badge: "Vault Keeper", trend: "up" },
  { rank: 4, username: "SecureStudent", score: 2180, badge: "Password Pro", trend: "down" },
  { rank: 5, username: "DigitalDefender", score: 1950, badge: "Security Star", trend: "up" },
  { rank: 6, username: "StudySafe", score: 1820, badge: "Beginner", trend: "same" },
  { rank: 7, username: "TechSavvy22", score: 1650, badge: "Beginner", trend: "up" },
  { rank: 8, username: "NewToSecurity", score: 1420, badge: "Beginner", trend: "same" },
];

export default function Community() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Security Tips", "Network Security", "Phishing Alerts", "Tools & Apps"];
  
  const filteredPosts = mockPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case "Security Expert": return "bg-primary text-primary-foreground";
      case "Privacy Pro": return "bg-secondary text-secondary-foreground";
      case "Vault Keeper": return "bg-success text-success-foreground";
      case "Password Pro": return "bg-warning text-warning-foreground";
      case "Security Star": return "bg-gradient-hero text-white";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return "↗️";
      case "down": return "↘️";
      default: return "→";
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Student Security Community</h1>
        <p className="text-muted-foreground">
          Learn from peers, share tips, and compete in security challenges
        </p>
      </div>

      <Tabs defaultValue="forum" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="forum" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Discussion Forum
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            Leaderboard
          </TabsTrigger>
        </TabsList>

        <TabsContent value="forum" className="space-y-6">
          {/* Forum Controls */}
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
            <Button className="bg-gradient-hero hover:opacity-90 text-white">
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </Button>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "bg-primary text-primary-foreground" : ""}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Forum Posts */}
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-card transition-all duration-200">
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
                        <Badge variant="outline" className="ml-4">
                          {post.category}
                        </Badge>
                      </div>
                      
                      <p className="text-muted-foreground leading-relaxed">
                        {post.content}
                      </p>
                      
                      <div className="flex items-center gap-6 pt-2">
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                          <ThumbsUp className="w-4 h-4 mr-1" />
                          {post.likes}
                        </Button>
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          {post.replies} replies
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No posts found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or category filter
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-6">
          {/* Leaderboard Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                    <p className="text-2xl font-bold text-primary">1,247</p>
                  </div>
                  <Users className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">This Week's Winner</p>
                    <p className="text-2xl font-bold text-warning">PasswordMaster</p>
                  </div>
                  <Trophy className="w-8 h-8 text-warning" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Your Rank</p>
                    <p className="text-2xl font-bold text-secondary">#42</p>
                  </div>
                  <Star className="w-8 h-8 text-secondary" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Leaderboard Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Security Champions
              </CardTitle>
              <CardDescription>
                Top students ranked by security score and learning progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockLeaderboard.map((entry) => (
                  <div key={entry.rank} className={`flex items-center justify-between p-4 rounded-lg border ${entry.rank <= 3 ? 'bg-gradient-card' : 'bg-card'}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        entry.rank === 1 ? 'bg-yellow-500 text-white' :
                        entry.rank === 2 ? 'bg-gray-400 text-white' :
                        entry.rank === 3 ? 'bg-amber-600 text-white' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {entry.rank}
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{entry.username}</span>
                          <Badge className={getBadgeColor(entry.badge)}>
                            {entry.badge}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {entry.score.toLocaleString()} points
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{getTrendIcon(entry.trend)}</span>
                      {entry.rank <= 3 && (
                        <Trophy className={`w-4 h-4 ${
                          entry.rank === 1 ? 'text-yellow-500' :
                          entry.rank === 2 ? 'text-gray-400' :
                          'text-amber-600'
                        }`} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* How Points Work */}
          <Card>
            <CardHeader>
              <CardTitle>How Security Points Work</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary mb-2">+50</div>
                  <p className="text-sm">Strong password created</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-secondary mb-2">+25</div>
                  <p className="text-sm">Phishing attempt detected</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-success mb-2">+100</div>
                  <p className="text-sm">Security lesson completed</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-warning mb-2">+15</div>
                  <p className="text-sm">Daily login streak</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}