import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function Donate() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // User is logged in, redirect to UCP with donate tab
        navigate("/ucp?tab=donate", { replace: true });
      } else {
        // User is not logged in, redirect to login with return URL
        navigate("/login?redirect=/ucp?tab=donate", { replace: true });
      }
      setChecking(false);
    };

    checkAuthAndRedirect();
  }, [navigate]);

  // Show loading while checking auth
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return null;
}
