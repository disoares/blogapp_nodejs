/*
COMANDOS GIT

(RETIRAR A PASTA NODE_MODULES NO ARQUIVO .gitignore)
git init
git add .
git commit -am "texto a ser commitado"
git remote add origin https://github.com/disoares/blogapp_nodejs.git
git push --force -u origin master

*/

/*
COMANDOS HEROKU

heroku login
heroku git:remote -a blogappnodejsdiego
git push heroku master
heroku open

*/

/*
REPOSITÓRIOS UTILIZADOS

npm init --yes
npm install express
npm install handlebars
npm install body-parser
npm install mongoose
npm install --save express-session (para controlar sessão)
npm install --save connect-flash (para usar os flashes)
npm install bcryptjs (para criptografias)
npm install passport (para controle de autenticação)
npm install passport-local (para autenticação em DB próprio)
*/

// Carregando módulos "nativos"
const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const app = express();
const path = require("path");
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');

// Carregando módulos importados
const adminRoutes = require("./routes/admin");
const mainRoutes = require("./routes/main");
const userRoutes = require("./routes/user");
const db = require("./config/db");

// Passport
const passport = require('passport');
require('./config/auth')(passport);

/**************** CONFIGS ***************/

// Sessão
app.use(session({
    secret: "cursodenode",
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Middleware
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.warning_msg = req.flash("warning_msg");
    res.locals.error = req.flash("error");
    res.locals.user = req.user || null;
    next();
});

// Config template engine (handlebars)
app.engine('handlebars', handlebars({
    templateLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Config Body Parser (body-parser)
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());





// Mongoose
mongoose.Promise = global.Promise;
mongoose.connect(db.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("MongoDB conectado...");
}).catch((err) => {
    console.log("Falha ao tenta se conectar com MongoDB: " + err);
});





// Public
app.use(express.static(path.join(__dirname, "public")));





/**************** ROUTES ***************/
app.use("/", mainRoutes);
app.use("/admin", adminRoutes);
app.use("/usuario", userRoutes);





/**************** OTHERS ***************/
const PORT = process.env.PORT || 8081;
var data = new Date().getDay() + "/" + new Date().getMonth() + "/" + new Date().getFullYear() + " " + new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds()
app.listen(PORT, () => {
    console.log("Servidor rodando em: localhost:" + PORT + " -- " + data);
});