import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface AIExecutionComponentProps {
  prompt: string;
  input: string;
}

export function AIExecutionComponent({
  prompt,
  input,
}: AIExecutionComponentProps) {
  const [result, setResult] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const executeAI = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/execute-ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, input }),
      });
      const data = await response.json();
      setResult(data.result);
    } catch (error) {
      console.error("Error executing AI:", error);
      setResult("An error occurred while processing your request.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <Button onClick={executeAI} disabled={isLoading}>
        {isLoading ? "Processing..." : "Execute AI"}
      </Button>
      {result && (
        <div className="mt-4">
          <h3 className="text-xl font-bold mb-2">AI Response:</h3>
          <Textarea value={result} readOnly className="w-full h-40" />
        </div>
      )}
    </div>
  );
}
