import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { TrashIcon, ChevronLeft } from "lucide-react";
import { useStoredApiKeys } from "@/store/profile";
import { Card } from "@/components/ui/card";
import { PROVIDERS } from "@/const/providers";
import { Separator } from "@/components/ui/separator";
import AddProvider from "@/components/add-provider";
import Database from "@tauri-apps/plugin-sql";

function Settings() {
  const storedApiKeys = useStoredApiKeys((state) => state.storedApiKeys);
  const setStoredApiKeys = useStoredApiKeys((state) => state.setStoredApiKeys);

  async function removeProvider(id) {
    try {
      const db = await Database.load("sqlite:profile.db");
      db.execute(`DELETE FROM profile WHERE id = ${id}`);
    } catch (error) {
      console.error(error);
    } finally {
      refreshApiProviders();
    }
  }

  async function refreshApiProviders() {
    try {
      const db = await Database.load("sqlite:profile.db");
      const apiProviders = await db.select("SELECT * FROM profile");
      setStoredApiKeys(apiProviders);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Link to={"/"}>
              <Button variant="outline">
                <ChevronLeft />
              </Button>
            </Link>
            <h1>Configuration</h1>
          </div>
        </div>
        <br />
        <Separator />
        <div>
          <br />
          <div className="flex justify-between">
            <p>Available providers</p>
            <AddProvider></AddProvider>
          </div>
          <br />

          {storedApiKeys.map((p) => {
            const providerName = PROVIDERS.find(
              (item) => item.value === p.provider,
            )?.name;
            const Icon = PROVIDERS.find(
              (item) => item.value === p.provider,
            )?.icon;
            const censoredAPIKey =
              p.api_key.substring(0, 8) +
              "..." +
              p.api_key.substring(54, p.api_key.length);
            return (
              <Card className="p-4 mb-2 group opacity-75 hover:opacity-100 hover:scale-105 transition-all">
                <div className="grid grid-cols-7 items-center gap-4">
                  <div className="flex items-center gap-2 col-span-2">
                    <Icon className="size-4" />
                    {providerName}
                  </div>
                  <div className="col-span-4 group">
                    <p className="font-mono opacity-0 group-hover:opacity-50 transition-all">
                      {censoredAPIKey}
                    </p>
                  </div>
                  <div className="col-span-1 flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-all">
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => {
                        removeProvider(p.id);
                      }}
                    >
                      <TrashIcon />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Settings;
