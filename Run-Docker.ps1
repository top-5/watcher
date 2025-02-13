docker build -t git-watcher .

$containerName = "git-watcher"
$unixPath = $PSScriptRoot -replace '\\', '/' -replace '^([a-zA-Z]):', '/$1'

# Check if the container is already running
$runningContainer = docker ps -q -f "name=$containerName"
if ($runningContainer) {
    docker stop $containerName
    docker rm $containerName
}

docker run --rm --name $containerName -v "$unixPath/storage:/storage" git-watcher
