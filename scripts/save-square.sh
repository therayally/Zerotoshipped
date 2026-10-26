#!/bin/zsh
# Saves your Square production access token: checks it with Square, stores it in Vercel as a Sensitive
# variable, and keeps a private copy (readable only by you) so Claude can set up payment notifications.
dir="$HOME/.config/tinyappcode"; mkdir -p "$dir" && chmod 700 "$dir"
cd "${0:A:h}/../web" || exit 1
while true; do
  read -rs "token?Paste your Square PRODUCTION access token (hidden), then press Return: "
  echo
  token=${token//[[:space:]]/}
  [[ -z $token ]] && { echo "Nothing pasted. Try again."; continue; }
  echo "Got ${#token} characters, ending in ...${token[-4,-1]}"
  biz=$(curl -s -H "Authorization: Bearer $token" -H "Square-Version: 2025-01-23" https://connect.squareup.com/v2/locations | grep -o '"business_name":"[^"]*"' | head -1)
  if [[ -n $biz ]]; then echo "✓ Works. Square account: ${biz#*:}"; break; fi
  echo "✗ Square did not accept that token. Make sure it is the Production token, not Sandbox."
done
umask 077; printf %s "$token" > "$dir/square_token"; chmod 600 "$dir/square_token"
printf %s "$token" | npx -y vercel@48.10.3 env add SQUARE_ACCESS_TOKEN production --sensitive --scope the-ray-ally 2>&1 | grep -E "Added|Error|already"
unset token
echo "Done. You can close this tab."
