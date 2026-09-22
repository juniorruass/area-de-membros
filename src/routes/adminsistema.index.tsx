import { createFileRoute, redirect } from "@tanstack/react-router";
import { checkAdminAuth } from "@/api/admin";

export const Route = createFileRoute("/adminsistema/")({
  beforeLoad: async () => {
    const { authenticated } = await checkAdminAuth();
    throw redirect({ to: authenticated ? "/adminsistema/moldes" : "/adminsistema/login" });
  },
});
