import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Trash2, X, Edit2, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { getApiUrl } from '@/config/api';
import { useAuth } from '@/context/AuthContext';

const AdminMentors = () => {
    const getImageSrc = (imageUrl) => {
        if (!imageUrl) return null;
        if (imageUrl.startsWith('http') || imageUrl.startsWith('blob') || imageUrl.startsWith('data:')) {
            return imageUrl;
        }
        return getApiUrl(`/uploads/${imageUrl}`);
    };
    const [mentors, setMentors] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        counselingType: '',
        description: '',
        imageUrl: '',
        isActive: true
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();
    const { token } = useAuth();

    useEffect(() => {
        fetchMentors();
        fetchCategories();
    }, []);

    const fetchMentors = async () => {
        setLoading(true);
        try {
            const response = await fetch(getApiUrl('/api/admin/mentors'), {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setMentors(data);
            }
        } catch (error) {
            console.error('Error fetching mentors:', error);
            toast({ title: 'Error', description: 'Failed to fetch mentors', variant: 'destructive' });
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch(getApiUrl('/api/query/counseling-options'));
            if (response.ok) {
                const data = await response.json();
                setCategories(data.data);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleOpenModal = (mentor = null) => {
        setSelectedFile(null);
        if (mentor) {
            setEditingId(mentor._id);
            setFormData({
                name: mentor.name,
                counselingType: mentor.counselingType,
                description: mentor.description,
                imageUrl: mentor.imageUrl,
                isActive: mentor.isActive
            });
        } else {
            setEditingId(null);
            setFormData({
                name: '',
                counselingType: '',
                description: '',
                imageUrl: '',
                isActive: true
            });
        }
        setShowModal(true);
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim() || !formData.counselingType || !formData.description.trim()) {
            toast({ title: 'Error', description: 'Please fill all required fields', variant: 'destructive' });
            return;
        }

        setIsSubmitting(true);
        try {
            const url = editingId
                ? getApiUrl(`/api/admin/mentors/${editingId}`)
                : getApiUrl('/api/admin/mentors');

            const bodyFormData = new FormData();
            bodyFormData.append('name', formData.name);
            bodyFormData.append('counselingType', formData.counselingType);
            bodyFormData.append('description', formData.description);
            bodyFormData.append('isActive', formData.isActive);
            if (selectedFile) {
                bodyFormData.append('image', selectedFile);
            }

            const response = await fetch(url, {
                method: editingId ? 'PUT' : 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: bodyFormData,
            });

            if (response.ok) {
                toast({ title: 'Success', description: `Mentor ${editingId ? 'updated' : 'added'} successfully` });
                setShowModal(false);
                fetchMentors();
            } else {
                const errorData = await response.json();
                toast({ title: 'Error', description: errorData.message || 'Action failed', variant: 'destructive' });
            }
        } catch (error) {
            console.error('Error saving mentor:', error);
            toast({ title: 'Error', description: 'An error occurred', variant: 'destructive' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this mentor?')) return;

        try {
            const response = await fetch(getApiUrl(`/api/admin/mentors/${id}`), {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                setMentors(mentors.filter(m => m._id !== id));
                toast({ title: 'Success', description: 'Mentor deleted successfully' });
            } else {
                toast({ title: 'Error', description: 'Failed to delete mentor', variant: 'destructive' });
            }
        } catch (error) {
            console.error('Error deleting mentor:', error);
            toast({ title: 'Error', description: 'An error occurred', variant: 'destructive' });
        }
    };

    const toggleStatus = async (mentor) => {
        try {
            const response = await fetch(getApiUrl(`/api/admin/mentors/${mentor._id}`), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ isActive: !mentor.isActive }),
            });

            if (response.ok) {
                fetchMentors();
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
                    <h2 className="text-3xl font-bold tracking-tight">Manage Mentors</h2>
                    <p className="text-muted-foreground">Add and manage mentors for students</p>
                </div>
                <div className="flex gap-4">
                    <Button onClick={() => handleOpenModal()} className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Add Mentor
                    </Button>
                    <Button variant="outline" onClick={handleBack} className="flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </Button>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-card rounded-2xl shadow-xl max-w-lg w-full p-6 border border-border">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold">{editingId ? 'Edit' : 'Add'} Mentor</h3>
                            <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="mentor-name">Name</Label>
                                    <Input
                                        id="mentor-name"
                                        placeholder="Mentor Name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="mentor-type">Counseling For</Label>
                                    <select
                                        id="mentor-type"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={formData.counselingType}
                                        onChange={(e) => setFormData({ ...formData, counselingType: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map((cat) => (
                                            <option key={cat._id} value={cat.name}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="mentor-image">Mentor Image</Label>
                                <Input
                                    id="mentor-image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                                {editingId && formData.imageUrl && !selectedFile && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Current image: {formData.imageUrl.substring(0, 30)}...
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="mentor-description">Description</Label>
                                <Textarea
                                    id="mentor-description"
                                    placeholder="Mentor background, achievements, etc."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="min-h-[120px]"
                                    required
                                />
                            </div>

                            <div className="flex gap-3 justify-end border-t border-border pt-6 mt-4">
                                <Button type="button" variant="outline" onClick={() => setShowModal(false)} disabled={isSubmitting}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
                                    {isSubmitting ? 'Saving...' : (editingId ? 'Update' : 'Add Mentor')}
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
                            <TableHead>Mentor</TableHead>
                            <TableHead>Counseling For</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan="5" className="text-center py-8">Loading...</TableCell>
                            </TableRow>
                        ) : mentors.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan="5" className="text-center py-8 text-muted-foreground">
                                    No mentors added yet.
                                </TableCell>
                            </TableRow>
                        ) : (
                            mentors.map((mentor, index) => (
                                <TableRow key={mentor._id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border">
                                                {mentor.imageUrl ? (
                                                    <img src={getImageSrc(mentor.imageUrl)} alt={mentor.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <User className="w-5 h-5 text-primary" />
                                                )}
                                            </div>
                                            <span className="font-semibold">{mentor.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{mentor.counselingType}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={mentor.isActive ? 'success' : 'secondary'}
                                            className={mentor.isActive ? "bg-green-100 text-green-800 cursor-pointer" : "bg-gray-100 text-gray-800 cursor-pointer"}
                                            onClick={() => toggleStatus(mentor)}
                                        >
                                            {mentor.isActive ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="sm" onClick={() => handleOpenModal(mentor)}>
                                                <Edit2 className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={() => handleDelete(mentor._id)} className="text-destructive">
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

export default AdminMentors;
