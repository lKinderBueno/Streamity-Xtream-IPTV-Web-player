1. Open with a text editor (for example notepad++) config.js and complete empty fields ( window.dns). More instructions are available inside the file.
2. Open with a text editor (for example notepad++) config.php and write your mysql database info (database url, database name, username, password) and epg xml url. (if you don't use epg you can skip part 2 and 3)
3. Import "sql_table.sql" in your mysql database (if you are using phpMyAdmin click on "import" -> select the sql_table.sql and click on execute)

4. [OPTIONAL] Open with a text editor (for example notepad++) config.css if you want to change main color and background one.
5. [OPTIONAL] Change favicon.ico and img > banner_w.png

6. Copy and paste all the files in your server. Use the root folder, like http://domain.com/ (don't use folders like http://domain.com/player/ !)

To avoid wasting server resources, epg update will be triggered when an user login and database has less than 12 hours of programmes.
