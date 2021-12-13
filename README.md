## Description

[File Encoder Api] project

## Setup

```bash
$ yarn install
```

```bash
$ yarn run build
```

## Running the app

# development

```bash
$ yarn run start
```

#  watch mode
```bash
$ yarn run start:dev
```

## Test
```bash
$ yarn run test
```

## Commentary
App is running on port 3000. The Api documentation can be found at `/api/doc`

# Default existing users:
```
email: piotr@gmail.com
password: password1

email: mateusz@gmail.com
password: password2

email: tadek@gmail.com
password: password3
```

# The app is using the following env variables:
```
JWT_SECRET - secret used for generating jwt tokens
JWT_EXPIRY_TIME - the time after which the jwt tokens expire

USER_EMAIL - users created in the database by default in CSV
USER_PASSWORDS - passwords for users created by default in CSV (1st email ->1st password, 2nd email -> 2nd password etc.)
```



### Old doc:
## Commentary

Passwords have been implemented in plain text on purpose.
The API documentation is available at 
```
localhost:3000/api/doc
```

In order to create a user send a request to `/api/register`, the body should be as follows:
```
{
  email: "email@email.com",
  password: "password"
}
```

In order to use the encrypting capabilities you need to 

1. Register `api/register`
2. Sign in using credentials `api/sign-in`
3. Generate RSA Key for you users using `api/generate-key-pair` endpoint
4. Now you can encrypt and decrypt data using `api/encrypt` and `api/decrypt` endpoints respectively
5. If no data is provided then a default `sample.pdf` file will be encoded

## IMPORTANT
You need to run 
```bash
$ yarn run build
```
command before hand, in order to copy over the `sample.pdf` file during compilation, and create folders required by the database. Otherwise the file will be unavailable for encryption.




