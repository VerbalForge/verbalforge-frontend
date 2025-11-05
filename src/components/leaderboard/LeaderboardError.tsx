import { Card, CardContent } from '@/components/ui/card';

interface LeaderboardErrorProps {
  error: string;
}

export function LeaderboardError({ error }: LeaderboardErrorProps) {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold">Leaderboard</h1>
        <p className="text-muted-foreground mt-2">See how you rank against other learners</p>
      </div>
      <Card>
        <CardContent className="p-12 text-center">
          <p className="text-destructive">{error}</p>
        </CardContent>
      </Card>
    </div>
  );
}
