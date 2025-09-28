using AutoMapper;
using Core.Entities;
using Core.DTO.Auth;
using Core.Exceptions;
using Core.Services;
using App.Contracts.Persistence;

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

    public async Task<bool> RegisterAsync(RegisterRequest request) {

        if (await _userRepository.ExistsByEmailAsync(request.Email)) {
            throw AppException.CreateError("EMAIL_EXISTS");
        }

        if (await _userRepository.ExistsByUsernameAsync(request.Username)) {
            throw AppException.CreateError("USERNAME_EXISTS");
        }

        var user = _mapper.Map<User>(request);
        
        // Hash the password before storing
        user.PasswordHash = _passwordService.HashPassword(request.Password);

        await _userRepository.CreateAsync(user);

        return true;
    }
}