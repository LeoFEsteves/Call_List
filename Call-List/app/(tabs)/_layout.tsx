import { Tabs, useRouter } from 'expo-router';
import { useAuth } from '@/context/authContext';
import { useEffect } from 'react';
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function TabsLayout() {
    const {isLogged,isLoading} = useAuth()
    const router = useRouter()

    useEffect(()=>{
        if(!isLoading&&!isLogged){
            router.replace("/login")
        }
    },[isLoading,isLogged])
    return (
        <Tabs 
        screenOptions={{
            headerShown: false,
            tabBarStyle: {
                backgroundColor: "#F3EDF7",
                paddingTop: 10,
                height: 70
            }
        }}>
            <Tabs.Screen
            name= "attendance"
            options={{
                title: "Attendance",
                tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons 
                            name="archive-outline" 
                            color={color} 
                            size={size ?? 28} 
                        />
                    ),

            }}
            />

            <Tabs.Screen
            name= "account"
            options={{
                title: "Account",
                tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons 
                            name="account" 
                            color={color} 
                            size={size ?? 28} 
                        />
                    ),

            }}
            />

        </Tabs>
    )
}