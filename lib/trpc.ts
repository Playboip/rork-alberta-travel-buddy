import { createTRPCReact } from "@trpc/react-query";
import { httpLink } from "@trpc/client";
import type { AppRouter } from "@/backend/trpc/app-router";
import superjson from "superjson";
import Constants from "expo-constants";
import { Platform } from "react-native";

export const trpc = createTRPCReact<AppRouter>();

const getBaseUrl = (): string => {
  const fromEnv = process.env.EXPO_PUBLIC_RORK_API_BASE_URL;
  if (fromEnv && typeof fromEnv === "string" && fromEnv.length > 0) {
    console.log("[trpc] Using base URL from EXPO_PUBLIC_RORK_API_BASE_URL", fromEnv);
    return fromEnv;
  }

  const fromConfig = (Constants.expoConfig?.extra as Record<string, unknown> | undefined)?.apiBaseUrl as string | undefined;
  if (fromConfig && fromConfig.length > 0) {
    console.log("[trpc] Using base URL from app.config extra.apiBaseUrl", fromConfig);
    return fromConfig;
  }

  if (Platform.OS === "web" && typeof window !== "undefined") {
    console.log("[trpc] Using window.origin as base URL for web", window.location.origin);
    return window.location.origin;
  }

  throw new Error(
    "No API base URL. Set EXPO_PUBLIC_RORK_API_BASE_URL or add extra.apiBaseUrl in app.config.js"
  );
};

export const trpcClient = trpc.createClient({
  links: [
    httpLink({
      url: `${getBaseUrl()}/api/trpc`,
      transformer: superjson,
    }),
  ],
});