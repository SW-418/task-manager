import mongoose from 'mongoose'

const createMongoConnection = () => {
    const connectionUrl = "mongodb://127.0.0.1:27017"
    const databaseName = "task-manager-api"
    const fullConnectionUrl = `${connectionUrl}/${databaseName}`

    mongoose.connect(fullConnectionUrl, {})
}

export { createMongoConnection }
