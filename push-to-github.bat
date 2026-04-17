@echo off
echo ========================================
echo GitHub Push Script for DDtech Project
echo ========================================
echo.

REM Check if git is initialized
if not exist ".git" (
    echo Initializing Git repository...
    git init
    echo.
)

REM Add all files
echo Adding all files to git...
git add .
echo.

REM Commit changes
echo Committing changes...
set /p commit_message="Enter commit message (or press Enter for default): "
if "%commit_message%"=="" set commit_message=Updated DDtech website - Fixed mobile navbar and service cards alignment

git commit -m "%commit_message%"
echo.

REM Check if remote exists
git remote -v | findstr origin >nul
if errorlevel 1 (
    echo No remote repository found.
    set /p repo_url="Enter your GitHub repository URL (e.g., https://github.com/username/repo.git): "
    git remote add origin !repo_url!
    echo Remote added successfully.
    echo.
)

REM Push to GitHub
echo Pushing to GitHub...
git branch -M main
git push -u origin main

echo.
echo ========================================
echo Push completed successfully!
echo ========================================
pause
