import { createFileRoute, redirect } from "@tanstack/react-router";
import { checkAdminAuth } from "@/api/admin";

export const Route = createFileRoute("/admin/")({
  beforeLoad: async () => {
    const { authenticated } = await checkAdminAuth();
    throw redirect({ to: authenticated ? "/admin/moldes" : "/admin/login" });
  },
});
