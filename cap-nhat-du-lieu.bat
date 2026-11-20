@echo off
chcp 65001 >nul
rem Sửa file data\Build_sung_Play_Together.xlsx rồi chạy file này để cập nhật web (js\data.js).
rem Hoặc kéo file Excel khác vào file .bat này, hoặc chạy: cap-nhat-du-lieu.bat "đường\dẫn\file.xlsx"
set SRC=%~1
if "%SRC%"=="" set SRC=%~dp0data\Build_sung_Play_Together.xlsx
python "%~dp0tools\build_data.py" "%SRC%"
pause
