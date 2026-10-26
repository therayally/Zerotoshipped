#!/bin/zsh
# Saves the Cloudflare token (and optionally the Resend key) to private files only you can read.
# Typing is hidden; you only see the length and last 4 characters, and each key is checked with its service.
dir="$HOME/.config/tinyappcode"
mkdir -p "$dir" && chmod 700 "$dir"

check() {
  case $1 in
    # Listing zones works for both user- and account-owned tokens (the newer 53-character kind).
    cloudflare_token) curl -s -H "Authorization: Bearer $2" 'https://api.cloudflare.com/client/v4/zones?name=tinyappcode.com' | grep -q '"name":"tinyappcode.com"' && echo 200 ;;
    resend_key) curl -s -o /dev/null -w '%{http_code}' -H "Authorization: Bearer $2" https://api.resend.com/domains ;;
  esac
}

save() {
  local name=$1 file=$2 value answer
  while true; do
    read -rs "value?Paste your $name (hidden), then press Return. Leave empty to skip: "
    echo
    value=${value//[[:space:]]/}
    if [[ -z $value ]]; then echo "Skipped $name."; return; fi
    echo "Got ${#value} characters, ending in ...${value[-4,-1]}"
    if [[ $(check $file $value) == 200 ]]; then
      echo "✓ $name works."
    else
      echo "✗ That $name was not accepted."
      read -r "answer?Try again? [Y/n] "
      [[ $answer == [nN]* ]] || continue
    fi
    umask 077
    printf %s "$value" > "$dir/$file"
    chmod 600 "$dir/$file"
    echo "Saved $name."
    return
  done
}

save "Cloudflare API token" cloudflare_token
save "Resend API key" resend_key
echo "Done. You can close this tab."
