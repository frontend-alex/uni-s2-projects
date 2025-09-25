using FluentValidation.Results;

namespace PeerLearn.API.Validators;

public class CustomValidationResult
{
    public bool IsValid { get; set; }
    public Dictionary<string, string[]> Errors { get; set; } = new();

    public static CustomValidationResult Success => new() { IsValid = true };

    public static CustomValidationResult Failure(IEnumerable<ValidationFailure> failures)
    {
        var errors = failures
            .GroupBy(f => f.PropertyName)
            .ToDictionary(
                g => g.Key,
                g => g.Select(f => f.ErrorMessage).ToArray()
            );

        return new CustomValidationResult
        {
            IsValid = false,
            Errors = errors
        };
    }
}
