[TOC]

# Create Database

```bash
mysql -u root -p < database_v0.sql
```



# Populate

```bash
node load_data.js load_data_v0.sql
```



You'll be prompted twice to enter in the password for user **root**
Its root b/c root has FILE privileges.

If you don't have a secure_file_priv location set up, this might not work.

See [Error](#Error)

# Clear Table Data

Clears all tables' data and resets numbering for auto-increment.

```bash
mysql -u root -p < empty_database_v0.sql
```



# Error

If you have the error when you are running command line above.

Error like this command:

```bash
secure_file_priv location is empty string "
```

Please go to your mysql bin folder, find the file like my.ini or my.cnf (depends on what you are using) and open it in editor.

Under [mysqld] add this command:

```bash
secure_file_priv="/usr/local/mysql-files"
​````

the path should be where the files stored

Then, restart mysql server. The error should gone now.

```



If you try to run mysql in terminal and it isn't found, make sure mysql is in your PATH environment variable.