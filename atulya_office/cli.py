import os
import sys
from datetime import datetime

import click
from rich.console import Console
from rich.table import Table
from rich.progress import Progress

from . import __version__
from .utils import get_platform, get_output_path
from . import core

console = Console()
platform_name = get_platform()


def _print_results(results, columns):
    if not results:
        console.print("[yellow]No results found.[/yellow]")
        return
    table = Table(show_header=True, header_style="bold cyan")
    for col in columns:
        table.add_column(col)
    for item in results:
        table.add_row(*[str(item.get(c, "")) for c in columns])
    console.print(table)


def _is_outlook_available():
    return platform_name == "windows"


@click.group()
@click.version_option(version=__version__, prog_name="atulya-office")
def main():
    """Atulya Office - Cross-platform CLI for Office automation.

    Automate Excel, Word, Outlook, and PowerPoint tasks from the command line.
    """


# ── Excel Group ──────────────────────────────────────────────────────────────

@click.group(help="Excel automation commands")
def excel():
    pass


@excel.command(help="Merge multiple Excel files into one workbook")
@click.argument("input_paths", nargs=-1, type=click.Path(exists=True), required=True)
@click.option("-o", "--output", default=None, help="Output file path")
def merge(input_paths, output):
    out = output or get_output_path(input_paths[0], "merged", "xlsx")
    with Progress() as progress:
        task = progress.add_task("Merging files...", total=1)
        result = core.merge_excel_files(list(input_paths), out)
        progress.update(task, completed=1)
    console.print(f"[green]Merged {len(input_paths)} files into:[/green] {result}")


@excel.command(help="Split a sheet into separate files by column value")
@click.argument("input_path", type=click.Path(exists=True))
@click.option("-c", "--column", required=True, help="Column to split by")
@click.option("-s", "--sheet", default=None, help="Sheet name (default: first sheet)")
@click.option("-o", "--output-dir", default="split_output", help="Output directory")
def split(input_path, column, sheet, output_dir):
    with Progress() as progress:
        task = progress.add_task("Splitting file...", total=1)
        result = core.split_excel_sheet(input_path, column, output_dir, sheet)
        progress.update(task, completed=1)
    console.print(f"[green]Split files saved to:[/green] {result}")


@excel.command(help="Compare two Excel files and show differences")
@click.argument("file1", type=click.Path(exists=True))
@click.argument("file2", type=click.Path(exists=True))
@click.option("-s", "--sheet", default=None, help="Sheet name to compare")
@click.option("-o", "--output", default=None, help="Output differences to file")
def compare(file1, file2, sheet, output):
    console.print("[blue]Comparing files...[/blue]")
    result = core.compare_excel_files(file1, file2, sheet, output)
    console.print(f"[cyan]{result}[/cyan]")
    if output:
        console.print(f"[green]Detailed diff written to:[/green] {output}")


@excel.command(help="Search for a value across all sheets")
@click.argument("input_path", type=click.Path(exists=True))
@click.argument("value", type=str)
@click.option("-s", "--sheet", default=None, help="Limit search to one sheet")
def search(input_path, value, sheet):
    with Progress() as progress:
        task = progress.add_task("Searching...", total=1)
        results = core.search_excel(input_path, value, sheet)
        progress.update(task, completed=1)
    if results:
        console.print(f"[green]Found {len(results)} match(es):[/green]")
        _print_results(results, ["sheet", "row", "column", "value"])
    else:
        console.print("[yellow]No matches found.[/yellow]")


@excel.command(help="Clean Excel file: remove duplicates, empty rows, fix dates")
@click.argument("input_path", type=click.Path(exists=True))
@click.option("-o", "--output", default=None, help="Output file path")
@click.option("--no-dedup", is_flag=True, help="Skip duplicate removal")
@click.option("--no-prune", is_flag=True, help="Skip empty row removal")
@click.option("--no-dates", is_flag=True, help="Skip date fixing")
def clean(input_path, output, no_dedup, no_prune, no_dates):
    out = output or get_output_path(input_path, "cleaned", "xlsx")
    with Progress() as progress:
        task = progress.add_task("Cleaning file...", total=1)
        core.clean_excel(
            input_path, out,
            remove_duplicates=not no_dedup,
            remove_empty_rows=not no_prune,
            fix_dates=not no_dates,
        )
        progress.update(task, completed=1)
    console.print(f"[green]Cleaned file saved to:[/green] {out}")


# ── Word Group ───────────────────────────────────────────────────────────────

@click.group(help="Word automation commands")
def word():
    pass


@word.command(help="Mail merge: generate DOCX files from Excel data and template")
@click.argument("template", type=click.Path(exists=True))
@click.argument("data", type=click.Path(exists=True))
@click.option("-o", "--output-dir", default="word_output", help="Output directory")
def merge(template, data, output_dir):
    with Progress() as progress:
        task = progress.add_task("Generating documents...", total=1)
        result = core.merge_word_docx(template, data, output_dir)
        progress.update(task, completed=1)
    console.print(f"[green]Documents generated in:[/green] {result}")


