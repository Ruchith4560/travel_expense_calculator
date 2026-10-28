@REM ----------------------------------------------------------------------------
@REM Maven Start Up Batch script for Travel Expense Calculator
@REM ----------------------------------------------------------------------------
@echo off
setlocal

set "MAVEN_CMD=C:\Users\macha\.m2\wrapper\dists\apache-maven-3.9.16-bin\5grr65jo27hi51sujmtcldfovl\apache-maven-3.9.16\bin\mvn.cmd"
if exist "%MAVEN_CMD%" (
    call "%MAVEN_CMD%" %*
    exit /b %ERRORLEVEL%
)

where mvn >nul 2>nul
if %ERRORLEVEL% equ 0 (
    call mvn %*
    exit /b %ERRORLEVEL%
)

echo [ERROR] Maven not found. Please install Apache Maven or set JAVA_HOME and MAVEN_HOME.
exit /b 1
