import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET;

// Helper to sign JWT
function createToken(id) {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: "7d" });
}

// REGISTER
app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, password, fullName, institution, bio,
            nativeLanguages, learningLanguages, proficiencyLevels } = req.body;

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(400).json({ message: "Email already used." });

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        fullName,
        institution,
        bio,
        nativeLanguages: JSON.stringify(nativeLanguages),
        learningLanguages: JSON.stringify(learningLanguages),
        proficiencyLevels: JSON.stringify(proficiencyLevels),
      },
    });

    const token = createToken(user.id);
    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        institution: user.institution,
        bio: user.bio,
        nativeLanguages,
        learningLanguages,
        proficiencyLevels
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// LOGIN
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(400).json({ message: "Invalid credentials" });

  const token = createToken(user.id);
  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      institution: user.institution,
      bio: user.bio,
      nativeLanguages: JSON.parse(user.nativeLanguages),
      learningLanguages: JSON.parse(user.learningLanguages),
      proficiencyLevels: JSON.parse(user.proficiencyLevels),
    }
  });
});

app.listen(4000, () => console.log("Server running on http://localhost:4000"));
