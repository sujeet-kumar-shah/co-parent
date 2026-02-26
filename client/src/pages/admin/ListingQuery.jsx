import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Ban, CheckCircle, ArrowLeft, PhoneCall } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate, Link } from 'react-router-dom'
import { getApiUrl } from '@/config/api';

const AdminListingQuery = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('pending');
    const { token } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            fetchUsers();
        }
    }, [token, filter]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await fetch(getApiUrl(`/api/admin/listing-query?type=${filter}`), {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, currentStatus) => {
        const newStatus = !currentStatus;
        if (!window.confirm(`Are you sure you want to ${newStatus ? 'activate' : 'suspend'} this user?`)) return;

        try {
            const response = await fetch(getApiUrl(`/api/query/listing-status/${id}`), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                toast({
                    title: "Success",
                    description: `User ${newStatus ? 'activated' : 'suspended'} successfully.`
                });

                // Update local state without refetch
                setUsers(users.map(u => u._id === id ? { ...u, isActive: newStatus } : u));
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update user status.",
                variant: "destructive"
            });
        }
    };

    const handleBack = () => {
        navigate(-1);
    }
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Listing Query</h2>
                    <p className="text-muted-foreground">View and manage students Room related Query.</p>
                </div>
                <Button variant="outline" className="inline-flex items-center gap-2  text-muted-foreground hover:text-foreground mb-6" id="backbutton" onClick={handleBack}>
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </Button>
            </div>

            <Tabs defaultValue="pending" onValueChange={setFilter} className="w-full">
                <TabsList>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="success">Success</TabsTrigger>
                </TabsList>
            </Tabs>

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Property Name</TableHead>
                            <TableHead>message</TableHead>
                            <TableHead>Contact Number</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8">Loading...</TableCell>
                            </TableRow>
                        ) : users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    No users found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((user) => (
                                <TableRow key={user._id}>
                                    <TableCell className="font-medium">{user.name}</TableCell>
                                    <TableCell> <Link to={`/listing/${user.listingId?._id}`} className="hover:text-blue-600 transition-colors">{user.listingId?.title}</Link></TableCell>
                                    <TableCell>{user.message}</TableCell>
                                    <TableCell>

                                        <div className="text-sm text-muted-foreground capitalize">
                                            {user.phone}
                                        </div>

                                    </TableCell>

                                    <TableCell>
                                        <Badge variant={user.status ? "success" : "destructive"} className={user.status ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}>
                                            {user.status ? 'Pending' : 'Success'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            size="sm"
                                            variant={user.status ? "outline" : "outline"}
                                        // onClick={() => handleStatusUpdate(user._id, user.isActive)}
                                        >
                                            {user.status ? (
                                                <><PhoneCall className="h-4 w-4 mr-1" /> <a href="tel:+919057176565" className="hover:text-blue-600 transition-colors">Call</a> </>
                                            ) : (
                                                <><CheckCircle className="h-4 w-4 mr-1" /> </>
                                            )}
                                        </Button>
                                        <Button
                                            className="ml-2"
                                            size="sm"
                                            variant={user.status ? "outline" : "outline"}
                                            onClick={() => handleStatusUpdate(user._id, user.status)}
                                        >
                                            {user.status == "success" ? (
                                                <><CheckCircle className="h-4 w-4 mr-1" />Mark As Pending</>
                                            ) : (
                                                <><CheckCircle className="h-4 w-4 mr-1" /> Mark as Success</>
                                            )}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default AdminListingQuery;
