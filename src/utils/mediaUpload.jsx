import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ryoijrplbbweonzdrwkj.supabase.co";
const supabaseKey = "sb_publishable_p06dJDyrL0qakc8OpwfH2g_zyIUG6if";

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function mediaUpload(file) {
  if (!file) {
    throw new Error("No file selected");
  }

  const timeStamp = Date.now();
  const newName = `${timeStamp}_${file.name}`;
  const filePath = `public/${newName}`;

  const { data, error } = await supabase.storage
    .from("images")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Supabase upload error:", error);
    throw new Error(error.message);
  }

  console.log("Image uploaded:", data);

  const { data: publicUrlData } = supabase.storage
    .from("images")
    .getPublicUrl(filePath);

  if (!publicUrlData?.publicUrl) {
    throw new Error("Failed to get image URL");
  }

  console.log("Image URL:", publicUrlData.publicUrl);

  return publicUrlData.publicUrl;
}