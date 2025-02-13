# Watcher AutoGit

## Overview

Watcher AutoGit is a file monitoring tool that automatically commits changes to a local Git repository. It uses `chokidar` to watch for file changes and `child_process` to execute Git commands. This project can be useful for tracking the performance of self-learning and self-evolving systems, as well as maintaining a history of changes in a local Git repository.

## How It Works

1. **Initialization**: The script initializes a Git repository if the target directory is empty or not already a Git repository.
2. **File Watching**: It uses `chokidar` to watch for file changes in the specified directory.
3. **Debouncing**: Changes are debounced for a specified delay (default is 10 seconds) to avoid committing too frequently.
4. **Auto Commit**: After the debounce delay, the changes are automatically committed to the local Git repository with a predefined commit message.

## Configuration

The configuration is read from a `config.json` file located in the same directory as the script. The configuration options include:
- `watchDir`: The directory to watch for changes.
- `usePolling`: Whether to use polling for file changes (useful for WSL2 Docker).
- `commitMessage`: The commit message to use for auto commits.

## Usage

### Using Node.js

1. **Install Dependencies**:
    ```sh
    npm install
    ```

2. **Start the Watcher**:
    ```sh
    npm start
    ```

### Using Docker

1. **Build the Docker Image**:
    ```sh
    ./Run-Docker.ps1
    ```

2. **Run the Docker Container**:
    ```sh
    ./Run-Docker.ps1
    ```

**Note**: For WSL2 Docker, the project relies on periodic polling instead of file I/O watch because polling on WSL2 Docker is not working correctly.

## Potential Applications

- **Self-Learning and Self-Evolving Systems**: Track the performance and changes in self-learning systems by maintaining a history of changes in a local Git repository.
- **Periodic File Watcher/Monitor**: Keep track of changes in a directory and maintain a history of changes for auditing or backup purposes.

## Example `config.json`

```json
{
  "watchDir": "./storage",
  "usePolling": true,
  "commitMessage": "Auto commit"
}
```
