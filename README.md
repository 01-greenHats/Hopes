#  Hopes

## Table of Contents

- [About the Project](#about-the-project)
- [Wireframes](#Wireframes)
- [User Stories](#User-Stories)
- [Domain Modeling](#Domain-Modeling)
- [Setup](#Setup)
- [UML](#UML)
- [Tests](#Tests)
- [Contribution](#Contribution)
- [License](#license)


# About the Project

the Idea of the project is to link the people in need with the people that wants to help them
 
# Wireframes

## Home page

![home](/assets/homePage.jpg)

## user signin

![signin](/assets/userSignin.jpg)

## user signup

![signup](/assets/userSignup.jpg)

## donor signin

![signin](/assets/donorSignin.jpg)

## donor signup

![signup](/assets/donorSignup.jpg)


# User Stories

- as a user/donor I want to sign up
- as a user/donor I want to sign in
- as a user/donor I want to sign in using gmail
- as a user/donor I want to be able to edit my personal data
- as a user/donor I want to see al the posts
- as a user/donor I want to publish a post 
- as a user/donor I want to comment on posts 
- as a user/donor I want to delete my posts 
- as a user/donor I want to edit my comments

- as a user I want to be notefied by email if i recived any donation
- as a user I want to see my donations history ordered by donation date

- as a donor I want to see a list of users 
- as a donor I want to search on the users by national no
- as a donor I want to see al the users donations history ordered by donation date
- as a donor I want to be able to see all the users details data
- as a donor I want to transfare money to the user


# Domain Modeling

![domain](/assets/workflow.jpg)

# UML
[link](https://miro.com/app/board/o9J_kj2Cl6s=/)

![uml](/assets/uml.JPG)


# Setup

## installation 

- open your terminal

- Clone the repo `git clone https://github.com/01-greenHats/Hopes.git`

- write `npm install` to install all the dependencies

## .env requirements

- PORT - Port Number
- DATABASE_URL - mongodb://localhost:27017/hopes
- CLIENT_ID - 82394101385-etk6j4a51uavmfnsg83uc7ccsc5nc0if.apps.googleusercontent.com
- CLIENT_SECRET - y88OeZ6j_oTqHkP7N1fnKZ-G
- TOKEN_SECRET - donttellanyoneRoqaia

## start the server

- in your terminal write `node .` to start the local server

## ReST testing tool

- postman

- POST

  - users/donors/admins signup

`http://localhost:3030/api/v1/donors/signup`

`http://localhost:3030/api/v1/users/signup`

`http://localhost:3030/api/v1/admins/signup`

- users/donors/admins signin

`http://localhost:3030/api/v1/donors/signin`

`http://localhost:3030/api/v1/users/signin`

`http://localhost:3030/api/v1/admins/signin`

- add posts

`http://localhost:3030/api/v1/users/posts/add`

`http://localhost:3030/api/v1/donors/posts/add`

- add comments

`http://localhost:3030/api/v1/users/comments/:postId`

`http://localhost:3030/api/v1/donors/comments/:postId`


- GET

  - view all posts/donors/users/admins

`http://localhost:3030/api/v1/posts`

`http://localhost:3030/api/v1/users`

`http://localhost:3030/api/v1/donors`

`http://localhost:3030/api/v1/admins`

- Patch

  - edit comments

`http://localhost:3030/api/v1/posts/comments/:postId/:commentId`


- Delete

  - delete comments 

`http://localhost:3030/api/v1/users/comments/delete/:id/commentId`

`http://localhost:3030/api/v1/donors/comments/delete/:id/commentId`


  - delete posts

`http://localhost:3030/api/v1/users/posts/delete/:id`

`http://localhost:3030/api/v1/donors/posts/delete/:id`


# Tests

- Unit Tests: `npm run test`
- [tests report]()


# Contribution

- [Ahmad Shela](https://github.com/AhmedShela)
- [Roukia Salahi](https://github.com/roukiaSalahi)
- [Ahmad Hirthani](https://github.com/AhmadHirthani)
- [HishamAl Naji](https://github.com/HishamAlNaji)


# License

Distributed under the MIT License. See [LICENSE](https://www.mit.edu/~amini/LICENSE.md) for more information.