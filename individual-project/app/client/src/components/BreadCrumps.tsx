import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useWorkspace } from "@/hooks/workspace/use-workspaces";
import { useUpdateDocument } from "@/hooks/document/use-document";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getCurrentRoute, ROUTES } from "@/lib/router-paths";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Input } from "./ui/input";

export const BreadCrumpSkeleton = () => {
  return (
    <div className="flex items-center gap-2">
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-4 w-4 rounded" />
      <Skeleton className="h-4 w-4 rounded" />
      <Skeleton className="h-4 w-16" />
      <span className="text-muted-foreground">/</span>
      <Skeleton className="h-4 w-24" />
      <span className="text-muted-foreground">/</span>
      <Skeleton className="h-4 w-12" />
    </div>
  );
};

const BreadCrumps = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isEditing, setIsEditing] = useState(false);
  const [titleInput, setTitleInput] = useState("");

  const { workspaceId, documentId } = useParams<{
    workspaceId: string;
    documentId: string;
  }>();

  const { data: workspaceResponse, isLoading } = useWorkspace(
    workspaceId ? Number(workspaceId) : undefined
  );

  const { mutateAsync: updateDocument } = useUpdateDocument(Number(documentId));

  const currentDocument = workspaceResponse?.data?.documents?.find(
    (document) => document.id === Number(documentId)
  );

  const workspace = workspaceResponse?.data;

  const currentRoute = getCurrentRoute(location.pathname);

  useEffect(() => {
    if (currentDocument?.title) {
      setTitleInput(currentDocument.title);
    }
  }, [currentDocument?.title]);

  const handleTitleUpdate = async () => {
    if (!documentId || !titleInput.trim()) {
      setIsEditing(false);
      return;
    }

    try {
      await updateDocument({
        title: titleInput.trim(),
      });
      setIsEditing(false);
    } catch (error) {
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleTitleUpdate();
    } else if (e.key === "Escape") {
      setTitleInput(currentDocument?.title || "");
      setIsEditing(false);
    }
  };

  if (isLoading) return <BreadCrumpSkeleton />;

  return (
    <div className="flex items-center gap-3">
      {/* Back/Forward Navigation */}
      <div className="flex items-center gap-1">
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8"
          onClick={() => navigate(1)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Breadcrumb */}
      <nav className="flex items-center gap-0 text-sm" aria-label="Breadcrumb">
        <Link
          to={ROUTES.AUTHENTICATED.DASHBOARD}
          className="text-muted-foreground capitalize max-w-[100px] truncate"
        >
          <Button className="px-2 capitalize" variant={"ghost"}>
            {currentRoute || "Dashboard"}
          </Button>
        </Link>
        {workspace && (
          <>
            <span className="text-muted-foreground">/</span>
            <Link to={ROUTES.AUTHENTICATED.BOARD(workspace.id)}>
              <Button
                variant="ghost"
                className="font-medium text-foreground px-2"
              >
                {workspace.name}
              </Button>
            </Link>
          </>
        )}
        {documentId && (
          <>
            <span className="text-muted-foreground">/</span>
            {isEditing ? (
              <Input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                onBlur={handleTitleUpdate}
                onKeyDown={handleKeyDown}
                autoFocus
                className="h-8 w-[150px] no-ring border-none font-medium"
              />
            ) : (
              <Button
                onDoubleClick={() => setIsEditing(true)}
                variant="ghost"
                className="font-medium text-foreground px-2"
              >
                {currentDocument?.title}
              </Button>
            )}
          </>
        )}
      </nav>
    </div>
  );
};

export default BreadCrumps;
