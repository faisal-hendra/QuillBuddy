import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { greetings } from "@/const/greetings";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { callFunction } from "tauri-plugin-python-api";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BoxlessSelect,
  BoxlessSelectContent,
  BoxlessSelectGroup,
  BoxlessSelectItem,
  BoxlessSelectTrigger,
  BoxlessSelectValue,
} from "@/components/ui/boxless-select";
import Database from "@tauri-apps/plugin-sql";
import { Link } from "react-router-dom";
import { CogIcon } from "lucide-react";
import useSound from "use-sound";
import toggle from "../assets/sounds/toggle-on.wav";
import { PROVIDERS } from "@/const/providers";
import { invoke } from "@tauri-apps/api/core";
import { useProfile } from "@/store/profile";

const MainApp = () => {
  const [userOS, setUserOS] = useState("");
  const [userInput, setUserInput] = useState("");
  const [randomGreeting, setRandomGreeting] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState("correction");
  const [provider, setProvider] = useState(PROVIDERS[0].value);
  const [playSound] = useSound(toggle, {
    volume: 0.1,
  });

  const profile = useProfile((state) => state.profile);
  const setProfile = useProfile((state) => state.setProfile);

  // Get OS Name
  let isMacOS;
  const fetchOsName = async () => {
    const os = await invoke("get_os_name");
    setUserOS(os);
    isMacOS = os === "macos";
  };

  useEffect(() => {
    fetchOsName();
  }, []);

  async function getProfile() {
    try {
      const db = await Database.load("sqlite:profile.db");
      const _profile = await db.select("SELECT * FROM profile");
      setProfile(_profile);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getProfile();
    setMounted(true);
    setRandomGreeting(greetings[Math.floor(Math.random() * greetings.length)]);
  }, []);

  const handleSubmit = async () => {
    if (!userInput.trim() || isLoading) return;
    try {
      setIsLoading(true);
      let correctedSentence;
      const apiKey = (profile?.find(
        (p) => p.provider === `${provider}`,
      )).api_key;

      if (apiKey !== null || apiKey !== undefined) {
        correctedSentence = await callFunction("generate_response", [
          {
            user_input: userInput,
            mode: mode,
            provider: provider,
            api_key: apiKey,
          },
        ]);
        setUserInput(correctedSentence);
      } else {
        console.error(
          `Looks like you haven't configured API ket for ${provider.charAt(0).toUpperCase}${provider.substring(1)} `,
        );
      }
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
    <div className="max-h-screen max-w-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-6">
        <header
          className={cn(
            "flex grid grid-cols-10 mb-12 items-baseline transition-all duration-700 ease-out-quint",
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
          )}
        >
          <div className="col-span-8">
            <h1 className="font-heading text-2xl text-foreground tracking-tight mb-3">
              {randomGreeting}
            </h1>
            <p className="text-muted-foreground text-base">
              Paste your text below and I'll help polish it up.
            </p>
          </div>
          <div className="flex col-span-2 justify-end">
            <Link to={"/config"}>
              <CogIcon className="opacity-10 hover:opacity-100 transition-all hover:cursor-pointer hover:rotate-64 animate-ease-out hover:scale-130" />
            </Link>
          </div>
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
              className={`min-h-32 border-0 rounded-none resize-none  ${isLoading ? "text-foreground/30" : "text-foreground/90"} placeholder:text-muted-foreground/60 py-4 px-5 text-base leading-relaxed focus-visible:ring-0 focus-visible:ring-offset-0 select-text`}
              disabled={isLoading}
            />
            <div className="flex items-center justify-between items-center px-5 py-3 bg-secondary/40 border-t border-border/40">
              <span className="text-xs text-muted-foreground/70 flex gap-2">
                {isLoading ? (
                  "Processing, hang tight..."
                ) : (
                  <div className="flex gap-2">
                    <Select
                      value={provider}
                      onValueChange={(e) => setProvider(e)}
                    >
                      <SelectTrigger className="min-w-[110px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {PROVIDERS.map((p) => {
                            const Icon = p.icon;
                            return (
                              <SelectItem value={p.value}>
                                <Icon />
                                {p.name}
                              </SelectItem>
                            );
                          })}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <BoxlessSelect
                      value={mode}
                      onValueChange={(e) => setMode(e)}
                    >
                      <BoxlessSelectTrigger className="w-[120px]">
                        <BoxlessSelectValue />
                      </BoxlessSelectTrigger>
                      <BoxlessSelectContent>
                        <BoxlessSelectGroup>
                          <BoxlessSelectItem value="correction">
                            Correction
                          </BoxlessSelectItem>
                          <BoxlessSelectItem value="paraphrase">
                            Paraphrase
                          </BoxlessSelectItem>
                        </BoxlessSelectGroup>
                      </BoxlessSelectContent>
                    </BoxlessSelect>
                  </div>
                )}
              </span>
              <Button
                onClick={() => {
                  handleSubmit();
                  while (isLoading === true) {
                    return null;
                  }
                  playSound();
                }}
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
            {isMacOS
              ? "Press ⌘ + Enter to submit"
              : "Press Ctrl + Enter to submit"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MainApp;
