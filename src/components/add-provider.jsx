import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PROVIDERS } from "@/const/providers";
import { useStoredApiKeys } from "@/store/profile";
import { PlusIcon, EyeIcon, EyeClosedIcon } from "lucide-react";
import { Input } from "./ui/input";
import { Label } from "@/components/ui/label";
import Database from "@tauri-apps/plugin-sql";
import _ from "lodash";

function AddProvider() {
  const storedApiKeys = useStoredApiKeys((state) => state.storedApiKeys);
  const setStoredApiKeys = useStoredApiKeys((state) => state.setStoredApiKeys);

  const [isOpen, setIsOpen] = useState(false);
  const [availableOptions, setAvailableOptions] = useState([]);
  const [hidePass, setHidePass] = useState(true);

  const [selectedProvider, setSelectedProvider] = useState();
  const [apiKey, setApiKey] = useState();

  const determineAvailableOption = () => {
    const a = PROVIDERS.map((p) => p.value);
    const b = storedApiKeys.map((p) => p.provider);
    const x = _.differenceWith(a, b, _.isEqual);
    setAvailableOptions(x);
  };

  const handleOpenChange = (open) => {
    setIsOpen(open);
    if (open) {
      determineAvailableOption();
    } else {
    }
  };

  async function addProvider() {
    try {
      const db = await Database.load("sqlite:profile.db");
      db.execute(
        `INSERT INTO profile (provider, api_key) VALUES ("${selectedProvider}", "${apiKey}");`,
      );
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

  const hasWhiteSpace = (val) => {
    return /\s/g.test(val);
  };

  const handleSubmit = () => {
    hasWhiteSpace(apiKey)
      ? console.error("Invalid API Address")
      : addProvider();
    setIsOpen(false);
  };

  useEffect(() => {
    if (isOpen) {
      determineAvailableOption();
    }
  }, [isOpen]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={handleOpenChange}
      onSubmit={handleSubmit}
    >
      <form>
        <DialogTrigger asChild>
          <Button size="icon" onClick={() => setIsOpen(true)}>
            <PlusIcon />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <div>
            <div className="flex grid grid-rows-2 gap-1 pb-2">
              <Label>Provider:</Label>
              <Select
                value={selectedProvider}
                onValueChange={(val) => setSelectedProvider(val)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a provider." />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {availableOptions.map((option) => {
                      const providerName = PROVIDERS?.find(
                        (item) => item.value === option,
                      ).name;

                      const Icon = PROVIDERS?.find(
                        (item) => item.value === option,
                      ).icon;
                      return (
                        <SelectItem value={option}>
                          <div className="flex gap-2 items-center">
                            <Icon />
                            {providerName}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex grid grid-rows-2 gap-1">
              <Label>API Key: </Label>
              <div className="flex gap-2">
                <Input
                  type={hidePass ? "password" : "text"}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                <Button
                  variant="outline"
                  onClick={() => {
                    setHidePass((val) => !val);
                  }}
                >
                  {hidePass ? <EyeIcon /> : <EyeClosedIcon />}
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              type="submit"
              onClick={() => {
                handleSubmit();
              }}
            >
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}

export default AddProvider;
