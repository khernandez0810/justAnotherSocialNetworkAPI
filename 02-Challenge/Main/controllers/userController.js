const { User, Thought  } = require('../models');

module.exports = {
  // Get all Users
  getUsers(req, res) {
    User.find()
      .then((users) => res.json(users))
      .catch((err) => res.status(500).json(err));
  },
  // Get a single User
  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .select('-__v')
      .populate('friends')
      .populate('thoughts')
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No User with that ID' })
          : res.json(user)
      )
      .catch((err) =>{
        console.log(err);
        res.status(500).json(err)
      })
  },
  // Create a User
  createUser(req, res) {
    User.create(req.body)
      .then((newUser) => res.json(newUser))
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // Delete a User and associated thoughts
  deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.userId })
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No User with that ID' })
          : Thought.deleteMany({ _id: { $in: user.thoughts } })
      )
      .then(() => res.json({ message: 'User and thoughts deleted!' }))
      .catch((err) => res.status(500).json(err));
  },
  // Update a User
  updateUser(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No User with this id!' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },

  //Add Friend

  addFriend(req, res) {
    User.findOneAndUpdate({ _id: req.params.userId}, {$addToSet: {friends: req.params.friendId}}, {new:true})
    .then((user) => 
    !user
    ? res.status(404).json({ message:'no User found'})
    : res.json(user)
    )
    .catch((err) => res.status(500).json(err))
  },
//Remove Friend
removeFriend(req,res) {
  User.findOneAndUpdate({ _id: req.params.userId}, {$pull: {friends: req.params.friendId}}, {new:true})
  .then((user) => 
  !user
  ? res.status(404).json({ message:'no User found'})
  : res.json(user)
  )
  .catch((err) => res.status(500).json(err))
},
};