@word.command(help="Convert DOCX to TXT")
@click.argument("input_path", type=click.Path(exists=True))
@click.option("-o", "--output", default=None, help="Output file path (.txt)")
def convert(input_path, output):
    out = output or get_output_path(input_path, "converted", "txt")
    with Progress() as progress:
        task = progress.add_task("Converting document...", total=1)
        core.convert_docx(input_path, out)
        progress.update(task, completed=1)
    console.print(f"[green]Converted to:[/green] {out}")


# ── Outlook Group ────────────────────────────────────────────────────────────

@click.group(help="Outlook automation commands")
def outlook():
    if not _is_outlook_available():
        console.print("[yellow]Outlook automation requires Windows.[/yellow]")
        sys.exit(1)


@outlook.command(help="Search emails by subject, sender, or date range")
@click.option("--subject", default=None, help="Filter by subject keyword")
@click.option("--sender", default=None, help="Filter by sender name or email")
@click.option("--since", default=None, help="Start date (e.g. 2024-01-01)")
@click.option("--until", default=None, help="End date (e.g. 2024-12-31)")
@click.option("--folder", default="Inbox", help="Mail folder to search")
@click.option("--max", "max_results", default=50, type=int, help="Max results")
def search(subject, sender, since, until, folder, max_results):
    with Progress() as progress:
        task = progress.add_task("Searching emails...", total=1)
        results = core.search_emails(subject, sender, since, until, folder, max_results)
        progress.update(task, completed=1)
    console.print(f"[green]Found {len(results)} email(s):[/green]")
    _print_results(results, ["subject", "sender", "received", "body_preview"])


@outlook.command(help="Send an email via SMTP (cross-platform)")
@click.option("--smtp-server", required=True, help="SMTP server address")
@click.option("--smtp-port", default=587, type=int, help="SMTP port")
@click.option("-u", "--username", required=True, help="SMTP username")
@click.option("-p", "--password", required=True, help="SMTP password")
@click.option("-t", "--to", "to_addrs", required=True, multiple=True, help="Recipient(s)")
@click.option("-s", "--subject", required=True, help="Email subject")
@click.option("--body", required=True, help="Email body text")
@click.option("--attach", "attachments", multiple=True, type=click.Path(exists=True),
              help="File to attach")
@click.option("--no-tls", is_flag=True, help="Disable STARTTLS")
def send(smtp_server, smtp_port, username, password,
         to_addrs, subject, body, attachments, no_tls):
    with Progress() as progress:
        task = progress.add_task("Sending email...", total=1)
        core.send_email(
            smtp_server, smtp_port, username, password,
            list(to_addrs), subject, body,
            attachments=list(attachments) or None,
            use_tls=not no_tls,
        )
        progress.update(task, completed=1)
    console.print("[green]Email sent successfully.[/green]")


@outlook.command(help="Export emails to CSV or Excel")
@click.option("-o", "--output", default=None, help="Output file (.csv or .xlsx)")
@click.option("--subject", default=None, help="Filter by subject")
@click.option("--sender", default=None, help="Filter by sender")
@click.option("--since", default=None, help="Start date")
@click.option("--until", default=None, help="End date")
@click.option("--folder", default="Inbox", help="Mail folder")
@click.option("--max", "max_results", default=200, type=int, help="Max results")
def export(output, subject, sender, since, until, folder, max_results):
    out = output or f"email_export_{datetime.now():%Y%m%d_%H%M%S}.csv"
    with Progress() as progress:
        task = progress.add_task("Exporting emails...", total=1)
        core.export_emails(out, subject, sender, since, until, folder, max_results)
        progress.update(task, completed=1)
    console.print(f"[green]Exported {max_results} emails to:[/green] {out}")


# ── PowerPoint Group ─────────────────────────────────────────────────────────

@click.group(help="PowerPoint automation commands")
def ppt():
    pass


@ppt.command(help="Generate slides from a template and CSV/Excel data")
@click.argument("template", type=click.Path(exists=True))
@click.argument("data", type=click.Path(exists=True))
@click.option("-o", "--output-dir", default="ppt_output", help="Output directory")
def batch(template, data, output_dir):
    with Progress() as progress:
        task = progress.add_task("Generating presentations...", total=1)
        result = core.batch_ppt(template, data, output_dir)
        progress.update(task, completed=1)
    console.print(f"[green]Presentations generated in:[/green] {result}")


@ppt.command(help="Export slides to images or text")
@click.argument("input_path", type=click.Path(exists=True))
@click.option("-o", "--output-dir", default="ppt_export", help="Output directory")
@click.option("-f", "--format", "format_type", default="png",
              type=click.Choice(["png", "jpg", "pdf", "txt"]),
              help="Export format")
def export(input_path, output_dir, format_type):
    with Progress() as progress:
        task = progress.add_task("Exporting slides...", total=1)
        exported = core.export_ppt(input_path, output_dir, format_type)
        progress.update(task, completed=1)
    console.print(f"[green]Exported {len(exported)} slide(s) to:[/green] {output_dir}")


main.add_command(excel)
main.add_command(word)
main.add_command(outlook)
main.add_command(ppt)


if __name__ == "__main__":
    main()
