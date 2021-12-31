import { UserDto } from '../../src/models/dtos/user-dto.js'

declare global {
    namespace Express {
        interface Request {
            user: UserDto
            token: string
        }
    }
}
