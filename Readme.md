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