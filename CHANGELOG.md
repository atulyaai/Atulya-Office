# Changelog — Atulya-Office

All notable changes to Atulya-Office are documented here.
Follows [Semantic Versioning](https://semver.org/) and [Keep a Changelog](https://keepachangelog.com/).

---

## [Unreleased]
- Added `ppt build` (text outline → slides)
- Fixed: Word mail merge corrupted output (zip read/write on same file) and now XML-escapes values
- Fixed: `ppt export -f txt` produced nothing
- Added pytest suite
- Added `formula` (plain English → Excel formula; rules or local Ollama model)
- Added `pdf` export via LibreOffice; real progress bars for batch merge/ppt
- Outlook calendar sync and meeting scheduler

---

## [v0.2.0] — 2026-09-10
### Added
- `excel clean` command: remove duplicates, fix formatting, fill blanks
- `excel merge` command: merge multiple sheets into one
- `word fill` command: fill Word template with CSV data
- `outlook sort` command: auto-sort attachments by sender/date
- Formula AI stub: `excel formula "sum of column B where C > 100"`
- Amber gold Cinzel typing SVG header in README

### Changed
- CLI restructured from flat script to `atulya-office` entry point
- All commands now support `--dry-run` flag

---

## [v0.1.0] — 2026-08-01
### Added
- Initial CLI scaffold
- Excel sheet reader/writer using `openpyxl`
- Word document template engine using `python-docx`
- Basic README and LICENSE
