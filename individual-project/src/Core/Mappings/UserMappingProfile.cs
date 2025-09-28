using AutoMapper;
using Core.DTO;
using Core.Enums;
using Core.Entities;
using Core.DTO.Auth;

namespace Core.Mappings;

public class UserMappingProfile : Profile {
    public UserMappingProfile() {
        CreateMap<RegisterRequest, User>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.PasswordHash, opt => opt.Ignore())
            .ForMember(dest => dest.EmailVerified, opt => opt.MapFrom(src => false))
            .ForMember(dest => dest.ProfilePicture, opt => opt.Ignore())
            .ForMember(dest => dest.Role, opt => opt.MapFrom(src => UserRole.Student))
            .ForMember(dest => dest.Xp, opt => opt.MapFrom(src => 0))
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore());

        CreateMap<User, UserDto>()
            .ForMember(dest => dest.Role, opt => opt.MapFrom(src => src.Role.ToString()));
    }
}


