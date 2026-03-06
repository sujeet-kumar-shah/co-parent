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
import { ArrowLeft, Plus, Trash2, X, Edit2, Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { getApiUrl } from '@/config/api';
import { useAuth } from '@/context/AuthContext';

const AdminCounselingOptions = () => {
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ name: '', value: '', isActive: true });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();
    const { token } = useAuth();

    useEffect(() => {
        fetchOptions();
    }, []);

    const fetchOptions = async () => {
        setLoading(true);
        try {
            const response = await fetch(getApiUrl('/api/admin/counseling-options'), {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setOptions(data);
            }
        } catch (error) {
            console.error('Error fetching options:', error);
            toast({ title: 'Error', description: 'Failed to fetch options', variant: 'destructive' });
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (option = null) => {
        if (option) {
            setEditingId(option._id);
            setFormData({ name: option.name, value: option.value, isActive: option.isActive });
        } else {
            setEditingId(null);
            setFormData({ name: '', value: '', isActive: true });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim() || !formData.value.trim()) {
            toast({ title: 'Error', description: 'Please fill all required fields', variant: 'destructive' });
            return;
        }

        setIsSubmitting(true);
        try {
            const url = editingId
                ? getApiUrl(`/api/admin/counseling-options/${editingId}`)
                : getApiUrl('/api/admin/counseling-options');

            const response = await fetch(url, {
                method: editingId ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                toast({ title: 'Success', description: `Option ${editingId ? 'updated' : 'added'} successfully` });
                setShowModal(false);
                fetchOptions();
            } else {
                const errorData = await response.json();
                toast({ title: 'Error', description: errorData.message || 'Action failed', variant: 'destructive' });
            }
        } catch (error) {
            console.error('Error saving option:', error);
            toast({ title: 'Error', description: 'An error occurred', variant: 'destructive' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this option?')) return;

        try {
            const response = await fetch(getApiUrl(`/api/admin/counseling-options/${id}`), {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                setOptions(options.filter(o => o._id !== id));
                toast({ title: 'Success', description: 'Option deleted successfully' });
            } else {
                toast({ title: 'Error', description: 'Failed to delete option', variant: 'destructive' });
            }
        } catch (error) {
            console.error('Error deleting option:', error);
            toast({ title: 'Error', description: 'An error occurred', variant: 'destructive' });
        }
    };

    const toggleStatus = async (option) => {
        try {
            const response = await fetch(getApiUrl(`/api/admin/counseling-options/${option._id}`), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ isActive: !option.isActive }),
            });

            if (response.ok) {
                fetchOptions();
            }
        } catch (error) {
            console.error('Error toggling status:', error);
        }
    };

    const handleBack = () => navigate(-1);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Counseling Options</h2>
                    <p className="text-muted-foreground">Manage categories for the counseling form (e.g., JEE, NEET)</p>
                </div>
                <div className="flex gap-4">
                    <Button onClick={() => handleOpenModal()} className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Add Category
                    </Button>
                    <Button variant="outline" onClick={handleBack} className="flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </Button>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-card rounded-2xl shadow-xl max-w-md w-full p-6 border border-border">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold">{editingId ? 'Edit' : 'Add'} Counseling Category</h3>
                            <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="option-name">Display Name</Label>
                                    <Input
                                        id="option-name"
                                        placeholder="e.g., JEE Mains"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="h-10"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="option-value">Value (slug)</Label>
                                    <Input
                                        id="option-value"
                                        placeholder="e.g., jee"
                                        value={formData.value}
                                        onChange={(e) => setFormData({ ...formData, value: e.target.value.toLowerCase() })}
                                        className="h-10"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 justify-end border-t border-border pt-6">
                                <Button type="button" variant="outline" onClick={() => setShowModal(false)} disabled={isSubmitting}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
                                    {isSubmitting ? 'Saving...' : (editingId ? 'Update' : 'Add Category')}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="rounded-lg border bg-card shadow-sm overflow-hidden bg-white">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-white">
                            <TableHead className="w-[50px]">No.</TableHead>
                            <TableHead>Category Name</TableHead>
                            <TableHead>Value</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan="5" className="text-center py-8">Loading...</TableCell>
                            </TableRow>
                        ) : options.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan="5" className="text-center py-8 text-muted-foreground">
                                    No categories added yet.
                                </TableCell>
                            </TableRow>
                        ) : (
                            options.map((option, index) => (
                                <TableRow key={option._id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell className="font-semibold">{option.name}</TableCell>
                                    <TableCell className="text-sm font-mono">{option.value}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={option.isActive ? 'success' : 'secondary'}
                                            className={option.isActive ? "bg-green-100 text-green-800 cursor-pointer" : "bg-gray-100 text-gray-800 cursor-pointer"}
                                            onClick={() => toggleStatus(option)}
                                        >
                                            {option.isActive ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="sm" onClick={() => handleOpenModal(option)}>
                                                <Edit2 className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={() => handleDelete(option._id)} className="text-destructive">
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

export default AdminCounselingOptions;
