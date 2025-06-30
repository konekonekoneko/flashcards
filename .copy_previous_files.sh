#!/bin/bash

# コピー元・コピー先のパス
SRC="$HOME/progate_path/dashboard_app_create_converter/dashboard_app"
DEST="$HOME/progate_path/dashboard_app_create_flashcards_client/dashboard_app"

# コピー対象のファイルリスト（スペースを含まないパス）
FILES=(
  "public/index.html"
  "public/style.css"
  "public/main.js"
  "public/js/tabs.js"
  "public/js/converter.js"
  
)

# ディレクトリの存在チェック
if [ ! -d "$SRC" ]; then
  echo "コピー元ディレクトリが見つかりません: $SRC"
  exit 1
fi

if [ ! -d "$DEST" ]; then
  echo "コピー先ディレクトリが見つかりません: $DEST"
  exit 1
fi

# コピー処理
echo "差分を確認しながらコピーを開始します..."
for file in "${FILES[@]}"; do
  src_file="$SRC/$file"
  dest_file="$DEST/$file"

  if [ ! -f "$src_file" ]; then
    echo "$file: コピー元ファイルが見つかりません"
    continue
  fi

  if [ ! -f "$dest_file" ]; then
    if cp "$src_file" "$dest_file"; then
      echo "$file: コピー先にファイルがないためコピーしました"
    else
      echo "$file: コピー失敗しました"
    fi
  elif cmp -s "$src_file" "$dest_file"; then
    echo "$file: 同じ内容のためスキップします"
  else
    if cp "$src_file" "$dest_file"; then
      echo "$file: コピーしました"
    else
      echo "$file: 上書きコピー失敗しました"
    fi
  fi
done

echo "ファイルのコピーが処理が完了しました。"
