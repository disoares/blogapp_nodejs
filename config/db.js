if (process.env.NODE_ENV == "production") {
    module.exports = {
        mongoURI: "mongodb+srv://diegoblogapp:metalcore123@cluster0.fbizw.mongodb.net/blogapp?retryWrites=true&w=majority"
    }
} else {
    module.exports = {
        mongoURI: "mongodb://localhost/blogapp"
    }
}