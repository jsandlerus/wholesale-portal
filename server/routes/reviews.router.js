const express = require('express')
const router = express.Router()
const async = require('async')
// {!} ADD REJECTUNAUTHENTICATED MIDDLEWARE TO ALL PRIVATE ROUTES
const {
    rejectUnauthenticated
} = require('../modules/authentication-middleware')
const Review = require('../schemas/reviewSchema')

// @route   GET /reviews/all/:page_size/:page_num
// @:page_size size of return
// @:page_num number of return
// @desc    Returns page_size reviews of page_number
// @access  Private
router.get('/all', (req, res) => {
    Review.find()
          .then(reviews => res.json(reviews))
          .catch(error => {
             console.log(error)
             res.status(500).send('no reviews found')
          })
})

// @route   GET /reviews/oneReview/:reviewId
// @desc    Returns the specified review
// @access  Private
router.get('/oneReview/:reviewId', (req, res) => {
    Order.findById(req.params.reviewId)
        .then(review => res.json(review))
        .catch(error => {
            console.log(error)
            res.status(500).send('review not found')
        })
})

// @route   GET /reviews/from/
// @desc    Returns page_size reviews of page_number from user
// @:page_size size of return
// @:page_num number of return
// @access  Private
router.get('/from/:page_size/:page_num', (req, res) => {
    const skips = req.params.page_size * (req.params.page_num - 1)

    Review.find({ user: req.user._id })
        .skip(skips)
        .limit(parseInt(req.params.page_size, 10))
        .then(reviews => {
            res.json(reviews)
        })
        .catch(error => {
            console.log(error)
            res.status(500).send('Error finding reviews from this id')
        })
})

// @route   POST /reviews/newReview/
// @desc    Returns a new Review for the selected product
// @req     {review: string, starts: number 1-5}
// @access  Private
router.post('/newReview/:productID', (req, res) => {
    const userID = req.user._id
    const userName = req.user.name
    const product = req.params.productID
    const review = req.body.review
    const stars = req.body.stars

    const newReview = new Review({
        user: userID,
        userName: userName,
        product: product,
        review: review,
        stars: stars
    })
    newReview
        .save()
        .then(review => res.json(review))
        .catch(err => console.log(err))
})

// @route   POST /reviews/editReview/:reviewID
// @req     {review: string, stars: number 1-5}
// @desc    Returns review with changed fields
// @access  Private
router.post('/editReview/:reviewID', (req, res) => {
    const newReview = req.body.review;
    const newStars = req.body.stars;
    Review.findById(req.params.reviewID)
        .then(review => {
        review
            .updateOne({ review: newReview, stars: newStars })
            .then(review => res.json(review))
            .catch(error => {
                console.log(error)
                res.status(500).send("Couldn't edit review")
            })
    })
})

// @route   DELETE /reviews/:reviewID
// @desc    Delete a Review
// @access  Private
router.delete('/:reviewID', (req, res) => {
    Review.findById(req.params.reviewID)
          .then(review => review.remove().then(() => res.json({ success: true })))
          .catch(err => {
             console.log(err)
             res.status(500).json("Can't delete review")
          })
})

// @route   DELETE /reviews/deleteAllReviewsFromUser
// @desc    Deletes all the reviews made by active user
// @access  Private
router.delete('/deleteAllReviewsFromUser', (req, res) => {
    Order.find({user: req.user._id})
        .then(reviews => reviews.remove().then(() => res.json({ success: true })))
        .catch(error => {
            console.log(error)
            res.status(500).send("Couldn't delete reviews")
        })
})

module.exports = router
