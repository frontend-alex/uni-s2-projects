namespace API.Controllers.Workspace;

using API.DTOs;
using API.DTOs.Workspace;
using Microsoft.AspNetCore.Mvc;
using Core.Interfaces.Services.Workspace;

public class WorkspaceController : BaseController {
    private readonly IWorkspaceService _workspaceService;

    public WorkspaceController(IWorkspaceService workspaceService) {
        _workspaceService = workspaceService;
    }

    [HttpPost]
    public async Task<IActionResult> CreateWorkspace([FromBody] CreateWorkspaceRequest request) {
        int userId = GetCurrentUserId();

        var workspace = await _workspaceService.CreateWorkspaceAsync(
            userId,
            request.Name,
            request.Visibility
        );

        var response = new WorkspaceResponse {
            Id = workspace.Id,
            Name = workspace.Name,
            Description = workspace.Description,
            Visibility = workspace.Visibility,
            CreatedBy = workspace.CreatedBy,
            CreatedAt = workspace.CreatedAt,
            UpdatedAt = workspace.UpdatedAt,
            CreatorName = $"{workspace.Creator?.FirstName} {workspace.Creator?.LastName}".Trim(),
            MemberCount = 1, // Creator is the first member
            DocumentCount = 0 // New workspace has no documents
        };

        return Ok(new ResponseDto<WorkspaceResponse> {
            Success = true,
            Message = "Workspace created successfully.",
            Data = response
        });
    }

    [HttpGet("{workspaceId}")]
    public async Task<IActionResult> GetWorkspace(int workspaceId) {
        int userId = GetCurrentUserId();

        var workspace = await _workspaceService.GetWorkspaceAsync(workspaceId, userId);

        if (workspace == null) {
            return NotFound(new ResponseDto<object> {
                Success = false,
                Message = "Workspace not found.",
                Data = null
            });
        }

        var response = new WorkspaceResponse {
            Id = workspace.Id,
            Name = workspace.Name,
            Description = workspace.Description,
            Visibility = workspace.Visibility,
            CreatedBy = workspace.CreatedBy,
            CreatedAt = workspace.CreatedAt,
            UpdatedAt = workspace.UpdatedAt,
            CreatorName = $"{workspace.Creator?.FirstName} {workspace.Creator?.LastName}".Trim(),
            MemberCount = workspace.UserWorkspaces?.Count ?? 0,
            DocumentCount = workspace.Documents?.Count ?? 0
        };

        return Ok(new ResponseDto<WorkspaceResponse> {
            Success = true,
            Message = "Workspace retrieved successfully.",
            Data = response
        });
    }

    [HttpGet]
    public async Task<IActionResult> GetUserWorkspaces() {
        int userId = GetCurrentUserId();

        var workspaces = await _workspaceService.GetUserWorkspacesAsync(userId);

        var response = workspaces.Select(w => new WorkspaceResponse {
            Id = w.Id,
            Name = w.Name,
            Description = w.Description,
            Visibility = w.Visibility,
            CreatedBy = w.CreatedBy,
            CreatedAt = w.CreatedAt,
            UpdatedAt = w.UpdatedAt,
            CreatorName = $"{w.Creator?.FirstName} {w.Creator?.LastName}".Trim(),
            MemberCount = w.UserWorkspaces?.Count ?? 0,
            DocumentCount = w.Documents?.Count ?? 0
        });

        return Ok(new ResponseDto<IEnumerable<WorkspaceResponse>> {
            Success = true,
            Message = "User workspaces retrieved successfully.",
            Data = response
        });
    }

    [HttpDelete("{workspaceId}")]
    public async Task<IActionResult> DeleteWorkspace(int workspaceId) {
        int userId = GetCurrentUserId();

        var result = await _workspaceService.DeleteWorkspaceAsync(workspaceId, userId);

        if (!result) {
            return BadRequest(new ResponseDto<object> {
                Success = false,
                Message = "Failed to delete workspace.",
                Data = null
            });
        }

        return Ok(new ResponseDto<object> {
            Success = true,
            Message = "Workspace deleted successfully.",
            Data = null
        });
    }

    [HttpPut("{workspaceId}")]
    public async Task<IActionResult> UpdateWorkspace(int workspaceId, [FromBody] UpdateWorkspaceRequest request) {
        int userId = GetCurrentUserId();

        var workspace = await _workspaceService.UpdateWorkspaceAsync(
            workspaceId,
            userId,
            request.Name,
            request.Description,
            request.Visibility
        );

        var response = new WorkspaceResponse {
            Id = workspace.Id,
            Name = workspace.Name,
            Description = workspace.Description,
            Visibility = workspace.Visibility,
            CreatedBy = workspace.CreatedBy,
            CreatedAt = workspace.CreatedAt,
            UpdatedAt = workspace.UpdatedAt,
            CreatorName = $"{workspace.Creator?.FirstName} {workspace.Creator?.LastName}".Trim(),
            MemberCount = workspace.UserWorkspaces?.Count ?? 0,
            DocumentCount = workspace.Documents?.Count ?? 0
        };

        return Ok(new ResponseDto<WorkspaceResponse> {
            Success = true,
            Message = "Workspace updated successfully.",
            Data = response
        });
    }
}
