CREATE TABLE "users" (
  "id" bigserial PRIMARY KEY,
  "username" varchar(30) UNIQUE,
  "password" varchar(100),
  "type" varchar(50)
);
