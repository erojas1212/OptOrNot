import React, { useState } from "react";
import axios from "axios";

export const UserContext = React.createContext();

const userAxios = axios.create();

userAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default function UserProvider(props) {
  const initState = {
    user: JSON.parse(localStorage.getItem("user")) || {},
    token: localStorage.getItem("token") || "",
    question: [],
    errMsg: "",
    questions: [],
  };

  const [userState, setUserState] = useState(initState);
  const [categories, setCategories] = useState([]);
  const [optionsLike, setOptionsLike] = useState([]);
  function signup(credentials) {
    axios
      .post("/auth/signup", credentials)
      .then((res) => {
        const { user, token } = res.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        setUserState((prevUserState) => ({
          ...prevUserState,
          user,
          token,
        }));
      })
      .catch((err) => handleAuthErr(err.response.data.errMsg));
  }

  function login(credentials) {
    axios
      .post("/auth/login", credentials)
      .then((res) => {
        const { user, token } = res.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        setUserState((prevUserState) => ({
          ...prevUserState,
          user,
          token,
        }));
      })
      .catch((err) => handleAuthErr(err.response.data.errMsg));
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUserState({
      user: {},
      token: "",
      todos: [],
    });
  }

  function handleAuthErr(errMsg){
    setUserState(prevState => ({
      ...prevState,
      errMsg
    }))
  }

  function resetAuthErr(){
    setUserState(prevState => ({
      ...prevState,
      errMsg: ""
    }))
  }

  function postQuestion(questionData) {
    userAxios
      .post("/api/questions", questionData)
      .then((res) => {
        const newQuestion = res.data;
        setUserState((prevUserState) => ({
          ...prevUserState,
          questions: [...prevUserState.questions, newQuestion],
        }));
      })
      .catch((err) => console.log(err.response.data.errMsg));
  }


  async function fetchCategories() {
    try {
      const response = await userAxios.get('/api/questions/categories'); // Corrected URL
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  }

  function likeOptionA(optionId) {
    userAxios.put(`/api/questions/likedA/${optionId}`)
    .then((res) => {
      setOptionsLike((prevOptions) =>
        prevOptions.map((option) =>
          optionId !== option._id ? option : res.data
        )
      );
      // setUserState((prevUserState) => ({
      //   ...prevUserState,
      //   option: prevUserState.option.map((option) =>
      //     optionId !== option._id ? option : res.data
      //   ),
      // }));
    })
    .catch((err) => console.log(err));
  }

  function likeOptionB(optionId) {
    userAxios
      .put(`/api/questions/likedB/${optionId}`)
      .then((res) => {
      setOptionsLike((prevOptions) =>
        prevOptions.map((option) => (optionId !== option._id ? option : res.data))
      )
      // setUserState((prevUserState) => ({
      //   ...prevUserState,
      //   option: prevUserState.option.map((option) =>
      //     optionId !== option._id ? option : res.data
      //   )
      // }));
    })
    .catch((err) => console.log(err));
  }

  return (
    <UserContext.Provider
      value={{
        ...userState,
        signup,
        login,
        logout,
        resetAuthErr,
        postQuestion,
        userAxios,
        fetchCategories,
        likeOptionA,
        likeOptionB,
        userState: userState,
        categories,
        optionsLike
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
}
