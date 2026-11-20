@echo off
chcp 65001 >nul
rem Kéo file Excel vào file .bat này, hoặc chạy: cap-nhat-du-lieu.bat "đường\dẫn\file.xlsx"
set SRC=%~1
if "%SRC%"=="" set SRC=D:\Downloads\Build_sung_Play_Together.xlsx
python "%~dp0tools\build_data.py" "%SRC%"
pause
