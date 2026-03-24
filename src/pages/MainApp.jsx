import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { greetings } from "@/const/greetings";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { callFunction } from "tauri-plugin-python-api";

const MainApp = () => {
  const [userInput, setUserInput] = useState("");
  const [results, setResults] = useState([]);
  const [randomGreeting, setRandomGreeting] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setRandomGreeting(greetings[Math.floor(Math.random() * greetings.length)]);
  }, []);

  const handleSubmit = async () => {
    if (!userInput.trim() || isLoading) return;

    try {
      setIsLoading(true);
      // Call python backend to communicate with Groq
      const correctedSentence = await callFunction("generate_response", [
        userInput,
      ]);
      setResults(correctedSentence);
      setUserInput(correctedSentence);
    } catch (error) {
      console.error("Failed to generate response:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <header
          className={cn(
            "mb-12 transition-all duration-700 ease-out-quint",
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
          )}
        >
          <h1 className="font-heading text-4xl text-foreground tracking-tight mb-3">
            {randomGreeting}
          </h1>
          <p className="text-muted-foreground text-base">
            Paste your text below and I'll help polish it up.
          </p>
        </header>

        <div
          className={cn(
            "mb-16 transition-all duration-700 ease-out-quint [transition-delay:150ms]",
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
          )}
        >
          <div className="bg-card rounded-xl border border-border/60 shadow-sm shadow-foreground/5 overflow-hidden">
            <Textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type or paste your text here..."
              className={`min-h-32 border-0 rounded-none resize-none  ${isLoading ? "text-foreground/30" : "text-foreground/90"} placeholder:text-muted-foreground/60 py-4 px-5 text-base leading-relaxed focus-visible:ring-0 focus-visible:ring-offset-0`}
              disabled={isLoading}
            />
            <div className="flex items-center justify-between px-5 py-3 bg-secondary/40 border-t border-border/40">
              <span className="text-xs text-muted-foreground/70">
                {isLoading
                  ? "Processing, hang tight..."
                  : userInput.length > 0 && `${userInput.length} characters`}
              </span>
              <Button
                onClick={handleSubmit}
                disabled={!userInput.trim() || isLoading}
                className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98] transition-all"
                size="sm"
              >
                {isLoading ? (
                  <>
                    <Spinner className="size-4" />
                    <span>Polishing...</span>
                  </>
                ) : (
                  <span>Polish Text</span>
                )}
              </Button>
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground/50 mt-2 text-right">
            Press ⌘ + Enter to submit
          </p>
        </div>
      </div>
    </div>
  );
};

export default MainApp;
