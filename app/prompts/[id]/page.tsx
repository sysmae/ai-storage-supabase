"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Prompt {
  id: string;
  title: string;
  content: string;
  category: string;
}

const supabase = createClient();

export default function PromptDetail() {
  const [prompt, setPrompt] = useState<Prompt | null>(null);
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
      }
    }

    fetchPrompt();
  }, [id]);

  const copyToClipboard = () => {
    if (prompt) {
      navigator.clipboard.writeText(prompt.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
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
      <div className="bg-white shadow-md rounded-lg p-6 mb-4">
        <p className="text-gray-700 whitespace-pre-wrap">{prompt.content}</p>
      </div>
      <button
        onClick={copyToClipboard}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        {copied ? "Copied!" : "Copy to Clipboard"}
      </button>
      <Link href="/prompts">back to prompts</Link>
    </div>
  );
}
