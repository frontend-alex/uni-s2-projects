namespace API.DTOs;

public class ResponseDto<T> {
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public T? Data { get; set; }
}

public class ErrorResponseDto {
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public int StatusCode { get; set; }
    public string ErrorCode { get; set; } = string.Empty;
    public string UserFriendlyMessage { get; set; } = string.Empty;
    public Dictionary<string, object>? Extra { get; set; }
}