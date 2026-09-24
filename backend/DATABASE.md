Create and apply your first migration
Create your first migration to set up the database tables:
>> npx prisma migrate dev --name init


This command creates the database tables based on your schema.
Now run the following command to generate the Prisma Client:
>> npx prisma generate

