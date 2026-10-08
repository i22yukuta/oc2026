# micro:bit Retro Arcade 傾けて探索する迷路

for PXT/arcade

MakeCode Arcadeで作った、micro:bit V2とELECFREAKS micro:bit Retro Arcadeで遊ぶ迷路ゲームです。本体を傾けて1マスずつ進み、周囲を探索しながらゴールを目指します。

## 必要なもの

- micro:bit V2
- ELECFREAKS micro:bit Retro Arcade（micro:bitを差し込むタイプ）
- データ通信対応micro USBケーブルとPC

## MakeCode Arcadeで開く

1. [MakeCode Arcade](https://arcade.makecode.com/)を開く。
2. 「読み込む」→「URLから読み込む」で次のURLを指定する。

```text
https://github.com/miyazaki-lab/oc2026
```

ブロック画面でゲームを編集できます。JavaScriptから切り替える場合は、上部の「ブロック」を選びます。移動間隔、傾きのしきい値、十字キーの判定、迷路や描画処理はブロックへ変換できます。「傾き操作」カテゴリには、準備・読み取り・横の傾き・縦の傾きのブロックがあります。

`main.blocks` は `main.ts` をMakeCodeの公式コンパイラーで変換したものです。細かなセンサー処理は別ファイル `tilt.ts` に置き、ブロックとJavaScriptを切り替えてもI2Cの処理を変換する必要がない構成にしています。GitHubから読み込む場合は、コードだけを貼り付けず、プロジェクト全体を読み込んでください。

## 加速度の読み取り

実機で `controller.acceleration()` の値が変わらなかったため、micro:bit V2内蔵のLSM303AGRを内部I2Cで直接読み取ります。センサーの識別値が `0x33` の場合だけ初期化します。他のセンサーを搭載した機種には対応していません。

内部配線はMCUのP0.16（SDA）とP0.8（SCL）です。micro:bitの外部端子P16・P8とは別です。`tilt.ts` に、設定値・mg単位への変換・通信失敗時の処理をコメントで記載しています。実機の縦方向は前の版から上下反転しています。読み取りに失敗した回は傾きによる移動を行いません。

シミュレーターでは標準の加速度入力を使います。`control.deviceDalVersion()` が `"sim"` の場合に切り替えるため、実機のセンサー故障をシミュレーターと混同しません。

## 機種設定と書き込み

1. micro:bit V2をRetro Arcadeへ差し込み、micro:bit側のUSB端子をPCへ接続する。
2. MakeCode Arcadeの歯車 →「About（このエディターについて）」→「Experiments（実験）」を開く。
3. **Experimental Hardware** を有効にする（初回のみ）。
4. 編集画面へ戻り、「ダウンロード」の機種選択で **micro:bit Arcade Shield** を選ぶ。
5. ダウンロードした **`.hex` ファイル**をPCの **`MICROBIT` ドライブ**へコピーする。
6. 書き込みが終わってから遊ぶ。

現在の公式機種一覧では `micro:bit Arcade Shield`（hw---n3）です。メーカー資料には `micro:bit Retro Shield`、さらに古い資料には `N3` と記載されています。選択時はELECFREAKSのmicro:bit用製品であることを確認してください。

## 遊び方

- 本体を上下左右に傾けると、300ミリ秒ごとに1マス移動します。
- 十字キーでも同じ間隔で移動できます。押している間は十字キーを優先し、離すと傾き操作に戻ります。複数のキーを同時に押した場合は、左・右・上・下の順に優先します。
- 加速度の絶対値が350 mgを超えると移動します（1000 mg = 1 g）。上下と左右では傾きの大きい軸を優先します。
- 赤い四角がプレイヤー、白い線が向き、緑のマスがゴールです（標準パレット）。
- 周囲3×3マスが発見され、一度発見したマスは表示されたままになります。壁の向こうも発見されます。
- 壁には進めません。壁に向けて操作した場合も、向きは変わります。
- 1面目は15×13マス、2面目は11×9マスです。2面ともクリアすると終了します。

## シミュレーターで遊ぶ

実行中のシミュレーター内でマウスを中央から上下左右へ動かすと、画面が傾き、その方向へ移動します。中央付近へ戻すと止まり、シミュレーター外へマウスを出すと傾きが徐々に戻ります。タッチ操作はブラウザーの対応によります。

画面の十字キー、またはキーボードの矢印キーでも遊べます。実機と同じ300ミリ秒・350 mgの判定で、壁・探索・ゴール・ステージの処理も共通です。

## 調整する場所

| 変更したいこと | `main.ts` の変更箇所 |
| --- | --- |
| 小さい傾きでも動かす | 最後の加速度判定の `350` と `-350` を、すべて `200` と `-200` などに変更 |
| 移動の速さ | `game.onUpdateInterval(300, ...)` の `300` を変更。小さいほど速い |
| 見える範囲 | `DISCOVER_RADIUS = 1` を変更。2なら周囲5×5マス |
| 色 | `COLOR_PLAYER`、`COLOR_WALL`、`COLOR_GOAL` などを変更 |
| 迷路 | `loadStage` の文字列を変更。`#` は壁、`.` は通路、`S` はスタート、`G` はゴール |

迷路は各行の文字数を `mazeW` に、行数を `mazeH` に合わせ、スタートとゴールをそれぞれ1つ置いてください。ステージを増やす場合は `loadStage` の分岐と `STAGE_COUNT` の両方を変更します。

## 困ったとき

- **機種が見つからない**：MakeCode Arcadeを開いているか、Experimental Hardwareが有効か確認します。
- **`.uf2` が出る**：機種を選び直します。micro:bit版では `.hex` を使います。
- **`Tilt unavailable` と表示される**：機種設定とmicro:bit V2の使用を確認します。LSM303AGR以外のセンサーには対応していません。十字キーでは遊べます。
- **傾けても動かない**：まず大きく傾けて試します。必要なら判定値350を200へ下げます。
- **方向を調整したい**：`tilt.ts` の実機側の `valueX` / `valueY` への代入を調整します。縦方向の値には上下反転のため `-` を付けています。
- **画面が出ない**：micro:bit V2、差し込み、電源、機種選択を確認します。
- **`MICROBIT` ドライブが出ない**：データ通信対応ケーブルでmicro:bit側のUSBへ接続します。

## 確認状況

両ステージの迷路データは前の版から変更していません。直接読み取りの診断プログラムでは、実機の加速度値が傾きに応じて変化することを確認済みです。

今回版はMakeCode Arcade v4.1.25の公式コンパイラーでシミュレーター向けコンパイルとブロック変換を確認し、灰色のJavaScriptブロックは0個でした。実際のソースを実行する入力処理テストで、シミュレーターの上下左右の入力、実機Y軸の反転、I2C設定、通信失敗時の停止、センサーなしの十字キー操作、キー優先、しきい値、壁判定を確認しました。

今回版のブラウザー画面での操作、ブロックとJavaScriptの画面上の往復、実機向けHEX生成、実機での移動は未確認です。前の版ではmicro:bit Arcade Shield向けHEX生成を確認しています。

## 参考資料

- [ELECFREAKS micro:bit Retro Arcade 書き込み手順](https://wiki.elecfreaks.com/en/microbit/expansion-board/microbit-retro-arcade-se/program-download-steps/)
- [MakeCode Arcade公式の機種一覧設定](https://github.com/microsoft/pxt-arcade/blob/master/targetconfig.json)
- [controller拡張機能](https://github.com/microsoft/pxt-common-packages/blob/master/libs/controller/pxt.json)



> このページを開く [https://i22yukuta.github.io/oc2026/](https://i22yukuta.github.io/oc2026/)

## 拡張機能として使用

このリポジトリは、MakeCode で **拡張機能** として追加できます。

* [https://arcade.makecode.com/](https://arcade.makecode.com/) を開く
* **新しいプロジェクト** をクリックしてください
* ギアボタンメニューの中にある **拡張機能** をクリックしてください
* **https://github.com/i22yukuta/oc2026** を検索してインポートします。

## このプロジェクトを編集します

MakeCode でこのリポジトリを編集します。

* [https://arcade.makecode.com/](https://arcade.makecode.com/) を開く
* **読み込む** をクリックし、 **URLから読み込む...** をクリックしてください
* **https://github.com/i22yukuta/oc2026** を貼り付けてインポートをクリックしてください

#### メタデータ (検索、レンダリングに使用)

* for PXT/arcade
<script src="https://makecode.com/gh-pages-embed.js"></script><script>makeCodeRender("{{ site.makecode.home_url }}", "{{ site.github.owner_name }}/{{ site.github.repository_name }}");</script>
