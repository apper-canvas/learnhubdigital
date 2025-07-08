import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Progress from "@/components/atoms/Progress";
import VideoPlayer from "@/components/molecules/VideoPlayer";
import QuizQuestion from "@/components/molecules/QuizQuestion";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { courseService } from "@/services/api/courseService";
import { progressService } from "@/services/api/progressService";

const LearningInterface = () => {
  const { courseId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [userProgress, setUserProgress] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [showQuizResults, setShowQuizResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [courseData, progressData] = await Promise.all([
        courseService.getById(parseInt(courseId)),
        progressService.getByCourseId(courseId)
      ]);
      
      setCourse(courseData);
      setUserProgress(progressData);
      
      // Set initial lesson
      const lessonId = searchParams.get("lesson");
      if (lessonId) {
        const lesson = courseData.lessons.find(l => l.id === lessonId);
        if (lesson) {
          setCurrentLesson(lesson);
        }
      } else {
        setCurrentLesson(courseData.lessons[0]);
      }
    } catch (err) {
      setError("Failed to load course content. Please try again.");
      console.error("Error loading course:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [courseId]);

  const handleLessonSelect = (lesson) => {
    setCurrentLesson(lesson);
    setCurrentQuiz(null);
    setSearchParams({ lesson: lesson.id });
  };

  const handleVideoComplete = async () => {
    try {
      const updatedProgress = {
        ...userProgress,
        completedLessons: [...new Set([...userProgress.completedLessons, currentLesson.id])],
        lastAccessed: new Date().toISOString()
      };
      
      // Calculate overall progress
      const totalLessons = course.lessons.length;
      const completedCount = updatedProgress.completedLessons.length;
      updatedProgress.overallProgress = (completedCount / totalLessons) * 100;
      
      await progressService.update(userProgress.Id, updatedProgress);
      setUserProgress(updatedProgress);
      
      toast.success("Lesson completed!");
      
      // Start quiz if available
      if (currentLesson.quiz) {
        setCurrentQuiz(currentLesson.quiz);
        setCurrentQuestion(0);
        setQuizAnswers([]);
        setShowQuizResults(false);
      } else {
        // Move to next lesson
        const currentIndex = course.lessons.findIndex(l => l.id === currentLesson.id);
        if (currentIndex < course.lessons.length - 1) {
          handleLessonSelect(course.lessons[currentIndex + 1]);
        }
      }
    } catch (err) {
      toast.error("Failed to save progress. Please try again.");
      console.error("Error saving progress:", err);
    }
  };

  const handleQuizAnswer = (answerIndex) => {
    const newAnswers = [...quizAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setQuizAnswers(newAnswers);
    
    setTimeout(() => {
      if (currentQuestion < currentQuiz.questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        handleQuizComplete(newAnswers);
      }
    }, 1500);
  };

  const handleQuizComplete = async (answers) => {
    try {
      const correctAnswers = answers.filter((answer, index) => 
        answer === currentQuiz.questions[index].correctAnswer
      ).length;
      
      const score = (correctAnswers / currentQuiz.questions.length) * 100;
      const passed = score >= currentQuiz.passingScore;
      
      // Update progress
      const updatedProgress = {
        ...userProgress,
        quizScores: {
          ...userProgress.quizScores,
          [currentLesson.id]: score
        },
        lastAccessed: new Date().toISOString()
      };
      
      await progressService.update(userProgress.Id, updatedProgress);
      setUserProgress(updatedProgress);
      
      setShowQuizResults(true);
      
      if (passed) {
        toast.success(`Quiz passed with ${Math.round(score)}%!`);
        
        // Move to next lesson after delay
        setTimeout(() => {
          const currentIndex = course.lessons.findIndex(l => l.id === currentLesson.id);
          if (currentIndex < course.lessons.length - 1) {
            handleLessonSelect(course.lessons[currentIndex + 1]);
          } else {
            toast.success("Congratulations! You've completed the course!");
            navigate(`/courses/${courseId}`);
          }
        }, 3000);
      } else {
        toast.error(`Quiz failed. You need ${currentQuiz.passingScore}% to pass.`);
      }
    } catch (err) {
      toast.error("Failed to save quiz score. Please try again.");
      console.error("Error saving quiz score:", err);
    }
  };

  const handleRetakeQuiz = () => {
    setCurrentQuestion(0);
    setQuizAnswers([]);
    setShowQuizResults(false);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;
  if (!course || !userProgress) return <Error message="Course content not found" onRetry={loadData} />;

  const overallProgress = userProgress.overallProgress || 0;
  const currentLessonIndex = course.lessons.findIndex(l => l.id === currentLesson?.id);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Course Navigation */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h2>
              <Progress value={overallProgress} showText={true} />
            </div>
            
            <div className="space-y-2">
              {course.lessons.map((lesson, index) => {
                const isCompleted = userProgress.completedLessons.includes(lesson.id);
                const isCurrent = currentLesson?.id === lesson.id;
                const quizScore = userProgress.quizScores[lesson.id];
                
                return (
                  <button
                    key={lesson.id}
                    onClick={() => handleLessonSelect(lesson)}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                      isCurrent
                        ? "bg-primary-50 border-2 border-primary-200 text-primary-800"
                        : "bg-white hover:bg-gray-50 border-2 border-transparent text-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                        isCompleted 
                          ? "bg-green-500 text-white"
                          : isCurrent
                          ? "bg-primary-500 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}>
                        {isCompleted ? (
                          <ApperIcon name="Check" size={12} />
                        ) : (
                          index + 1
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{lesson.title}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{Math.floor(lesson.duration / 60)}m</span>
                          {lesson.quiz && (
                            <span className="flex items-center gap-1">
                              <ApperIcon name="FileText" size={10} />
                              Quiz
                            </span>
                          )}
                          {quizScore && (
                            <span className={`font-medium ${
                              quizScore >= lesson.quiz.passingScore ? "text-green-600" : "text-red-600"
                            }`}>
                              {Math.round(quizScore)}%
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{currentLesson?.title}</h1>
                <p className="text-gray-600">
                  Lesson {currentLessonIndex + 1} of {course.lessons.length}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => navigate(`/courses/${courseId}`)}
              >
                <ApperIcon name="ArrowLeft" size={16} />
                Back to Course
              </Button>
            </div>

            {/* Content */}
            {currentQuiz ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Quiz</h2>
                  {!showQuizResults && (
                    <span className="text-sm text-gray-500">
                      Question {currentQuestion + 1} of {currentQuiz.questions.length}
                    </span>
                  )}
                </div>

                {showQuizResults ? (
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="mb-4">
                        <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center">
                          <ApperIcon name="Award" size={24} className="text-white" />
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Quiz Complete!</h3>
                      <p className="text-gray-600">
                        You scored {Math.round((quizAnswers.filter((answer, index) => 
                          answer === currentQuiz.questions[index].correctAnswer
                        ).length / currentQuiz.questions.length) * 100)}%
                      </p>
                    </div>

                    <div className="space-y-4">
                      {currentQuiz.questions.map((question, index) => (
                        <QuizQuestion
                          key={question.id}
                          question={question}
                          onAnswer={() => {}}
                          showResult={true}
                          selectedAnswer={quizAnswers[index]}
                        />
                      ))}
                    </div>

                    <div className="flex justify-center">
                      <Button onClick={handleRetakeQuiz} variant="outline">
                        Retake Quiz
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <Progress 
                      value={currentQuestion + 1} 
                      max={currentQuiz.questions.length}
                      showText={false}
                    />
                    
                    <QuizQuestion
                      question={currentQuiz.questions[currentQuestion]}
                      onAnswer={handleQuizAnswer}
                      showResult={false}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <VideoPlayer
                  lesson={currentLesson}
                  onComplete={handleVideoComplete}
                />
                
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (currentLessonIndex > 0) {
                        handleLessonSelect(course.lessons[currentLessonIndex - 1]);
                      }
                    }}
                    disabled={currentLessonIndex === 0}
                  >
                    <ApperIcon name="ChevronLeft" size={16} />
                    Previous
                  </Button>
                  
                  <Button
                    onClick={() => {
                      if (currentLessonIndex < course.lessons.length - 1) {
                        handleLessonSelect(course.lessons[currentLessonIndex + 1]);
                      }
                    }}
                    disabled={currentLessonIndex === course.lessons.length - 1}
                  >
                    Next
                    <ApperIcon name="ChevronRight" size={16} />
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LearningInterface;