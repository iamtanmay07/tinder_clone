# APIs for tinder clone 

authRouter
- POST /signup 
- POST /login
- POST /logout

profileRouter
- GET /profile/view 
- GET /prpfile/edit 
- PATCH /profile/password 

connectionRequestRouter
- GET /request/send/interested/:userId
- GET /request/send/ignored/:userId
- POST /request/review/accept/:requestedID
- POST /request/review/reject/:requestedID

userRouter
- GET /user/connections
- GET /user/feed
- GET /user/requests
