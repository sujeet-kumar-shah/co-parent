import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { Users, Eye, TrendingUp, Home, Plus, ArrowLeft } from 'lucide-react';
import { getApiUrl } from '@/config/api';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';


const VendorDashboard = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const handleBack = () => navigate(-1);
    const [stats, setStats] = useState({
        totalLeads: 0,
        views: 0,
        conversion: 0,
        activeListings: 0,
        totalListings: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch(getApiUrl('/api/vendor/stats'), {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setStats(data.stats);
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
        // {
        //     title: 'Total Leads',
        //     value: stats.totalLeads,
        //     icon: Users,
        //     description: 'Potential students interested',
        //     color: 'text-blue-600'
        // },
        // {
        //     title: 'Total Views',
        //     value: stats.views,
        //     icon: Eye,
        //     description: 'Across all your listings',
        //     color: 'text-green-600'
        // },
        // {
        //     title: 'Conversion Rate',
        //     value: `${stats.conversion}%`,
        //     icon: TrendingUp,
        //     description: 'Leads per view',
        //     color: 'text-purple-600'
        // },
        {
            title: 'Active Listings',
            value: `${stats.activeListings} / ${stats.totalListings}`,
            icon: Home,
            description: 'Currently live on platform',
            color: 'text-orange-600',
            link: '/vendor/listings'
        }
    ];

    if (loading) {
        return <div>Loading dashboard...</div>;
    }

    return (
        <div className="space-y-8">

            <div className='flex flex-col md:flex-row justify-between md:items-center gap-4'>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                    <p className="text-muted-foreground">Overview of your performance and listings.</p>
                </div>
                <div className='flex gap-4'>
                    <Button onClick={() => navigate('/vendor/listings/add')}>
                        <Plus className="mr-2 h-4 w-4" /> Add New Listing
                    </Button>
                </div>
            </div>


            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {statCards.map((stat, index) => (
                    <Card key={index}>
                        <Link to={stat.link}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {stat.title}
                                </CardTitle>
                                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className="text-xs text-muted-foreground">
                                    {stat.description}
                                </p>
                            </CardContent>
                        </Link>
                    </Card>
                ))}
            </div>

            {/* Future: Recent Leads Table or Charts could go here */}
        </div>
    );
};

export default VendorDashboard;
