import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapPin,
  Star,
  Heart,
  Share2,
  Phone,
  MessageCircle,
  Mail,
  Check,
  ChevronLeft,
  ChevronRight,
  Wifi,
  Wind,
  Dumbbell,
  Utensils,
  Car,
  Shield,
  Clock,
  Users,
  Building,
  Navigation,
  Eye,
  Calendar,
  Layers,
  Sparkles,
  Info,
  Play
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { useToast } from "@/hooks/use-toast";
import { getApiUrl, getUploadUrl } from '@/config/api';
// listingData removed

export default function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [queryForm, setQueryForm] = useState({

    name: '',
    phone: '',
    message: '',
  })
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: '',
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setQueryForm(prev => ({ ...prev, [name]: value }));
  };
  // Helper to map features to icons (fallback to Check icon)
  const getIconForFeature = (feature) => {
    const map = {
      "WiFi": Wifi,
      "AC": Wind,
      "Gym": Dumbbell,
      "Meals": Utensils,
      "Parking": Car,
      "Security": Shield,
      "24/7 Access": Clock,
      "Common Area": Users,
      "CCTV": Shield,
      "Warden": Users,
      "Study Hall": Users,
      "Power Backup": Check,
      "Cafeteria": Utensils,
      "Discussion Room": Users,
      "Expert Faculty": Users,
      "Study Material": Check,
      "Mock Tests": Check,
      "test": Check,
      "cooler": Wind
    };
    // Fuzzy match or exact match (case-insensitive)
    const featureLower = feature.toLowerCase();
    const key = Object.keys(map).find(k => featureLower.includes(k.toLowerCase()));
    return key ? map[key] : Check;
  };

  // Helper to safely parse amenities (handles stringified JSON arrays)
  const parseAmenities = (amenitiesData) => {
    if (!amenitiesData) return [];
    if (Array.isArray(amenitiesData)) {
      // If it's an array with a single stringified JSON string, parse it
      if (amenitiesData.length === 1 && typeof amenitiesData[0] === 'string') {
        try {
          return JSON.parse(amenitiesData[0]);
        } catch (e) {
          return amenitiesData;
        }
      }
      return amenitiesData;
    }
    // If it's a string, try to parse it
    if (typeof amenitiesData === 'string') {
      try {
        return JSON.parse(amenitiesData);
      } catch (e) {
        return [amenitiesData];
      }
    }
    return [];
  };

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const url = new URL(getApiUrl(`/api/listings/${id}`));
        if (user?._id) url.searchParams.append('userId', user._id);

        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setListing(data.listing);
          setLiked(data.likedStatus?.status || false);
        } else {
          console.error("Failed to fetch listing");
        }
      } catch (error) {
        console.error("Error fetching listing:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchListing();

    const fetchReviews = async () => {
      try {
        const response = await fetch(getApiUrl(`/api/reviews/listing/${id}`));
        if (response.ok) {
          const data = await response.json();
          setReviews(data);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setReviewsLoading(false);
      }
    };
    fetchReviews();
  }, [id]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login", { state: { from: `/listing/${id}` } });
    }
  }, [isAuthenticated, authLoading, navigate, id]);

  // Moved hooks to the top
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const nextImage = () => {
    if (!listing) return;
    setCurrentImageIndex((prev) =>
      prev === (listing.images ? listing.images.length : 1) - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    if (!listing) return;
    setCurrentImageIndex((prev) =>
      prev === 0 ? (listing.images ? listing.images.length : 1) - 1 : prev - 1
    );
  };
  const handleLike = () => {
    setLiked(!liked)
    axios.post(getApiUrl('/api/listings/like'), {
      propertyId: id,
      liked: liked,
      userId: user._id
    })
      .then(function (responce) {
        console.log(responce)
      })
  }

  const handleQuerySubmit = async (e) => {
    e.preventDefault();

    if (!queryForm.name || !queryForm.phone || !queryForm.message) {
      toast({
        title: "Missing fields",
        description: "Please fill in all fields before sending.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      // Fixed API endpoint typo here
      const response = await axios.post(getApiUrl('/api/query/listing'), {
        listingId: id,
        name: queryForm.name,
        phone: queryForm.phone,
        message: queryForm.message,
        userId: user._id
      });

      if (response.status === 201) {
        setQueryForm({ name: '', phone: '', message: '' });
        toast({
          title: "Inquiry Sent!",
          description: "Your inquiry has been sent successfully. The vendor will contact you soon.",
        });
      }
    } catch (error) {
      console.error('Error sending inquiry:', error);
      toast({
        title: "Error",
        description: "Failed to send inquiry. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewForm.rating || !reviewForm.comment) {
      toast({
        title: "Missing fields",
        description: "Please provide a rating and a comment.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const response = await axios.post(getApiUrl('/api/reviews'), {
        listingId: id,
        rating: reviewForm.rating,
        comment: reviewForm.comment,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("coparents_token")}`
        }
      });

      if (response.status === 201) {
        toast({
          title: "Review Submitted!",
          description: "Thank you for your feedback.",
        });
        setReviewForm({ rating: 5, comment: '' });
        // Refresh reviews and listing data (for new avg rating)
        const [reviewsRes, listingRes] = await Promise.all([
          fetch(getApiUrl(`/api/reviews/listing/${id}`)),
          fetch(getApiUrl(`/api/listings/${id}`))
        ]);
        if (reviewsRes.ok) setReviews(await reviewsRes.json());
        if (listingRes.ok) {
          const data = await listingRes.json();
          setListing(data.listing);
        }
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to submit review.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  }

  if (authLoading) return <div className="min-h-screen pt-20 text-center">Loading...</div>;
  if (!isAuthenticated) return null;
  if (loading) return <div className="min-h-screen pt-20 text-center">Loading listing...</div>;
  if (!listing) return <div className="min-h-screen pt-20 text-center">Listing not found</div>;

  // Combine single image and images array for carousel
  const allImages = [];
  if (listing.image) allImages.push(listing.image);
  if (listing.images && Array.isArray(listing.images)) {
    allImages.push(...listing.images);
  }
  const images = allImages.length > 0 ? allImages : ["https://via.placeholder.com/800x600"];

  // Parse amenities (handles stringified JSON arrays from API)
  const parsedAmenitiesData = listing.amenities ? parseAmenities(listing.amenities) : (listing.features || []);
  const amenities = parsedAmenitiesData.map(f => ({
    Icon: getIconForFeature(f),
    name: typeof f === 'string' ? f.charAt(0).toUpperCase() + f.slice(1) : f
  }));

  // Mock data for missing fields in API
  const mockReviews = [
    {
      id: 1,
      name: "Demo User",
      avatar: "https://github.com/shadcn.png",
      rating: 5,
      date: "1 week ago",
      text: "Great place!"
    }
  ];

  const shareUrl = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "CO-Parents",
          text: "Check this out!",
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share cancelled", err);
      }
    } else {
      console.log("Sharing not supported on this browser");
    }
  };


  const vendorInfo = listing.vendor || { name: "Unknown Vendor", phone: "N/A", verified: false };
  const handleBack = () => {
    navigate(-1);
  }
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20">
        {/* Breadcrumb */}
        <div className="container py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <Link to="/listings" className="hover:text-primary">Listings</Link>
            <span>/</span>
            <span className="text-foreground">{listing.title}</span>
          </div>
          <Button variant="outline" className="inline-flex items-center gap-2  text-muted-foreground hover:text-foreground mb-6" id="backbutton" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>

        {/* Premium Gallery Section */}
        <section className="container mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-4 h-[400px] md:h-[500px] lg:h-[600px]"
          >
            {/* Main Featured Image */}
            <div className="md:col-span-3 lg:col-span-8 relative rounded-2xl overflow-hidden group shadow-lg border border-border/50">
              <motion.img
                key={currentImageIndex}
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6 }}
                src={getUploadUrl(images[currentImageIndex])}
                alt={listing.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0 duration-300">
                <div className="flex gap-2">
                  <button
                    onClick={prevImage}
                    className="w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all shadow-glow"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all shadow-glow"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
                <div className="glass px-4 py-2 rounded-full text-sm font-medium">
                  {currentImageIndex + 1} / {images.length}
                </div>
              </div>

              <div className="absolute top-6 right-6 flex gap-3">
                <button
                  onClick={handleLike}
                  className={`w-12 h-12 rounded-full glass flex items-center justify-center hover:scale-110 transition-all shadow-lg ${liked ? "text-accent" : "text-foreground"}`}
                >
                  <Heart className={`w-5 h-5 ${liked ? "fill-accent" : ""}`} />
                </button>
                <button
                  onClick={shareUrl}
                  className="w-12 h-12 rounded-full glass flex items-center justify-center hover:scale-110 transition-all shadow-lg text-foreground"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Side Grid Thumbnails (Desktop Only) */}
            <div className="hidden md:flex md:col-span-1 lg:col-span-4 flex-col gap-4">
              {images.slice(0, 3).map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`relative flex-1 rounded-xl overflow-hidden border-2 transition-all group ${idx === currentImageIndex ? "border-primary ring-2 ring-primary/20 shadow-glow" : "border-transparent opacity-80 hover:opacity-100"
                    }`}
                >
                  <img src={getUploadUrl(img)} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  {idx === 2 && images.length > 3 && (
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white backdrop-blur-[2px]">
                      <span className="text-2xl font-bold">+{images.length - 3}</span>
                      <span className="text-xs font-medium uppercase tracking-wider">More Photos</span>
                    </div>
                  )}
                </button>
              ))}
              {images.length < 3 && Array.from({ length: 3 - images.length }).map((_, i) => (
                <div key={i} className="flex-1 rounded-xl bg-muted/30 border border-dashed border-border flex items-center justify-center">
                  <Layers className="w-6 h-6 text-muted-foreground/40" />
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        <div className="container pb-20">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 px-3 py-1 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    {listing.category.toUpperCase()}
                  </Badge>
                  <Badge className="bg-accent/10 text-accent border-accent/20 px-3 py-1 flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5" />
                    Verified Property
                  </Badge>
                  {listing.gender && (
                    <Badge className={`px-3 py-1 capitalize flex items-center gap-1 ${listing.gender === 'girls' ? 'bg-pink-100 text-pink-700 border-pink-200' :
                      listing.gender === 'boys' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                        'bg-purple-100 text-purple-700 border-purple-200'
                      }`}>
                      <Users className="w-3.5 h-3.5" />
                      {listing.gender} Only
                    </Badge>
                  )}
                </div>

                <h1 className="font-display text-4xl md:text-5xl font-extrabold mb-4 tracking-tight leading-tight">
                  {listing.title}
                </h1>

                <div className="flex flex-wrap items-center gap-6 text-muted-foreground bg-secondary/30 p-4 rounded-2xl border border-border/50">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">Location</p>
                      <p className="text-sm font-bold text-foreground">{listing.location?.name}, {listing.city}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 border-l border-border/60 pl-6">
                    <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                      <Star className="w-4 h-4 fill-accent" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">Rating</p>
                      <p className="text-sm font-bold text-foreground">{listing.rating} <span className="font-normal text-muted-foreground">({listing.reviews} Reviews)</span></p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 border-l border-border/60 pl-6">
                    <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                      <Eye className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">Engagement</p>
                      <p className="text-sm font-bold text-foreground">{listing.views || 0} <span className="font-normal text-muted-foreground">Views</span></p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Tabs */}
              <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="w-full justify-start bg-secondary/50 p-1.5 rounded-2xl border border-border/40 overflow-x-auto gap-1">
                  <TabsTrigger value="overview" className="rounded-xl px-4 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary font-bold transition-all shrink-0">Overview</TabsTrigger>
                  <TabsTrigger value="amenities" className="rounded-xl px-4 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary font-bold transition-all shrink-0">Amenities</TabsTrigger>
                  {listing.videos && listing.videos.length > 0 && (
                    <TabsTrigger value="videos" className="rounded-xl px-4 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary font-bold transition-all shrink-0">Videos</TabsTrigger>
                  )}
                  <TabsTrigger value="reviews" className="rounded-xl px-4 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary font-bold transition-all shrink-0">Reviews</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <div className="space-y-6">
                    <div className="bg-secondary/20 p-6 rounded-2xl border border-border/50">
                      <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
                        <Info className="w-5 h-5 text-primary" />
                        About the Property
                      </h2>
                      <p className="text-muted-foreground whitespace-pre-line leading-relaxed text-lg">
                        {listing.description || `Experience comfortable living at ${listing.title}. Located in ${listing.location?.name || listing.location || 'your area'}, we provide safe and affordable accommodation with all necessary amenities.`}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
                        <h2 className="font-display text-xl font-bold mb-5 flex items-center gap-2">
                          <Building className="w-5 h-5 text-primary" />
                          Address Details
                        </h2>
                        <div className="space-y-4">
                          <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-xl bg-muted/30 flex items-center justify-center shrink-0">
                              <Navigation className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="text-sm font-bold">{listing.street}</p>
                              <p className="text-xs text-muted-foreground">{listing.location?.name}, {listing.city}</p>
                            </div>
                          </div>
                          {listing.nearbyCoaching && (
                            <div className="flex gap-4 p-4 bg-primary/5 rounded-xl border border-primary/10">
                              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                                <GraduationCap className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-primary">Nearby Coaching</p>
                                <p className="text-sm text-foreground/80">{listing.nearbyCoaching}</p>
                                <p className="text-xs font-semibold text-muted-foreground mt-1">Distance: {listing.coachingDistance || 'Walking distance'}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
                        <h2 className="font-display text-xl font-bold mb-5 flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-primary" />
                          Listing Info
                        </h2>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between py-2 border-b border-border/50">
                            <span className="text-muted-foreground text-sm font-medium">Monthly Rent</span>
                            <span className="font-bold text-primary">₹{listing.price.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center justify-between py-2 border-b border-border/50">
                            <span className="text-muted-foreground text-sm font-medium">Listing Created</span>
                            <span className="font-bold">{new Date(listing.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center justify-between py-2">
                            <span className="text-muted-foreground text-sm font-medium">Availability</span>
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">Available Now</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="amenities" className="mt-8">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="font-display text-3xl font-bold">Included Amenities</h2>
                    <span className="text-sm bg-muted px-4 py-2 rounded-full font-medium text-muted-foreground">
                      {amenities.length} Features Total
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {amenities.map((amenity, idx) => (
                      <motion.div
                        key={amenity.name}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex flex-col gap-4 p-6 bg-white rounded-2xl border border-border shadow-sm hover:border-primary/40 hover:shadow-md transition-all group"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                          <amenity.Icon className="w-6 h-6 text-primary group-hover:text-inherit" />
                        </div>
                        <span className="text-base font-bold text-foreground/80 tracking-tight">{amenity.name}</span>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>

                {listing.videos && listing.videos.length > 0 && (
                  <TabsContent value="videos" className="mt-8">
                    <h2 className="font-display text-3xl font-bold mb-8">Property Videos</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {listing.videos.map((video, idx) => (
                        <div key={idx} className="aspect-video rounded-3xl overflow-hidden bg-black shadow-lg border border-border relative group">
                          <video
                            src={getUploadUrl(video)}
                            controls
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none group-hover:opacity-0 transition-opacity">
                            <Play className="w-16 h-16 text-white opacity-80" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                )}

                <TabsContent value="reviews" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-xl font-semibold">
                      Reviews ({listing.reviews})
                    </h2>
                    <div className="flex items-center gap-2">
                      <Star className="w-6 h-6 fill-accent text-accent" />
                      <span className="font-display text-2xl font-bold">{listing.rating}</span>
                    </div>
                  </div>

                  {/* Review Submission Form */}
                  <div className="p-6 bg-card rounded-2xl border border-border">
                    <h3 className="font-semibold mb-4">Write a Review</h3>
                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                            className="focus:outline-none"
                          >
                            <Star className={`w-6 h-6 ${reviewForm.rating >= star ? "fill-accent text-accent" : "text-muted-foreground"}`} />
                          </button>
                        ))}
                      </div>
                      <Textarea
                        placeholder="Share your experience..."
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                        rows={3}
                      />
                      <Button type="submit" disabled={submitting}>
                        {submitting ? "Submitting..." : "Submit Review"}
                      </Button>
                    </form>
                  </div>

                  <div className="space-y-4">
                    {reviewsLoading ? (
                      <p className="text-center text-muted-foreground">Loading reviews...</p>
                    ) : reviews.length > 0 ? (
                      reviews.map((review) => (
                        <div key={review._id} className="p-5 bg-secondary rounded-xl">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                              {review.user?.profileImage ? (
                                <img src={getUploadUrl(review.user.profileImage)} alt={review.user.name} className="w-full h-full object-cover" />
                              ) : (
                                <span className="font-bold text-primary">{review.user?.name?.charAt(0) || 'U'}</span>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold">{review.user?.name || "Anonymous"}</h4>
                                <span className="text-sm text-muted-foreground">
                                  {new Date(review.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex gap-0.5 mb-2">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star key={i} className={`w-4 h-4 ${review.rating > i ? "fill-accent text-accent" : "text-muted-foreground"}`} />
                                ))}
                              </div>
                              <p className="text-muted-foreground">{review.comment}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground">No reviews yet. Be the first to review!</p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Price Card */}
              <div className="bg-card rounded-2xl p-6 shadow-card sticky top-24">
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="font-display text-3xl font-bold">
                    ₹{listing.price.toLocaleString()}
                  </span>
                  <span className="text-muted-foreground">/month</span>
                </div>

                {/* Contact Buttons */}
                <div className="space-y-3 mb-6">
                  <Button
                    variant="hero"
                    size="lg"
                    className="w-full h-16 rounded-2xl shadow-glow active:scale-95 transition-all text-lg font-bold"
                    onClick={() => window.location.href = 'tel:+919057176565'}
                  >
                    <div className="flex items-center justify-center gap-3 w-full">
                      <Phone className="w-6 h-6 animate-pulse" />
                      <div className="text-left">
                        <span className="block text-sm font-medium opacity-80 leading-none mb-1 text-primary-foreground/70">Call Vendor Now</span>
                        <span className="block leading-none text-primary-foreground">+91 90571 76565</span>
                      </div>
                    </div>
                  </Button>
                  <Button
                    variant="accent"
                    size="lg"
                    className="w-full h-16 rounded-2xl shadow-lg active:scale-95 transition-all text-lg font-bold"
                    onClick={() => window.open('https://wa.me/919057176565', '_blank')}
                  >
                    <div className="flex items-center justify-center gap-3 w-full">
                      <MessageCircle className="w-6 h-6" />
                      <div className="text-left">
                        <span className="block text-sm font-medium opacity-80 leading-none mb-1">Chat on WhatsApp</span>
                        <span className="block leading-none">+91 90571 76565</span>
                      </div>
                    </div>
                  </Button>
                </div>

                {/* Inquiry Form */}
                <div className="border-t border-border pt-6 ">
                  <h3 className="font-semibold mb-4">Send Inquiry</h3>
                  <form className="space-y-4" onSubmit={handleQuerySubmit}>
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" name="name" placeholder="Your name" className="mt-1" onChange={handleChange} />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" name="phone" placeholder="Your phone number" maxLength="10" className="mt-1" onChange={handleChange} />
                    </div>
                    <div>
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="I'm interested in this listing..."
                        className="mt-1"
                        rows={3}
                        onChange={handleChange}
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={submitting}>
                      <Mail className="w-4 h-4" />
                      {submitting ? "Sending..." : "Send Inquiry"}
                    </Button>
                  </form>
                </div>

                {/* Vendor Info Section */}
                <div className="mt-8 p-6 bg-primary/5 rounded-3xl border border-primary/10 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform duration-500" />

                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-primary/60 mb-6">Listed By Vendor</h3>

                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground font-display font-bold text-2xl shadow-glow">
                      {vendorInfo.name?.charAt(0) || "V"}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold tracking-tight">{vendorInfo.name}</span>
                        <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center text-[10px] text-white">
                          <Check className="w-3 h-3" />
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground font-medium">{vendorInfo.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-primary/20 w-fit">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Responsive Vendor</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
