import { Tabs, useRouter } from 'expo-router';
import { useAuth } from '@/context/authContext';
import { useEffect } from 'react';

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
                title: "Attendance"
            }}
            />

        </Tabs>
    )
}