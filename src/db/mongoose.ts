import mongoose from 'mongoose'

const createMongoConnection = () => {
    const connectionUrl = process.env.MONGODB_URL
    const databaseName = "task-manager-api"
    const fullConnectionUrl = `${connectionUrl}/${databaseName}`

    mongoose.connect(fullConnectionUrl, {})
}

export { createMongoConnection }
