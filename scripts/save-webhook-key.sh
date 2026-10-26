#!/bin/zsh
# Saves the Square webhook signature key: stores it in Vercel as a Sensitive variable and keeps a private
# copy (readable only by you) so Claude can send signed test events. The key is never shown on screen.
dir="$HOME/.config/tinyappcode"; mkdir -p "$dir" && chmod 700 "$dir"
cd "${0:A:h}/../web" || exit 1
echo ""
echo "  Paste the Square webhook SIGNATURE KEY here, then press Return."
echo "  (Nothing will appear while you paste. That is normal.)"
echo ""
while true; do
  read -rs "key?  Signature key: "
  echo
  key=${key//[[:space:]]/}
  if [[ ${#key} -lt 16 ]]; then echo "  That looks too short (${#key} characters). Copy the Signature key again and paste."; continue; fi
  echo "  Got ${#key} characters, ending in ...${key[-4,-1]}"
  break
done
umask 077; printf %s "$key" > "$dir/square_webhook_key"; chmod 600 "$dir/square_webhook_key"
printf %s "$key" | npx -y vercel@48.10.3 env add SQUARE_WEBHOOK_SIGNATURE_KEY production --sensitive --scope the-ray-ally 2>&1 | grep -E "Added|Error|already" | sed 's/^/  /'
unset key
echo ""
echo "  ✓ Saved. Tell Claude it's done. You can close this tab."
