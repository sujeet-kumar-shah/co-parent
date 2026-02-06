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
        const response = await fetch(getApiUrl(`/api/listings/${id}`));
        if (response.ok) {
          const data = await response.json();
          setListing(data.listing);
          setLiked(data.likedStatus.status)
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
  }, [id]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login", { state: { from: `/listing/${id}` } });
    }
  }, [isAuthenticated, authLoading, navigate, id]);

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
    icon: getIconForFeature(f),
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
  // New state for button loading
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

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

        {/* Image Gallery */}
        <section className="container mb-8">
          <div className="relative rounded-2xl overflow-hidden">
            <motion.img
              key={currentImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              src={getUploadUrl(images[currentImageIndex])}
              alt={listing.title}
              className="w-full h-[300px] md:h-[500px] object-fit"
            />
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors shadow-lg"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors shadow-lg"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${index === currentImageIndex
                    ? "bg-primary-foreground w-6"
                    : "bg-primary-foreground/50"
                    }`}
                />
              ))}
            </div>
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={handleLike}
                className="w-10 h-10 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors"
              >
                <Heart className={`w-5 h-5 ${liked ? "fill-accent text-accent" : ""}`} />
              </button>
              <button className="w-10 h-10 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors" onClick={shareUrl}>
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Thumbnails */}
          <div className="flex gap-4 mt-4 overflow-x-auto pb-2">
            {images.map((images, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${index === currentImageIndex
                  ? "border-primary"
                  : "border-transparent opacity-60 hover:opacity-100"
                  }`}
              >
                <img src={getUploadUrl(images)} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </section>

        <div className="container pb-20">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">{listing.category}</Badge>
                  <Badge className="bg-primary">Verified</Badge>
                </div>
                <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">
                  {listing.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {listing.location.name}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-accent text-accent" />
                    <span className="font-semibold text-foreground">{listing.rating}</span>
                    <span>({listing.reviews} reviews)</span>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="w-full justify-start bg-secondary p-1 rounded-xl">
                  <TabsTrigger value="overview" className="rounded-lg">Overview</TabsTrigger>
                  <TabsTrigger value="amenities" className="rounded-lg">Amenities</TabsTrigger>
                  <TabsTrigger value="reviews" className="rounded-lg hidden">Reviews</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <div>
                    <h2 className="font-display text-xl font-semibold mb-4">About</h2>
                    <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                      {listing.description || `Experience comfortable living at ${listing.title}. Located in ${listing.location}, we provide safe and affordable accommodation with all necessary amenities.`}
                    </p>
                  </div>

                  <div>
                    <h2 className="font-display text-xl font-semibold mb-4">Room Options</h2>
                    <div className="space-y-3">
                      {[{ type: "Standard", price: listing.price }].map((room) => (
                        <div
                          key={room.type}
                          className="flex items-center justify-between p-4 bg-secondary rounded-xl"
                        >
                          <span className="font-medium">{room.type}</span>
                          <span className="font-display font-bold">
                            ₹{room.price.toLocaleString()}/mo
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="amenities">
                  <h2 className="font-display text-xl font-semibold mb-4">Amenities & Facilities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {amenities.map((amenity) => (
                      <div
                        key={amenity.name}
                        className="flex items-center gap-3 p-4 bg-secondary rounded-xl"
                      >
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <amenity.icon className="w-5 h-5 text-primary" />
                        </div>
                        <span className="text-sm font-medium">{amenity.name}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>

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
                  <div className="space-y-4">
                    {mockReviews.map((review) => (
                      <div key={review.id} className="p-5 bg-secondary rounded-xl">
                        <div className="flex items-start gap-4">
                          <img
                            src={review.avatar}
                            alt={review.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold">{review.name}</h4>
                              <span className="text-sm text-muted-foreground">{review.date}</span>
                            </div>
                            <div className="flex gap-0.5 mb-2">
                              {Array.from({ length: review.rating }).map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                              ))}
                            </div>
                            <p className="text-muted-foreground">{review.text}</p>
                          </div>
                        </div>
                      </div>
                    ))}
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
                    className="w-full flex-col h-auto py-4"
                    onClick={() => window.location.href = 'tel:+919057176565'}
                  >
                    <div className="flex items-center gap-2">
                      <Phone className="w-5 h-5" />
                      <span>Call Now</span>
                      <span className="text-sm mt-1 opacity-90">+91 90571 76565</span>
                    </div>
                  </Button>
                  <Button
                    variant="accent"
                    size="lg"
                    className="w-full flex-col h-auto py-4"
                    onClick={() => window.open('https://wa.me/919057176565', '_blank')}
                  >
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5" />
                      <span>WhatsApp</span>
                      <span className="text-sm mt-1 opacity-90">+91 90571 76565</span>
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

                {/* Vendor Info */}
                <div className="border-t border-border mt-6 pt-6  hidden">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-display font-bold text-primary">SP</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{vendorInfo.name}</span>
                        {vendorInfo.verified && (
                          <Check className="w-4 h-4 text-primary" />
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {vendorInfo.responseTime || "Responds quickly"}
                      </span>
                    </div>
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
