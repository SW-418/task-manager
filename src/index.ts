import { ExpressApplication } from "./app"

const port = process.env.PORT

ExpressApplication.listen(port, () => {
    console.log(`App started on port ${port}`)
})
