export class Task {
    ownerId: string
    description: string
    completed: boolean

    constructor(ownerId: string, description: string, completed: boolean) {
        this.ownerId = ownerId
        this.description = description;
        this.completed = completed;
    }
}
