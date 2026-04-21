@echo off
:loop
git add .
git commit -m "Auto-sync: Consortium Masterwork Update"
git push
timeout /t 60
goto loop
