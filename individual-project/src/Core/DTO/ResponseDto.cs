namespace Core.DTO;

public sealed class ResponseDto<T> {
    public string Message { get; set; } = string.Empty;
    public bool Success { get; set; }
    public T? Data { get; set; }
}

public sealed class ErrorResponseDto {
    public bool Success { get; set; } = false;
    public int StatusCode { get; set; }
    public string ErrorCode { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string UserFriendlyMessage { get; set; } = string.Empty;
    public Dictionary<string, object>? Extra { get; set; }
}

