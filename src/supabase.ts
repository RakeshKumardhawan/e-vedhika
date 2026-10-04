import { createClient } from "@supabase/supabase-js";

// Supabase Configuration with environment fallbacks and customizable project keys
const supabaseUrl = (
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_SUPABASE_URL) ||
  (typeof process !== "undefined" && process.env?.VITE_SUPABASE_URL) ||
  "https://vjylwkgbkybylzuxpksm.supabase.co"
).trim();

const supabaseAnonKey = (
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
  (typeof process !== "undefined" && process.env?.VITE_SUPABASE_ANON_KEY) ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqeWx3a2dia3lieWx6dXhwa3NtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg1MDU4NDQsImV4cCI6MjA1NDA4MTg0NH0.f3c7k8kQ9P5d3L6o1Z3q-placeholder"
).trim();

export const SUPABASE_DEFAULT_BUCKET = "e-vedhika-files";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

/**
 * Upload a file directly to Supabase Storage as 3rd Fallback
 */
export async function uploadFileToSupabase(
  file: File | Blob,
  fileName: string,
  bucketName: string = SUPABASE_DEFAULT_BUCKET
): Promise<{ url: string; path: string } | null> {
  try {
    const cleanFileName = fileName.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const filePath = `uploads/${Date.now()}_${cleanFileName}`;

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
        contentType: file.type || "application/octet-stream",
      });

    if (error) {
      console.warn("[SUPABASE STORAGE WARNING]:", error.message);
      // If bucket doesn't exist, try fallback public bucket
      if (bucketName !== "public-uploads") {
        const { data: retryData, error: retryErr } = await supabase.storage
          .from("public-uploads")
          .upload(filePath, file, { cacheControl: "3600", upsert: true });

        if (!retryErr && retryData) {
          const { data: pubData } = supabase.storage
            .from("public-uploads")
            .getPublicUrl(retryData.path);
          return { url: pubData.publicUrl, path: retryData.path };
        }
      }
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(data.path);

    if (publicUrlData?.publicUrl) {
      return { url: publicUrlData.publicUrl, path: data.path };
    }
    return null;
  } catch (err: any) {
    console.warn("[SUPABASE UPLOAD EXCEPTION]:", err?.message);
    return null;
  }
}
