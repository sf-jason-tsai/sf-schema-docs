#!/usr/bin/env node
// sync.mjs · 一鍵把本地 HTML 同步到 GitHub Pages
// 用法：node sync.mjs [--msg "commit message"]
// 或   :npm run sync

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const REPO_DIR = path.dirname(new URL(import.meta.url).pathname).replace(/^\//,'').replace(/\//g,'\\');
process.chdir(REPO_DIR);

// ─── 檔案對應表 · 新增 HTML 時只需在這裡加一行 ───
const PAGES = [
    {
        src: 'C:/Users/bingyan.tsai/Desktop/Claude/配方時代-demo/specs/Salesforce-Account-Schema.html',
        dest: 'account-schema.html',
        title: 'Salesforce Account · Schema'
    },
    {
        src: 'C:/Users/bingyan.tsai/Desktop/Claude/配方時代-demo/specs/配方時代-專案說明.html',
        dest: 'healthformula-project.html',
        title: '配方時代 · Care Cloud Demo'
    },
    {
        src: 'C:/Users/bingyan.tsai/Desktop/Claude/配方時代-demo/specs/data-cloud-narrative.html',
        dest: 'data-cloud-narrative.html',
        title: 'Data Cloud · Unified Individual'
    },
    // ─── 有你共創 YCC (Marketing Cloud Growth on Core + Data Cloud) ───
    {
        src: 'C:/Users/bingyan.tsai/Desktop/Claude/ycc/specs/index.html',
        dest: 'ycc/index.html',
        title: '有你共創 · 專案首頁'
    },
    {
        src: 'C:/Users/bingyan.tsai/Desktop/Claude/ycc/specs/schema.html',
        dest: 'ycc/schema.html',
        title: '有你共創 · 5 Object Schema'
    },
    {
        src: 'C:/Users/bingyan.tsai/Desktop/Claude/ycc/specs/data-cloud-story.html',
        dest: 'ycc/data-cloud-story.html',
        title: '有你共創 · Data Cloud 敘事'
    },
    {
        src: 'C:/Users/bingyan.tsai/Desktop/Claude/ycc/specs/mcoc-on-core.html',
        dest: 'ycc/mcoc-on-core.html',
        title: '有你共創 · Marketing Cloud on Core'
    },
    {
        src: 'C:/Users/bingyan.tsai/Desktop/Claude/ycc/specs/demo-script.html',
        dest: 'ycc/demo-script.html',
        title: '有你共創 · 20 分鐘 Demo Script'
    },
    {
        src: 'C:/Users/bingyan.tsai/Desktop/Claude/有你共創-demo-playbook-v2.html',
        dest: 'ycc/playbook-v2.html',
        title: '有你共創 · Demo Playbook v2 (2026-07-18)'
    },
    {
        src: 'C:/Users/bingyan.tsai/Desktop/Claude/有你共創-journey-playbook.html',
        dest: 'ycc/journey-playbook.html',
        title: '有.數據 · MC Advanced Journey Playbook (2026-07-18)'
    },
    {
        src: 'C:/Users/bingyan.tsai/Desktop/Claude/有你共創-EDM-pack.html',
        dest: 'ycc/edm-pack.html',
        title: '有.數據 · EDM 內容包 · 24 檔行銷活動 (2026-07-20)'
    },
    {
        src: 'C:/Users/bingyan.tsai/Desktop/Claude/ycc/specs/journey-map.html',
        dest: 'ycc/journey-map.html',
        title: '有.數據 · MC on Core 行銷旅程地圖 (2026-07-22)'
    },
    // ─── Salesforce 6 大雲 Overview ───
    {
        src: 'C:/Users/bingyan.tsai/Desktop/Claude/salesforce-clouds/index.html',
        dest: 'salesforce-clouds/index.html',
        title: 'Salesforce 6 大雲 · Object & Schema 全覽'
    },
    // ─── THERMOS 膳魔師 ───
    {
        src: 'C:/Users/bingyan.tsai/Desktop/Claude/thermos-demo/specs/index.html',
        dest: 'thermos/index.html',
        title: 'THERMOS 膳魔師 · Demo 文件集 Landing'
    },
    // ─── 銀樺國際 Silverbirch (B2B Retail Wholesale · CBUSDO) ───
    {
        src: 'C:/Users/bingyan.tsai/Desktop/Claude/silverbirch-demo/specs/index.html',
        dest: 'silverbirch/index.html',
        title: '銀樺國際 Silverbirch · Sales Cloud B2B Wholesale Demo'
    },
    // ─── KKDAY Travel (Sales+Service+Experience · CBUSDO) ───
    {
        src: 'C:/Users/bingyan.tsai/Desktop/Claude/kkday-demo/specs/index.html',
        dest: 'kkday/index.html',
        title: 'KKDAY Travel · Sales+Service+Experience Cloud Demo'
    },
    {
        src: 'C:/Users/bingyan.tsai/Desktop/Claude/thermos-demo/specs/THERMOS_Agentforce_Setup.html',
        dest: 'thermos/agentforce-setup.html',
        title: 'THERMOS · Agentforce Studio 設定指南'
    },
    {
        src: 'C:/Users/bingyan.tsai/Desktop/Claude/thermos-demo/THERMOS_Case_Page_Delivery.html',
        dest: 'thermos/case-page-delivery.html',
        title: 'THERMOS · Case Record Page 客製化交付報告'
    },
    {
        src: 'C:/Users/bingyan.tsai/Desktop/Claude/thermos-demo/mockup/thermosCase360_mockup.html',
        dest: 'thermos/case-page-mockup.html',
        title: 'THERMOS · Case Page v1 Mockup'
    },
    {
        src: 'C:/Users/bingyan.tsai/Desktop/Claude/thermos-demo/specs/THERMOS_AI_Features.html',
        dest: 'thermos/ai-features.html',
        title: 'THERMOS · AI 功能總覽（誠實對照版）'
    },
    // ─── LeBio (lifenergy org · 真實客戶資料遷移) ───
    {
        src: 'C:/Users/bingyan.tsai/Desktop/Claude/lebio-import/etl-report.html',
        dest: 'lebio/etl-account-report.html',
        title: 'LeBio · 客戶管理→Account ETL 報告 (2026-07-27)'
    },
    {
        src: 'C:/Users/bingyan.tsai/Desktop/Claude/lebio-import/etl-contact-report.html',
        dest: 'lebio/etl-contact-report.html',
        title: 'LeBio · 聯絡人→Contact ETL 報告 (2026-07-27)'
    },
    {
        src: 'C:/Users/bingyan.tsai/Desktop/Claude/lebio-import/etl-lead-report.html',
        dest: 'lebio/etl-lead-report.html',
        title: 'LeBio · 商機→Lead(潛在客戶) ETL 報告 (2026-07-27)'
    },
    {
        src: 'C:/Users/bingyan.tsai/Desktop/Claude/lebio-import/etl-visit-report.html',
        dest: 'lebio/etl-visit-report.html',
        title: 'LeBio · 拜訪紀錄→活動(Task) ETL 報告 (2026-07-28)'
    },
    {
        src: 'C:/Users/bingyan.tsai/Desktop/Claude/lebio-import/etl-campaign-report.html',
        dest: 'lebio/etl-campaign-report.html',
        title: 'LeBio · 活動TMP+行銷活動→行銷活動(Campaign) ETL 報告 (2026-07-28)'
    },
    {
        src: 'C:/Users/bingyan.tsai/Desktop/Claude/lebio-import/etl-opportunity-report.html',
        dest: 'lebio/etl-opportunity-report.html',
        title: 'LeBio · 預估業績→商機(Opportunity) ETL 報告 (2026-07-28)'
    },
    {
        src: 'C:/Users/bingyan.tsai/Desktop/Claude/lebio-import/etl-event-report.html',
        dest: 'lebio/etl-event-report.html',
        title: 'LeBio · 事件列表→行事曆事件(Event) ETL 報告 (2026-07-28)'
    },
    {
        src: 'C:/Users/bingyan.tsai/Desktop/Claude/lebio-import/etl-overview.html',
        dest: 'lebio/index.html',
        title: 'LeBio · 資料遷移總覽（全 7 Object）(2026-07-28)'
    },
    {
        src: 'C:/Users/bingyan.tsai/Desktop/Claude/lebio-import/企業歸戶複核報告.html',
        dest: 'lebio/enterprise-grouping-report.html',
        title: 'LeBio · 客戶公司「企業」歸戶複核報告 (2026-07-28)'
    },
    // ─── 104 遠距藍海職缺分析 ───
    {
        src: 'C:/Users/bingyan.tsai/Desktop/Claude/job-crawler/out/report.html',
        dest: 'jobs/bluocean-report.html',
        title: '104 遠距藍海職缺分析報告 (2026-07-27)'
    },
    // ─── 銓盛-Adtek 銷售 Account 管理優化 ───
    {
        src: 'C:/Users/bingyan.tsai/Desktop/Claude/adtek-demo/docs/adtek-sales-mgmt-optimization.html',
        dest: 'adtek/sales-mgmt-optimization.html',
        title: '銓盛-Adtek · 銷售 Account 管理優化驗收 (2026-08-09)'
    },
    {
        src: 'C:/Users/bingyan.tsai/Desktop/Claude/adtek-demo/landing/energy-taiwan-2025.html',
        dest: 'adtek/energy-taiwan-2025.html',
        title: 'Energy Taiwan 2025 台灣國際智慧能源週 · 報名登陸頁'
    },
    {
        src: 'C:/Users/bingyan.tsai/Desktop/Claude/adtek-demo/docs/銓盛-Adtek-經營戰情室首頁驗收.html',
        dest: 'adtek/executive-cockpit-home.html',
        title: '銓盛-Adtek · 經營戰情室首頁驗收 · 銷售預測看板 (2026-08-10)'
    },
    {
        src: 'C:/Users/bingyan.tsai/Desktop/Claude/adtek-demo/銓盛-Adtek_Demo導覽.html',
        dest: 'adtek/demo-guide.html',
        title: '銓盛-Adtek · Demo 導覽（單一真相文件）(2026-08-10)'
    },
    {
        src: 'C:/Users/bingyan.tsai/Desktop/Claude/adtek-demo/docs/銓盛-Adtek-機會流程報價卡控驗收.html',
        dest: 'adtek/opportunity-quote-gate.html',
        title: '銓盛-Adtek · 機會流程報價單歸檔輕量卡控驗收 (2026-08-11)'
    },
    // ↑ 加新頁時只需在這裡插入 { src, dest, title }
];

// ─── Parse args ───
const args = process.argv.slice(2);
const msgIdx = args.indexOf('--msg');
const userMsg = msgIdx >= 0 ? args[msgIdx+1] : null;

const log = (icon, msg) => console.log(`${icon} ${msg}`);

// ─── Copy files ───
let copiedCount = 0;
const changedFiles = [];
for (const p of PAGES) {
    if (!fs.existsSync(p.src)) {
        log('⚠', `SKIP · 找不到 ${p.src}`);
        continue;
    }
    const srcStat = fs.statSync(p.src);
    const destPath = path.join(REPO_DIR, p.dest);
    const destExists = fs.existsSync(destPath);
    const destStat = destExists ? fs.statSync(destPath) : null;

    // 只複製 · 內容不同或不存在
    let shouldCopy = !destExists;
    if (destExists) {
        const srcBuf = fs.readFileSync(p.src);
        const dstBuf = fs.readFileSync(destPath);
        shouldCopy = !srcBuf.equals(dstBuf);
    }
    if (shouldCopy) {
        fs.copyFileSync(p.src, destPath);
        const sizeKB = (srcStat.size/1024).toFixed(1);
        log('📄', `${p.dest} ← ${p.title} (${sizeKB} KB)`);
        copiedCount++;
        changedFiles.push(p.dest);
    } else {
        log('=', `${p.dest} unchanged`);
    }
}

if (copiedCount === 0) {
    log('✔', 'All pages up-to-date · nothing to push.');
    process.exit(0);
}

// ─── Git commit + push ───
try {
    execSync('git status', { stdio: 'ignore' });
} catch {
    log('✗', 'Not a git repo. Run this script inside sf-schema-docs folder.');
    process.exit(1);
}

const stagedChanges = execSync('git status --porcelain', { encoding: 'utf8' });
if (!stagedChanges.trim()) {
    log('✔', 'Git working tree clean · nothing to commit.');
    process.exit(0);
}

// Auto commit message
const now = new Date();
const stamp = now.toISOString().replace('T',' ').substring(0,19);
const defaultMsg = `sync: ${changedFiles.join(', ')} (${stamp})`;
const commitMsg = userMsg || defaultMsg;

log('📦', `Staging ${changedFiles.length} file(s)...`);
execSync('git add .', { stdio: 'inherit' });

log('✍', `Commit: ${commitMsg}`);
execSync(`git -c user.email="sf-jason-tsai@users.noreply.github.com" -c user.name="Jason Tsai" commit -m "${commitMsg.replace(/"/g,'\\"')}"`, { stdio: 'inherit' });

log('🚀', 'Pushing to origin/main...');
execSync('git push origin main', { stdio: 'inherit' });

log('✅', 'Sync complete!');
console.log('');
console.log('  🌐 https://sf-jason-tsai.github.io/sf-schema-docs/');
console.log('  ⏳ GitHub Pages rebuild 通常 30-60 秒後生效');
console.log('');
