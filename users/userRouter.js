const express = require("express");
const db = require("./userDb");
const Posts = require("../posts/postDb");

const router = express.Router();

//router.use(express.json());
// router.use(validatePost);
// router.use("/:id", validateUserId, validateUser);
// router.use("/:id", validateUserId, validatePost);

router.post("/", validateUser, (req, res) => {
  // do your magic!
  db.insert(req.body)
    .then((newUser) => {
      res.status(200).json(newUser);
    })
    .catch((err) => {
      res.status(500).json({
        err,
        errorMessage: "Can't make new user.",
      });
    });
});

router.post("/:id/posts", validateUserId, validatePost, (req, res) => {
  // do your magic!
  Posts.insert({ text: req.body.text, user_id: req.params.id })
    .then((newPost) => {
      res.status(200).json(newPost);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        err,
        errorMessage: "Can't make new post.",
      });
    });
});

router.get("/", (req, res) => {
  // do your magic!
  db.get()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      res.status(500).json({
        err,
        errorMessage: "Can't retrieve users.",
      });
    });
});

router.get("/:id", validateUserId, (req, res) => {
  //do your magic!
  db.getById(req.params.id)
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      res.status(404).json({
        err,
        errorMessage: "Can't retrieve user.",
      });
    });
});

router.get("/:id/posts", validateUserId, (req, res) => {
  // do your magic!

  db.getUserPosts(req.params.id)
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((err) => {
      res.status(500).json({
        err,
        errorMessage: "Can't retrieve users posts.",
      });
    });
});

router.delete("/:id", validateUserId, (req, res) => {
  // do your magic!
  db.remove(req.params.id)
    .then((count) => {
      count === 1
        ? res.status(200).json({
            message: `${count} user was removed from database.`,
          })
        : res.status(500).json({
            err,
            errorMessage: "Can't remove user.",
          });
    })
    .catch((err) => {
      res.status(500).json({
        err,
        errorMessage: "Can't remove user.",
      });
    });
});
router.put("/:id", validateUser, validateUserId, (req, res) => {
  // do your magic!
  db.update(req.params.id, req.body)
    .then((count) => {
      count === 1
        ? res.status(200).json({
            message: `${count} user was updated in database.`,
          })
        : res.status(500).json({
            err,
            errorMessage: "Can't update user.",
          });
    })
    .catch((err) => {
      res.status(500).json({
        err,
        errorMessage: "Can't update user.",
      });
    });
});
//custom middleware

function validateUserId(req, res, next) {
  // do your magic!
  db.getById(req.params.id)
    .then((user) => {
      if (user) {
        req.user = user;
        next();
      } else {
        res.status(400).json({
          errorMessage: "Invalid User ID",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "Error connecting to database.",
      });
    });
}

function validateUser(req, res, next) {
  // do your magic!

  if (Object.keys(req.body).length !== 0) {
    req.body.name
      ? next()
      : res.status(400).json({
          message: "missing required name field",
        });
  } else {
    res.status(400).json({
      message: "missing user data",
    });
  }
}

function validatePost(req, res, next) {
  // do your magic!

  if (Object.keys(req.body).length !== 0) {
    req.body.text
      ? next()
      : res.status(400).json({
          errorMessage: "missing required text field.",
        });
  } else {
    res.status(400).json({
      message: "Missing post data",
    });
  }
}

module.exports = router;
