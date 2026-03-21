import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Building2, Home, GraduationCap, Library, Utensils, ArrowRight, Brain, Users, BookOpen, FileText } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const categories = [
  {
    id: "hostel+pg",
    name: "Safe & Budget Housing (Hostels, PG, Flats)",
    description: "Verified budget-friendly accommodations with regular check-ups",
    icon: Building2,
    count: 5700,
    color: "hostel",
    gradient: "from-hostel/20 to-hostel/5",
  },
  {
    id: "mess",
    name: "Best Mess & Home-made Food From Local Homes",
    description: "Hygienic, high-quality mess and home-style tiffin services",
    icon: Utensils,
    count: 1400,
    color: "mess",
    gradient: "from-mess/20 to-mess/5",
  },
  {
    id: "coaching",
    name: "Coaching Admission Support",
    description: "Expert guidance for selecting the best coaching institutes",
    icon: GraduationCap,
    count: 1800,
    color: "coaching",
    gradient: "from-coaching/20 to-coaching/5",
  },
  {
    id: "school-admission",
    name: "School Admission & Board Support",
    description: "Reliable support for school admissions and board preparations",
    icon: BookOpen,
    count: 980,
    color: "coaching",
    gradient: "from-coaching/20 to-coaching/5",
  },
  {
    id: "mentorship",
    name: "Academic and Mentorship Support",
    description: "Get guidance from IIT, NEET toppers & experienced mentors",
    icon: Users,
    count: 2500,
    color: "hostel",
    gradient: "from-hostel/20 to-hostel/5",
  },
  {
    id: "emotional-counseling",
    name: "Emotional & Stress Management Counselling",
    description: "Professional support to help you manage stress and anxiety",
    icon: Brain,
    count: 1200,
    color: "counseling",
    gradient: "from-counseling/20 to-counseling/5",
  },
  {
    id: "form-update",
    name: "Examination & Forms Related Updates",
    description: "Get updates of latest exam forms and filling assistance",
    icon: FileText,
    count: 1500,
    color: "library",
    gradient: "from-library/20 to-library/5",
  },
  {
    id: "college-counseling",
    name: "Counselling-JEE/NEET & Pvt. College",
    description: "Expert career counseling for JEE, NEET, and college admissions",
    icon: Library,
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
  const { isAuthenticated, user } = useAuth();

  const handleCategoryClick = (categoryId) => {
    if (isAuthenticated && user.type === 'student') {
      if (categoryId === 'mentorship') {
        navigate(`/mentors`);
      } else if (categoryId === 'school-admission') {
        navigate(`/schools`);
      } else if (categoryId === 'emotional-counseling' || categoryId === 'college-counseling') {
        navigate(`/counseling`);
      } else {
        navigate(`/listings?category=${categoryId}`);
      }
    } else if (isAuthenticated && user.type === 'vendor') {
      navigate("/", { state: true });
    } else if (isAuthenticated && user.type === 'Admin') {
      navigate(`/listings?category=${categoryId}`);
    } else {
      navigate("/login", { state: { from: `/listings?category=${categoryId}` } });
    }
  };

  return (
    <section className="py-2 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary font-medium text-sm tracking-wider uppercase">
            Our Solutions
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
                <span className="text-sm font-medium text-foreground/60 hidden">
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
