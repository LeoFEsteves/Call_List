import { Tabs } from 'expo-router';

export default function TabsLayout() {
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