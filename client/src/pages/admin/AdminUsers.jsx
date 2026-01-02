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
import { Ban, CheckCircle ,ArrowLeft} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {useNavigate} from 'react-router-dom'

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('student');
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
            const response = await fetch(`http://localhost:5000/api/admin/users?type=${filter}`, {
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
            const response = await fetch(`http://localhost:5000/api/admin/users/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ isActive: newStatus })
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
                    <h2 className="text-3xl font-bold tracking-tight">Manage Users</h2>
                    <p className="text-muted-foreground">View and manage student and vendor accounts.</p>
                </div>
                 <button className="inline-flex items-center gap-2  text-muted-foreground hover:text-foreground mb-6" id="backbutton" onClick={handleBack}>
                        <ArrowLeft className="w-4 h-4" />
                            Back
                 </button>
            </div>

            <Tabs defaultValue="student" onValueChange={setFilter} className="w-full">
                <TabsList>
                    <TabsTrigger value="student">Students</TabsTrigger>
                    <TabsTrigger value="vendor">Vendors</TabsTrigger>
                </TabsList>
            </Tabs>

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Info</TableHead>
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
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        {user.type === 'vendor' ? (
                                            <div className="text-sm text-muted-foreground capitalize">
                                                Business: {user.businessName}
                                            </div>
                                        ) : (
                                            <div className="text-sm text-muted-foreground">
                                                Phone: {user.phone}
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={user.isActive ? "success" : "destructive"} className={user.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                                            {user.isActive ? 'Active' : 'Suspended'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            size="sm"
                                            variant={user.isActive ? "destructive" : "outline"}
                                            onClick={() => handleStatusUpdate(user._id, user.isActive)}
                                        >
                                            {user.isActive ? (
                                                <><Ban className="h-4 w-4 mr-1" /> Suspend</>
                                            ) : (
                                                <><CheckCircle className="h-4 w-4 mr-1" /> Activate</>
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

export default AdminUsers;
