export interface UserSession {
    account: AccountObject,
    expires: string,
    session: string
}

interface AccountObject {
    id: number
    username: string
    owner: boolean
}
