$ErrorActionPreference = "Stop"

Write-Host "Starting auto-sync..."

# Check for changes
$status = git status --porcelain
if ([string]::IsNullOrWhiteSpace($status)) {
    Write-Host "No changes detected. Exiting."
    exit 0
}

# Add all changes
git add .

# Commit with timestamp
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
git commit -m "Auto-save: $timestamp"

# Push to current branch
git push

Write-Host "Successfully synced changes at $timestamp"
