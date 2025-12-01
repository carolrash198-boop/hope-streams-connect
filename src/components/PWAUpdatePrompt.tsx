import { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { RefreshCw, X } from 'lucide-react';

export function PWAUpdatePrompt() {
  const [showPrompt, setShowPrompt] = useState(false);

  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered: ' + r);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  useEffect(() => {
    if (offlineReady || needRefresh) {
      setShowPrompt(true);
    }
  }, [offlineReady, needRefresh]);

  const close = () => {
    setShowPrompt(false);
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  if (!showPrompt) return null;

  return (
    <Card className="fixed bottom-4 right-4 z-50 p-4 shadow-lg max-w-sm">
      <div className="flex items-start gap-4">
        <RefreshCw className="h-5 w-5 text-primary mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold mb-1">
            {needRefresh ? 'New Update Available' : 'App Ready'}
          </h3>
          <p className="text-sm text-muted-foreground mb-3">
            {needRefresh
              ? 'A new version is available. Refresh to update.'
              : 'App is ready to work offline.'}
          </p>
          <div className="flex gap-2">
            {needRefresh && (
              <Button
                size="sm"
                onClick={() => updateServiceWorker(true)}
              >
                Update Now
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={close}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
