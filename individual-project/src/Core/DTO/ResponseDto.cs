namespace Core.DTO;

public sealed class ResponseDto<T> {
    public string Message { get; set; } = string.Empty;
    public bool Success { get; set; }
    public T? Data { get; set; }
}
