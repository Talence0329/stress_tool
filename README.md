# stress_tool

## Jmeter壓測平台前端
基於free版本的coreui改寫而來，可搭配Jmeter壓測平台後端使用

主要功能為：管理Jmeter檔案與其執行情況
![image](https://github.com/Talence0329/stress_tool/blob/master/jmeter_edit.png)
![image](https://github.com/Talence0329/stress_tool/blob/master/work_exec.png)

## 頁面
分為兩個頁面，Jmeter管理、工作管理

Jmeter管理可建立檔案並上傳Jmeter檔案供工作管理建立資料使用

工作管理可選擇已建立的Jmeter建檔並設定值行參數

建立完畢後可以執行，並且實時觀測其執行狀況(透過ws)

## 特色
1. 可以省去指令執行或開啟Jmeter UI的動作
2. 可以快速調整執行參數
3. 可遠端接收執行端當前log，不必於執行端直接觀測執行狀況
4. 執行結果可依照工作分別保留並可以於壓測平台直接瀏覽
