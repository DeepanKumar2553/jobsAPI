const Job = require('../model/jobSchema')
const { StatusCodes } = require('http-status-codes')
const { NotFoundError, BadRequestError } = require('../errors')
const asyncWrapper = require('../middleware/asyncWrapper')

const getAllJobs = asyncWrapper(async (req, res) => {
    const job = await Job.find({ createdBy: req.user.userId })
    res.status(StatusCodes.OK).json({ job, count: job.length })
})

const getJob = asyncWrapper(async (req, res) => {
    const {
        params: { id: jobId },
        user: { userId }
    } = req
    const job = await Job.findOne({ _id: jobId, createdBy: userId })

    if (!job) {
        throw new NotFoundError(`No job with id ${jobId}`)
    }
    res.status(StatusCodes.OK).json({ job })
})

const createJob = asyncWrapper(async (req, res) => {
    req.body.createdBy = req.user.userId
    const job = await Job.create(req.body)
    res.status(StatusCodes.CREATED).json({ job })
})

const updateJob = asyncWrapper(async (req, res) => {
    const {
        body: { company, position },
        params: { id: jobId },
        user: { userId }
    } = req

    if (company === '' || position === '') {
        throw new BadRequestError('Please provide company and position')
    }

    const job = await Job.findByIdAndUpdate(
        { _id: jobId, createdBy: userId },
        req.body,
        { new: true, runValidators: true }
    )

    if (!job) {
        throw new NotFoundError(`No job with id ${jobId}`)
    }
    res.status(StatusCodes.OK).json({ job })
})

const deleteJob = asyncWrapper(async (req, res) => {
    const {
        params: { id: jobId },
        user: { userId }
    } = req
    const job = await Job.findByIdAndDelete({ _id: jobId, createdBy: userId })

    if (!job) {
        throw new NotFoundError(`No job with id ${jobId}`)
    }
    res.status(StatusCodes.OK).send('Job deleted successfully')
})

module.exports = {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob
}