import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../context/UserProvider";

export default function CategoryOptions() {

  const { category } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [totalPercentageOptionA, setTotalPercentageOptionA] = useState(0);
  const [totalPercentageOptionB, setTotalPercentageOptionB] = useState(0);
  const [allQuestionsAnswered, setAllQuestionsAnswered] = useState(false);
  const [canVote, setCanVote] = useState(true);
  const [displayResults, setDisplayResults] = useState(false);

  const { userAxios, likeOptionA, likeOptionB, userState } =
    useContext(UserContext);
  const navigate = useNavigate();

  const currentQuestion = questions[currentQuestionIndex];

  const handleOptionsClick = (selectedOption) => {
    if (canVote) {
      setDisplayResults(true)
      if (selectedOption === "optionA") {
        setCanVote(false)
        likeOptionA(currentQuestion._id);
        const updatedA = questions[currentQuestionIndex]
        updatedA.likedOptionA.push(userState.user._id);
        setQuestions(prevState => prevState.map(question => question._id === updatedA._id ? updatedA : question))
        likedOptions()
      } else if (selectedOption === "optionB") {
        setCanVote(false)
        const updatedB = questions[currentQuestionIndex]
        updatedB.likedOptionB.push(userState.user._id);
        setQuestions(prevState => prevState.map(question => question._id === updatedB._id ? updatedB : question))
        likeOptionB(currentQuestion._id);
        likedOptions()
      }
    }
  };


  const likedOptions = () => {
    const optionA = questions[currentQuestionIndex].likedOptionA.length;
    const optionB = questions[currentQuestionIndex].likedOptionB.length;
    const totalVotes = optionA + optionB;
    const percentageA = optionA / totalVotes * 100;
    const percentageB = optionB / totalVotes * 100;
    setTotalPercentageOptionA(percentageA);
    setTotalPercentageOptionB(percentageB);
    console.log(optionA);
  };

  const handleNextQuestion = () => {
    setCanVote(true)
    setDisplayResults(false)
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      likedOptions()
    } else {
      setAllQuestionsAnswered(true);
  }
};

useEffect(() => {
  userAxios
    .get(`/api/questions/category/${category}`)
    .then((response) => setQuestions(response.data))
    .catch((error) => console.error("Error fetching options:", error));
}, []);


  const handleNavigateProfile = () => {
    navigate("/profile");
  };

  return (
    <div className="wouldYou-container">
      <h2 className="category-selected">Category: {category}</h2>
      <h1 className="wouldYou">Would You Rather?</h1>
      {currentQuestionIndex < questions.length && (
        <div key={questions[currentQuestionIndex]._id}>
          <h3
            className="onClickA"
            onClick={() => handleOptionsClick( "optionA")}
          >
            {questions[currentQuestionIndex].optionA}
          </h3>
          {displayResults && <h2 className="percentageA">{Math.round(totalPercentageOptionA)}%</h2>}
          <h3 className="or">OR</h3> {/* Add the OR text here */}
          <h3
            className="onClickB"
            onClick={() => handleOptionsClick( "optionB")}
          >
            {questions[currentQuestionIndex].optionB}
          </h3>
        {displayResults && <h2 className="percentageB">{Math.round(totalPercentageOptionB)}%</h2>}
        </div>
      )}
      {!allQuestionsAnswered && (
        <button className="nextBtn" onClick={handleNextQuestion}>Next Question</button>
      )}
      {allQuestionsAnswered && (
        <button className="backBtn" onClick={handleNavigateProfile}>Back to Categories</button>
      )}
    </div>
  );
}
