import { faker } from "@faker-js/faker";

export const generateRandomPassword = () => {
  // https://regexr.com/8dm04
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

  let password = faker.internet.password({
    length: 8,
  });

  while (!regex.test(password)) {
    password = faker.internet.password({
      length: 8,
    });
  }

  return password;
};

export const createUser = () => {
  const displayName = faker.internet.displayName();
  const username = faker.internet.username();
  const password = generateRandomPassword();

  return Object.freeze({ displayName, username, password });
};
