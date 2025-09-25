import { Button } from "@/components/ui/button";
import { API } from "@/lib/config";

interface ProviderButtonsProps {
  providers: string[];
  isPending: boolean;
}

export const ProviderButtons: React.FC<ProviderButtonsProps> = ({ providers, isPending }) => {

  if(providers.length === 0) return <p className="text-xs text-center text-stone-400">No providers to load...</p>

  const showText = providers?.length <= 2;

  return (
    <div className={`grid gap-3 grid-cols-${Math.min(providers?.length || 1, 5)}`}>
      {providers?.map((provider) => (
        <Button
          key={provider}
          type="button"
          variant="outline"
          disabled={isPending}
          className="flex-1 items-center justify-center gap-2 cursor-pointer"
          onClick={() => window.open(`${API.BASE_URL}/Auth/oauth/${provider}`, '_blank', 'noopener,noreferrer')}
        >
          <img loading="lazy" className="w-4 h-4" src={`/images/providers/${provider}.webp`}/>
          {showText && <span>{`${provider}`}</span>}
        </Button>
      ))}
    </div>
  );
};
