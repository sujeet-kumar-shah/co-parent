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
import { Check, X, Eye, ArrowLeft, Trash2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate, Link } from 'react-router-dom'
import { getApiUrl, getUploadUrl } from '@/config/api';

const AdminListings = () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('submitted'); // Default to pending
    const { token } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        fetchListings();
    }, [token, filter]);

    const fetchListings = async () => {
        setLoading(true);
        try {
            const url = filter === 'all'
                ? getApiUrl('/api/admin/listings')
                : getApiUrl(`/api/admin/listings?status=${filter}`);

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setListings(data);
            }
        } catch (error) {
            console.error('Error fetching listings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            const response = await fetch(getApiUrl(`/api/admin/listings/${id}/status`), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });

            if (response.ok) {
                toast({
                    title: "Success",
                    description: `Listing ${status} successfully.`
                });
                fetchListings(); // Refresh list
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update listing status.",
                variant: "destructive"
            });
        }
    };
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this listing?")) return;

        try {
            const response = await fetch(getApiUrl(`/api/vendor/listings/${id}`), {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setListings(listings.filter(l => l._id !== id));
                toast({
                    title: "Success",
                    description: "Listing deleted successfully."
                });
            } else {
                throw new Error('Failed to delete');
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete listing.",
                variant: "destructive"
            });
        }
    };
    const getStatusBadge = (status) => {
        const variants = {
            draft: "secondary",
            submitted: "warning", // Need custom or use outline
            approved: "success",
            rejected: "destructive"
        };

        let className = "";
        if (status === 'approved') className = "bg-green-500 hover:bg-green-600";
        if (status === 'submitted') className = "bg-orange-500 hover:bg-orange-600";

        return <Badge variant={variants[status] || "outline"} className={className}>{status.toUpperCase()}</Badge>;
    };

    const handleBack = () => {
        navigate(-1);
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Manage Listings</h2>
                    <p className="text-muted-foreground">Approve or reject vendor listings.</p>
                </div>
                <Button variant="outline" className="inline-flex items-center gap-2  text-muted-foreground hover:text-foreground mb-6" id="backbutton" onClick={handleBack}>
                    <ArrowLeft className="w-4 h-4" />
                        Back
                </Button>
            </div>

            <Tabs defaultValue="submitted" onValueChange={setFilter} className="w-full">
                <TabsList>
                    <TabsTrigger value="submitted">Pending Approval</TabsTrigger>
                    <TabsTrigger value="approved">Active</TabsTrigger>
                    <TabsTrigger value="rejected">Rejected</TabsTrigger>
                    <TabsTrigger value="all">All Listings</TabsTrigger>
                </TabsList>
            </Tabs>

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Image</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Vendor</TableHead>
                            <TableHead>Contact Number</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8">Loading...</TableCell>
                            </TableRow>
                        ) : listings.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                    No listings found for this filter.
                                </TableCell>
                            </TableRow>
                        ) : (
                            listings.map((listing) => (
                                <TableRow key={listing._id}>
                                    <TableCell className="font-medium"><Link to={`/listing/${listing._id}`}><img src={getUploadUrl(listing.image)} alt="" width="100px" /></Link></TableCell>
                                    <TableCell className="font-medium">
                                        <Link to={`/listing/${listing._id}`}>
                                            <div>{listing.title}</div>
                                            <div className="text-xs text-muted-foreground capitalize">{listing.category}</div>
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        <div>{listing.vendor?.name}</div>
                                        <div className="text-xs text-muted-foreground">{listing.vendor?.businessName}</div>
                                    </TableCell>
                                    <TableCell>{listing.vendor?.phone}</TableCell>
                                    <TableCell>{listing.location.name}</TableCell>
                                    <TableCell>₹{listing.price}</TableCell>
                                    <TableCell>{getStatusBadge(listing.status)}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                            {/* Could add a View Detail Dialog here */}
                                            {listing.status === 'submitted' && (
                                                <>
                                                    <Button
                                                        size="sm"
                                                        className="bg-green-600 hover:bg-green-700"
                                                        onClick={() => handleStatusUpdate(listing._id, 'approved')}
                                                    >
                                                        <Check className="h-4 w-4 mr-1" /> Approve
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => handleStatusUpdate(listing._id, 'rejected')}
                                                    >
                                                        <X className="h-4 w-4 mr-1" /> Reject
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                        {listing.status === 'approved' && (
                                            <div className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    {/* <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => navigate(`/vendor/listings/edit/${listing._id}`)}
                                                >
                                                    <Edit className="h-4 w-4 text-blue-600" />
                                                </Button> */}
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDelete(listing._id)}
                                                    >
                                                        <Trash2 className="h-4 w-4 text-red-600" />
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
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

export default AdminListings;
