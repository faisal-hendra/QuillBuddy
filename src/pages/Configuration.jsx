import { Button } from "@/components/ui/button";
import React from "react";
import { Link } from "react-router-dom";

function Configuration() {
  return (
    <div className="h-8">
      <h1>This will be our configuration page</h1>
      <Link to={"/"}>
        <Button>Back to main page</Button>
      </Link>
    </div>
  );
}

export default Configuration;
