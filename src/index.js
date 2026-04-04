import readline from "readline";
import bcrypt from "bcrypt";
import app from "./app.js";
import { registerUser, getOwner } from "./db.js";
import {
  validateUsername,
  validatePassword,
  validateEmail,
  validatePhone
} from "./validate.js";

const PORT = process.env.PORT || 4000;

const owner = await getOwner();
if (!owner) {
  const SALT_ROUNDS = 10;
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  /**
    Prompts the user with a question.

    @param {string} question
    @return {Promise<string>}
  */
  const askQuestion = (question) => {
    return new Promise((resolve) => {
      rl.question(question, (answer) => resolve(answer));
    });
  };

  console.log("No owner created!");
  const ownerEmail = await askQuestion("Enter the owner's email address: ");
  const ownerPhone = await askQuestion("Enter the owner's phone number: ");
  const ownerUsername = await askQuestion("Enter the owner's username: ");
  const ownerPassword = await askQuestion("Enter the owner's password: ");

  try {
    validateUsername(ownerUsername);
    validatePassword(ownerPassword);
    validateEmail(ownerEmail);
    validatePhone(ownerPhone);

    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const passwordHash = await bcrypt.hash(ownerPassword, salt);

    await registerUser(
      ownerUsername,
      passwordHash,
      ownerEmail,
      ownerPhone
    );
  } catch (err) {
    console.error(`Failed to create owner!\n${err}`);
    process.exit(1);
  }
}

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});
