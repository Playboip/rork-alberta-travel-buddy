import RegisterScreen from "@/components/auth/RegisterScreen";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { useAuth } from "@/hooks/auth-context";

export default function Register() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  // Redirect to tabs when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/(tabs)");
    }
  }, [isAuthenticated]);

  return (
    <RegisterScreen 
      onSwitchToLogin={() => router.push("/auth/login")}
    />
  );
}
