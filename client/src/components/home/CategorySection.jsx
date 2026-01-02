import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Building2, Home, GraduationCap, Library, Utensils, ArrowRight,Brain } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const categories = [
  {
    id: "hostel",
    name: "Hostels",
    description: "Safe & secure hostels near your college with all amenities",
    icon: Building2,
    count: 2500,
    color: "hostel",
    gradient: "from-hostel/20 to-hostel/5",
  },
  {
    id: "pg",
    name: "PG Accommodations",
    description: "Comfortable paying guest facilities with home-like environment",
    icon: Home,
    count: 3200,
    color: "pg",
    gradient: "from-pg/20 to-pg/5",
  },
  {
    id: "coaching",
    name: "Coaching Centers",
    description: "Top-rated coaching institutes for competitive exams",
    icon: GraduationCap,
    count: 1800,
    color: "coaching",
    gradient: "from-coaching/20 to-coaching/5",
  },
  {
    id: "library",
    name: "Libraries",
    description: "Quiet study spaces with AC and all-day access",
    icon: Library,
    count: 950,
    color: "library",
    gradient: "from-library/20 to-library/5",
  },
  {
    id: "mess",
    name: "Mess & Tiffin",
    description: "Hygienic and affordable meal services for students",
    icon: Utensils,
    count: 1400,
    color: "mess",
    gradient: "from-mess/20 to-mess/5",
  },
  {
    id: "counseling",
    name: "counseling",
    description: "student caounseling ",
    icon: Brain,
    count: 1400,
    color: "counseling",
    gradient: "from-counseling/20 to-counseling/5",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function CategorySection() {
  const navigate = useNavigate();
  const { isAuthenticated,user } = useAuth();

  const handleCategoryClick = (categoryId) => {
    if (isAuthenticated &&  user.type === 'student') {
      navigate(`/listings?category=${categoryId}`);
    } else if(isAuthenticated && user.type === 'vendor' ){
      navigate("/", { state: true });
    } else if(isAuthenticated &&  user.type === 'Admin'){
       navigate(`/listings?category=${categoryId}`);
    }else{
      navigate("/login", { state: { from: `/listings?category=${categoryId}` } });
    }
  };

  return (
    <section className="py-20 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary font-medium text-sm tracking-wider uppercase">
            Our Services
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mt-2 mb-4">
            Everything Students Need
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From accommodation to education, we've got all your essential services covered 
            in one place.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {categories.map((category) => (
            <motion.div key={category.id} variants={itemVariants}>
              <button
                onClick={() => handleCategoryClick(category.id)}
                className={`group block w-full text-left p-6 rounded-2xl bg-gradient-to-br ${category.gradient} border border-${category.color}/20 hover:border-${category.color}/40 transition-all duration-300 hover:shadow-card-hover`}
              >
                <div className={`w-14 h-14 rounded-xl bg-${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <category.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-2 flex items-center gap-2">
                  {category.name}
                  <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {category.description}
                </p>
                <span className="text-sm font-medium text-foreground/60">
                  {category.count.toLocaleString()}+ listings
                </span>
              </button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
