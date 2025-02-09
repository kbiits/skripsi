# panduan menjalankan program

> pastikan .env sudah sesuai
> pastikan sudah melakukan npx prisma migrate pada backend

## pada backend folder

1. jalankan docker compose
```sh
docker compose up
```

2. install dependecies
```sh
npm install
```

3. lakukan migrate prisma
```sh
npx prisma migrate dev && npx prisma db push
```

4. jalankan backend
```sh
npm run start
```

## pada frontend folder

1. install dependecies
```sh
npm install
```

2. build nextjs
```sh
npm run build
```

3. jalankan nextjs
```sh
npm run start
```


