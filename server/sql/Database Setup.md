[TOC]

# Create Database

```bash
mysql -u root -p < database_v0.sql
```



# Populate

```bash
node load_data.js load_data_v0.sql
```



You'll be prompted twice to enter in the password for user **cmpe165**

If you don't have a secure_file_priv location set up, this might not work.