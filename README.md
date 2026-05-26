# Atulya Office

One-click Excel, Word, Outlook and PowerPoint automation tools.

## Features

### Excel
- Merge, split, compare workbooks
- Search/replace across sheets
- Batch CSV/Excel conversion
- Formula injection & cleanup
- Chart generation

### Word
- Mail merge from Excel data
- Batch DOCX template filling
- Document comparison

### Outlook
- Read, search, send emails programmatically
- Auto-archive old emails
- Export emails to Excel/PDF
- Rule-based email processing

### PowerPoint
- Batch slide generation from templates
- Export slides to images/PDF

## Quick Start

```bash
pip install atulya-office
atulya-office excel merge --files *.xlsx --output merged.xlsx
atulya-office outlook send --to user@example.com --subject "Report" --body "Attached" --attach report.pdf
```

## License

MIT
