using FluentValidation;
using PeerLearn.API.Validators;

namespace PeerLearn.API.Middlewares;

public class ModelValidationMiddleware {
    private readonly RequestDelegate _next;
    private readonly IServiceProvider _serviceProvider;

    public ModelValidationMiddleware(RequestDelegate next, IServiceProvider serviceProvider) {
        _next = next;
        _serviceProvider = serviceProvider;
    }

    public async Task InvokeAsync(HttpContext context) {
        if (context.Request.Method == "GET" ||
            context.Request.Path.StartsWithSegments("/health") ||
            context.Request.Path.StartsWithSegments("/swagger")) {
            await _next(context);
            return;
        }

        if (context.Request.ContentLength == 0 ||
            !context.Request.ContentType?.StartsWith("application/json") == true) {
            await _next(context);
            return;
        }

        // Read the request body
        context.Request.EnableBuffering();
        var body = await new StreamReader(context.Request.Body).ReadToEndAsync();
        context.Request.Body.Position = 0;

        if (string.IsNullOrEmpty(body)) {
            await _next(context);
            return;
        }

        try {
            // Try to determine the model type from the route
            var modelType = GetModelTypeFromRoute(context);
            if (modelType == null) {
                await _next(context);
                return;
            }

            // Deserialize the request body
            var model = System.Text.Json.JsonSerializer.Deserialize(
                body,
                modelType,
                new System.Text.Json.JsonSerializerOptions {
                    PropertyNameCaseInsensitive = true
                });

            if (model == null) {
                await _next(context);
                return;
            }

            // Validate the model
            var validationResult = await ValidateModelAsync(model);
            if (!validationResult.IsValid) {
                context.Response.StatusCode = 400;
                context.Response.ContentType = "application/json";

                var response = new {
                    message = "Validation failed",
                    errors = validationResult.Errors
                };

                await context.Response.WriteAsync(System.Text.Json.JsonSerializer.Serialize(response));
                return;
            }
        }
        catch (Exception) {
            await _next(context);
            return;
        }

        await _next(context);
    }

    private Type? GetModelTypeFromRoute(HttpContext context) {
        var path = context.Request.Path.Value?.ToLower();

        return path switch {
            var p when p.Contains("/auth/login") => typeof(Core.DTOs.LoginDTO),
            var p when p.Contains("/auth/register") => typeof(Core.DTOs.CreateUserDTO),
            var p when p.Contains("/auth/forgot-password") => typeof(Core.DTOs.ForgotPasswordDTO),
            var p when p.Contains("/auth/reset-password") => typeof(Core.DTOs.ResetPasswordDTO),
            var p when p.Contains("/auth/change-password") => typeof(Core.DTOs.ChangePasswordDTO),
            var p when p.Contains("/users") && context.Request.Method == "POST" => typeof(Core.DTOs.CreateUserDTO),
            var p when p.Contains("/users") && context.Request.Method == "PUT" => typeof(Core.DTOs.UpdateUserDTO),
            _ => null
        };
    }

    private async Task<CustomValidationResult> ValidateModelAsync(object model) {
        var modelType = model.GetType();
        var validatorType = typeof(IValidator<>).MakeGenericType(modelType);
        var validator = _serviceProvider.GetService(validatorType) as IValidator;

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

// Extension method to register the middleware
public static class ModelValidationMiddlewareExtensions {
    public static IApplicationBuilder UseModelValidation(this IApplicationBuilder builder) {
        return builder.UseMiddleware<ModelValidationMiddleware>();
    }
}
