using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using FluentValidation;
using PeerLearn.API.Validators;

namespace PeerLearn.API.Attributes;

public class ValidateModelAttribute : ActionFilterAttribute
{
    public override async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        // Get the model from the action arguments
        var model = context.ActionArguments.Values.FirstOrDefault();

        if (model != null)
        {
            var validationResult = await ValidateModelAsync(model, context.HttpContext.RequestServices);

            if (!validationResult.IsValid)
            {
                context.Result = new BadRequestObjectResult(new
                {
                    message = "Validation failed",
                    errors = validationResult.Errors
                });
                return;
            }
        }

        await next();
    }

    private async Task<CustomValidationResult> ValidateModelAsync(object model, IServiceProvider serviceProvider)
    {
        var modelType = model.GetType();
        var validatorType = typeof(IValidator<>).MakeGenericType(modelType);
        var validator = serviceProvider.GetService(validatorType) as IValidator;

        if (validator == null) {
            return CustomValidationResult.Success;
        }

        var context = new ValidationContext<object>(model);
        var result = await validator.ValidateAsync(context);

        return result.IsValid
            ? CustomValidationResult.Success
            : CustomValidationResult.Failure(result.Errors);
    }
}
