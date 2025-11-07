namespace Core.Utils;

using System;
using System.Text.RegularExpressions;

public static class ColorUtils {
    private static readonly string[] ColorPalette = new[] {
        "#ef4444",
        "#3b82f6",
        "#22c55e",
        "#eab308",
        "#a855f7",
        "#ec4899",
        "#6366f1",
        "#14b8a6",
        "#f97316"
    };

    private static readonly Regex ColorRegex = new("^#(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$", RegexOptions.Compiled);

    public static string GetRandomColorHex() {
        return ColorPalette[Random.Shared.Next(ColorPalette.Length)];
    }

    public static string? NormalizeColorHex(string? color) {
        if (string.IsNullOrWhiteSpace(color)) {
            return null;
        }

        string trimmed = color.Trim();
        return ColorRegex.IsMatch(trimmed) ? trimmed : null;
    }
}


