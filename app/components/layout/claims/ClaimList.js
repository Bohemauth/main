"use client";

import { Input } from "@heroui/react";
import { useState } from "react";
import { Search } from "lucide-react";
import { useSelector } from "react-redux";
import ClaimEmpty from "./ClaimEmpty";
import Claims from "./Claims";

export default function ClaimList() {
  const [search, setSearch] = useState("");
  const claims = useSelector((state) => state.user.claims);
  return (
    <main className="container mx-auto py-7">
      <div className="flex w-full justify-between gap-2">
        <Input
          variant="outline"
          placeholder="Search Claims"
          className="w-[350px] shadow-none border-[var(--foreground)] border rounded-none"
          startContent={<Search className="h-4 w-4 opacity-50" />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {claims.length === 0 && <ClaimEmpty />}
      {claims.length > 0 && (
        <Claims claims={claims} search={search} setSearch={setSearch} />
      )}
    </main>
  );
}
