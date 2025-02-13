import chokidar from 'chokidar';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import { fileURLToPath } from 'url';

// Convert import.meta.url to __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read configuration from config.json
const configPath = path.resolve(__dirname, 'config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const WATCH_DIR = path.resolve(__dirname, config.watchDir);
const USE_POLLING = config.usePolling !== undefined ? path.resolve(__dirname, config.usePolling) : (process.env.USE_POLLING !== undefined ? process.env.USE_POLLING : false);
const COMMIT_MESSAGE = config.commitMessage || 'Auto commit';
const DEBOUNCE_DELAY = 10000; // 10 seconds

let commitTimer = null;

// Function to initialize Git repository
const initializeGitRepo = () => {
    console.log(`[INFO] Initializing Git repository...`);
    exec(`git init && git config user.name "Auto Commit Bot" && git config user.email "autocommit@example.com"`, { cwd: WATCH_DIR }, (err, stdout, stderr) => {
        if (err) {
            console.error(`[ERROR] Git initialization failed:`, stderr);
        } else {
            console.log(`[SUCCESS] Git repository initialized:\n`, stdout);
        }
    });
};

// Check if directory is empty or not a Git repository
const isDirectoryEmpty = (dir) => {
    return fs.readdirSync(dir).length === 0;
};

const isGitRepo = (dir) => {
    return fs.existsSync(path.join(dir, '.git'));
};

// Function to list top-level directory contents
const listTopLevelDirectory = (dir) => {
    console.log(`[INFO] Listing top-level directory contents:`);
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        console.log(file);
    });
};

if (isDirectoryEmpty(WATCH_DIR) || !isGitRepo(WATCH_DIR)) {
    initializeGitRepo();
}

// List top-level directory contents
listTopLevelDirectory(WATCH_DIR);

// Check for USE_POLLING environment variable
const usePolling = process.env.USE_POLLING === '1';

// Log whether polling is being used or not
if (usePolling) {
    console.log(`[INFO] Using polling for file changes.`);
} else {
    console.log(`[INFO] Using file system watcher for file changes.`);
}

// Initialize file watcher
const watcher = chokidar.watch(WATCH_DIR, {
    persistent: true,
    ignoreInitial: true,
    depth: 99, // Recursively watch deeply nested files
    ignored: /(^|[\/\\])\.git/, // Ignore .git directory
    usePolling: usePolling // Use polling if USE_POLLING is set to 1
});

// Function to execute Git commit
const commitChanges = () => {
    console.log(`[INFO] Running Git commit...`);
    exec(`git add -A && git commit -m "${COMMIT_MESSAGE}"`, { cwd: WATCH_DIR }, (err, stdout, stderr) => {
        if (err) {
            console.error(`[ERROR] Git commit failed:`, stderr);
        } else {
            console.log(`[SUCCESS] Git committed changes:\n`, stdout);
        }
    });
};

// Handle file changes
let timeLeft = DEBOUNCE_DELAY / 1000;
let intervalId = null;

const startTimer = () => {
    if (intervalId) clearInterval(intervalId);

    intervalId = setInterval(() => {
        process.stdout.write(chalk.green(`\r[INFO] Time left to commit: ${timeLeft}s      `)); // Add extra spaces to clear the line
        timeLeft--;

        if (timeLeft < 0) {
            clearInterval(intervalId);
            commitChanges();
        }
    }, 1000);
};

watcher.on('all', (event, filePath) => {
    console.log(`[WATCH] Detected ${event} in ${filePath}`);

    // Reset the timer every time a change is detected
    if (commitTimer) clearTimeout(commitTimer);

    timeLeft = DEBOUNCE_DELAY / 1000;
    startTimer();

    commitTimer = setTimeout(() => {
        clearInterval(intervalId);
        commitChanges();
    }, DEBOUNCE_DELAY);
});

console.log(`[INFO] Watching directory: ${WATCH_DIR}`);
