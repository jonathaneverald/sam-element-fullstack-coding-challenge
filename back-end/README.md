# How to Setup this project

Create .env file

```
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
```

```shell
npm install

npx prisma migrate dev

npx prisma generate

npm run build

npm run start
```
