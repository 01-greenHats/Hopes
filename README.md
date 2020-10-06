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

The Idea of the project is to link the people in need with the people that wants to help them
 
# Wireframes

## Home Page

![home](/assets/homePage.jpg)

## User Signin

![signin](/assets/userSignin.jpg)

## User signup

![signup](/assets/userSignup.jpg)

## Donor signin

![signin](/assets/donorSignin.jpg)

## Donor Signup

![signup](/assets/donorSignup.jpg)

## Home Posts

![homePosts](/assets/homePosts.jpg)

## Donations Posts

![donationPosts](/assets/donationPosts.jpg)





# User Stories

- As a user/donor I want to sign up
- As a user/donor I want to sign in
- As a user/donor I want to sign in using Gmail
- As a user/donor I want to be able to edit my account data
- As a user/donor I want to see al the posts
- As a user/donor I want to publish a post 
- As a user/donor I want to comment on posts 
- As a user/donor I want to delete my posts 
- As a user/donor I want to edit my comments

- As a user, I want to be notified by email if I received any donation
- As a user, I want to see my donations history ordered by donation date

- As a donor, I want to see a list of users 
- As a donor, I want to search for the users by their national no
- As a donor, I want to see all the user's donations history ordered by donation date
- As a donor, I want to be able to see all the users details data
- As a donor, I want to transfer money to the user

- As an admin, I want to validate the in-need person's account.


# Domain Modeling

![domain](/assets/workflow.jpg)

# UML
[link](https://miro.com/app/board/o9J_kj2Cl6s=/)

![uml](/assets/uml.JPG)


# Setup

## Installation 

- Open your terminal

- Clone the repo `git clone https://github.com/01-greenHats/Hopes.git`

- Write `npm install` to install all the dependencies

## .env requirements

- PORT - Port Number
- DATABAsE_URL - mongodb://localhost:27017/hopes
- CLIENT_ID - 82394101385-etk6j4a51uavmfnsg83uc7ccsc5nc0if.apps.googleusercontent.com
- CLIENT_SECRET - y88OeZ6j_oTqHkP7N1fnKZ-G
- TOKEN_SECRET - donttellanyoneRoqaia

## Start the server

- In your terminal write `node .` to start the local server

## ReST testing tool

##### Postman

- POST

  - Users/donors/admins signup

        `http://localhost:3030/api/v1/donors/signup`
        
        `http://localhost:3030/api/v1/users/signup`
        
        `http://localhost:3030/api/v1/admins/signup`

  - users/donors/admins signin

       `http://localhost:3030/api/v1/donors/signin`

       `http://localhost:3030/api/v1/users/signin`

       `http://localhost:3030/api/v1/admins/signin`

  - Add posts

       `http://localhost:3030/api/v1/users/posts/add`

       `http://localhost:3030/api/v1/donors/posts/add`

  - Add comments

      `http://localhost:3030/api/v1/users/comments/:postId`

      `http://localhost:3030/api/v1/donors/comments/:postId`


- GET

  - View all posts/donors/users/admins

     `http://localhost:3030/api/v1/posts`

     `http://localhost:3030/api/v1/users`

     `http://localhost:3030/api/v1/donors`

     `http://localhost:3030/api/v1/admins`

- Patch

  - Edit comments

    `http://localhost:3030/api/v1/users/comments/edit/:id/:commentId`

    `http://localhost:3030/api/v1/donors/comments/edit/:id/:commentId`


- Delete

  - Delete comments 

    `http://localhost:3030/api/v1/users/comments/delete/:id/commentId`

    `http://localhost:3030/api/v1/donors/comments/delete/:id/commentId`


  - Delete posts

    `http://localhost:3030/api/v1/users/posts/delete/:id`

    `http://localhost:3030/api/v1/donors/posts/delete/:id`


# Tests

- Unit Tests: `npm run test`
- [tests report]()


# Contribution

- [Ahmad Shela](https://github.com/AhmedShela)
- [Roukia Salahi](https://github.com/roukiAsalahi)
- [Ahmad Hirthani](https://github.com/AhmadHirthani)
- [Hisham Al Naji](https://github.com/HishamAlNaji)


# License

Distributed under the MIT License. See [LICENSE](https://www.mit.edu/~amini/LICENSE.md) for more information.
