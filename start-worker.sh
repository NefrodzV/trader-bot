echo "Starting worker loop..."

while true; do
echo "Running wroker at $(date)"
node bot.js
sleep 60
done