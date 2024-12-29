"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

const supabase = createClient();

interface Prompt {
  id: string;
  title: string;
  content: string;
  category: string;
}

function truncateContent(content: string, maxLength: number) {
  if (content.length > maxLength) {
    return content.slice(0, maxLength - 3) + "...";
  }
  return content;
}

export default function PromptList() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);

  useEffect(() => {
    async function fetchPrompts() {
      const { data, error } = await supabase
        .from("prompts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching prompts:", error);
      } else {
        setPrompts(data || []);
      }
    }

    fetchPrompts();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {prompts.map((prompt) => (
        <Link href={`/prompts/${prompt.id}`} key={prompt.id}>
          <div className="bg-white shadow-md rounded-lg p-6 flex flex-col h-full cursor-pointer hover:shadow-lg transition-shadow duration-200">
            <h2 className="text-xl font-semibold mb-2">{prompt.title}</h2>
            <p className="text-gray-600 mb-4 flex-grow">
              {truncateContent(prompt.content, 100)}
            </p>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
              {prompt.category}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
