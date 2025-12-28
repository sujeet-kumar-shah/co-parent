import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { Users, Building2, CheckCircle, Clock } from 'lucide-react';

const AdminDashboard = () => {
    const { token } = useAuth();
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalVendors: 0,
        activeListings: 0,
        pendingApprovals: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/admin/stats', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setStats(data);
                }
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [token]);

    const statCards = [
        {
            title: 'Total Students',
            value: stats.totalStudents,
            icon: Users,
            color: 'text-blue-600'
        },
        {
            title: 'Total Vendors',
            value: stats.totalVendors,
            icon: Building2,
            color: 'text-purple-600'
        },
        {
            title: 'Active Listings',
            value: stats.activeListings,
            icon: CheckCircle,
            color: 'text-green-600'
        },
        {
            title: 'Pending Approvals',
            value: stats.pendingApprovals,
            icon: Clock,
            color: 'text-orange-600'
        }
    ];

    if (loading) {
        return <div>Loading dashboard...</div>;
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
                <p className="text-muted-foreground">Platform overview and statistics.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {statCards.map((stat, index) => (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboard;
