import { useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const QuizQuestion = ({ question, onAnswer, showResult = false, selectedAnswer = null }) => {
  const [selected, setSelected] = useState(selectedAnswer);
  
  const handleSelect = (index) => {
    if (showResult) return;
    setSelected(index);
  };

  const handleSubmit = () => {
    if (selected !== null) {
      onAnswer(selected);
    }
  };

  const isCorrect = selected === question.correctAnswer;
  const hasAnswered = showResult && selected !== null;

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          {question.text}
        </h3>
        
        <div className="space-y-3">
          {question.options.map((option, index) => {
            let buttonVariant = "outline";
            let iconName = null;
            
            if (showResult && index === question.correctAnswer) {
              buttonVariant = "success";
              iconName = "CheckCircle";
            } else if (showResult && index === selected && index !== question.correctAnswer) {
              buttonVariant = "danger";
              iconName = "XCircle";
            } else if (selected === index && !showResult) {
              buttonVariant = "primary";
            }
            
            return (
              <motion.button
                key={index}
                whileHover={{ scale: showResult ? 1 : 1.02 }}
                whileTap={{ scale: showResult ? 1 : 0.98 }}
                onClick={() => handleSelect(index)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                  showResult && index === question.correctAnswer
                    ? "border-green-500 bg-green-50 text-green-800"
                    : showResult && index === selected && index !== question.correctAnswer
                    ? "border-red-500 bg-red-50 text-red-800"
                    : selected === index && !showResult
                    ? "border-primary-500 bg-primary-50 text-primary-800"
                    : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                }`}
                disabled={showResult}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{option}</span>
                  {iconName && (
                    <ApperIcon 
                      name={iconName} 
                      size={20} 
                      className={index === question.correctAnswer ? "text-green-600" : "text-red-600"}
                    />
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {!showResult && (
        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={selected === null}
            size="large"
          >
            Submit Answer
          </Button>
        </div>
      )}

      {hasAnswered && question.explanation && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`mt-4 p-4 rounded-lg ${
            isCorrect ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
          }`}
        >
          <div className="flex items-start gap-3">
            <ApperIcon 
              name={isCorrect ? "CheckCircle" : "XCircle"} 
              size={20} 
              className={isCorrect ? "text-green-600" : "text-red-600"}
            />
            <div>
              <p className={`font-medium ${isCorrect ? "text-green-800" : "text-red-800"}`}>
                {isCorrect ? "Correct!" : "Incorrect"}
              </p>
              <p className={`text-sm mt-1 ${isCorrect ? "text-green-700" : "text-red-700"}`}>
                {question.explanation}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </Card>
  );
};

export default QuizQuestion;