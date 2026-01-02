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
import { Edit, Trash2, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const VendorListings = () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    useEffect(() => {
        fetchListings();
    }, [token]);

    const fetchListings = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/vendor/listings', {
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
            toast({
                title: "Error",
                description: "Failed to load listings.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this listing?")) return;

        try {
            const response = await fetch(`http://localhost:5000/api/vendor/listings/${id}`, {
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
            submitted: "default", // Blue-ish usually
            approved: "success", // We might not have success, fallback to green styling or default
            rejected: "destructive"
        };
        // Use custom styling for success as default badge might not have it
        let className = "";
        if (status === 'approved') className = "bg-green-500 hover:bg-green-600";

        return <Badge variant={variants[status] || "outline"} className={className}>{status.toUpperCase()}</Badge>;
    };

    if (loading) return <div>Loading listings...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">My Listings</h2>
                    <p className="text-muted-foreground">Manage your properties and check their status.</p>
                </div>
                <Button onClick={() => navigate('/vendor/listings/add')}>
                    <Plus className="mr-2 h-4 w-4" /> Add New Listing
                </Button>
            </div>

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Image</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Views</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {listings.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                    No listings found. Create your first listing!
                                </TableCell>
                            </TableRow>
                        ) : (
                            listings.map((listing) => (
                                <TableRow key={listing._id}>
                                     <TableCell className="font-medium"><img src={`http://localhost:5000/uploads/${listing.image}`} alt="" width= "100px" /></TableCell>
                                    <TableCell className="font-medium">{listing.title}</TableCell>
                                    <TableCell className="capitalize">{listing.category}</TableCell>
                                    <TableCell>{listing.city}</TableCell>
                                    <TableCell>₹{listing.price}</TableCell>
                                    <TableCell>{getStatusBadge(listing.status)}</TableCell>
                                    <TableCell>{listing.views}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => navigate(`/vendor/listings/edit/${listing._id}`)}
                                            >
                                                <Edit className="h-4 w-4 text-blue-600" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(listing._id)}
                                            >
                                                <Trash2 className="h-4 w-4 text-red-600" />
                                            </Button>
                                        </div>
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

export default VendorListings;
