import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { getApiUrl } from '@/config/api';

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
    const [areas, setAreas] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'hostel',
        gender: 'unisex',
        price: '0',
        city: 'new',
        location: '', // General area
        street: 'new', // Address street
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
                    const response = await fetch(getApiUrl(`/api/listings/${id}`));
                    if (response.ok) {
                        const data = await response.json();
                        setFormData({
                            title: data.listing.title,
                            description: data.listing.description || '',
                            category: data.listing.category,
                            gender: data.listing.gender,
                            price: data.listing.price,
                            city: data.listing.city,
                            location: data.listing.location,
                            street: data.listing.address?.street || '',
                            // image: data.listing.image,
                            // images: data.listing.images ? data.listing.images.join(', ') : '',
                            videos: data.listing.videos ? data.listing.videos.join(', ') : '',
                            amenities: data.listing.amenities ? data.listing.amenities.join(', ') : '',
                            status: data.listing.status
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

        // Validation
        if (!formData.location) {
            toast({
                title: "Validation Error",
                description: "Please select an Area / Locality",
                variant: "destructive"
            });
            setLoading(false);
            return;
        }

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

        form.append('street', formData.street,);

        // files
        if (mainImage) form.append('image', mainImage);
        otherImages.forEach(file => form.append('images', file));


        try {
            const url = isEditMode
                ? getApiUrl(`/api/vendor/listings/${id}`)
                : getApiUrl('/api/listings'); // NOTE: POST was in original listings.js, need to make sure auth matches headers

            const method = isEditMode ? 'PUT' : 'POST';
            const finalUrl = isEditMode ? url : getApiUrl('/api/vendor/listings');
            const reqUrl = isEditMode ? getApiUrl(`/api/vendor/listings/${id}`) : getApiUrl('/api/listings');

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

    const [selected, setSelected] = useState("");
    const [rows, setRows] = useState([]);

    const handleSelect = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        setSelected(e.target.value);
        setRows([{ field1: "", field2: "" }]); // add first row
    };

    const addRow = () => {
        setRows([...rows, { field1: "", field2: "" }]);
    };

    const removeRow = (index) => {
        setRows(rows.filter((_, i) => i !== index));
    };

    const handleRowChange = (index, name, value) => {
        const updated = [...rows];
        updated[index][name] = value;
        setRows(updated);
    };


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
                    <Button variant="outline" className="inline-flex items-center gap-2  text-muted-foreground hover:text-foreground mb-6" id="backbutton" onClick={handleBack}>
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </Button>
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
                                    onChange={handleSelect}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="hostel">Hostel</option>
                                    <option value="pg">PG</option>
                                    <option value="Flat">Flat</option>
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

                        {/* Dynamic inputs */}
                        {rows.map((row, index) => (
                            <div key={index} className="grid grid-cols-2 gap-4 hidden">
                                <div className="space-y-2">
                                    <Label htmlFor="price"> type </Label>
                                    <Input
                                        type="text"
                                        placeholder="type"
                                        className=""
                                        value={row.field1}
                                        onChange={(e) =>
                                            handleRowChange(index, "field1", e.target.value)
                                        }
                                    />
                                </div>
                                <div className="space-y-2  me-5">
                                    <div>
                                        <Label htmlFor="price">Monthly Price (₹)</Label>
                                        <Input
                                            type="text"
                                            placeholder="price"
                                            className=""
                                            onKeyDown={preventNegativeNumber}
                                            value={row.field2}
                                            onChange={(e) =>
                                                handleRowChange(index, "field2", e.target.value)
                                            }

                                        />
                                    </div>
                                    {/* Add / Remove buttons */}
                                    <div>
                                        {index === rows.length - 1 ? (
                                            <button
                                                type="button"
                                                onClick={addRow}
                                                className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                                            >
                                                <Plus size={16} />
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => removeRow(index)}
                                                className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="price">Monthly Price (₹)</Label>
                                <Input id="price" name="price" min="0" type="number" value={formData.price} onChange={handleChange} onKeyDown={preventNegativeNumber} required />
                            </div>
                            <div className='space-y-2'>
                                <label htmlFor="location">Area / Locality</label>
                                <select
                                    name="location"
                                    id="location"
                                    aria-required="true"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                                >
                                    <option value="">Select Area</option>
                                    {
                                        areas && areas.length > 0 ? (
                                            areas.map((area) => (
                                                <option key={area._id} value={area._id}>
                                                    {area.name}
                                                </option>
                                            ))) : (
                                            <option value="">No areas found</option>
                                        )}
                                </select>
                            </div>
                        </div>

                        {/* <div className=""> */}
                        {/* <Label>Location</Label> */}
                        {/* <Input name="location" value={formData.location} onChange={handleChange} placeholder="Full Street Address" className="mt-2" /> */}
                        {/* <div className="grid grid-cols-2 gap-4"> */}
                        {/* <div>
                                    <label htmlFor="city">City</label>
                                    <Input name="city" value={formData.city} onChange={handleChange} placeholder="City" required />
                                </div> */}
                        {/* <div> */}
                        {/* <label htmlFor="street">Area / Locality</label> */}
                        {/* <Input name="street" value={formData.street} onChange={handleChange} placeholder="Area / Locality" required /> */}
                        {/* <select name="location" id="location" className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'>
                                {areas.map((area) => (
                                    <option key={area._id} value={area._id}>
                                        {area.name}
                                    </option>
                                ))}
                            </select> */}


                        {/* </div> */}
                        {/* </div> */}

                        {/* </div> */}

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
                            <Button variant="outline" className="w-full " onClick={() => navigate('/vendor/listings')}>
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
