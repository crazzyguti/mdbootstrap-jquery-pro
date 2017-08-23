# Script name : mergeJS.ps1
# Version     : 0.1
# Author      : Dawid Adach
# Purpose     : Combine JS files 
# Requirements: -

$data = Get-Content "MDB.txt"
write-host $data.count total lines read from file
$command=""

$location = Get-Location
Push-Location -Path modules
$location = Get-Location



write-host $location
foreach ($line in $data)
{
	$command = $command + $location + "\"
	$command = $command + $line
	$command = $command + "+"
    write-host $line
}

$command = $command.Substring(0,$command.Length-1)
cmd /c copy /b $command  mdb.js



Pause 