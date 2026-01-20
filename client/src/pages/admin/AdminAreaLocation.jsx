import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Trash2, X, Edit2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { getApiUrl } from '@/config/api';

const AdminLocation = () => {
    const [areas, setAreas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    // Fetch areas on mount
    useEffect(() => {
        fetchAreas();
    }, []);

    const fetchAreas = async () => {
        setLoading(true);
        try {
            const response = await fetch(getApiUrl('/api/areas'));
            if (response.ok) {
                const data = await response.json();
                setAreas(data);
            }
        } catch (error) {
            console.error('Error fetching areas:', error);
            toast({ title: 'Error', description: response.error, variant: 'destructive' });
        } finally {
            setLoading(false);
        }
    };

    const handleAddArea = async (e) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            toast({ title: 'Error', description: 'Please enter a location name', variant: 'destructive' });
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch(getApiUrl('/api/areas'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: formData.name }),
            });

            if (response.ok) {
                const newArea = await response.json();
                setAreas([...areas, newArea]);
                setFormData({ name: '' });
                setShowModal(false);
                toast({ title: 'Success', description: 'Area location added successfully' });
            } else {
                toast({ title: 'Error', description: 'Failed to add area location', variant: 'destructive' });
            }
        } catch (error) {
            console.error('Error adding area:', error);
            toast({ title: 'Error', description: 'An error occurred', variant: 'destructive' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteArea = async (id) => {
        if (!window.confirm('Are you sure you want to delete this area location?')) return;

        try {
            const response = await fetch(getApiUrl(`/api/areas/${id}`), { method: 'DELETE' });
            if (response.ok) {
                setAreas(areas.filter(a => a._id !== id));
                toast({ title: 'Success', description: 'Area location deleted successfully' });
            } else {
                toast({ title: 'Error', description: 'Failed to delete area location', variant: 'destructive' });
            }
        } catch (error) {
            console.error('Error deleting area:', error);
            toast({ title: 'Error', description: 'An error occurred', variant: 'destructive' });
        }
    };

    const handleBack = () => navigate(-1);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Area Locations</h2>
                    <p className="text-muted-foreground">Manage service areas and locations</p>
                </div>
                <div className="flex gap-4">
                    <Button onClick={() => setShowModal(true)} className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Add Location
                    </Button>
                    <Button variant="outline" onClick={handleBack} className="flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </Button>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-card rounded-2xl shadow-xl max-w-md w-full p-6 border border-border">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold">Add Area Location</h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Form */}
                        <form onSubmit={handleAddArea} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="location-name">Location Name</Label>
                                <Input
                                    id="location-name"
                                    type="text"
                                    placeholder="e.g., Bangalore, Mumbai, Delhi"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ name: e.target.value })}
                                    className="h-10"
                                />
                            </div>

                            {/* Modal Footer */}
                            <div className="flex gap-3 justify-end border-t border-border pt-6">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowModal(false)}
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="min-w-[120px]"
                                >
                                    {isSubmitting ? 'Adding...' : 'Add Location'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-secondary/50">
                        <TableHead className="font-semibold">Number</TableHead>
                            <TableHead className="font-semibold">Location Name</TableHead>
                            <TableHead className="text-right font-semibold">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan="2" className="text-center py-8 text-muted-foreground">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : areas.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan="2" className="text-center py-8 text-muted-foreground">
                                    No area locations added yet. Click "Add Location" to create one.
                                </TableCell>
                            </TableRow>
                        ) : (
                            areas.map((area, index) => (
                                <TableRow key={area._id} className="hover:bg-secondary/30 transition-colors">
                                    <TableCell className="font-medium">
                                        <span className="text-sm text-muted-foreground mr-3 font-semibold">{index + 1}</span>
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {area.name}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDeleteArea(area._id)}
                                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                            >
                                                <Trash2 className="w-4 h-4" />
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

export default AdminLocation;

