import { Button } from "@/components/ui/button";
import React from "react";
import { Link } from "react-router-dom";

function Configuration() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-6">
        <h1>This will be our configuration page</h1>
        <Link to={"/"}>
          <Button>Back to main page</Button>
        </Link>
      </div>
    </div>
  );
}

export default Configuration;
