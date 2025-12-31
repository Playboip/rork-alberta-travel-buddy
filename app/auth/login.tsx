import LoginScreen from "@/components/auth/LoginScreen";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { useAuth } from "@/hooks/auth-context";

export default function Login() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  // Redirect to tabs when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/(tabs)");
    }
  }, [isAuthenticated]);

  return (
    <LoginScreen 
      onSwitchToRegister={() => router.push("/auth/register")}
    />
  );
}
