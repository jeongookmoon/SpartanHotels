# Script Commands

## `npm run db <command> <version>`

## <Command>

- build

    Creates database in mysql using database_<version>.sql 

- load

    Copies csv files and loads database in mysql according to load_data_<version>.sql 

- reset

    Equivalent to clear and then reset

- clear

    Clears data from mysql according to empty_database_<version>.sql 

## <Version>

Format is `v#.#`

## Examples

`npm run db build v0`

`npm run db load v0.2`

`npm run db reset v0`

`npm run db clear v0`

