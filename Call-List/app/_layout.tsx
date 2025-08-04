import { AuthProvider, useAuth } from "@/context/authContext";
import { Stack, usePathname, useRouter } from "expo-router";
import { useEffect } from "react";

function Protected() {
  const { isLogged, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) return;
    const isInProtectedRoute = pathname?.startsWith("/(tabs)");

    if (!isLogged && isInProtectedRoute) router.replace("/login");
    else if (isLogged && !isInProtectedRoute)
      router.replace("/(tabs)/attendance");
  }, [isLogged, isLoading, pathname]);

  return (
    <Stack screenOptions={{ headerShown: false, statusBarStyle: "dark" }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <Protected />
    </AuthProvider>
  );
}
