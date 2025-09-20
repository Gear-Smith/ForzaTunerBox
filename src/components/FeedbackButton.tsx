import type { CheckedState } from "@radix-ui/react-checkbox";
import { useState } from "react";
import { toast } from "sonner";
import { sendFeedbackEmail } from "../lib/emailService";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

type Feedback = {
  email?: string;
  content: string;
  tune?: ReturnType<import("../ForzaTune").ForzaTune["toJSON"]> | null;
};

type FeedbackProps = {
  tune: ReturnType<import("../ForzaTune").ForzaTune["toJSON"]> | null;
};

export const Feedback = ({ tune }: FeedbackProps) => {
  const [email, setEmail] = useState("");
  const [feedbackContent, setFeedbackContent] = useState("");
  const [includeTune, setIncludeTune] = useState<CheckedState>(true);
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitFeedback = async (feedback: Feedback) => {
    setIsSubmitting(true);

    try {
      await sendFeedbackEmail({
        email: feedback.email,
        content: feedback.content,
        tune: includeTune ? tune : null,
        recipientEmail: "feedback@forzatunerbox.com",
      });

      toast.success("Feedback submitted!", {
        description: "Thanks for your input! We'll get back to you soon.",
      });

      setEmail("");
      setFeedbackContent("");
      setIncludeTune(true);
      setOpen(false);
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      toast.error("Failed to submit feedback", {
        description: error instanceof Error ? error.message : "Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button id="feedback" variant="outline">
          Feedback
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmitFeedback({
              email,
              content: feedbackContent,
              tune: includeTune ? tune : null,
            });
          }}
          className="flex flex-col gap-6"
        >
          <AlertDialogHeader>
            <AlertDialogTitle>User Feedback</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="flex flex-col gap-6">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Textarea
                  required
                  placeholder="I'm not sure what to do with my hands..."
                  value={feedbackContent}
                  onChange={(e) => setFeedbackContent(e.target.value)}
                />
                <Label className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-amber-600 has-[[aria-checked=true]]:bg-amber-50 dark:has-[[aria-checked=true]]:border-amber-900 dark:has-[[aria-checked=true]]:bg-amber-950">
                  <Checkbox
                    id="include-tune-toggle"
                    checked={includeTune}
                    onCheckedChange={(checked) => setIncludeTune(checked === true)}
                    className="data-[state=checked]:border-amber-600 data-[state=checked]:bg-amber-600 data-[state=checked]:text-white dark:data-[state=checked]:border-amber-700 dark:data-[state=checked]:bg-amber-700"
                  />
                  <div className="grid gap-1.5 font-normal">
                    <p className="text-sm leading-none font-medium">Include Tune</p>
                    <p className="text-muted-foreground text-sm">
                      This will include the current tune with your feedback.
                    </p>
                  </div>
                </Label>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="hover:outline-1 outline-green-400 rounded-md px-2"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};
