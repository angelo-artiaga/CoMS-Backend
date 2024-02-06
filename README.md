# Compliance Management System

## Getting Started

Clone the repository

```
git clone https://github.com/sui-tyan/CoMS-Backend.git
```

After cloning the repository run this command to install dependencies

```
npm install
```

or if you're using yarn

```
yarn install
```

## Note

You need to install knex globally to use their CLI

```
npm install -g knex
```

or in yarn

```
yarn global add knex
```

## ORM

To initialize

```
knex init
```

To create a migration file

```
knex migrate:make <table_name>
```

To apply migration

```
knex migrate:latest
```

To rollback

```
knex migrate:rollback
```
