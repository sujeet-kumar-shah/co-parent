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
import { ArrowLeft, Plus, Trash2, X, Edit2, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { getApiUrl } from '@/config/api';
import { useAuth } from '@/context/AuthContext';

const AdminSchools = () => {
    const getImageSrc = (imageUrl) => {
        if (!imageUrl) return null;
        if (imageUrl.startsWith('http') || imageUrl.startsWith('blob') || imageUrl.startsWith('data:')) {
            return imageUrl;
        }
        return getApiUrl(`/uploads/${imageUrl}`);
    };
    const [schools, setSchools] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        board: '',
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
        fetchSchools();
    }, []);

    const fetchSchools = async () => {
        setLoading(true);
        try {
            const response = await fetch(getApiUrl('/api/admin/schools'), {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setSchools(data);
            }
        } catch (error) {
            console.error('Error fetching schools:', error);
            toast({ title: 'Error', description: 'Failed to fetch schools', variant: 'destructive' });
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (school = null) => {
        setSelectedFile(null);
        if (school) {
            setEditingId(school._id);
            setFormData({
                name: school.name,
                board: school.board,
                description: school.description,
                imageUrl: school.imageUrl,
                isActive: school.isActive
            });
        } else {
            setEditingId(null);
            setFormData({
                name: '',
                board: '',
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
        if (!formData.name.trim() || !formData.board.trim() || !formData.description.trim()) {
            toast({ title: 'Error', description: 'Please fill all required fields', variant: 'destructive' });
            return;
        }

        setIsSubmitting(true);
        try {
            const url = editingId
                ? getApiUrl(`/api/admin/schools/${editingId}`)
                : getApiUrl('/api/admin/schools');

            const bodyFormData = new FormData();
            bodyFormData.append('name', formData.name);
            bodyFormData.append('board', formData.board);
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
                toast({ title: 'Success', description: `School ${editingId ? 'updated' : 'added'} successfully` });
                setShowModal(false);
                fetchSchools();
            } else {
                const errorData = await response.json();
                toast({ title: 'Error', description: errorData.message || 'Action failed', variant: 'destructive' });
            }
        } catch (error) {
            console.error('Error saving school:', error);
            toast({ title: 'Error', description: 'An error occurred', variant: 'destructive' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this school?')) return;

        try {
            const response = await fetch(getApiUrl(`/api/admin/schools/${id}`), {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                setSchools(schools.filter(m => m._id !== id));
                toast({ title: 'Success', description: 'School deleted successfully' });
            } else {
                toast({ title: 'Error', description: 'Failed to delete school', variant: 'destructive' });
            }
        } catch (error) {
            console.error('Error deleting school:', error);
            toast({ title: 'Error', description: 'An error occurred', variant: 'destructive' });
        }
    };

    const toggleStatus = async (school) => {
        try {
            const response = await fetch(getApiUrl(`/api/admin/schools/${school._id}`), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ isActive: !school.isActive }),
            });

            if (response.ok) {
                fetchSchools();
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
                    <h2 className="text-3xl font-bold tracking-tight">Manage Schools</h2>
                    <p className="text-muted-foreground">Add and manage schools for admission support</p>
                </div>
                <div className="flex gap-4">
                    <Button onClick={() => handleOpenModal()} className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Add School
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
                            <h3 className="text-xl font-bold">{editingId ? 'Edit' : 'Add'} School</h3>
                            <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="school-name">School Name</Label>
                                    <Input
                                        id="school-name"
                                        placeholder="e.g. KV Kota"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="school-board">Board / Affiliation</Label>
                                    <Input
                                        id="school-board"
                                        placeholder="e.g. CBSE, ICSE, RBSE"
                                        value={formData.board}
                                        onChange={(e) => setFormData({ ...formData, board: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="school-image">School Image</Label>
                                <Input
                                    id="school-image"
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
                                <Label htmlFor="school-description">Description</Label>
                                <Textarea
                                    id="school-description"
                                    placeholder="School description, facilities, etc."
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
                                    {isSubmitting ? 'Saving...' : (editingId ? 'Update' : 'Add School')}
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
                            <TableHead>School</TableHead>
                            <TableHead>Board</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan="5" className="text-center py-8">Loading...</TableCell>
                            </TableRow>
                        ) : schools.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan="5" className="text-center py-8 text-muted-foreground">
                                    No schools added yet.
                                </TableCell>
                            </TableRow>
                        ) : (
                            schools.map((school, index) => (
                                <TableRow key={school._id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border">
                                                {school.imageUrl ? (
                                                    <img src={getImageSrc(school.imageUrl)} alt={school.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <BookOpen className="w-5 h-5 text-primary" />
                                                )}
                                            </div>
                                            <span className="font-semibold">{school.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{school.board}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={school.isActive ? 'success' : 'secondary'}
                                            className={school.isActive ? "bg-green-100 text-green-800 cursor-pointer" : "bg-gray-100 text-gray-800 cursor-pointer"}
                                            onClick={() => toggleStatus(school)}
                                        >
                                            {school.isActive ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="sm" onClick={() => handleOpenModal(school)}>
                                                <Edit2 className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={() => handleDelete(school._id)} className="text-destructive">
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

export default AdminSchools;
