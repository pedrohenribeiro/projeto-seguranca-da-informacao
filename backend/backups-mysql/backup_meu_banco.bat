@echo off
rem ----------------------------
rem Script de backup diário MySQL
rem ----------------------------

rem Gera timestamp no formato YYYY-MM-DD_HH-MM-SS
set TIMESTAMP=%DATE:~6,4%-%DATE:~3,2%-%DATE:~0,2%_%TIME:~0,2%-%TIME:~3,2%-%TIME:~6,2%

rem Caminho completo do arquivo de saída
set OUTFILE="C:\Users\pedri\OneDrive\Desktop\SPRINT 3\projeto-seguranca-da-informacao\backend\backups-mysql\projeto_lgpd_%TIMESTAMP%.sql"

rem Executa o mysqldump
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqldump.exe" ^
  -u root ^
  -psofia ^
  -h 127.0.0.1 ^
  -P 3306 ^
  projeto_lgpd > %OUTFILE%

rem Se quiser apagar manualmente, descomente abaixo:
rem forfiles /p "C:\Users\pedri\OneDrive\Desktop\SPRINT 3\projeto-seguranca-da-informacao\backend\backups-mysql" /m *.sql /d -7 /c "cmd /c del @file"
