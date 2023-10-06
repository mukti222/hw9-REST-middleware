npm init -y
npm i express pg
npm i nodemon
npm i body-parser
npm i jsonwebtoken
npm i cookie-parser
npm i swagger-ui-express swagger-jsdoc
npm i morgan


langkah2 dan logika
1. buat koneksi pool DB di query.js
2. buat CRUD get, put, post, delete (movie.js)
3. buat generatetoken pake jwt di (generate.js) 
4. buat users/signin yang isinya generatetoken (nanti mengubah email, password jdi token unik)
5. buat middleware utk autentifikasi jwt.VERIFY token unik tadi dan fungsi next() di middleware.js
6. implementasikan middleware di movie.js (CRUD)
7. implementasi SWAGGER


langkah percobaan postman dan Swagger
1. POST http://localhost:3000/users/signin
body json: pake email dan password dari Database users misalnya : {"email" : "oainger0@craigslist.org", "password" : "KcAk6Mrg7DRM"}
lalu copy accessToken

2. GET http://localhost:3000/movies?page=1&limit=5
Header : buat authorization isinya accesstoken tadi
Berhasil get movie

3. Swagger docs: buka http://localhost:3000/api-docs/
klik Authorization KUNCI HIJAU
post /users/signin
get /movies

![Screenshot 2023-10-06 140838](https://github.com/mukti222/hw9-REST-middleware/assets/135799527/d6e7fdee-0cfa-4098-82c6-088d92479363)

