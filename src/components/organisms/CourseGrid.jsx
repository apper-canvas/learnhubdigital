import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import CourseCard from "@/components/molecules/CourseCard";
import FilterSelect from "@/components/molecules/FilterSelect";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { courseService } from "@/services/api/courseService";
import { progressService } from "@/services/api/progressService";
import { bookmarkService } from "@/services/api/bookmarkService";
const CourseGrid = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [userProgress, setUserProgress] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
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
      
      const [coursesData, progressData, bookmarksData] = await Promise.all([
        courseService.getAll(),
        progressService.getAll(),
        bookmarkService.getAll()
      ]);
      
      setCourses(coursesData);
      setUserProgress(progressData);
      setBookmarks(bookmarksData);
    } catch (err) {
      setError("Failed to load courses. Please try again.");
      console.error("Error loading courses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let filtered = courses;

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
  }, [courses, filters]);

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

  const isBookmarked = (courseId) => {
    return bookmarks.some(bookmark => bookmark.courseId === courseId);
  };

  const handleBookmarkToggle = async (courseId) => {
    try {
      if (isBookmarked(courseId)) {
        await bookmarkService.delete(courseId);
        setBookmarks(prev => prev.filter(bookmark => bookmark.courseId !== courseId));
      } else {
        const newBookmark = await bookmarkService.create({ courseId });
        setBookmarks(prev => [...prev, newBookmark]);
      }
    } catch (err) {
      console.error("Error toggling bookmark:", err);
    }
  };
  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Explore Courses</h1>
          <p className="text-gray-600 mt-1">
            Discover new skills and advance your career with our expert-led courses
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">
            {filteredCourses.length} of {courses.length} courses
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

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-premium p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <SearchBar 
              onSearch={handleSearch}
              placeholder="Search courses, instructors..."
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
          title="No courses found"
          description="Try adjusting your filters or search terms to find the perfect course for you."
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
                isBookmarked={isBookmarked(course.Id)}
                onBookmarkToggle={handleBookmarkToggle}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default CourseGrid;