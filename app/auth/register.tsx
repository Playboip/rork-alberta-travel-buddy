import RegisterScreen from "@/components/auth/RegisterScreen";
import { useRouter } from "expo-router";

export default function Register() {
  const router = useRouter();

  return (
    <RegisterScreen 
      onSwitchToLogin={() => router.push("/auth/login")}
    />
  );
}
