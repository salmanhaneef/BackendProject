<h1>This is my backend Project with javascript</h1>

1.Talk to mongo database use try catch  because many error seens and handle in try catch block.

2. use mongo database connection use async and await because it takes time to connection.

3. I am learning how to connect to mongo database into two approch 

:first{
    main file all connections an configuration
},

 second:{
    make  a function on another folder like db and make a file and write a function to connect it and export this function
}

4.Define the function in this function store database name  and export it and use during the database creation.

5. I am load the dot env file one time and access it every time and every file. method:{

    first:
    import dotenv in main file and then config.env file.
    
    second: add this line in package.json in script tag like this:
    "dev": "nodemon -r dotenv/config --experimental-json-modules src/index.js"
}

6. app.use() in two casses one is any confiigration and other one   is use for middleware.

7. I am use express. json middleware bacause it allows specific limit of json data.

8. I am also use one more middleware 
express.urlencoder because it encode the url and set the specific limit of data to the url.

9. I am also use one more middleware like express.staic because it helps to save data like photos, images ,documentation i am  save this type of data in my own server , save into the like public folder.

10. i am use cookie parse package it can set cookies secure for browser and allow option like delete, update, view cookies of server .

11.Middleware :
     it is just like a gate for user check if user is capable for this functionality like user access one module after logedin, i am define function like if user is looged in to access this module.

12.Imp info:
app.get have four parameter(err,req,res,next)
in these arguments next is use to define a middleware or next is a flag to pass next module to allow access the user.
13. Then make a genralize function like i am talking mostly on database every time right a function ,I can make a genralize a function and access a function on any time and any place.
14.Then i am using node js error class because handle the error for proper standard format.
15. create a schema, index is true because i am using this field searching many times,this field is top searching on the mongo database.
16.Aggregation Pipeline:


17.Bcrypt and jwt:


18. Not use jwt and bcrypt directly use mongoose hooks like pre and post.

19. Customs method designed using mongoose:


20.Jwt is a bearer token means its look like a key to access data .

21.Mostly Access Token has short ecpiry period than refresh token period.


22.clodinary:


23.Fs:


24.Multer:


25.Http:


26.basic routes declaration is app.get bacause all the routes and controllers declared in one file but in otherhand the routes and controllers are seprate file use middleware and app.use can make a routes declaration.