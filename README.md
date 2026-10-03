<!-- Hero Banner -->
<div align="center">
  <img src="assets/atulya-hero.png" alt="Atulya Office - Automation Suite" width="100%"/>
</div>

<div align="center">
  <h1>
    <img src="https://readme-typing-svg.herokuapp.com?font=Cinzel&weight=700&size=40&duration=4000&pause=1000&color=F7931A&center=true&vCenter=true&width=700&height=75&lines=ATULYA+OFFICE;EXCEL+%2B+WORD+%2B+OUTLOOK+AUTOMATION;CLI+%2B+FORMULA+AI+TOOLKIT;अतुल्य+ऑफिस" alt="Atulya Office — Automation Suite" />
  </h1>
</div>

<p align="center">
  <em><strong>अतुल्य</strong> (Atulya) — Peerless &nbsp;·&nbsp; <strong>Office</strong> — Productivity elevated</em><br/>
  <strong>Cross-platform CLI and automation toolkit for Excel, Word, Outlook, and PowerPoint: merge spreadsheets, generate documents, sort mail, and automate repetitive office tasks 100% locally.</strong>
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-F7931A.svg?style=flat-square" alt="MIT License"/></a>
  <a href="https://python.org"><img src="https://img.shields.io/badge/Python-3.9%2B-F7931A.svg?style=flat-square&logo=python&logoColor=white" alt="Python 3.9+"/></a>
  <a href="#"><img src="https://img.shields.io/badge/Status-Active_CLI-success.svg?style=flat-square" alt="Status: Active CLI"/></a>
  <a href="#"><img src="https://img.shields.io/badge/Apps-Excel_%7C_Word_%7C_Outlook_%7C_PowerPoint-blue.svg?style=flat-square" alt="Supported Apps"/></a>
  <a href="#"><img src="https://img.shields.io/badge/Privacy-100%25_Local_Execution-success.svg?style=flat-square" alt="Local First"/></a>
  <img src="https://img.shields.io/badge/Made_in-India_🇮🇳-FF9933.svg?style=flat-square" alt="Made in India"/>
</p>

```
 ┌─────────────────────────────────────────────────────────────────────────────┐
 │                         ATULYA OFFICE WORKFLOW                              │
 ├─────────────────────────────────────────────────────────────────────────────┤
 │   📂 Raw Files (XLSX, DOCX, PPTX) ──► atulya-office CLI / Python Engine    │
 │                                            │                                │
 │         ┌──────────────────────────────────┼────────────────────────────────┐
 │         ▼                                  ▼                                ▼
 │   📊 Excel Engine                    📝 Word Mail Merge              📬 Outlook Sync
 │   Clean · Merge · Split · Diff       Fill Templates · Docx-to-Text   Search · Export · Mail
 │         │                                  │                                │
 │         └──────────────────────────────────┼────────────────────────────────┘
 │                                            ▼                                
 │                       📊 PowerPoint Decks (Batch Gen)                       │
 └─────────────────────────────────────────────────────────────────────────────┘
```

---

## ⚡ Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/atulyaai/Atulya-Office.git
cd Atulya-Office

# Install in development mode
pip install -e .
```

Verify installation:
```bash
atulya-office --help
```

---

## 🧰 Command Reference

### 📊 Excel Automation (`atulya-office excel`)

| Command | Usage | Description |
|---|---|---|
| `clean` | `atulya-office excel clean data.xlsx -o cleaned.xlsx` | Deduplicates rows, prunes blanks, and standardizes dates |
| `merge` | `atulya-office excel merge q1.xlsx q2.xlsx -o full_year.xlsx` | Merges multiple workbooks into a single sheet or workbook |
| `split` | `atulya-office excel split roster.xlsx --column "Department"` | Splits sheet into separate workbooks by column value |
| `compare` | `atulya-office excel compare old.xlsx new.xlsx` | Diffs two sheets and outputs discrepancies |
| `search` | `atulya-office excel search report.xlsx --value "Invoice #123"` | Scans across all sheets for exact or fuzzy matches |

### 📝 Word Automation (`atulya-office word`)

| Command | Usage | Description |
|---|---|---|
| `merge` | `atulya-office word merge template.docx --data employees.xlsx -o ./output/` | Mail-merges spreadsheet rows into individual DOCX documents |
| `convert` | `atulya-office word convert document.docx -o document.txt` | Extracts plain-text from formatted Word documents |

### 📬 Outlook & Email Automation (`atulya-office outlook`)

| Command | Usage | Description |
|---|---|---|
| `search` | `atulya-office outlook search --subject "Invoice" --since 2026-01-01` | Searches mail folders by subject, sender, or date range |
| `export` | `atulya-office outlook export -o emails.xlsx --folder "Inbox"` | Exports email headers and messages to Excel/CSV |
| `send` | `atulya-office outlook send --to client@example.com --subject "Report"` | Sends automated emails via cross-platform SMTP |

### 📽️ PowerPoint Automation (`atulya-office ppt`)

| Command | Usage | Description |
|---|---|---|
| `batch` | `atulya-office ppt batch template.pptx --data sales.xlsx -o ./decks/` | Generates branded presentations populated with tabular data |
| `export` | `atulya-office ppt export deck.pptx -o ./slides/ --format png` | Exports presentation slides directly into PNG images |

---

## 🔒 Security & Privacy

- **100% On-Device Processing**: File operations, merges, and text extractions run strictly on your local CPU.
- **Zero Cloud Uploads**: Your financial sheets, contracts, and emails never leave your machine.
- **Safe Previews**: Source files are preserved; modified files are created alongside or in designated output folders.

---

## 📜 License

MIT License. Copyright (c) 2026 Atulya AI.
