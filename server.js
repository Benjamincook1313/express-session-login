import express from "express";
import morgan from "morgan";
import nunjucks from "nunjucks";
import session from "express-session";

const app = express();

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: "somerandomstring",
  saveUninitialized: true,
  resave: false,
}));

nunjucks.configure("views", {
  autoescape: true,
  express: app
});

const people = [
  {
    email: "hello@email.com",
    password: "password1234"
  },
  {
    email: "ben@email.com",
    password: "asdf1234"
  },
  {
    email: "jamin@email.com",
    password: "asdf;lkj"
  }
];

app.get("/", (req, res) => {
  if(req.session.email){
    res.render("dashboard.html", {email: req.session.email});
  }else{
    res.render("home.html");
  }
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  // loginlogic
  // loop over people array
  // find a matching email
  const user = people.filter(person => person.email === email);
  // check if passwords match
  if(user[0]){
    if(user[0].password === password){
      req.session.email = email;
      req.session.password = password;
      
      // render dashboard if user found & password match
      res.render("dashboard.html", { email, password });
    }else{
      res.sendStatus(401);
    }
  }else{
    res.sendStatus(404);
  }
  //  else send bad status code

});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    err? console.log(err): res.redirect("/");
    // if(err){
    //   console.log(err)
    // }else{
    //   res.redirect("/");
    // }
  })
});

app.listen(8080, () => console.log("Server is up on port 8080"));