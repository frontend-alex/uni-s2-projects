// The key principle: DTOs are the contract between layers, 
// while Domain Models are the internal representation. 
// This separation ensures clean architecture and prevents domain pollution.


namespace API.Controllers.WorkspaceController;

using API.Models;
using API.Models.Workspace;
using API.Controllers.Base;
using Microsoft.AspNetCore.Mvc;
using Core.Services.Workspace;
using Core.DTOs.Workspace;

public class WorkspaceController : BaseController {
    private readonly WorkspaceService _workspaceService;

    public WorkspaceController(WorkspaceService workspaceService) {
        _workspaceService = workspaceService;
    }

    [HttpPost]
    public async Task<IActionResult> CreateWorkspace([FromBody] CreateWorkspaceRequest request) {
        int userId = GetCurrentUserId();

        WorkspaceDto workspaceDto = await _workspaceService.CreateWorkspaceAsync(
            userId,
            request.Name,
            request.Visibility
        );

        return Ok(new ApiResponse<WorkspaceDto> {
            Success = true,
            Message = "Workspace created successfully.",
            Data = workspaceDto
        });
    }

    [HttpGet("{workspaceId}")]
    public async Task<IActionResult> GetWorkspace(int workspaceId) {
        int userId = GetCurrentUserId();

        WorkspaceDto workspaceDto = await _workspaceService.GetWorkspaceAsync(workspaceId, userId);

        return Ok(new ApiResponse<WorkspaceDto> {
            Success = true,
            Message = "Workspace retrieved successfully.",
            Data = workspaceDto
        });
    }

    [HttpGet]
    public async Task<IActionResult> GetUserWorkspaces() {
        int userId = GetCurrentUserId();

        IEnumerable<WorkspaceDto> workspaces = await _workspaceService.GetUserWorkspacesAsync(userId);

        return Ok(new ApiResponse<IEnumerable<WorkspaceDto>> {
            Success = true,
            Message = "User workspaces retrieved successfully.",
            Data = workspaces
        });
    }

    [HttpDelete("{workspaceId}")]
    public async Task<IActionResult> DeleteWorkspace(int workspaceId) {
        int userId = GetCurrentUserId();

        await _workspaceService.DeleteWorkspaceAsync(workspaceId, userId);

        return Ok(new ApiResponse<object> {
            Success = true,
            Message = "Workspace deleted successfully.",
            Data = null
        });
    }

    [HttpPut("{workspaceId}")]
    public async Task<IActionResult> UpdateWorkspace(int workspaceId, [FromBody] UpdateWorkspaceRequest request) {
        int userId = GetCurrentUserId();

        WorkspaceDto workspace = await _workspaceService.UpdateWorkspaceAsync(
            workspaceId,
            userId,
            request.Name,
            request.Description,
            request.Visibility
        );

        return Ok(new ApiResponse<WorkspaceDto> {
            Success = true,
            Message = "Workspace updated successfully.",
            Data = workspace
        });
    }
}