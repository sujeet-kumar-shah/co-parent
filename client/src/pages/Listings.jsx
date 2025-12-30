import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import {
  MapPin,
  Star,
  Heart,
  Search,
  SlidersHorizontal,
  Grid3X3,
  List,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";

// removing hardcoded listings
const allListings = [];

const categories = [
  { value: "all", label: "All Categories" },
  { value: "hostel", label: "Hostels" },
  { value: "pg", label: "PG" },
  { value: "coaching", label: "Coaching" },
  { value: "library", label: "Library" },
  { value: "mess", label: "Mess" },
];

const cities = ["All Cities", "Pune", "Bangalore", "Delhi", "Chennai", "Jaipur"];

export default function Listings() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();
  const initialCategory = searchParams.get("category") || "all";
  const initialCity = searchParams.get("city") || "";

  const categoryValues = useMemo(() => categories.filter(c => c.value !== "all").map(c => c.value), []);

  const [searchQuery, setSearchQuery] = useState(initialCity);
  const [selectedCategories, setSelectedCategories] = useState(
    initialCategory === "all" ? categoryValues : [initialCategory]
  );
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [showFilters, setShowFilters] = useState(true); // Show filters by default now
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("rating");
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/listings");
        const data = await response.json();
        setListings(data);
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    };
    fetchListings();
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login", { state: { from: `/listings?category=${initialCategory}` } });
    }
  }, [isAuthenticated, loading, navigate, initialCategory]);

  const filteredListings = useMemo(() => {
    return listings
      // .filter((listing) => {
      //   const matchesCategory = selectedCategories.includes(listing.category);
      //   const matchesCity =
      //     selectedCity === "All Cities" || listing.city === selectedCity;
      //   const matchesSearch =
      //     !searchQuery ||
      //     listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      //     listing.location.toLowerCase().includes(searchQuery.toLowerCase());
      //   const matchesPrice =
      //     listing.price >= priceRange[0] && listing.price <= priceRange[1];
      //   return matchesCategory && matchesCity && matchesSearch && matchesPrice;
      // })
      .sort((a, b) => {
        if (sortBy === "rating") return b.rating - a.rating;
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        if (sortBy === "reviews") return b.reviews - a.reviews;
        return 0;
      });
  }, [selectedCategories, selectedCity, searchQuery, priceRange, sortBy, listings]);

  const toggleCategory = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  if (loading) {
    return <div className="min-h-screen pt-20 text-center">Loading...</div>;
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20">
        {/* Search Header */}
        <section className="bg-gradient-hero py-12">
          <div className="container">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
              Find Your Perfect Service
            </h1>
            <div className="flex flex-col md:flex-row gap-4 max-w-4xl">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search by name or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 bg-card border-0 shadow-sm"
                />
              </div>
              <Button
                variant="hero-outline"
                size="lg"
                onClick={() => setShowFilters(!showFilters)}
                className="h-12"
              >
                <SlidersHorizontal className="w-5 h-5" />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </Button>
            </div>
          </div>
        </section>

        <div className="container py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            {showFilters && (
              <motion.aside
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="w-full lg:w-72 space-y-6 p-6 bg-card rounded-2xl shadow-card h-fit border border-border"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-semibold text-lg">Filters</h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="lg:hidden p-2 hover:bg-secondary rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Categories Multi-select */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="font-medium">Categories</Label>
                    <button
                      onClick={() => setSelectedCategories(categoryValues)}
                      className="text-xs text-primary hover:underline font-medium"
                    >
                      Select All
                    </button>
                  </div>
                  <div className="space-y-2">
                    {categories.filter(c => c.value !== "all").map((category) => (
                      <div key={category.value} className="flex items-center gap-2">
                        <Checkbox
                          id={`cat-${category.value}`}
                          checked={selectedCategories.includes(category.value)}
                          onCheckedChange={() => toggleCategory(category.value)}
                        />
                        <Label
                          htmlFor={`cat-${category.value}`}
                          className="text-sm font-normal cursor-pointer flex-1"
                        >
                          {category.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* City Filter
                <div className="space-y-3">
                  <Label className="font-medium">City</Label>
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div> */}

                {/* Price Range */}
                <div className="space-y-4">
                  <Label className="font-medium">
                    Price Range: ₹{priceRange[0].toLocaleString()} - ₹
                    {priceRange[1].toLocaleString()}
                  </Label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={50000}
                    step={500}
                    className="py-2"
                  />
                </div>

                {/* Amenities */}
                <div className="space-y-3 pt-2">
                  <Label className="font-medium">Amenities</Label>
                  {["WiFi", "AC", "Meals", "Gym", "24/7 Access"].map((amenity) => (
                    <div key={amenity} className="flex items-center gap-2">
                      <Checkbox id={amenity} />
                      <Label htmlFor={amenity} className="text-sm font-normal cursor-pointer">
                        {amenity}
                      </Label>
                    </div>
                  ))}
                </div>

                <Button variant="outline" className="w-full mt-4" onClick={() => {
                  setSelectedCategories(categoryValues);
                  setSelectedCity("All Cities");
                  setPriceRange([0, 50000]);
                  setSearchQuery("");
                }}>
                  Reset All
                </Button>
              </motion.aside>
            )}

            {/* Listings Grid */}
            <div className="flex-1">
              {/* Results Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <p className="text-muted-foreground">
                  Showing <span className="font-semibold text-foreground">{filteredListings.length}</span> results
                </p>
                <div className="flex items-center gap-4">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rating">Top Rated</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="reviews">Most Reviewed</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex border border-border rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}
                    >
                      <Grid3X3 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 ${viewMode === "list" ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}
                    >
                      <List className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Listings */}
              {filteredListings.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-muted-foreground text-lg">No listings found matching your criteria.</p>
                  <Button variant="outline" className="mt-4" onClick={() => {
                    setSelectedCategories(categoryValues);
                    setSelectedCity("All Cities");
                    setPriceRange([0, 50000]);
                    setSearchQuery("");
                  }}>
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
                  {filteredListings.map((listing, index) => (
                    <motion.div
                      key={listing._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        to={`/listing/${listing._id}`}
                        className={`group block bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 ${viewMode === "list" ? "flex" : ""
                          }`}
                      >
                        <div className={`relative overflow-hidden ${viewMode === "list" ? "w-48 flex-shrink-0" : "h-48"}`}>
                          <img
                            src={listing.image}
                            alt={listing.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute top-3 left-3">
                            <Badge variant="secondary" className="bg-card/90 backdrop-blur-sm capitalize">
                              {listing.category}
                            </Badge>
                          </div>
                          <button className="absolute top-3 right-3 w-9 h-9 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors">
                            <Heart className="w-4 h-4 text-muted-foreground" />
                          </button>
                        </div>
                        <div className="p-5 flex-1">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                            <MapPin className="w-4 h-4" />
                            {listing.location}
                          </div>
                          <h3 className="font-display text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                            {listing.title}
                          </h3>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {listing.features.slice(0, 3).map((feature) => (
                              <span
                                key={feature}
                                className="text-xs px-2 py-1 bg-secondary rounded-md text-muted-foreground"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center justify-between pt-4 border-t border-border">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-accent text-accent" />
                              <span className="font-semibold">{listing.rating}</span>
                              <span className="text-muted-foreground text-sm">
                                ({listing.reviews})
                              </span>
                            </div>
                            <div>
                              <span className="font-display font-bold text-lg">
                                ₹{listing.price.toLocaleString()}
                              </span>
                              <span className="text-muted-foreground text-sm">/mo</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
