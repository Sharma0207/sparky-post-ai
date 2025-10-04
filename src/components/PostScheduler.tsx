import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon, Clock, Save, X } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface PostSchedulerProps {
  caption: string;
  hashtags: string[];
  imageUrl: string;
  onSchedule: (scheduledPost: ScheduledPost) => void;
  onClose: () => void;
}

interface ScheduledPost {
  id: string;
  caption: string;
  hashtags: string[];
  imageUrl: string;
  scheduledDate: Date;
  scheduledTime: string;
  status: 'scheduled' | 'posted' | 'failed';
  createdAt: Date;
}

export const PostScheduler = ({
  caption,
  hashtags,
  imageUrl,
  onSchedule,
  onClose,
}: PostSchedulerProps) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState("12:00");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSchedule = async () => {
    if (!date) {
      toast({
        title: "Select Date",
        description: "Please select a date for scheduling.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const scheduledPost: ScheduledPost = {
        id: `scheduled_${Date.now()}`,
        caption,
        hashtags,
        imageUrl,
        scheduledDate: date,
        scheduledTime: time,
        status: 'scheduled',
        createdAt: new Date(),
      };

      // Save to localStorage
      const existingScheduled = JSON.parse(localStorage.getItem('scheduled_posts') || '[]');
      existingScheduled.push(scheduledPost);
      localStorage.setItem('scheduled_posts', JSON.stringify(existingScheduled));

      onSchedule(scheduledPost);
      
      toast({
        title: "Post Scheduled!",
        description: `Your post is scheduled for ${format(date, 'PPP')} at ${time}`,
      });

      onClose();
    } catch (error) {
      toast({
        title: "Scheduling Failed",
        description: "Could not schedule the post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Schedule Post
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Post Preview */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Post Preview</Label>
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm text-foreground mb-2">{caption}</p>
            <div className="flex flex-wrap gap-1">
              {hashtags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
              {hashtags.length > 3 && (
                <span className="text-xs text-muted-foreground">
                  +{hashtags.length - 3} more
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Date Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Select Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Time Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Select Time</Label>
          <Select value={time} onValueChange={setTime}>
            <SelectTrigger>
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {timeSlots.map((slot) => (
                <SelectItem key={slot} value={slot}>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    {slot}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Quick Time Suggestions */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Quick Select</Label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTime("09:00")}
              className="text-xs"
            >
              Morning (9:00 AM)
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTime("12:00")}
              className="text-xs"
            >
              Noon (12:00 PM)
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTime("15:00")}
              className="text-xs"
            >
              Afternoon (3:00 PM)
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTime("18:00")}
              className="text-xs"
            >
              Evening (6:00 PM)
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSchedule}
            disabled={!date || isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Scheduling...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Schedule Post
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};