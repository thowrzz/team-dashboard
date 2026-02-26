#!/bin/bash
# Dashboard Auto-Update Script
# Runs daily at 12:30 PM IST

cd /root/.openclaw/workspace/team-dashboard

# Get current date
TODAY=$(date +"%Y-%m-%d")
NOW=$(date +"%Y-%m-%dT%H:%M:%S+05:30")

# Update the lastUpdated timestamp in the data file
if [ -f "data/team-data.json" ]; then
  # Update timestamp using jq if available, otherwise use sed
  if command -v jq &> /dev/null; then
    jq ".lastUpdated = \"$NOW\"" data/team-data.json > data/team-data-temp.json && mv data/team-data-temp.json data/team-data.json
  else
    sed -i "s/\"lastUpdated\": \"[^\"]*\"/\"lastUpdated\": \"$NOW\"/" data/team-data.json
  fi
fi

# Rebuild and deploy
npm run build

# Commit and push if there are changes
git add .
git diff --cached --quiet || git commit -m "Auto-update: Dashboard data refresh $(date '+%Y-%m-%d %H:%M')"
git push origin main

echo "Dashboard updated at $NOW"
