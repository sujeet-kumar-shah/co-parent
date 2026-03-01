import { motion, useSpring, useTransform, animate } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import heroImage from "@/assets/hero-students.jpg";
import axios from "axios";
import { getApiUrl } from "@/config/api";

export function HeroSection() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    students: 0,
    listings: 0,
    vendors: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(getApiUrl("/api/query/stats"));
        if (response.data.success) {
          const { students, vendors, listings } = response.data.data;
          setStats({
            students: 25000 + students,
            listings: 10000 + listings,
            vendors: 500 + vendors,
          });
        }
      } catch (error) {
        console.error("Error fetching hero stats:", error);
      }
    };
    fetchStats();
  }, []);

  const CountUp = ({ value, suffix = "+" }) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
      const controls = animate(0, value, {
        duration: 2,
        onUpdate: (latest) => setDisplayValue(Math.floor(latest)),
      });
      return () => controls.stop();
    }, [value]);

    return (
      <span>
        {displayValue.toLocaleString()}
        {suffix}
      </span>
    );
  };

  return (
    <section className="relative mt-16 w-full overflow-hidden" style={{ background: "linear-gradient(135deg, #f0eeff 0%, #e8f4ff 50%, #f5f3ff 100%)" }}>
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#5A4BDA]/8 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-400/8 rounded-full blur-[60px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 flex items-center sm:py-[60px] py-[30px] justify-between flex-col xl:flex-row px-4 md:px-6 pt-28 xl:pt-[60px]">
        {/* Left: Text content */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center xl:text-left xl:w-[42%] w-full"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#5A4BDA]/10 border border-[#5A4BDA]/20 rounded-full px-4 py-1.5 mb-4">
            <span className="w-2 h-2 bg-[#5A4BDA] rounded-full animate-pulse" />
            <span className="text-[#5A4BDA] text-sm font-semibold">India's #1 Student Services Platform</span>
          </div>

          <h1 className="font-bold text-2xl px-[50px] md:px-0 text-[#1B2124] xl:text-[40px] md:text-[32px] md:leading-[48px] xl:leading-[50px] mb-[6px]">
            India's{" "}
            <span className="text-[#5A4BDA]">Trusted &amp; Affordable</span>{" "}
            Student Guardian Ecosystem
          </h1>

          <div className="text-sm md:text-[16px] px-4 md:px-0 text-center xl:text-start text-[#3D3D3D] mb-6 xl:mb-10">
            Find verified hostels, PGs, coaching centers, libraries, and mess services — all in one place. Trusted by{" "}
            <span className="font-semibold text-[#5A4BDA]">{stats.students.toLocaleString()}+ students</span> across India.
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center xl:justify-start">
            <button
              onClick={() => navigate("/listings")}
              className="px-[28px] py-[14px] w-full sm:w-[200px] rounded-md hover:bg-[#4437B8] transition-all duration-200 bg-[#5A4BDA] items-center text-white font-semibold text-[17px] flex items-center justify-center gap-2"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate("/login", { state: { startTab: "register", authType: "vendor" } })}
              className="px-[28px] py-[14px] w-full sm:w-[220px] rounded-md border-2 border-[#5A4BDA] text-[#5A4BDA] font-semibold text-[17px] hover:bg-[#5A4BDA]/5 transition-all duration-200"
            >
              List Your Service
            </button>
          </div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-6 mt-8 justify-center xl:justify-start"
          >
            {[
              { value: stats.students, label: "Happy Students" },
              { value: stats.listings, label: "Verified Listings" },
              { value: stats.vendors, label: "Trusted Vendors" },
            ].map((stat, i) => (
              <div key={i} className="text-center xl:text-left">
                <div className="text-xl font-bold text-[#1B2124]">
                  <CountUp value={stat.value} />
                </div>
                <div className="text-xs text-[#3D3D3D]/70">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right: Student image with speech bubbles */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="sm:py-4 py-6 xl:w-[55%] w-full flex justify-center"
        >
          <div className="relative justify-items-center sm:text-[14px] sm:leading-[20px] text-[12px] leading-[18px] font-[500]">
            {/* Student image — use local hero image as fallback */}
            <img
              alt="hero-student"
              className="sm:hidden block h-[225px] w-[320px] object-cover object-top rounded-2xl"
              src={heroImage}
            />
            <img
              alt="hero-student"
              className="sm:block hidden h-[318px] w-[600px] object-cover object-top rounded-2xl"
              src={heroImage}
            />

            {/* Speech bubble 1 — white, right side (question) */}
            <div className="bg-white p-2 sm:h-[36px] h-[34px] absolute sm:right-[180px] sm:top-[85px] right-[85px] top-[48px] rounded-md z-0 shadow-[0_0_8px_0_rgba(0,0,0,0.08)] flex items-center whitespace-nowrap">
              {/* Arrow */}
              <div className="w-[20px] h-full absolute flex right-[-13px] top-0 z-[-1]">
                <div className="bg-white sm:w-[14px] sm:h-[14px] w-[12px] h-[12px] rounded-sm my-auto rotate-45" />
              </div>
              <p className="text-[#1B2124] text-xs sm:text-sm">What is CO-PARENTS?</p>
            </div>

            {/* Speech bubble 2 — dark, left side (answer line 1) */}
            <div className="bg-[#140D52] p-2 sm:h-[36px] h-[34px] text-white absolute sm:left-[170px] sm:top-[158px] left-[85px] top-[115px] rounded-md z-0 shadow-[0_0_8px_0_rgba(0,0,0,0.08)] flex items-center whitespace-nowrap">
              <div className="w-[20px] h-full absolute flex left-[-6px] top-0 z-[-1]">
                <div className="bg-[#140D52] sm:w-[14px] sm:h-[14px] w-[12px] h-[12px] rounded-sm my-auto rotate-45" />
              </div>
              <p className="text-xs sm:text-sm">CO-PARENTS is where students find</p>
            </div>

            {/* Speech bubble 3 — dark, left side (answer line 2) */}
            <div className="bg-[#140D52] px-2 pt-1 pb-2 sm:h-[30px] h-[28px] text-white absolute sm:left-[170px] sm:top-[185px] left-[85px] top-[141px] rounded-md z-[1] shadow-[0_0_8px_0_rgba(0,0,0,0.08)] sm:w-[240px] w-[210px] flex items-center">
              <p className="text-xs sm:text-sm">homes, coaching &amp; more ❤️</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
