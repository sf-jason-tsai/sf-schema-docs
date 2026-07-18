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
