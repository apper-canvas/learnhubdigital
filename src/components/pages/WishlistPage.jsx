import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import CourseCard from "@/components/molecules/CourseCard";
import FilterSelect from "@/components/molecules/FilterSelect";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { bookmarkService } from "@/services/api/bookmarkService";
import { courseService } from "@/services/api/courseService";
import { progressService } from "@/services/api/progressService";

const WishlistPage = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [userProgress, setUserProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [filters, setFilters] = useState({
    category: "",
    difficulty: "",
    search: ""
  });

  const categories = [
    { value: "Web Development", label: "Web Development" },
    { value: "Data Science", label: "Data Science" },
    { value: "Mobile Development", label: "Mobile Development" },
    { value: "Design", label: "Design" }
  ];

  const difficulties = [
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" }
  ];

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [bookmarksData, coursesData, progressData] = await Promise.all([
        bookmarkService.getAll(),
        courseService.getAll(),
        progressService.getAll()
      ]);
      
      setBookmarks(bookmarksData);
      setCourses(coursesData);
      setUserProgress(progressData);
    } catch (err) {
      setError("Failed to load wishlist. Please try again.");
      console.error("Error loading wishlist:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    // Get bookmarked courses
    const bookmarkedCourseIds = bookmarks.map(bookmark => bookmark.courseId);
    let filtered = courses.filter(course => bookmarkedCourseIds.includes(course.Id));

    // Filter by category
    if (filters.category) {
      filtered = filtered.filter(course => course.category === filters.category);
    }

    // Filter by difficulty
    if (filters.difficulty) {
      filtered = filtered.filter(course => course.difficulty === filters.difficulty);
    }

    // Filter by search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchLower) ||
        course.description.toLowerCase().includes(searchLower) ||
        course.instructor.toLowerCase().includes(searchLower)
      );
    }

    setFilteredCourses(filtered);
  }, [bookmarks, courses, filters]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const handleSearch = (searchTerm) => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      difficulty: "",
      search: ""
    });
  };

  const getUserProgress = (courseId) => {
    return userProgress.find(progress => progress.courseId === courseId);
  };

  const handleBookmarkToggle = async (courseId) => {
    try {
      await bookmarkService.delete(courseId);
      setBookmarks(prev => prev.filter(bookmark => bookmark.courseId !== courseId));
      toast.success("Course removed from wishlist");
    } catch (err) {
      toast.error("Failed to remove from wishlist");
      console.error("Error removing bookmark:", err);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <ApperIcon name="Bookmark" size={32} className="text-primary-600" />
            My Wishlist
          </h1>
          <p className="text-gray-600 mt-1">
            Your saved courses for later learning
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">
            {filteredCourses.length} of {bookmarks.length} courses
          </span>
          {(filters.category || filters.difficulty || filters.search) && (
            <button
              onClick={clearFilters}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {bookmarks.length === 0 ? (
        <Empty
          title="Your wishlist is empty"
          description="Start exploring courses and save the ones you're interested in for later."
          actionLabel="Browse Courses"
          onAction={() => window.location.href = "/courses"}
        />
      ) : (
        <>
          {/* Filters */}
          <div className="bg-white rounded-xl shadow-premium p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <SearchBar 
                  onSearch={handleSearch}
                  placeholder="Search wishlist..."
                />
              </div>
              
              <FilterSelect
                label="Category"
                options={categories}
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                placeholder="All Categories"
              />
              
              <FilterSelect
                label="Difficulty"
                options={difficulties}
                value={filters.difficulty}
                onChange={(e) => handleFilterChange("difficulty", e.target.value)}
                placeholder="All Levels"
              />
            </div>
          </div>

          {/* Course Grid */}
          {filteredCourses.length === 0 ? (
            <Empty
              title="No courses match your filters"
              description="Try adjusting your filters to find courses in your wishlist."
              actionLabel="Clear Filters"
              onAction={clearFilters}
            />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredCourses.map((course, index) => (
                <motion.div
                  key={course.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <CourseCard 
                    course={course} 
                    userProgress={getUserProgress(course.Id)}
                    isBookmarked={true}
                    onBookmarkToggle={handleBookmarkToggle}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

export default WishlistPage;