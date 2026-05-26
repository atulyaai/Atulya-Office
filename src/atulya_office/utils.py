import sys
import os
import platform


def get_platform():
    system = platform.system().lower()
    if system == "darwin":
        return "macos"
    elif system == "windows":
        return "windows"
    elif system == "linux":
        return "linux"
    return system


def ensure_file_exists(path):
    if not os.path.isfile(path):
        raise FileNotFoundError(f"File not found: {path}")
    return os.path.abspath(path)


def get_output_path(input_path, suffix, ext):
    base, _ = os.path.splitext(input_path)
    return f"{base}_{suffix}.{ext}"


def require_windows(feature_name):
    if get_platform() != "windows":
        raise RuntimeError(
            f"{feature_name} requires Windows. "
            f"Current platform: {get_platform()}"
        )


def get_win32_module(module_name="win32com.client"):
    try:
        if sys.platform != "win32":
            raise RuntimeError("Not on Windows")
        import importlib
        return importlib.import_module(module_name)
    except ImportError as e:
        raise RuntimeError(
            "pywin32 is required for this feature on Windows. "
            "Install with: pip install atulya-office[win32]"
        ) from e
