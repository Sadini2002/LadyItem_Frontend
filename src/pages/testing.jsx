import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ryoijrplbbweonzdrwkj.supabase.co";
const supabaseKey = "sb_publishable_p06dJDyrL0qakc8OpwfH2g_zyIUG6if";

const supabase = createClient(supabaseUrl, supabaseKey);

export default function Testing() {
  const [image, setImage] = useState(null);

  const fileUpload = async () => {
    console.log("Button clicked");

    // Check if a file was selected
    if (!image) {
      console.log("Please select a file first");
      alert("Please select a file first");
      return;
    }

    console.log("Selected file:", image);
    console.log("File name:", image.name);

    try {
      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from("images")
        .upload(`public/${image.name}`, image, {
          upsert: false,
          cacheControl: "3600",
        });

      if (error) {
        console.error("Upload error:", error);
        alert(error.message);
        return;
      }

      console.log("Upload successful:", data);

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from("images")
        .getPublicUrl(`public/${image.name}`);

      console.log("Public URL:", publicUrlData.publicUrl);

      alert("Image uploaded successfully!");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#FFF5F4] via-white to-[#FFE5E0] flex items-center justify-center px-6">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Upload Image
        </h1>

        <input
          type="file"
          accept="image/*"
          className="file-input file-input-bordered file-input-primary w-full"
          onChange={(e) => {
            const selectedFile = e.target.files[0];

            if (selectedFile) {
              setImage(selectedFile);
              console.log("File selected:", selectedFile);
            }
          }}
        />

        {image && (
          <p className="mt-4 text-sm text-gray-600">
            Selected: {image.name}
          </p>
        )}

        <button
          onClick={fileUpload}
          className="btn btn-primary w-full mt-6"
        >
          Upload
        </button>
      </div>
    </div>
  );
}