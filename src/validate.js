/**
  Validates the given email address and throws if the email isn't valid.

  @param {string} email
  @return {boolean}
*/
export function validateEmail(email) {
  if (typeof email !== "string") {
    throw new Error("Email should be a string!");
  }

  if (email.length > 254) {
    throw new Error("Email should be less than 254 characters long!");
  }

  // Email vaildator obtained from here:
  // https://regex101.com/r/lHs2R3/1
  const emailValid = /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/i.test(email);
  if (!emailValid) {
    throw new Error("Email should be a valid email link!");
  }

  return email
}

/**
  Validates the given phone number and throws if the number isn't valid.

  @param {string} phone
  @return {string}
*/
export function validatePhone(phone) {
  if (typeof phone !== "string") {
    throw new Error("Phone number should be a string!");
  }

  const phoneValid = /\d{3}-\d{3}-\d{4}/
  if (!phoneValid) {
    throw new Error("Phone number should be a valid US phone number!");
  }

  return phone;
}

/**
  Validates the given username and throws if the username isn't valid.

  @param {string} username
  @return {string}
*/
export function validateUsername(username) {
  if (typeof username !== "string") {
    throw new Error("Username should be a string!");
  }

  if (username.length < 3 || username.length > 32) {
    throw new Error("Username should be 3 to 32 characters long!");
  }

  const usernameValid = /^[a-zA-Z0-9_]+$/i.test(username);
  if (!usernameValid) {
    throw new Error(
      "Username should be made of letters, numbers, and underscores!"
    );
  }

  return username;
}

/**
  Validates the given password and throws if the password isn't valid.

  @param {string} password
  @return {boolean}
*/
export function validatePassword(password) {
  if (typeof password !== "string") {
    throw new Error("Password should be a string!");
  }

  if (password.length < 8 || password.length > 60) {
    throw new Error("Password should be 8 to 60 characters long!");
  }

  return password;
}
