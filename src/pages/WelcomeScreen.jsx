import { useEffect, useState } from "react";
import { PROVIDERS } from "@/const/providers";
import { Button } from "@/components/ui/button";
import { SparklesIcon, ArrowRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import _ from "lodash";
import { Input } from "@/components/ui/input";
import { useProfile } from "@/store/profile";
import Database from "@tauri-apps/plugin-sql";
import Workspace from "./Workspace";

function WelcomeScreen() {
  const profile = useProfile((state) => state.profile);
  const setProfile = useProfile((state) => state.setProfile);

  const [selectedProvider, setSelectedProvider] = useState("");
  const [enteredApiKey, setEnteredApiKey] = useState("");
  const [isContinueSelected, setIsContinueSelected] = useState(false);
  const [headerIcon, setHeaderIcon] = useState([null]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const icon = PROVIDERS.find((p) => p.value === selectedProvider)?.icon;
    setHeaderIcon([icon]);
  }, [selectedProvider]);

  async function addProvider() {
    try {
      const db = await Database.load("sqlite:profile.db");
      db.execute(
        `INSERT INTO profile (provider, api_key) VALUES ("${selectedProvider}", "${enteredApiKey}");`,
      );
    } catch (error) {
      console.error(error);
    } finally {
      refreshProfile();
      setIsSubmitted(true);
    }
  }

  async function refreshProfile() {
    try {
      const db = await Database.load("sqlite:profile.db");
      const _profile = await db.select("SELECT * FROM profile");
      setProfile(_profile);
    } catch (error) {
      console.error(error);
    }
  }

  const hasWhiteSpace = (val) => {
    return /\s/g.test(val);
  };

  const handleSubmit = () => {
    hasWhiteSpace(enteredApiKey)
      ? console.error("Invalid API Address")
      : addProvider();
    setIsOpen(false);
  };

  const WelcomeMessage = () => {
    return (
      <>
        <div className="min-h-screen bg-background flex items-center justify-center px-6 transition-all">
          <div className="max-w-xl w-full">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary mb-5">
                <SparklesIcon className="w-7 h-7" />
              </div>
              <h1 className="font-heading text-3xl text-foreground tracking-tight mb-3">
                Welcome to QuillBuddy
              </h1>
              <p className="text-muted-foreground text-base leading-relaxed">
                Your AI writing companion. Choose a provider to get started.
              </p>
            </div>

            <div className="space-y-3 mb-10">
              {PROVIDERS.map((provider) => {
                const Icon = provider.icon;
                const isSelected = selectedProvider === provider.value;

                return (
                  <button
                    key={provider.value}
                    onClick={() => setSelectedProvider(provider.value)}
                    className={cn(
                      "w-full flex items-center gap-4 p-5 rounded-xl border-2 text-left transition-all duration-200",
                      "hover:scale-[1.01] active:scale-[0.99]",
                      isSelected
                        ? "border-primary bg-primary/5 text-foreground"
                        : "border-border bg-card hover:border-primary/30 hover:bg-secondary/50",
                    )}
                  >
                    <div
                      className={cn(
                        "shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                        isSelected
                          ? "border-primary bg-primary"
                          : "border-muted-foreground/30",
                      )}
                    >
                      {isSelected && (
                        <div className="w-2.5 h-2.5 rounded-full bg-primary-foreground" />
                      )}
                    </div>

                    <div className="shrink-0 w-10 h-10 flex items-center justify-center">
                      <Icon className="w-8 h-8" />
                    </div>

                    {/* Provider Info */}
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground text-lg">
                        {provider.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Use {provider.name} API for AI-powered writing
                        assistance
                      </p>
                    </div>

                    {isSelected && (
                      <ArrowRightIcon className="w-5 h-5 text-primary animate-in fade-in slide-in-from-left-2" />
                    )}
                  </button>
                );
              })}
            </div>

            <Button
              size="lg"
              disabled={!selectedProvider}
              className="w-full gap-2 text-base h-12"
              onClick={() => {
                setIsContinueSelected((state) => !state);
              }}
            >
              <span>Continue</span>
              <ArrowRightIcon className="w-4 h-4" />
            </Button>

            <p className="text-center text-xs text-muted-foreground/60 mt-4">
              You can change this later in settings
            </p>
          </div>
        </div>
      </>
    );
  };

  const EnterApiKey = () => {
    return (
      <>
        <div className="min-h-screen bg-background flex items-center justify-center px-6 transition-all">
          <div className="max-w-xl w-full">
            <div className="text-center mb-10 flex grid grid-cols-1 gap-6 justify-items-center">
              <div>
                {headerIcon.map((i) => {
                  const Icon = i;
                  return <Icon className="w-10 h-10" />;
                })}
              </div>

              <h1 className="font-heading text-2xl">
                Enter your{" "}
                <span className="underline underline-offset-2">
                  {PROVIDERS.find((p) => p.value === selectedProvider)?.name}
                </span>{" "}
                API Key
              </h1>
              <div>
                <Input
                  className="w-md"
                  placeholder="abcde-12345..."
                  value={enteredApiKey}
                  onChange={(e) => setEnteredApiKey(e.target.value)}
                ></Input>
              </div>
              <div className="w-50">
                <Button
                  disabled={!selectedProvider}
                  className="w-full gap-2 text-base h-12"
                  onClick={() => {
                    handleSubmit();
                  }}
                >
                  <span> Continue</span>
                  <ArrowRightIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  if (!isContinueSelected) {
    return <WelcomeMessage />;
  } else {
    const render = !isSubmitted ? <EnterApiKey /> : <Workspace />;
    return render;
  }
}

export default WelcomeScreen;
