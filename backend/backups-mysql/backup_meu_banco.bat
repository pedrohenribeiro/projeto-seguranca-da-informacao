@echo off

set TIMESTAMP=%DATE:~6,4%-%DATE:~3,2%-%DATE:~0,2%_%TIME:~0,2%-%TIME:~3,2%-%TIME:~6,2%

set OUTFILE="C:\Users\pedri\OneDrive\Desktop\SPRINT 3\projeto-seguranca-da-informacao\backend\backups-mysql\projeto_lgpd_%TIMESTAMP%.sql"

"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqldump.exe" ^
  -u root ^
  -psofia ^
  -h 127.0.0.1 ^
  -P 3306 ^
  projeto_lgpd > %OUTFILE%
