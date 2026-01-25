import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export function useAdminAuth() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setIsLoading(false);
          navigate("/login");
          return;
        }

        setUserId(session.user.id);

        // Check if user has admin role
        const { data: roles, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .eq("role", "admin")
          .single();

        if (error || !roles) {
          setIsAdmin(false);
          navigate("/");
        } else {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setIsAdmin(false);
        setUserId(null);
        navigate("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return { isAdmin, isLoading, userId };
}
