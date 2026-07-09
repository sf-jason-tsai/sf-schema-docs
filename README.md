# Salesforce Schema Docs

互動式 Salesforce 技術文檔 · 部署於 GitHub Pages

🔗 **Live**: https://sf-jason-tsai.github.io/sf-schema-docs/

## 頁面

| 頁面 | 說明 |
|---|---|
| [index.html](./index.html) | Landing page · 導向 3 個子頁 |
| [account-schema.html](./account-schema.html) | Salesforce Account object 完整欄位表 (302 fields) · SLDS 樣式 · 支援搜尋 + 篩選 |
| [healthformula-project.html](./healthformula-project.html) | 配方時代 Care Cloud Demo 專案完整說明 |
| [data-cloud-narrative.html](./data-cloud-narrative.html) | Data Cloud Unified Individual 敘事 · SAQL + 資料流動圖 |

## 生成方式

Account schema 使用 Salesforce CLI `sf sobject describe` 抓取真實 org metadata，Node.js 產出 SLDS 樣式 HTML。

```bash
sf sobject describe --sobject Account -o <target-org> --json > account.json
node gen_account_schema.mjs
```

## Stack

- 純 static HTML + vanilla JS (no framework)
- Salesforce Lightning Design System (SLDS) 樣式
- GitHub Pages 部署

## License

Personal SE demo use.
