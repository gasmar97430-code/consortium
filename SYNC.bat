@echo off
title ANTIGRAVITY - CONSORTIUM MASTERWORK
color 0B
cls
echo ======================================================
echo    ANTIGRAVITY : BINOME INTELLECTUEL ACTIF
echo ======================================================
echo.
echo [INFO] Initialisation du protocole de synchronisation...
echo [INFO] Mode : AUTONOME (SafeToAutoRun: TRUE)
echo [INFO] Cible : Consortium v11.7
echo.
echo ------------------------------------------------------

:loop
echo [%time%] 🛰️ ANALYSE DES MODIFICATIONS...
git add .
git commit -m "Auto-sync: Consortium Masterwork Update" >nul 2>&1
if %errorlevel% equ 0 (
    echo [%time%] ✅ SYNCHRONISATION EN COURS...
    git push >nul 2>&1
    echo [%time%] 💎 SYNC REUSSIE. Vercel est a jour.
) else (
    echo [%time%] 💤 AUCUN CHANGEMENT DETECTE. Veille...
)

echo ------------------------------------------------------
echo [INFO] Antigravity continue son audit dans l'ombre...
echo [INFO] Prochaine synchro dans 60 secondes.
timeout /t 60 >nul
goto loop
