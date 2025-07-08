import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: "BookOpen",
      title: "Expert-Led Courses",
      description: "Learn from industry professionals with years of experience"
    },
    {
      icon: "Video",
      title: "High-Quality Videos",
      description: "Crystal clear video content with interactive elements"
    },
    {
      icon: "FileText",
      title: "Interactive Quizzes",
      description: "Test your knowledge with engaging quizzes and assessments"
    },
    {
      icon: "Award",
      title: "Certificates",
      description: "Earn recognized certificates upon course completion"
    },
    {
      icon: "Users",
      title: "Community",
      description: "Connect with fellow learners and instructors"
    },
    {
      icon: "TrendingUp",
      title: "Progress Tracking",
      description: "Monitor your learning journey with detailed analytics"
    }
  ];

  const categories = [
    { name: "Web Development", count: 120, color: "primary" },
    { name: "Data Science", count: 85, color: "secondary" },
    { name: "Mobile Development", count: 65, color: "accent" },
    { name: "Design", count: 90, color: "success" }
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 rounded-3xl overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative px-8 py-16 lg:py-24 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Learn Without Limits
            </h1>
            <p className="text-xl lg:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
              Discover thousands of courses, build in-demand skills, and advance your career with expert-led learning.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="large"
                variant="accent"
                onClick={() => navigate("/courses")}
                className="text-lg px-8"
              >
                Start Learning Today
              </Button>
              <Button
                size="large"
                variant="secondary"
                onClick={() => navigate("/dashboard")}
                className="text-lg px-8"
              >
                View My Progress
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { number: "1000+", label: "Courses Available", icon: "BookOpen" },
          { number: "50K+", label: "Students Learning", icon: "Users" },
          { number: "25K+", label: "Certificates Earned", icon: "Award" }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <ApperIcon name={stat.icon} size={32} className="text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gradient mb-2">{stat.number}</h3>
              <p className="text-gray-600">{stat.label}</p>
            </Card>
          </motion.div>
        ))}
      </section>

      {/* Categories Section */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Popular Categories
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our wide range of courses across different domains and find the perfect fit for your learning goals.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="p-6 text-center cursor-pointer hover:shadow-elevation transition-all duration-300"
                    onClick={() => navigate(`/courses?category=${encodeURIComponent(category.name)}`)}>
                <div className={`w-16 h-16 bg-${category.color}-100 rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <ApperIcon name="Folder" size={32} className={`text-${category.color}-600`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h3>
                <Badge variant={category.color} size="small">
                  {category.count} courses
                </Badge>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose LearnHub?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We provide everything you need to succeed in your learning journey with cutting-edge technology and expert guidance.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="p-6">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                  <ApperIcon name={feature.icon} size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center">
        <Card className="p-12 bg-gradient-to-r from-primary-50 to-secondary-50 border-primary-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of learners who are already advancing their careers with our comprehensive courses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="large"
              variant="primary"
              onClick={() => navigate("/courses")}
              className="px-8"
            >
              <ApperIcon name="BookOpen" size={20} />
              Browse Courses
            </Button>
            <Button
              size="large"
              variant="outline"
              onClick={() => navigate("/dashboard")}
              className="px-8"
            >
              <ApperIcon name="User" size={20} />
              View Dashboard
            </Button>
          </div>
        </Card>
      </section>
    </div>
  );
};

export default Home;