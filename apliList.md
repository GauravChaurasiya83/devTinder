#devTinder APIs

authRouter
- POST /signup
- POST /login
- POST /logout

profileRouter
- GET /profile/view
- POST /profile/edit
- POST /profile/editPassword

connectionRequestRouter
- POST /request/send/interested/:userId
- POST /request/send/ignored/:userId

- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

userRouter
- GET /user/conections
- GET /user/requests/received
- GET /user/feed - gets you the profiles of others users on platform

Status - interested, ignored, accepted, rejected