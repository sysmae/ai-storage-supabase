import PromptList from "@/components/prompts/PromptList";
import Link from "next/link";

export default function PromptsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">프롬프트 목록</h1>
      <Link href="/prompts/create"> 프롬프트 생성 </Link>
      <PromptList />
    </div>
  );
}
