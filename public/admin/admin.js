document.addEventListener("DOMContentLoaded", () => {
  fetch("/admin/check")
    .then(res => res.json())
    .then(data => {
      if (!data.admin) return;

      document.querySelectorAll("img[data-editable]").forEach(img => {
        // Visual hint
        img.style.cursor = "pointer";
        img.title = "Click to upload image";

        img.addEventListener("click", () => {
          const section = img.dataset.section;
          const filename = img.dataset.image;

          if (!section || !filename) {
            alert("Missing section or filename");
            return;
          }

          const input = document.createElement("input");
          input.type = "file";
          input.accept = "image/*";

          input.onchange = () => {
            const file = input.files[0];
            if (!file) return;

            const formData = new FormData();
            formData.append("image", file);

            fetch(
              `/admin/upload?section=${encodeURIComponent(section)}&filename=${encodeURIComponent(filename)}`,
              {
                method: "POST",
                body: formData
              }
            )
              .then(res => res.json())
              .then(result => {
                if (result.success) {
                  // Force reload of this image only
                  img.src = `/uploads/${section}/${filename}?t=${Date.now()}`;
                } else {
                  alert("Upload failed");
                }
              })
              .catch(() => {
                alert("Server error");
              });
          };

          input.click();
        });
      });
    });
});
