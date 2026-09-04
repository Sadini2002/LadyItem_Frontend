import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ryoijrplbbweonzdrwkj.supabase.co";
const supabaseKey = "sb_publishable_p06dJDyrL0qakc8OpwfH2g_zyIUG6if";

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function mediaUpload(file, retries = 2) {
  if (!file) {
    throw new Error("No file selected");
  }

  const timeStamp = Date.now();
  // avoid URL encoding issues with spaces or special characters
  const sanitizedFileName = file.name ? file.name.replace(/[^a-zA-Z0-9._-]/g, "_") : "image.jpg";
  const newName = `${timeStamp}_${sanitizedFileName}`;
  const filePath = `public/${newName}`;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const { data, error } = await supabase.storage
        .from("images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error(`Supabase upload error (attempt ${attempt + 1}):`, error);
        if (attempt < retries) {
          await new Promise((res) => setTimeout(res, 1000));
          continue;
        }
        throw new Error(error.message || "Failed to upload image to Supabase");
      }

      const { data: publicUrlData } = supabase.storage
        .from("images")
        .getPublicUrl(filePath);

      if (!publicUrlData?.publicUrl) {
        throw new Error("Failed to get public image URL");
      }

      return publicUrlData.publicUrl;
    } catch (err) {
      if (attempt < retries) {
        console.warn(`Retrying image upload (${attempt + 1}/${retries})...`, err);
        await new Promise((res) => setTimeout(res, 1000));
      } else {
        console.error("Final image upload error:", err);
        throw err;
      }
    }
  }
}