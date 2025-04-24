import { FilePlus } from "lucide-react";

export default function ClaimEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="border border-[var(--foreground)] p-4 mb-4">
        <FilePlus className="h-10 w-10" />
      </div>
      <h3 className="text-lg font-medium">No Claims yet</h3>
      <p className="text-muted-foreground mt-2 max-w-md">
        You have not claimed any product in your account yet.
      </p>
    </div>
  );
}
