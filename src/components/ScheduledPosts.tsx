import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Trash2, Play, AlertCircle } from "lucide-react";
import { format, isAfter, isBefore } from "date-fns";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

interface ScheduledPost {
  id: string;
  caption: string;
  hashtags: string[];
  imageUrl: string;
  scheduledDate: string;
  scheduledTime: string;
  status: 'scheduled' | 'posted' | 'failed';
  createdAt: string;
}

export const ScheduledPosts = () => {
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadScheduledPosts();
  }, []);

  const loadScheduledPosts = () => {
    try {
      const saved = localStorage.getItem('scheduled_posts');
      if (saved) {
        const posts = JSON.parse(saved);
        setScheduledPosts(posts.sort((a: ScheduledPost, b: ScheduledPost) => 
          new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime()
        ));
      }
    } catch (error) {
      console.error('Error loading scheduled posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteScheduled = (id: string) => {
    const updated = scheduledPosts.filter(post => post.id !== id);
    setScheduledPosts(updated);
    localStorage.setItem('scheduled_posts', JSON.stringify(updated));
    
    toast({
      title: "Post Removed",
      description: "Scheduled post has been deleted.",
    });
  };

  const handlePostNow = async (post: ScheduledPost) => {
    try {
      // This would integrate with the Facebook posting logic
      // For now, we'll just mark it as posted
      const updated = scheduledPosts.map(p => 
        p.id === post.id ? { ...p, status: 'posted' as const } : p
      );
      setScheduledPosts(updated);
      localStorage.setItem('scheduled_posts', JSON.stringify(updated));
      
      toast({
        title: "Posted Now!",
        description: "The scheduled post has been published immediately.",
      });
    } catch (error) {
      toast({
        title: "Posting Failed",
        description: "Could not post immediately. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (post: ScheduledPost) => {
    const now = new Date();
    const scheduledDateTime = new Date(`${post.scheduledDate}T${post.scheduledTime}`);
    
    if (post.status === 'posted') {
      return <Badge variant="secondary" className="bg-green-100 text-green-800">Posted</Badge>;
    }
    
    if (post.status === 'failed') {
      return <Badge variant="destructive">Failed</Badge>;
    }
    
    if (isBefore(scheduledDateTime, now)) {
      return <Badge variant="outline" className="border-orange-500 text-orange-600">Overdue</Badge>;
    }
    
    return <Badge variant="default" className="bg-blue-100 text-blue-800">Scheduled</Badge>;
  };

  const getTimeUntilPost = (post: ScheduledPost) => {
    const now = new Date();
    const scheduledDateTime = new Date(`${post.scheduledDate}T${post.scheduledTime}`);
    const diff = scheduledDateTime.getTime() - now.getTime();
    
    if (diff <= 0) return "Overdue";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (scheduledPosts.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Scheduled Posts</h3>
          <p className="text-muted-foreground text-center">
            You haven't scheduled any posts yet. Generate a post and schedule it for later!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Scheduled Posts</h2>
        <Badge variant="outline">{scheduledPosts.length} posts</Badge>
      </div>
      
      {scheduledPosts.map((post) => {
        const scheduledDateTime = new Date(`${post.scheduledDate}T${post.scheduledTime}`);
        const isOverdue = isBefore(scheduledDateTime, new Date()) && post.status === 'scheduled';
        
        return (
          <Card key={post.id} className={`${isOverdue ? 'border-orange-200 bg-orange-50' : ''}`}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusBadge(post)}
                    {isOverdue && (
                      <Badge variant="outline" className="border-orange-500 text-orange-600">
                        Overdue
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(scheduledDateTime, 'PPP')}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {format(scheduledDateTime, 'p')}
                    </div>
                    {post.status === 'scheduled' && (
                      <div className="text-xs">
                        {isOverdue ? 'Overdue' : `In ${getTimeUntilPost(post)}`}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {post.status === 'scheduled' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handlePostNow(post)}
                    >
                      <Play className="h-3 w-3 mr-1" />
                      Post Now
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteScheduled(post.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-3">
                <p className="text-sm text-foreground line-clamp-2">
                  {post.caption}
                </p>
                
                <div className="flex flex-wrap gap-1">
                  {post.hashtags.slice(0, 4).map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                  {post.hashtags.length > 4 && (
                    <span className="text-xs text-muted-foreground px-2 py-1">
                      +{post.hashtags.length - 4} more
                    </span>
                  )}
                </div>
                
                {isOverdue && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      This post was scheduled for the past. You can post it now or reschedule it.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};