using AutoMapper;
using Core.Entities;
using Core.DTO.Auth;
using Core.Exceptions;
using App.Contracts.Persistence;
using App.Contracts.Security;

namespace App.Services.Auth;

public class AuthService {
    private readonly IUserRepository _userRepository;
    private readonly IMapper _mapper;
    private readonly IPasswordService _passwordService;

    public AuthService(IUserRepository userRepository, IMapper mapper, IPasswordService passwordService) {
        _userRepository = userRepository;
        _mapper = mapper;
        _passwordService = passwordService;
    }

    public async Task<string> RegisterAsync(RegisterRequest request) {

        var existingUser = await _userRepository.GetByEmailAsync(request.Email);

        if (existingUser != null) {
            if (!existingUser.EmailVerified) {
                throw AppException.CreateError("EMAIL_EXISTS_NOT_VERIFIED", extra: new Dictionary<string, object> { { "email", request.Email } });
            }
            throw AppException.CreateError("EMAIL_EXISTS");
        }

        if (await _userRepository.ExistsByUsernameAsync(request.Username)) {
            throw AppException.CreateError("USERNAME_EXISTS");
        }

        var user = _mapper.Map<User>(request);

        user.PasswordHash = _passwordService.HashPassword(request.Password);

        await _userRepository.CreateAsync(user);

        return user.Email;
    }
    

    public async Task<string> LoginAsync(LoginRequest request) {
        var user = await _userRepository.GetByEmailAsync(request.Email);

        if (user == null || !_passwordService.VerifyPassword(request.Password, user.PasswordHash)) {
            throw AppException.CreateError("INVALID_CREDENTIALS");
        }

        if (!user.EmailVerified) {
            throw AppException.CreateError("EMAIL_NOT_VERIFIED", extra: new Dictionary<string, object> { { "email", request.Email }, { "otpRedirect", true } });
        }

        return user.Email;
    }
}