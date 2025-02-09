const express = require("express");
const router = express.Router();
const cors = require("cors");
const nodemailer = require("nodemailer");

// server used to send send emails
const app = express();

// Configure CORS
const corsOptions = {
  origin: ["http://localhost:3000", "https://next-gen-makers.onrender.com"], // Add all allowed origins here
  methods: "GET,POST",
  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/", router);

app.listen(5000, () => console.log("Server Running"));
console.log(process.env.EMAIL_USER);
console.log(process.env.EMAIL_PASS);

const contactEmail = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "moatazghabri@gmail.com",
    pass: "dqkkbjwvpugivxen",
  },
});

contactEmail.verify((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Ready to Send");
  }
});

router.post("/contact", (req, res) => {
  const name = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const message = req.body.message;
  const phone = req.body.phone;
  const mail = {
    from: name,
    to: "moatazghabri@gmail.com",
    subject: `Nouveau message de ${name} ${lastName}`,
    html: ` <div style=" max-width: 600px;
       margin: 0 auto; border: 2px solid #3498db; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
      <h2 style="color: #3498db;
      text-align: center;
      padding: 10px;
      border-radius: 5px;">Nouveau Message</h2>
      <p><strong>Nom:</strong> ${name}</p>
      <p><strong>Prenom:</strong> ${lastName}</p>
      <p><strong>E-mail:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Message:</strong><br> ${message}</p>
      <h2 style=" background-color: #3498db;
      color: white;
      text-align: center;
      padding: 10px;
      border-radius: 5px;">  © NGM</h2>
    </div>
  `,
  };
  contactEmail.sendMail(mail, (error) => {
    if (error) {
      res.json(error);
    } else {
      res.json({ code: 200, status: "Message Sent" });
    }
  });
});
