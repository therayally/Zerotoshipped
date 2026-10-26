#!/bin/zsh
# Saves the Cloudflare token (and optionally the Resend key) to private files only you can read.
# Typing is hidden and nothing is printed, so the keys never show on screen or in chat.
dir="$HOME/.config/tinyappcode"
mkdir -p "$dir" && chmod 700 "$dir"

save() {
  local name=$1 file=$2 value
  read -rs "value?Paste your $name (hidden), then press Return. Leave empty to skip: "
  echo
  if [[ -n $value ]]; then
    umask 077
    printf %s "$value" > "$dir/$file"
    chmod 600 "$dir/$file"
    echo "Saved $name."
  else
    echo "Skipped $name."
  fi
}

save "Cloudflare API token" cloudflare_token
save "Resend API key" resend_key
echo "Done. You can close this tab."
