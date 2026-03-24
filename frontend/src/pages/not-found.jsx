import { Link } from "wouter";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { FileX2 } from "lucide-react";
function NotFound() {
  return (
    <Layout>
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center glass-panel p-12 rounded-3xl max-w-md w-full border border-white/10">
          <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-primary/20">
            <FileX2 className="w-10 h-10 text-primary" />
          </div>

          <h1 className="font-display text-4xl font-bold text-white mb-2">
            404
          </h1>
          <p className="text-muted-foreground mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>

          <Link href="/">
            <Button className="w-full">Return to Marketplace</Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
export { NotFound as default };
