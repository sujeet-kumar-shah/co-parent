import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Loader2,ArrowLeft } from 'lucide-react';

const ListingForm = () => {
    const { id } = useParams();
    const isEditMode = !!id;
    const navigate = useNavigate();
    const { token } = useAuth();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEditMode);
    const [mainImage, setMainImage] = useState(null);
    const [otherImages, setOtherImages] = useState([]);
    const [mainPreview, setMainPreview] = useState('');
    const [otherPreviews, setOtherPreviews] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'hostel',
        gender: 'unisex',
        price: '0',
        city: '',
        location: '', // General area
        street: '', // Address street
        image: '', // Main image URL
        images: '', // Comma separated for now
        videos: '', // Comma separated
        amenities: '', // Comma separated
        status: 'draft'
    });

    useEffect(() => {
        if (isEditMode) {
            const fetchListing = async () => {
                try {
                    // We can reuse the public get single listing or needed a vendor specific one
                    // Public one works for reading data.
                    const response = await fetch(`http://localhost:5000/api/listings/${id}`);
                    if (response.ok) {
                        const data = await response.json();
                        setFormData({
                            title: data.title,
                            description: data.description || '',
                            category: data.category,
                            gender: data.gender,
                            price: data.price,
                            city: data.city,
                            location: data.location,
                            street: data.address?.street || '',
                            image: data.image,
                            images: data.images ? data.images.join(', ') : '',
                            videos: data.videos ? data.videos.join(', ') : '',
                            amenities: data.amenities ? data.amenities.join(', ') : '',
                            status: data.status
                        });
                    }
                } catch (error) {
                    console.error("Failed to fetch listing", error);
                } finally {
                    setFetching(false);
                }
            };
            fetchListing();
        }
    }, [id, isEditMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    const preventNegativeNumber = (e) => {
         if (['e', 'E', '+', '-'].includes(e.key)) {
            e.preventDefault();
        }
    }
    const handleSubmit = async (e, statusOverride = null) => {
        e.preventDefault();

        if (!token) {
            toast({
                title: "Error",
                description: "You must be logged in to submit a listing.",
                variant: "destructive"
            });
            return;
        }

        setLoading(true);

        const status = statusOverride || formData.status;

      const form = new FormData();

        form.append('title', formData.title);
        form.append('description', formData.description);
        form.append('category', formData.category);
        form.append('gender', formData.gender);
        form.append('price', Number(formData.price));
        form.append('city', formData.city);
        form.append('location', formData.location);
        form.append('status', statusOverride || formData.status);

        // arrays
        form.append('videos', JSON.stringify(
        formData.videos.split(',').map(v => v.trim()).filter(Boolean)
        ));

        form.append('amenities', JSON.stringify(
        formData.amenities.split(',').map(a => a.trim()).filter(Boolean)
        ));

        form.append('address', JSON.stringify({
        street: formData.street,
        }));

        // files
        if (mainImage) form.append('image', mainImage);
        otherImages.forEach(file => form.append('images', file));


        try {
            const url = isEditMode
                ? `http://localhost:5000/api/vendor/listings/${id}`
                : `http://localhost:5000/api/listings`; // NOTE: POST was in original listings.js, need to make sure auth matches headers

            // Note: Currently POST /api/listings is protected but uses req.body directly. 
            // We might want to use the vendor specific PUT for updates. 
            // For CREATE, we can use the existing POST endpoint, but I need to make sure it supports all new fields.
            // Wait, existing POST endpoint in listings.js only supported limited fields.
            // I should have updated Create Listing in listings.js or added POST to vendor.js.
            // I'll assume for now I should use a new POST in vendor.js or update listings.js. 
            // Actually, I'll update the POST in listings.js via separate tool call if needed, OR just add POST to vendor.js now (cleaner).
            // Retrospective: I didn't add POST to vendor.js. I'll add it now or use PUT for create if I make ID optional? No.
            // Let's use the existing POST /api/listings and I will update it in a moment to support all fields.

            // Actually, best to use /api/vendor/listings for create as well to keep it consistent.
            // But I didn't implement POST in vendor.js.
            // I will use /api/listings for create, but I MUST update it to accept new fields (description, etc.)

            const method = isEditMode ? 'PUT' : 'POST';
            const finalUrl = isEditMode ? url : 'http://localhost:5000/api/vendor/listings';
            // WAIT - I need to add POST to vendor routes if I want to use it there.
            // I'll stick to updating existing POST /api/listings to keep things simple as it's already there.

            const reqUrl = isEditMode ? `http://localhost:5000/api/vendor/listings/${id}` : `http://localhost:5000/api/listings`;

            const response = await fetch(reqUrl, {
                method: method,
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: form
            });

            if (response.ok) {
                toast({
                    title: "Success",
                    description: `Listing ${status === 'submitted' ? 'submitted' : 'saved'} successfully.`
                });
                navigate('/vendor/listings');
            } else {
                const err = await response.json();
                throw new Error(err.message || 'Failed to save');
            }
        } catch (error) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };
//    const {addreshDropdown,setAddressDropdown } = useState('')
    // const handleChangeLocation = (e) =>{
    //     const { name, value } = e.target;
    //     setFormData(prev => ({ ...prev, [name]: value }));
    //     getLocation(e)
    // }
// 
    // const getLocation = (e) =>{
    //   const query = e.target.value;
    //   if (query.length < 2) {
    //       return;
    //   }

    //    fetch(`https://us1.locationiq.com/v1/autocomplete?key=pk.560cd22f136c354bbff2b87d1ea17e3b&q=${encodeURIComponent(query)}&format=json`)
    //     .then(res => res.json())
    //     .then(res => console.log(res))
    //     .catch(err => console.error(err));
        // }
    const handleBack = () => {
        navigate(-1); 
    }
    const mainImagePreview = (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
         setMainImage(file);
        // Simple preview using FileReader -> data URL, and store in formData.profileImage
        const reader = new FileReader();
        reader.onloadend = () => {
            setMainPreview(reader.result);
        };
        reader.readAsDataURL(file);
    }
    const handleOtherImages = async (e) => {
        const files = Array.from(e.target.files || []);
        setOtherImages(files);

        const toDataUrl = (file) => new Promise((res, rej) => {
            const reader = new FileReader();
            reader.onloadend = () => res(reader.result);
            reader.onerror = rej;
            reader.readAsDataURL(file);
        });

        try {
            const previews = await Promise.all(files.map(f => toDataUrl(f)));
            setOtherPreviews(previews);
        } catch (err) {
            console.error('Failed to read other images', err);
        }
    };

    if (fetching) return <div>Loading...</div>;

    return (
        <div className=" mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">
                    {isEditMode ? 'Edit Listing' : 'Add New Listing'}
                </h2>
                <div className="flex gap-2 ">
                    <Button variant="outline" className="hidden" onClick={() => navigate('/vendor/listings')}>
                        Cancel
                    </Button>
                    <button className="inline-flex items-center gap-2  text-muted-foreground hover:text-foreground mb-6" id="backbutton" onClick={handleBack}>
                        <ArrowLeft className="w-4 h-4" />
                            Back
                    </button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Listing Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={(e) => handleSubmit(e, 'submitted')} className="space-y-6" encType="multipart/form-data">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input id="title" name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. Sunrise Boys Hostel" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" name="description" value={formData.description} onChange={handleChange} required placeholder="Describe the property..." />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <select
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="hostel">Hostel</option>
                                    <option value="pg">PG</option>
                                    {/* <option value="coaching">Coaching</option> */}
                                    <option value="library">Library</option>
                                    <option value="mess">Mess</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="gender">Gender</Label>
                                <select
                                    id="gender"
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="unisex">Unisex / Co-ed</option>
                                    <option value="boys">Boys Only</option>
                                    <option value="girls">Girls Only</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="price">Monthly Price (₹)</Label>
                                <Input id="price" name="price" min="0" type="number" value={formData.price} onChange={handleChange} onKeyDown={preventNegativeNumber} required />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Location</Label>
                            <Input name="street" value={formData.street} onChange={handleChange} placeholder="Full Street Address" className="mt-2" />
                            <div className="grid grid-cols-2 gap-4">
                                <Input name="city" value={formData.city} onChange={handleChange} placeholder="City" required />
                                <Input name="location" value={formData.location} onChange={handleChange} placeholder="Area / Locality" required />
                            </div>
                           
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="image">Main Image</Label>
                            <Input id="image" name="image" type="file" onChange={mainImagePreview} required={!isEditMode} placeholder="Image" />
                            <div className="mt-2">
                                {mainPreview ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={mainPreview} alt="Main preview" className="w-48 h-32 object-fit rounded-md" id="previewImage" />
                                ) : null}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="images">Additional Images</Label>
                            <Input id="images" name="images" type="file" multiple onChange={handleOtherImages} placeholder="" />
                            <div className="mt-2 flex flex-wrap gap-2">
                                {otherPreviews.map((p, idx) => (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img key={idx} src={p} alt={`preview-${idx}`} className="w-28 h-20 object-fit rounded-md" />
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="videos">Video URLs (Comma separated)</Label>
                            <Textarea id="videos" name="videos" value={formData.videos} onChange={handleChange} placeholder="https://youtube.com/..." />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="amenities">Amenities (Comma separated)</Label>
                            <Textarea id="amenities" name="amenities" value={formData.amenities} onChange={handleChange} placeholder="Wifi, AC, Laundry..." />
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Button
                                type="button"
                                variant="secondary"
                                className="w-full hidden"
                                disabled={loading}
                                onClick={(e) => handleSubmit(e, 'draft')}
                            >
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save as Draft
                            </Button>
                            <Button variant="outline"  className="w-full " onClick={() => navigate('/vendor/listings')}>
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={loading}
                            >
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Submit Listing
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default ListingForm;
