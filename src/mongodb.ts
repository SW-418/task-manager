import mongodb from "mongodb"

const { MongoClient, ObjectID } = mongodb

const connectionUrl = "mongodb://127.0.0.1:27017"
const databaseName = "task-manager"


MongoClient.connect(connectionUrl, (error, client) => {
    if (error) {
        return console.log("Unable to connect to database!")
    }

    const db = client?.db(databaseName)

    // // Insert single user
    // const newUser = new User("Sam", "Wells", 69);
    // db?.collection("users").insertOne(newUser, (error, result) =>{
    //     if(error) {
    //         console.log("Unable to insert document")
    //         return console.log(error.message)
    //     }
    // })

    // // Insert multiple users
    // const newUser2 = new User("P", "Parker", 25);
    // const newUser3 = new User("S", "Scott", 420);
    // db?.collection("users").insertMany([newUser2, newUser3], (error, result) =>{
    //     if(error) {
    //         console.log("Unable to insert document")
    //         return console.log(error.message)
    //     }
    //     console.log(`# Items added: ${result?.insertedCount}`)
    // })

    // // Insert multiple Tasks
    // const task1 = new Task("Go shopping", false);
    // const task2 = new Task("Wash clothes", true);
    // const task3 = new Task("Send email", true);
    // db?.collection("tasks").insertMany([task1, task2, task3],
    //     (error, result) => {
    //     if(error) {
    //         console.log("Unable to insert document")
    //         return console.log(error.message)
    //     }
    //     console.log(`# Items added: ${result?.insertedCount}`)
    // })

    // // Find individual document
    // db?.collection("users").findOne({ firstName: "Jeff"}, (error, user) => {
    //     if(error) {
    //         return console.log("Unable to retrieve")
    //     }
    //     console.log(user)
    // })

    // // Find individual Task by ID
    // db?.collection("tasks").findOne({ _id: new ObjectID("61ca8479b73950e4e89e56c5")}, (error, task) => {
    //     if(error) {
    //         return console.log("Unable to retrieve")
    //     }
    //     console.log(task)
    // })

    // // Find all incomplete tasks
    // db?.collection("tasks").find({ completed: false }).toArray((error, task) => {
    //     if(error) {
    //         return console.log("Unable to retrieve")
    //     }
    //     console.log(task)
    // })

    // // Update a document
    // const promise = db?.collection("users").updateOne({_id : new ObjectID("61ca8308e6a13b8be2fea970")}, { $inc: { age: 2 } })
    //
    // promise?.then((response) => {
    //     console.log("Success!", response)
    // }).catch((error) => {
    //     console.error("Error!", error)
    // })

    // // Update a document
    // const promise = db?.collection("users").updateOne({_id : new ObjectID("61ca8308e6a13b8be2fea970")}, { $inc: { age: 2 } })
    //
    // promise?.then((response) => {
    //     console.log("Success!", response)
    // }).catch((error) => {
    //     console.error("Error!", error)
    // })

    // // Update all tasks to be complete
    // const promise = db?.collection("tasks").updateMany({ completed: false}, { $set: { completed: true } })
    //
    // promise?.then((response) => {
    //     console.log("Success!", response)
    // }).catch((error) => {
    //     console.error("Error!", error)
    // })

    // Delete single task by description
    const promise = db?.collection("tasks").deleteOne({description: "Send email"})
    promise?.then((response) => {
        console.log("Success!", response)
    }).catch((error) => {
        console.error("Error!", error)
    })
})
