import { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { SocialMediaPopup } from "./SocialMediaPopup";
import { GeneratedPost } from "./GeneratedPost";
import { PostScheduler } from "./PostScheduler";
import { ScheduledPosts } from "./ScheduledPosts";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Facebook, Calendar, Edit3, BarChart3, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface GeneratedVersion {
  caption: string;
  hashtags: string[];
  imageUrl: string;
}

interface FacebookUser {
  id: string;
  name: string;
  email?: string;
}

export const Dashboard = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState("facebook");
  const [prompt, setPrompt] = useState("");
  const [generatedContents, setGeneratedContents] = useState<GeneratedVersion[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<FacebookUser | null>(null);
  const [postHistory, setPostHistory] = useState<any[]>([]);
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);
  const [scheduledPosts, setScheduledPosts] = useState<any[]>([]);
  const { toast } = useToast();

  // Load saved authentication state
  useEffect(() => {
    const savedToken = localStorage.getItem('facebook_access_token');
    const savedUserInfo = localStorage.getItem('facebook_user_info');
    const savedPostHistory = localStorage.getItem('post_history');
    const savedScheduledPosts = localStorage.getItem('scheduled_posts');
    
    if (savedToken && savedUserInfo) {
      setAccessToken(savedToken);
      setUserInfo(JSON.parse(savedUserInfo));
      setIsAuthenticated(true);
    }
    
    if (savedPostHistory) {
      setPostHistory(JSON.parse(savedPostHistory));
    }
    
    if (savedScheduledPosts) {
      setScheduledPosts(JSON.parse(savedScheduledPosts));
    }
  }, []);

  const handleConnectPlatform = (platform: string) => {
    setSelectedPlatform(platform);
    setIsPopupOpen(true);
  };

  const handleAuthenticated = async (token: string) => {
    setAccessToken(token);
    setIsAuthenticated(true);
    
    // Save token to localStorage
    localStorage.setItem('facebook_access_token', token);
    
    // Fetch user info
    try {
      const response = await fetch(`https://graph.facebook.com/me?access_token=${token}&fields=id,name,email`);
      const userData = await response.json();
      
      if (userData.error) {
        throw new Error(userData.error.message);
      }
      
      setUserInfo(userData);
      localStorage.setItem('facebook_user_info', JSON.stringify(userData));
      
      toast({
        title: "Welcome!",
        description: `Connected as ${userData.name}`,
      });
    } catch (error: any) {
      console.error("Error fetching user info:", error);
      toast({
        title: "Connection Warning",
        description: "Connected but couldn't fetch profile info.",
        variant: "destructive",
      });
    }
  };

  const handleDisconnect = () => {
    setAccessToken(null);
    setUserInfo(null);
    setIsAuthenticated(false);
    localStorage.removeItem('facebook_access_token');
    localStorage.removeItem('facebook_user_info');
    
    toast({
      title: "Disconnected",
      description: "Facebook account disconnected successfully.",
    });
  };

  const handlePromptSubmit = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Empty Prompt",
        description: "Please enter a prompt to generate posts.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setGeneratedContents([]);
    setSelectedIndex(null);

    try {
      const { data, error } = await supabase.functions.invoke("generate-post", {
        body: { prompt },
      });

      if (error) throw error;

      setGeneratedContents(data.versions);
      toast({
        title: "Posts Generated!",
        description: "3 unique versions are ready for you.",
      });
    } catch (error: any) {
      console.error("Generation error:", error);
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate posts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostToFacebook = async () => {
    if (selectedIndex === null || !accessToken) return;

    const selectedPost = generatedContents[selectedIndex];
    setIsPosting(true);

    try {
      // First, upload the image to Facebook
      const formData = new FormData();
      
      // Convert image URL to blob
      const imageResponse = await fetch(selectedPost.imageUrl);
      const imageBlob = await imageResponse.blob();
      formData.append('source', imageBlob);
      formData.append('access_token', accessToken);

      const uploadResponse = await fetch(`https://graph.facebook.com/me/photos`, {
        method: 'POST',
        body: formData,
      });

      const uploadData = await uploadResponse.json();

      if (uploadData.error) {
        throw new Error(uploadData.error.message);
      }

      // Now create a post with the uploaded photo
      const postText = `${selectedPost.caption}\n\n${selectedPost.hashtags.join(" ")}`;
      
      const postResponse = await fetch(`https://graph.facebook.com/me/feed`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          message: postText,
          object_attachment: uploadData.id,
          access_token: accessToken,
        }),
      });

      const postData = await postResponse.json();

      if (postData.error) {
        throw new Error(postData.error.message);
      }

      // Add to post history
      const newPost = {
        id: postData.id,
        caption: selectedPost.caption,
        hashtags: selectedPost.hashtags,
        imageUrl: selectedPost.imageUrl,
        postedAt: new Date().toISOString(),
        status: 'success'
      };
      
      setPostHistory(prev => [newPost, ...prev]);
      localStorage.setItem('post_history', JSON.stringify([newPost, ...postHistory]));

      toast({
        title: "Posted Successfully!",
        description: "Your post has been published to Facebook.",
      });

      // Clear selection
      setSelectedIndex(null);

    } catch (error: any) {
      console.error("Posting error:", error);
      toast({
        title: "Posting Failed",
        description: error.message || "Failed to post to Facebook. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPosting(false);
    }
  };

  const handleShareViaFacebook = () => {
    if (selectedIndex === null) return;

    const selectedPost = generatedContents[selectedIndex];
    const text = `${selectedPost.caption}\n\n${selectedPost.hashtags.join(" ")}`;
    const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      selectedPost.imageUrl
    )}&quote=${encodeURIComponent(text)}`;

    window.open(fbShareUrl, "_blank", "width=600,height=400");
  };

  const handleSchedulePost = (scheduledPost: any) => {
    setScheduledPosts(prev => [scheduledPost, ...prev]);
    setIsSchedulerOpen(false);
    setSelectedIndex(null);
  };

  const handleOpenScheduler = () => {
    if (selectedIndex === null) {
      toast({
        title: "Select a Post",
        description: "Please select a post to schedule.",
        variant: "destructive",
      });
      return;
    }
    setIsSchedulerOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar onConnectPlatform={handleConnectPlatform} />

      <div className="flex-1 flex flex-col p-4 md:p-6 md:ml-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Sparky Post AI
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Generate and post amazing content to Facebook with AI
            </p>
          </div>
          
          {isAuthenticated && userInfo && (
            <Card className="p-3 md:p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-[#1877F2] rounded-full flex items-center justify-center">
                  <Facebook className="h-4 w-4 md:h-5 md:w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm md:text-base truncate">{userInfo.name}</p>
                  <Badge variant="secondary" className="text-green-600 text-xs">
                    Connected
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDisconnect}
                  className="text-xs"
                >
                  Disconnect
                </Button>
              </div>
            </Card>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Posts Generated</CardTitle>
              <Edit3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{generatedContents.length}</div>
              <p className="text-xs text-muted-foreground">
                Ready to post
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Posts Published</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{postHistory.length}</div>
              <p className="text-xs text-muted-foreground">
                Successfully posted
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Scheduled Posts</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{scheduledPosts.length}</div>
              <p className="text-xs text-muted-foreground">
                Waiting to post
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Connection Status</CardTitle>
              <Facebook className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isAuthenticated ? "✓" : "✗"}
              </div>
              <p className="text-xs text-muted-foreground">
                {isAuthenticated ? "Facebook Connected" : "Not Connected"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="generate" className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="generate">Generate Posts</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled Posts</TabsTrigger>
            <TabsTrigger value="history">Post History</TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="flex-1 flex flex-col">
            {/* Generated Posts */}
            {generatedContents.length > 0 && !isLoading && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Generated Post Previews</h2>
                  {selectedIndex !== null && (
                    <div className="flex gap-2">
                      {isAuthenticated ? (
                        <>
                          <Button
                            onClick={handlePostToFacebook}
                            disabled={isPosting}
                            className="bg-[#1877F2] hover:bg-[#166FE5] text-white"
                          >
                            {isPosting ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                Posting...
                              </>
                            ) : (
                              <>
                                <Facebook className="mr-2 h-4 w-4" />
                                Post Now
                              </>
                            )}
                          </Button>
                          <Button
                            onClick={handleOpenScheduler}
                            variant="outline"
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            Schedule
                          </Button>
                        </>
                      ) : (
                        <Button
                          onClick={handleShareViaFacebook}
                          variant="outline"
                        >
                          <Facebook className="mr-2 h-4 w-4" />
                          Share via Facebook
                        </Button>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {generatedContents.map((version, index) => (
                    <GeneratedPost
                      key={index}
                      caption={version.caption}
                      hashtags={version.hashtags}
                      imageUrl={version.imageUrl}
                      isSelected={selectedIndex === index}
                      onSelect={() => setSelectedIndex(index)}
                      onPostToFacebook={handlePostToFacebook}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-16 space-y-4">
                <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                <p className="text-lg text-muted-foreground animate-pulse">
                  Creating amazing posts for you...
                </p>
                <div className="text-sm text-muted-foreground text-center">
                  <p>Generating captions, hashtags, and images...</p>
                  <p>This may take a few moments</p>
                </div>
              </div>
            )}

            <div className="flex-1" />

            {/* Prompt Input */}
            <div className="p-6 bg-card rounded-lg shadow-card border border-border max-w-4xl mx-auto w-full">
              <div className="space-y-4">
                <div className="flex items-end gap-3">
                  <Textarea
                    className="flex-1 min-h-[100px] resize-none bg-background border-border"
                    placeholder="Enter your prompt (e.g., 'Generate a happy Diwali post with diyas')..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handlePromptSubmit();
                      }
                    }}
                  />
                  <Button
                    onClick={handlePromptSubmit}
                    disabled={isLoading || !prompt.trim()}
                    size="lg"
                    className="bg-primary hover:bg-primary/90"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5" />
                        Generate
                      </>
                    )}
                  </Button>
                </div>
                
                {!isAuthenticated && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-center gap-2 text-amber-800">
                      <Facebook className="h-4 w-4" />
                      <span className="font-medium">Connect Facebook to post directly</span>
                    </div>
                    <p className="text-sm text-amber-700 mt-1">
                      Without connection, you can still generate posts and share them manually.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="scheduled" className="flex-1">
            <ScheduledPosts />
          </TabsContent>

          <TabsContent value="history" className="flex-1">
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Post History</h2>
              {postHistory.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-8">
                    <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Posts Yet</h3>
                    <p className="text-muted-foreground text-center">
                      Your published posts will appear here. Generate and post your first content!
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {postHistory.map((post, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <img
                            src={post.imageUrl}
                            alt="Post"
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <p className="text-sm text-foreground mb-2">{post.caption}</p>
                            <div className="flex flex-wrap gap-1 mb-2">
                              {post.hashtags.slice(0, 3).map((tag: string, idx: number) => (
                                <span
                                  key={idx}
                                  className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Posted on {new Date(post.postedAt).toLocaleString()}
                            </p>
                          </div>
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Published
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Social Media Popup */}
      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
          <div className="bg-card rounded-lg shadow-card border border-border max-w-md w-full max-h-[90vh] overflow-y-auto">
            <SocialMediaPopup
              platform={selectedPlatform}
              onClose={() => setIsPopupOpen(false)}
              onAuthenticated={handleAuthenticated}
            />
          </div>
        </div>
      )}

      {/* Post Scheduler Popup */}
      {isSchedulerOpen && selectedIndex !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
          <PostScheduler
            caption={generatedContents[selectedIndex].caption}
            hashtags={generatedContents[selectedIndex].hashtags}
            imageUrl={generatedContents[selectedIndex].imageUrl}
            onSchedule={handleSchedulePost}
            onClose={() => setIsSchedulerOpen(false)}
          />
        </div>
      )}
    </div>
  );
};
