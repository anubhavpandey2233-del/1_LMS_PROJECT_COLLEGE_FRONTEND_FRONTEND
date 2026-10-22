import React, { useState } from "react";
import { useGetquizContentQuery } from "../../redux/Api/quizContent.api";
import { useGetquizQuery } from "../../redux/Api/quiz.api";
import { useParams } from "react-router-dom";

function Quiz() {
  const param = useParams();
  const { data: quiz } = useGetquizQuery();
  const { data: quizContent } = useGetquizContentQuery();

  const finalQuiz = quiz?.data.find((v) => v.section_id === param._id);
  console.log("1234567890", finalQuiz);

  const finalQuestions = quizContent?.data.filter(
    (v) => v.quiz === finalQuiz?._id,
  );
  console.log("asdfg", finalQuestions);

  let [index, setIndex] = useState(0);
  let [score, setScore] = useState(0);
  let [answer, setAnswer] = useState({});
  let [lock, setLock] = useState(false);
  let [result, setResult] = useState(false);
  let [userAns, setUserAns] = useState({});

  const data = finalQuestions || [];
  const questions = data[index];
  console.log("questions", questions, quizContent?.data);

  const checkAns = (e, ans) => {
    console.log(e, ans);

    let Qid = questions._id;

    if (answer[Qid]) return;

    setUserAns((v) => ({
      ...v,
      [Qid]: ans,
    }));

    setAnswer((p) => ({
      ...p,
      [Qid]: true,
    }));

    if (lock == false) {
      if (questions.Answer === ans) {
        setScore(++score);
        // e.target.classList?.add("select");
        setLock(true);
      } else {
        // e?.target?.classList?.add("select");
        setLock(true);
      }
    }
  };

  console.log("Scoreeee", score);

  const handlenext = () => {
    if (lock) {
      if (index === data.length - 1) {
        setResult(true);
      }

      if (index < data?.length - 1) {
        setIndex(index + 1);
        setLock(false);
        // questions.options.classList.remove("select")
        questions.options.map((v) => {
          v.current.classList.remove("select");
          return null;
        });
      }
    }
  };

  const handlepre = () => {
    if (index > 0) {
      setIndex(index - 1);
    }
  };

  const handleReset = () => {
    setIndex(0);
    setLock(false);
    setScore(0);
    setResult(false);
    setAnswer({});
    setUserAns({})
  };
  console.log(answer, userAns);

  return (
    <div className="quiz-container">
      <h1>Quiz</h1>
      <hr />
      {result ? (
        <>
          <h3>
            🎉You Scored {score} of {data.length}
          </h3>
          {data?.map((v, i) => {
            let userAnswer = userAns[v._id];
            let corretAns = v.Answer;

            return (
              <div>
                <h3>
                  {i + 1}. {v?.question}
                </h3>
                <ul>
                  {v?.options?.map((v) => {
                    let iscoreect = v === corretAns;
                    let iswrong = v === userAnswer;

                    return (
                      <li
                        className={`${iscoreect ? "corret" : " "} ${iswrong && !iscoreect ? "worng" : " "}`}
                        onClick={(e) => {
                          checkAns(e, v);
                        }}
                      >
                        {v}
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
          <button className="button" onClick={() => handleReset()}>
            Reset
          </button>
        </>
      ) : (
        <>
          <h3>
            {index + 1}. {questions?.question}
          </h3>
          <ul>
            {questions?.options?.map((v) => (
              <li
                className={userAns[questions?._id] === v ? "select" : " "}
                onClick={(e) => {
                  checkAns(e, v);
                }}
              >
                {v}
              </li>
            ))}
          </ul>
          <div>
            <button className="button" onClick={() => handlepre()}>
              Previous
            </button>
            <button className="button" onClick={() => handlenext()}>
              Next
            </button>
          </div>
          <div className="index">
            {index + 1} of {data.length} questions
          </div>
        </>
      )}
    </div>
  );
}

export default Quiz;
