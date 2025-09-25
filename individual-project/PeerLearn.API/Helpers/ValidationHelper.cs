using FluentValidation;
using PeerLearn.API.Validators;

namespace PeerLearn.API.Helpers;

public static class ValidationHelper
{
    public static async Task<CustomValidationResult> ValidateAsync<T>(T model, IValidator<T> validator)
    {
        var context = new ValidationContext<T>(model);
        var result = await validator.ValidateAsync(context);

        return result.IsValid
            ? CustomValidationResult.Success
            : CustomValidationResult.Failure(result.Errors);
    }

    public static CustomValidationResult Validate<T>(T model, IValidator<T> validator)
    {
        var context = new ValidationContext<T>(model);
        var result = validator.Validate(context);

        return result.IsValid
            ? CustomValidationResult.Success
            : CustomValidationResult.Failure(result.Errors);
    }
}
