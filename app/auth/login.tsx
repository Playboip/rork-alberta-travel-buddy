import LoginScreen from "@/components/auth/LoginScreen";
import { useRouter } from "expo-router";

export default function Login() {
  const router = useRouter();

  return (
    <LoginScreen 
      onSwitchToRegister={() => router.push("/auth/register")}
    />
  );
}
