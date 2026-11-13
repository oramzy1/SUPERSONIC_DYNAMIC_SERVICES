import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_user/reset-password")({
  validateSearch: (search: Record<string, unknown>) => ({
    token: typeof search.token === "string" ? search.token : "",
  }),
  beforeLoad: ({ search }) => {
    throw redirect({
      to: "/setnewpassword",
      search: { token: search.token },
      replace: true,
    });
  },
});
