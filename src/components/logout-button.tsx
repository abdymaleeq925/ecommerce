"use client";

import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();

  const logout = useMutation(
    trpc.auth.logout.mutationOptions({
      onError: (error) => {
        toast.error(error.message);
      },
      onSuccess: async () => {
        toast.success("Logged out successfully");
        await queryClient.invalidateQueries(trpc.auth.session.queryFilter());
        router.push("/");
      },
    }),
  );

  return (
    <Button
      onClick={() => logout.mutate()}
      disabled={logout.isPending}
      className="hover:bg-pink-400 hover:text-black"
    >
      {logout.isPending ? "Logging out" : "Sign Out"}
    </Button>
  );
}
