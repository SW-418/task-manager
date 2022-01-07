import express, {NextFunction, Request, Response} from 'express'
import {authenticate} from '../middleware/authenticate';
import {UserDto} from "../models/dtos/user-dto";
import {JWTToken} from "../models/JWTToken";
import multer from "multer"
import {ErrorResponse} from "../models/error-response";
import sharp from "sharp";

const UserRouter = express.Router()

const multerOptions = multer({
    limits: {
        fileSize: 1000000 // Size in bytes
    },
    fileFilter(req: Express.Request, file: Express.Multer.File, callback: multer.FileFilterCallback) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return callback(new Error("File must have jpg, jpeg or png format"))
        }
        callback(null, true)
    }
})

UserRouter.post("/users", async (req: Request, res: Response) => {
    const user = new UserDto(req.body)

    try {
        await user.save();
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    } catch(error) {
        console.log(error)
        res.status(400).send(error)
    }
})

UserRouter.get("/users/me", authenticate, async (req: Request, res: Response) => {
    res.send(req.user)
})

UserRouter.patch("/users/me", authenticate, async (req: Request, res: Response) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['firstName', 'surname', 'age', 'password']
    const isValidUpdate = updates.every((item) => allowedUpdates.includes(item))

    if(!isValidUpdate) {
        return res.status(400).send("error: Invalid updates!")
    }

    try {
        req.user.firstName = req.body.firstName ? req.body.firstName : req.user.firstName
        req.user.surname = req.body.surname ? req.body.surname : req.user.surname
        req.user.age = req.body.age ? req.body.age : req.user.age
        req.user.email = req.body.email ? req.body.email : req.user.email
        req.user.password = req.body.password ? req.body.password : req.user.password

        await req.user.save()

        res.send(req.user)
    } catch(error) {
        res.status(500).send(error)
    }
})

UserRouter.delete("/users/me", authenticate, async (req: Request, res: Response) => {
    try{
        await req.user.remove()
        res.send(req.user)
    } catch(error) {
        res.status(500).send(error)
    }
})

UserRouter.post("/users/login", async (req: Request, res: Response) => {
    try {
        const user = await UserDto.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch(error) {
        console.log(error)
        res.status(400).send()
    }
})

UserRouter.post("/users/logout", authenticate, async (req: Request, res: Response) => {
    try {
        req.user.tokens = req.user.tokens.filter((current: JWTToken) => current.token != req.token)
        await req.user.save()
        res.send()
    } catch(error) {
        res.status(500).send("Error occurred trying to log out")
    }
})

UserRouter.post("/users/logoutall", authenticate, async (req: Request, res: Response) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch(error) {
        res.status(500).send("Error occurred trying to log out")
    }
})

UserRouter.post("/users/me/avatar", authenticate, multerOptions.single("avatar"), async (req: Request, res: Response) => {
    const buffer = await sharp(req.file?.buffer).png().resize({ width: 250, height: 250 }).toBuffer()

    req.user.avatar = buffer
    await req.user.save()
    res.send()
},
    (error: Error, req: Request, res: Response, next: NextFunction) => {
    const errorMessage = new ErrorResponse(400, error.message)
    res.status(400).send(errorMessage)
})

UserRouter.delete("/users/me/avatar", authenticate, async (req: Request, res: Response) => {
    try {
        req.user.avatar = undefined
        await req.user.save()
        res.send()
    } catch(error) {
        console.log(error)
        res.status(500).send(error)
    }
})

UserRouter.get("/users/:id/avatar", async (req: Request, res: Response) => {
    try {
        const user = await UserDto.findById(req.params.id)

        if(!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/jpg')
        res.send(user.avatar)
    } catch(error) {
        res.status(404).send()
    }
})

export { UserRouter }
