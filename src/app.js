const express = require('express');

const app = express();

app.use(
    "/admin/getAllData", (req, res, next) => {
        const token = "xz";
        const isAuth = token === "xyz";
        if(isAuth){
            res.send("got all the data!");
        }
        else{
            res.status(401).send("Not Authenticated!!");
        }
    },
);

app.use(
    "/admin/deleteUser", (req, res, next) => {
        const token = "xyz";
        const isAuth = token === "xyz";
        if(isAuth){
            res.send("deleted the user");
        }
        else{
            res.status(401).send("Not Authenticated!!");
        }
    },
);


app.listen(3000, () => {
    console.log('Server is running on port 3000')
});

/* output : 

*/