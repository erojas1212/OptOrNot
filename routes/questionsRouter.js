const express = require("express");
const questionsRouter = express.Router();
const Questions = require("../models/questions.js");

// Get all questions
questionsRouter.get("/", (req, res, next) => {
  Questions.find((err, questions) => {
    if (err) {
      res.status(500);
      return next(err);
    }
    return res.status(200).send(questions);
  });
});

//Get all questions with response count
questionsRouter.get("/allwithresponse", (req, res, next) => {
  Questions.aggregate(
    [
      {
        $lookup: {
          from: "responses",
          localField: "_id",
          foreignField: "question",
          as: "responses",
        },
      },
      {
        $addFields: {
          responseCount: { $size: "$responses" },
        },
      },
    ],
    (err, questionsWithResponses) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(200).send(questionsWithResponses);
    }
  );
});

// Get responses for a specific question
questionsRouter.get("/:questionId/responses", (req, res, next) => {
  const questionId = req.params.questionId;
  Questions.findById(questionId)
    .populate("responses")
    .exec((err, questionsWithResponses) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(200).send(questionsWithResponses.responses);
    });
});

//Add a new question
questionsRouter.post("/", async (req, res, next) => {
  try {
    const newQuestion = new Questions(req.body);

    const savedQuestion = await newQuestion.save();

    res.status(201).send(savedQuestion);
  } catch (err) {
    console.log(err);
    res.status(500);
    return next(err);
  }
});

// Update question
questionsRouter.put("/:questionId", (req, res, next) => {
  const questionId = req.params.questionId;

  Questions.findByIdAndUpdate(
    questionId,
    {
      text: req.body.text,
      options: req.body.options,
      category: req.body.category,
    },
    { new: true },
    (err, updatedQuestion) => {
      if (err) {
        res.status(500);
        return next(err);
      }
      res.status(200).send(updatedQuestion);
    }
  );
});

// Delete question
questionsRouter.delete("/:questionId", (req, res, next) => {
  const questionId = req.params.questionId;

  Questions.findByIdAndDelete(questionId, (err, deleteQuestion) => {
    if (err) {
      res.status(500);
      return next(err);
    }
    res.status(200).send(deleteQuestion);
  });
});

// Get Categories
questionsRouter.get("/categories", (req, res, next) => {
  Questions.distinct("category", (err, categories) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(200).send(categories);
  });
});

// Get Category by category
questionsRouter.get("/category/:category", (req, res, next) => {
  const category = req.params.category;
  Questions.find({ category }, (err, questions) => {
    if (err) {
      res.status(500);
      return next(err);
    }
    res.status(200).send(questions);
  });
});

//Like Option A
questionsRouter.put("/likedA/:optionId", (req, res, next) => {
  Questions.findOneAndUpdate(
    { _id: req.params.optionId },
    {
      $addToSet: { likedOptionA: req.auth._id },
      $pull: { likedOptionB: req.auth._id },
    },
    { new: true },
    (err, updatedQuestion) => {
      if (err) {
        res.status(500);
        return next(err);
      }
      return res.status(201).send(updatedQuestion);
    }
  );
});

//like OptionB
questionsRouter.put("/likedB/:optionId", (req, res, next) => {
  Questions.findOneAndUpdate(
    { _id: req.params.optionId },
    {
      $addToSet: { likedOptionB: req.auth._id },
      $pull: { likedOptionA: req.auth._id },
    },
    { new: true },
    (err, updatedQuestion) => {
      if (err) {
        res.status(500);
        return next(err);
      }
      return res.status(201).send(updatedQuestion);
    }
  );
});

module.exports = questionsRouter;
