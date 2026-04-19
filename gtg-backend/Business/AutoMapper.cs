using AutoMapper;
using gtg_backend.Dtos;
using gtg_backend.Models;

namespace gtg_backend.Business;

public class AutoMapper : Profile
{
    public AutoMapper()
    {
        CreateMap<Game, GameDto>()
            .ForMember(dest => dest.User, opt => opt.MapFrom(src => src.User))
            .ForMember(dest => dest.UserId, opt => opt.Ignore())
            .ReverseMap();
        CreateMap<User, UserDto>()
            .ForMember(dest => dest.Games, opt => opt.MapFrom(src => src.Games))
            .ForMember(dest => dest.RoleName, opt => opt.MapFrom(src => src.Role.Name))
            .ReverseMap()
            .ForMember(dest => dest.Games, opt => opt.MapFrom(src => src.Games))
            .ForMember(dest => dest.Password, opt => opt.Ignore())
            .ForMember(dest => dest.Email, opt => opt.Ignore())
            .ForMember(dest => dest.Salt, opt => opt.Ignore());
        CreateMap<Meet, MeetDto>()
            .ForMember(dest => dest.MeetDateSuggestions,
                opt => opt.MapFrom(src =>
                    (src.MeetDateSuggestions ?? new List<MeetDateSuggestion>()).OrderBy(x => x.Date)))
            .ForMember(dest => dest.MeetUsers, opt => opt.MapFrom(src => (src.MeetUsers ?? new List<MeetUser>())))
            .ReverseMap()
            .ForMember(dest => dest.MeetDateSuggestions, opt => opt.MapFrom(src => src.MeetDateSuggestions));
        CreateMap<MeetDateSuggestion, MeetDateSuggestionDto>()
            .ReverseMap();
        CreateMap<Group, GroupDto>()
            .ReverseMap();
        CreateMap<MeetUser, MeetUserDto>()
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.User.Name))
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.User, opt => opt.MapFrom(src => src.User))
            .ReverseMap()
            .ForMember(dest => dest.User, opt => opt.Ignore());
        CreateMap<MeetUserVote, MeetUserVoteDto>()
            //Todo: Check how to implement votableItemType enum to frontend (instead of string)
            .ForMember(dest => dest.VotableItemType, opt => opt.MapFrom(src => src.VotableItemType.ToString()))
            .ForPath(dest => dest.MeetUser.Name, opt => opt.MapFrom(src => src.MeetUser.User.Name))
            .ForPath(dest => dest.MeetUser.Id, opt => opt.MapFrom(src => src.MeetUserId))
            .ReverseMap()
            .ForMember(dest => dest.MeetUserId, opt => opt.MapFrom(src => src.MeetUser.Id))
            .ForMember(dest => dest.MeetUser, opt => opt.Ignore());
        CreateMap<MeetUserVote, MeetUserVoteSummaryDto>()
            .ReverseMap();
        CreateMap<User, FullUserDto>()
            .ForMember(dest => dest.RoleName, opt => opt.MapFrom(src => src.Role.Name))
            .ReverseMap()
            .ForMember(dest => dest.Password, opt => opt.Ignore())
            .ForMember(dest => dest.Salt, opt => opt.Ignore())
            .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));
        CreateMap<GroupSettings, GroupSettingsDto>()
            .ReverseMap();
    }
}