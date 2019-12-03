class User {
    _id: String
    email: String
    password: String
    constructor(email: String, password: String){
        this.email = email,
        this.password = password
    }
}
export default User;