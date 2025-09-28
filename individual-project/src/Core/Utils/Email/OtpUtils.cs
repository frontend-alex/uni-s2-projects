namespace Core.Utils.Email;

public static class OtpUtils {
    public static string GenerateOtpCode() {
        var random = new Random();
        return random.Next(100000, 999999).ToString();
    }
}
