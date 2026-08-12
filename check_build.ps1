cd "e:\bot wats\whatsapp-music-bot-main"
echo "Starting compilation check..."
npx tsc --noEmit 2>&1 | head -20
if ($LASTEXITCODE -eq 0) {
  echo ""
  echo "✅ TypeScript compilation successful!"
} else {
  echo ""
  echo "❌ Compilation failed with exit code $LASTEXITCODE"
}
