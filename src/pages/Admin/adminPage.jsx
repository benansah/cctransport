import { useState, useEffect } from "react";
import { supabase } from "../../api/supabase-client";
import { useNavigate, Link } from "react-router-dom";


export default function AdminPage () {

    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigate("/admin/login");
            } else {
                setUser(user);
            }
        };
        checkUser();

        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            if (!session) {
                navigate("/admin/login");
            } else {
                setUser(session.user);
            }
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, [navigate]);

    if (!user) {
        return <div>Loading...</div>;
    }

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate("/admin/login");
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-6">Admin Dashboard</h1>
                <div className="grid grid-cols-1 gap-4 space-x-4 m-4">
                    <Link to="/admin/bookings" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 w-full">View Bookings</Link>
                    <Link to="/admin/settings" className="bg-green-500 text-white p-2 rounded hover:bg-green-600 w-full">Settings</Link>
                    <Link to="/admin/analytics" className="bg-purple-500 text-white p-2 rounded hover:bg-purple-600 w-full">Analytics</Link>
                </div>
                <button onClick={handleLogout} className="bg-red-500 text-white p-2 rounded hover:bg-red-600 mt-4">
                    Logout
                </button>
            </div>
        </div>
    );
}