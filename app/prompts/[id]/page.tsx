"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AIExecutionComponent } from "@/components/prompts/AIExecutionComponent";

interface Prompt {
  id: string;
  title: string;
  content: string;
  category: string;
}

const supabase = createClient();

export default function PromptDetail() {
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [editedPrompt, setEditedPrompt] = useState("");
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    async function fetchPrompt() {
      const { data, error } = await supabase
        .from("prompts")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching prompt:", error);
      } else {
        setPrompt(data);
        setEditedPrompt(data.content);
      }
    }

    fetchPrompt();
  }, [id]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePromptEdit = (content: string) => {
    setEditedPrompt(content);
  };

  if (!prompt) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{prompt.title}</h1>
      <span className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded mb-4 inline-block">
        {prompt.category}
      </span>
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Edit Prompt:</h2>
        <Textarea
          value={editedPrompt}
          onChange={(e) => handlePromptEdit(e.target.value)}
          className="w-full h-40 mb-4"
        />
        <Button onClick={() => copyToClipboard(editedPrompt)}>
          {copied ? "Copied!" : "Copy Prompt"}
        </Button>
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Input:</h2>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-20 mb-4"
        />
      </div>
      <AIExecutionComponent prompt={editedPrompt} input={input} />
      <Link
        href="/prompts"
        className="mt-4 inline-block text-blue-500 hover:underline"
      >
        Back to prompts
      </Link>
    </div>
  );
}
